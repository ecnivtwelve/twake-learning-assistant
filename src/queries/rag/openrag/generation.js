import { getHeaders, getRequestOptions, OPENRAG_URL } from './client'
import mockData from '../mock.json'

function makeFlashcardsSystemPrompt(
  subject,
  age,
  topic,
  number,
  previousQuestions
) {
  const prompt = `Tu es un expert en ingénierie pédagogique. Matière : ${subject}. Niveau : ${age}. Sujet : ${topic}. Génère exactement ${number} flashcards à partir des documents fournis. ${
    previousQuestions.length > 0
      ? `Les flashcards suivantes sont déjà présentes : "${previousQuestions.join(
          ', '
        )}"`
      : ''
  } N'ajoute pas de flashcards qui sont déjà présentes. Assure-toi que la question et la réponse sont cohérentes, claires, et compréhensibles.`

  return prompt
}

export async function generateFlashCards(
  subject,
  age,
  topic,
  number = 5,
  previousQuestions = [],
  mock = true
) {
  if (mock) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return mockData
  }

  const myHeaders = getHeaders({ 'Content-Type': 'application/json' })

  const raw = JSON.stringify({
    model: 'openrag-' + subject.partition,
    messages: [
      {
        role: 'user',
        content: makeFlashcardsSystemPrompt(
          subject.title,
          age,
          topic,
          number,
          previousQuestions
        )
      }
    ],
    temperature: 0.8,
    max_tokens: 2000
  })

  const requestOptions = getRequestOptions('POST', myHeaders, raw)

  return fetch(`${OPENRAG_URL}/v1/chat/completions`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
      throw new Error(error)
    })
}

function makeMCQSystemPrompt(subject, age, topic, number) {
  return `Tu es un professeur de ${subject}. Niveau ${age}. Theme : ${topic}.
Génère exactement ${number} questions de QCM avec leur réponse correcte à partir du cours.
Chaque question doit porter sur un concept DIFFÉRENT.
Réponds UNIQUEMENT avec ce JSON :
[{"question":"...","reponse":"..."}, ...]`
}

function makeSelectionPrompt(activityTitle, subjectTitle, questions, number) {
  const questionList = questions
    .map((q, i) => {
      const choices =
        q.choices
          ?.map((choice, choiceIndex) => {
            const isCorrect = choice?.value === true
            return `${choiceIndex + 1}. ${choice?.description || ''}${
              isCorrect ? ' [bonne reponse]' : ''
            }`
          })
          .join(' | ') || ''

      return `${i + 1}. (${
        q.interaction === 'flashcard' ? 'Flashcard' : 'QCM'
      }) "${q.label}"${choices ? ` -> Choix: ${choices}` : ''}`
    })
    .join('\n')

  return `Tu es un expert en ingénierie pédagogique.
Matière : ${subjectTitle}.
Un enseignant prépare un entraînement intitulé "${activityTitle}".

Voici les questions disponibles :
${questionList}

Sélectionne les ${number} questions les plus pertinentes pour cet entraînement en te basant sur :
- La cohérence avec le titre de l'entraînement
- La diversité des concepts couverts
- La complémentarité entre les questions (éviter les doublons thématiques)

Réponds UNIQUEMENT avec un tableau JSON des numéros des questions choisies, par exemple : [3, 7, 1]`
}

export async function selectRelevantQuestions(
  subject,
  activityTitle,
  availableQuestions,
  number = 5
) {
  const myHeaders = getHeaders({ 'Content-Type': 'application/json' })

  const raw = JSON.stringify({
    model: 'openrag-' + subject.partition,
    messages: [
      {
        role: 'user',
        content: makeSelectionPrompt(
          activityTitle,
          subject.title,
          availableQuestions,
          number
        )
      }
    ],
    temperature: 0.1,
    max_tokens: 200
  })

  const requestOptions = getRequestOptions('POST', myHeaders, raw)

  const response = await fetch(
    `${OPENRAG_URL}/v1/chat/completions`,
    requestOptions
  )
  const result = await response.json()
  const content = result.choices[0].message.content

  const jsonMatch = content.match(/\[[\s\S]*?\]/)
  if (!jsonMatch) throw new Error('Invalid LLM response')

  const indices = JSON.parse(jsonMatch[0])

  return indices
    .filter(i => i >= 1 && i <= availableQuestions.length)
    .map(i => availableQuestions[i - 1]._id)
}

export async function generateMCQs(subject, age, topic, number = 3) {
  const myHeaders = getHeaders({ 'Content-Type': 'application/json' })

  const seedPayload = JSON.stringify({
    model: 'openrag-' + subject.partition,
    messages: [
      {
        role: 'user',
        content: makeMCQSystemPrompt(subject.title, age, topic, number)
      }
    ],
    temperature: 0.7
  })

  const requestOptions = getRequestOptions('POST', myHeaders, seedPayload)

  const response = await fetch(
    `${OPENRAG_URL}/v1/chat/completions`,
    requestOptions
  )

  const result = await response.json()
  return result
}
