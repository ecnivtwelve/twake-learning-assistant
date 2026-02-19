import {
  AUTH_TOKEN,
  LUCIE_API_KEY,
  LUCIE_URL,
  OPENRAG_URL
} from '@/consts/consts'

export const getHeaders = (additionalHeaders = {}, ignoreAuth = false) => {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  if (!ignoreAuth) headers.append('Authorization', 'Bearer ' + AUTH_TOKEN)

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

export { LUCIE_URL, OPENRAG_URL, LUCIE_API_KEY }
