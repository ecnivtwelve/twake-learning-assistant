import log from 'cozy-logger'

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
