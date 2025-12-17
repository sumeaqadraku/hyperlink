import axios from 'axios'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return axios(originalRequest)
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
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          
          processQueue(null, token)
          isRefreshing = false
          
          return axios(originalRequest)
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

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
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
