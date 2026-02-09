import log from 'cozy-logger'

import mockData from './mock.json'

import { AUTH_TOKEN, OPENRAG_URL } from '@/consts/consts'

export async function createPartition(partition) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(`${OPENRAG_URL}/partition/${partition}`, requestOptions)
}

export async function deletePartition(partition) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(`${OPENRAG_URL}/partition/${partition}`, requestOptions)
}

export async function deleteTask(taskId) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(`${OPENRAG_URL}/indexer/task/${taskId}`, requestOptions)
}

export async function fetchPartition(partition) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(
    `${OPENRAG_URL}/partition/${partition}?limit=2943`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
      throw new Error(error)
    })
}

export async function fetchPartitionTask(taskId) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(`${OPENRAG_URL}/indexer/task/${taskId}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
      throw new Error(error)
    })
}

function makeSystemPrompt(subject, age, topic, number, previousQuestions) {
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

  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    model: 'openrag-' + subject.partition,
    messages: [
      {
        role: 'user',
        content: makeSystemPrompt(
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

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  return fetch(`${OPENRAG_URL}/v1/chat/completions`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
      throw new Error(error)
    })
}

export function extractJSONObject(input) {
  try {
    const regex = /```json\s*([\s\S]*?)\s*```/
    const match = input.match(regex)

    if (match && match[1]) {
      const jsonString = match[1].trim()
      return JSON.parse(jsonString)
    }

    const fallbackRegex = /({[\s\S]*})/
    const fallbackMatch = input.match(fallbackRegex)

    if (fallbackMatch) {
      return JSON.parse(fallbackMatch[0].trim())
    }

    throw new Error('No JSON found in the provided string.')
  } catch (error) {
    log.error('Parsing failed:', error.message)
    return null
  }
}

export async function deleteFile(partition, fileId) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  }

  return fetch(
    `${OPENRAG_URL}/indexer/partition/${partition}/file/${fileId}`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => (result ? JSON.parse(result) : {}))
    .catch(error => {
      throw new Error(error)
    })
}

export const generateFileHash = async file => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.substring(0, 10)
}

export async function uploadFile(partition, file, author, description, fileId) {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  let filename = file.name
  let mimetype = file.type

  if (filename.endsWith('.docs-note') || filename.endsWith('.cozy-note')) {
    filename = filename.replace(/\.(docs-note|cozy-note)$/, '.md')
    mimetype = 'text/markdown'
  }

  const formdata = new FormData()
  formdata.append(
    'metadata',
    JSON.stringify({
      mimetype: mimetype,
      author: author,
      description: description
    })
  )
  formdata.append('file', file, filename)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  }

  const url = `${OPENRAG_URL}/indexer/partition/${partition}/file/${fileId}`

  return fetch(url, requestOptions)
    .then(response => response.json())
    .catch(error => {
      throw new Error(error)
    })
}
