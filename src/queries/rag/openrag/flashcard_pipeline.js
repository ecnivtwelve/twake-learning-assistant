/* eslint-disable no-console */
import {
  getHeaders,
  getRequestOptions,
  LUCIE_API_KEY,
  LUCIE_URL
} from './client'
import { fetchPartitionChunks } from './partitions'
import { extractJSONObject } from './utils'

const SYSTEM_PROMPT_TEMPLATE = `
# CONTEXTE PEDAGOGIQUE
- Ton role : Expert en didactique et ingenierie pedagogique
- Ton objectif : Generer des flashcards educatives a partir du contenu fourni
- Ton public : des élèves

# REGLES SPECIFIQUES POUR [H5P.Flashcards]
- Génère autant de carte pertinentes que possible (max 20) à partir du texte fourni.
- Concentre-toi sur les notions majeures suivantes : {notions}
- Association : Le recto et le verso doivent etre relies par un critere claire (ex : definition -> terme, evenement -> date, auteur -> oeuvre). Utilise la MEME unique relation pour toutes les cartes et formule la consigne ainsi : "Associe chaque X a Y".

# REGLES PEDAGOGIQUES
- Langue : Le contenu et les consignes doivent etre rediges en francais.

# SOURCES
- Tu utiliseras UNIQUEMENT le texte suivant pour generer ton activite.
---
{context}
---

# STRUCTURE DU JSON ATTENDUE
- Genere UNIQUEMENT un JSON complet et valide. Ta reponse DOIT commencer par { et finir par }. Aucun autre texte ou commentaire.
- L'objet doit contenir :
  - "title" : Un titre pertinent pour l'activite.
  - "description" : Une consigne claire pour l'eleve.
  - "cards" : Un tableau d'objets, ou chaque objet represente une carte (flashcard) et contient :
    - "text" : La question ou le terme a deviner (recto).
    - "answer" : Reponse ou definition (verso). Regles de normalisation : un seul mot simple ou un nombre (pas de mots composes), minuscules (sauf noms propres), sans article ni ponctuation, nombres en chiffres.
    - "tip" (optionnel) : Indice pour aider l'eleve.
    - "notion" : Liste des notions (parmi {notions}) les plus proches de cette carte. Au moins 1 notion par carte.
`

const NOTIONS_PROMPT = `
Tu es un expert en didactique. On te fournit un extrait de document pedagogique.

Ton objectif : identifier les **grandes notions** (concepts cles, themes principaux) abordees dans ce texte.

Regle : genere entre 1 et {max_notions} notions, pas plus. Chaque notion doit etre un terme ou une expression courte (1 a 4 mots).

Reponds UNIQUEMENT avec un JSON valide de la forme :
{"notions": ["notion1", "notion2", ...]}

Voici le texte :
---
{context}
---
`

async function callLucie(prompt, maxTokens = 2000, temperature = 0.1) {
  const myHeaders = getHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + LUCIE_API_KEY
    },
    true
  )

  const raw = JSON.stringify({
    model: 'Qwen2.5-VL-7B-Instruct',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  })

  const requestOptions = getRequestOptions('POST', myHeaders, raw)
  try {
    const response = await fetch(
      `${LUCIE_URL}/chat/completions`,
      requestOptions
    )
    if (!response.ok) {
      throw new Error(`Lucie API error: ${response.statusText}`)
    }
    const result = await response.json()
    return result.choices[0].message.content
  } catch (e) {
    console.error('Call to Lucie failed', e)
    return null
  }
}

function groupChunksByFile(chunks) {
  const grouped = {}
  chunks.forEach(chunk => {
    const fileId = chunk.metadata?.file_id || 'unknown'
    if (!grouped[fileId]) grouped[fileId] = []
    grouped[fileId].push(chunk)
  })

  Object.keys(grouped).forEach(fileId => {
    grouped[fileId].sort((a, b) => {
      const pageA = a.metadata?.page || 0
      const pageB = b.metadata?.page || 0
      if (pageA !== pageB) return pageA - pageB
      return String(a.metadata?._id || '').localeCompare(
        String(b.metadata?._id || '')
      )
    })
  })
  return grouped
}

function makeChunkGroups(chunks, groupSize = 11) {
  const groups = []
  for (let i = 0; i < chunks.length; i += groupSize) {
    groups.push(chunks.slice(i, i + groupSize))
  }
  return groups
}

async function extractNotions(contents, maxNotions = 5) {
  const combined = contents.join(`

---

`)
  const prompt = NOTIONS_PROMPT.replace('{context}', combined).replace(
    '{max_notions}',
    maxNotions
  )
  const response = await callLucie(prompt, 500, 0.1)
  if (!response) return []
  const json = extractJSONObject(response)
  return json?.notions || []
}

async function generateFlashcardsForGroup(contents, notions) {
  const combinedContext = contents.join(`

---

`)
  const notionsStr = notions.length > 0 ? notions.join(', ') : 'non definies'
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
    '{context}',
    combinedContext
  ).replace(/{notions}/g, notionsStr)

  const response = await callLucie(systemPrompt, 2000, 0.1)
  if (!response) return null
  return extractJSONObject(response)
}

export async function runFlashcardPipeline(partition, onProgress) {
  if (onProgress) onProgress('Fetching chunks...')
  console.log(`Starting flashcard pipeline for partition: ${partition}`)

  const chunks = await fetchPartitionChunks(partition)
  if (!chunks || chunks.length === 0) {
    if (onProgress) onProgress('No chunks found.')
    console.log('No chunks found in this partition.')
    return []
  }
  console.log(`Found ${chunks.length} chunks total.`)

  const grouped = groupChunksByFile(chunks)
  const results = []

  const totalFiles = Object.keys(grouped).length
  let fileIndex = 0

  for (const fileId in grouped) {
    fileIndex++
    const fileChunks = grouped[fileId]
    const groupSize = 11
    const chunkGroups = makeChunkGroups(fileChunks, groupSize)
    const filename = fileChunks[0]?.metadata?.filename || fileId

    if (onProgress)
      onProgress(
        `Processing ${filename} (${fileIndex}/${totalFiles}): Extracting notions...`
      )
    console.log(
      `Processing document: ${filename} (${fileChunks.length} chunks)`
    )

    const groupContents = chunkGroups.map(group =>
      group.map(c => c.content || '').filter(c => c.trim().length > 0)
    )

    const allNotions = []
    for (let i = 0; i < groupContents.length; i++) {
      const contents = groupContents[i]
      if (contents.length === 0 || contents.join('').length < 50) continue

      const budget = Math.max(
        1,
        Math.round((5 * contents.length) / fileChunks.length)
      )
      const notions = await extractNotions(contents, budget)
      notions.forEach(n => {
        if (!allNotions.includes(n)) allNotions.push(n)
      })
    }
    const limitedNotions = allNotions.slice(0, 5)
    console.log(`Document notions: ${limitedNotions.join(', ')}`)

    for (let i = 0; i < groupContents.length; i++) {
      const contents = groupContents[i]
      if (contents.length === 0 || contents.join('').length < 50) continue

      if (onProgress)
        onProgress(
          `Processing ${filename} (${fileIndex}/${totalFiles}): Generating group ${
            i + 1
          }/${chunkGroups.length}...`
        )
      console.log(
        `Generating flashcards for group ${i + 1}/${chunkGroups.length}...`
      )
      const flashcards = await generateFlashcardsForGroup(
        contents,
        limitedNotions
      )
      if (flashcards && flashcards.cards) {
        console.log(`Group ${i + 1}: OK (${flashcards.cards.length} cards)`)
        results.push({
          fileId,
          filename,
          ...flashcards
        })
      }
    }
  }

  const finalResults = []
  results.forEach(res => {
    const existing = finalResults.find(r => r.fileId === res.fileId)
    if (existing) {
      // Deduplicate cards by text and answer
      res.cards.forEach(card => {
        const isDuplicate = existing.cards.some(
          c => c.text === card.text && c.answer === card.answer
        )
        if (!isDuplicate) {
          existing.cards.push(card)
        }
      })
    } else {
      const uniqueCards = []
      res.cards.forEach(card => {
        const isDuplicate = uniqueCards.some(
          c => c.text === card.text && c.answer === card.answer
        )
        if (!isDuplicate) {
          uniqueCards.push(card)
        }
      })

      finalResults.push({
        fileId: res.fileId,
        filename: res.filename,
        title: res.title,
        description: res.description,
        cards: uniqueCards
      })
    }
  })

  if (onProgress) onProgress('Finished.')
  console.log('Flashcard pipeline finished.')
  console.log('Generated Flashcards:', JSON.stringify(finalResults, null, 2))
  return finalResults
}
