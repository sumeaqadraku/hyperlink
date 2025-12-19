import axios from 'axios'

type ViteEnv = { VITE_API_URL?: string; VITE_GATEWAY_URL?: string }
const meta = (typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: ViteEnv }) : { env: undefined })
const rawBase = meta.env?.VITE_API_URL
const rawGateway = meta.env?.VITE_GATEWAY_URL

const normalizeBase = (input?: string): string => {
  if (!input) return '/api'
  const trimmed = input.endsWith('/') ? input.slice(0, -1) : input
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const normalizeGatewayBase = (input?: string): string => {
  if (!input) return ''
  return input.endsWith('/') ? input.slice(0, -1) : input
}

// Dev-friendly fallback: when no VITE_API_URL is provided, default the gateway base
// to the local gateway port if running under a common dev port (Vite: 3000/5173).
// In production, always provide VITE_API_URL (e.g., https://gateway.myhost.com).
const detectDevGateway = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const port = window.location.port
      if (port === '3000' || port === '5173') {
        return 'http://localhost:5006'
      }
    }
  } catch {
    // ignore
  }
  return ''
}

const baseURL = normalizeBase(rawBase)
const gatewayURL = normalizeGatewayBase(rawGateway) || detectDevGateway()

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export const gatewayClient = axios.create({
  baseURL: gatewayURL,
  headers: { 'Content-Type': 'application/json' },
})
