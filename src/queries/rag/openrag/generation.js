import { getHeaders, getRequestOptions, OPENRAG_URL } from './client'
import mockData from '../mock.json'

function makeFlashcardsSystemPrompt(
  subject,
  age,
  topic,
  number,
  previousQuestions
) {
  const prompt = `Tu es un expert en ingénierie pédagogique. Matière : ${subject}. Niveau : ${age}. Sujet : ${topic}. Génère exactement ${number} flashcards à partir des documents fournis. ${previousQuestions.length > 0
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

  const response = await fetch(`${OPENRAG_URL}/v1/chat/completions`, requestOptions)

  const result = await response.json()
  return result
}
