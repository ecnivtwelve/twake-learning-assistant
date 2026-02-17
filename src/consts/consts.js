import env from './env.json'

export const OPENRAG_URL = env.OPENRAG_URL || 'http://localhost:8081'
export const AUTH_TOKEN = env.AUTH_TOKEN || ''
export const OPENRAG_MODEL = env.OPENRAG_MODEL || 'openrag'
export const PARTITION = env.PARTITION || 'vince-test-test1'

export const LUCIE_URL =
  env.LUCIE_URL || 'https://chat.lucie.ovh.linagora.com/v1'
export const LUCIE_API_KEY = env.LUCIE_API_KEY || 'sk-dummy'
export const LUCIE_MODEL = env.LUCIE_MODEL || 'lucie'
