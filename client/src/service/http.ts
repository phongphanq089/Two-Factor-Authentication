import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:4000/api/auth'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor để thêm session_id nếu có
httpClient.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('session_id')
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId
  }
  return config
})

// Response interceptor để handle lỗi chung
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa session và redirect về login
      localStorage.removeItem('session_id')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
