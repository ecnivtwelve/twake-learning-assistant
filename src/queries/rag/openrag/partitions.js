import { getHeaders, getRequestOptions, OPENRAG_URL } from './client'

export async function createPartition(partition) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('POST', myHeaders)

  return fetch(`${OPENRAG_URL}/partition/${partition}`, requestOptions)
}

export async function deletePartition(partition) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('DELETE', myHeaders)

  return fetch(`${OPENRAG_URL}/partition/${partition}`, requestOptions)
}

export async function fetchPartition(partition) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('GET', myHeaders)

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

export async function fetchPartitionChunks(partition) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('GET', myHeaders)

  return fetch(`${OPENRAG_URL}/partition/${partition}/chunks`, requestOptions)
    .then(response => response.json())
    .then(data => data.chunks || [])
    .catch(error => {
      throw new Error(error)
    })
}
