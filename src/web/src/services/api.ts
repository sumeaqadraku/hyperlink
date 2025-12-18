import axios from 'axios'

type ViteEnv = { VITE_API_URL?: string }
const meta = (typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: ViteEnv }) : { env: undefined })
const rawBase = meta.env?.VITE_API_URL

const normalizeBase = (input?: string): string => {
  if (!input) return '/api'
  const trimmed = input.endsWith('/') ? input.slice(0, -1) : input
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const normalizeGatewayBase = (input?: string): string => {
  if (!input) return ''
  return input.endsWith('/') ? input.slice(0, -1) : input
}

const baseURL = normalizeBase(rawBase)
const gatewayURL = normalizeGatewayBase(rawBase)

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export const gatewayClient = axios.create({
  baseURL: gatewayURL,
  headers: { 'Content-Type': 'application/json' },
})
