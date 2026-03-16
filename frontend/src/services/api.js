import axios from 'axios'
import { API_URL } from '../config/env.js'

const TOKEN_KEY = 'atelie_auth_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error) {
  const data = error.response?.data
  if (!data) return error.message || 'Erro de conexão'
  const err = data.error
  if (typeof err === 'string') return err
  if (err?.message) return err.message
  return data.message || error.message || 'Erro desconhecido'
}

export default api
