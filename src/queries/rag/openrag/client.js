import { AUTH_TOKEN, OPENRAG_URL } from '@/consts/consts'

export const getHeaders = (additionalHeaders = {}) => {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Authorization', 'Bearer ' + AUTH_TOKEN)

  Object.keys(additionalHeaders).forEach(key => {
    headers.append(key, additionalHeaders[key])
  })

  return headers
}

export const getRequestOptions = (method, headers, body = null) => {
  const options = {
    method,
    headers,
    redirect: 'follow'
  }

  if (body) {
    options.body = body
  }

  return options
}

export { OPENRAG_URL }
