import {
  getHeaders,
  getRequestOptions,
  LUCIE_API_KEY,
  LUCIE_MODEL,
  LUCIE_URL
} from './client'
import { extractJSONObject } from './utils'

async function callLucie(prompt, maxTokens = 1000, temperature = 0.5) {
  const myHeaders = getHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + LUCIE_API_KEY
    },
    true
  )

  const raw = JSON.stringify({
    model: LUCIE_MODEL,
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
    // eslint-disable-next-line no-console
    console.error('Call to Lucie failed', e)
    return null
  }
}

async function generateDistractors(question, answer) {
  const prompt = `Genere 8 distracteurs : reponses FAUSSES mais plausibles.
Regles : courts, uniques, pas de paraphrase de la bonne reponse, pas de placeholders.
Question : ${question}
Bonne reponse : ${answer}
JSON strict : {"distractors":[]}`

  const content = await callLucie(prompt, 700, 0.5)
  if (!content) return []
  const json = extractJSONObject(content)
  return json?.distractors || []
}

async function reviewDistractors(question, answer, distractors) {
  const numbered = distractors.map((d, i) => `${i + 1}. ${d}`).join('\n')
  const prompt = `Pour chaque distracteur, donne un verdict (BON/MOYEN/MAUVAIS), un bon distracteur doit être plausible mais faux et un commentaire court (<=12 mots).
Question : ${question}
Bonne reponse : ${answer}
Distracteurs :
${numbered}
JSON strict : {"reviews":[{"distractor":"","verdict":"BON","commentaire":""}]}`

  const content = await callLucie(prompt, 900, 0.2)
  if (!content) return []
  const json = extractJSONObject(content)
  return json?.reviews || []
}


export async function runDistractorPipeline(question, answer) {
  try {
    const distractors = await generateDistractors(question, answer)
    if (!distractors || distractors.length === 0) return null

    const reviews = await reviewDistractors(question, answer, distractors)
    if (!reviews || reviews.length === 0) {
      const selected = distractors.slice(0, 3)
      return {
        question: question,
        options: [answer, ...selected].sort(() => Math.random() - 0.5),
        correct_answer: answer
      }
    }

    const validReviews = reviews.filter(r => r.distractor)
    const sorted = validReviews.sort((a, b) => {
      const score = {
        BON: 3,
        GOOD: 3,
        MOYEN: 2,
        OK: 2,
        MAUVAIS: 1,
        BAD: 1
      }
      return (score[b.verdict] || 0) - (score[a.verdict] || 0)
    })
    const top3 = sorted.slice(0, 3).map(r => r.distractor)

    return {
      question,
      options: [answer, ...top3].sort(() => Math.random() - 0.5),
      correct_answer: answer
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Distractor pipeline failed', e)
    return null
  }
}
