import env from './env.json'

export const OPENRAG_URL = env.OPENRAG_URL || 'http://localhost:8081'
export const AUTH_TOKEN = env.AUTH_TOKEN || ''
export const OPENRAG_MODEL = env.OPENRAG_MODEL || 'openrag'
