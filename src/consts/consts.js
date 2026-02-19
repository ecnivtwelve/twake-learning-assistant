import flag from 'cozy-flags'

import env from './env.json'

export const OPENRAG_URL = env.OPENRAG_URL || 'learnings.openrag.url'
export const AUTH_TOKEN = env.AUTH_TOKEN || flag('learnings.openrag.token')

export const LUCIE_URL = env.LUCIE_URL || flag('learnings.lucie.url')
export const LUCIE_API_KEY = env.LUCIE_API_KEY || flag('learnings.lucie.token')
