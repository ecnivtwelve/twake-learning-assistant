import { getHeaders, getRequestOptions, OPENRAG_URL } from './client'
import { AUTH_TOKEN } from '@/consts/consts'

export async function deleteTask(taskId) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('DELETE', myHeaders)

  return fetch(`${OPENRAG_URL}/indexer/task/${taskId}`, requestOptions)
}

export async function fetchPartitionTask(taskId) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('GET', myHeaders)

  return fetch(`${OPENRAG_URL}/indexer/task/${taskId}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
      throw new Error(error)
    })
}
