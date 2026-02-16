import { getHeaders, getRequestOptions, OPENRAG_URL } from './client'
import { AUTH_TOKEN } from '@/consts/consts'

export async function deleteFile(partition, fileId) {
  const myHeaders = getHeaders()
  const requestOptions = getRequestOptions('DELETE', myHeaders)

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
  const myHeaders = getHeaders()

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

  const requestOptions = getRequestOptions('POST', myHeaders, formdata)

  const url = `${OPENRAG_URL}/indexer/partition/${partition}/file/${fileId}`

  return fetch(url, requestOptions)
    .then(response => response.json())
    .catch(error => {
      throw new Error(error)
    })
}
