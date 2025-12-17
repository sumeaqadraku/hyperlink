import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosHeaders } from 'axios'
import { apiClient } from './api'

let isRefreshing = false
type QueueItem = { resolve: (token: string | null) => void; reject: (error: unknown) => void }
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

const isAxiosHeaders = (h: unknown): h is AxiosHeaders =>
  !!h && typeof (h as AxiosHeaders).set === 'function'

const setAuthHeader = (headers: AxiosRequestHeaders | undefined, token: string): AxiosRequestHeaders => {
  if (isAxiosHeaders(headers)) {
    headers.set('Authorization', 'Bearer ' + token)
    return headers
  }
  const base: Record<string, string> = headers ? ((headers as unknown) as Record<string, string>) : {}
  const obj: Record<string, string> = { ...base, Authorization: 'Bearer ' + token }
  return (obj as unknown) as AxiosRequestHeaders
}

const attach = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers = setAuthHeader(originalRequest.headers as AxiosRequestHeaders | undefined, token as string)
            return client(originalRequest)
          }).catch(err => {
            return Promise.reject(err)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Refresh using HttpOnly cookie - no need to send refreshToken in body
          const response = await axios.post('/auth/refresh', {}, { 
            withCredentials: true // Important: sends cookies
          })
          const { token } = response.data

          // Store new access token
          localStorage.setItem('authToken', token)
          
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          client.defaults.headers.common['Authorization'] = 'Bearer ' + token
          originalRequest.headers = setAuthHeader(originalRequest.headers as AxiosRequestHeaders | undefined, token)
          
          processQueue(null, token)
          isRefreshing = false
          
          return client(originalRequest)
        } catch (err) {
          processQueue(err, null)
          isRefreshing = false
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(err)
        }
      }

      return Promise.reject(error)
    }
  )

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers = setAuthHeader(config.headers as AxiosRequestHeaders | undefined, token)
      }
      // Always include credentials for cookies
      config.withCredentials = true
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

export const setupAxiosInterceptors = () => {
  attach(axios)
  attach(apiClient)
}
