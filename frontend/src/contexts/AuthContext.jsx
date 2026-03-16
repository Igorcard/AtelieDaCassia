import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { getStoredToken, setStoredToken, clearStoredToken, getErrorMessage } from '../services/api.js'

const USER_KEY = 'atelie_user'

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setStoredUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  const restoreSession = useCallback(() => {
    const token = getStoredToken()
    const storedUser = getStoredUser()
    if (token && storedUser) {
      setUser(storedUser)
    } else {
      if (!token) clearStoredToken()
      setStoredUser(null)
      setUser(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    const { id, email: userEmail, name, roleId, token } = data
    const userData = { id, email: userEmail, name, roleId }
    setStoredToken(token)
    setStoredUser(userData)
    setUser(userData)
    return data
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setStoredUser(null)
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getErrorMessage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
