import axios from 'axios'

type ViteEnv = { VITE_API_URL?: string }
const meta = (typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: ViteEnv }) : { env: undefined })
const rawBase = meta.env?.VITE_API_URL

const normalizeBase = (input?: string): string => {
  if (!input) return '/api'
  const trimmed = input.endsWith('/') ? input.slice(0, -1) : input
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const baseURL = normalizeBase(rawBase)

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
