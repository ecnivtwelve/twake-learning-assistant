import log from 'cozy-logger'

import mockData from './mock.json'

import { AUTH_TOKEN, OPENRAG_URL } from '@/consts/consts'

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

export async function generateFlashCards(
  partition,
  subject,
  age,
  topic,
  number = 5,
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
    model: 'openrag-vince-test-test1',
    messages: [
      {
        role: 'user',
        content: `Tu es un expert en ingénierie pédagogique. Matière : ${subject}. Niveau : ${age}. Sujet : ${topic}. Génère exactement ${number} flashcards à partir des documents fournis.`
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
