import { create } from 'zustand'
import api from '../services/api'

export const useAuthStore = create((set) => {
  // Initialize from localStorage (only in browser)
  const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }
  
  const getStoredUser = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    }
    return null
  }
  
  const token = getStoredToken()
  const storedUser = getStoredUser()
  
  const safeLocalStorage = {
    getItem: (key) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key)
      }
      return null
    },
    setItem: (key, value) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value)
      }
    },
    removeItem: (key) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    }
  }
  
  return {
    user: storedUser,
    token: token,
    isAuthenticated: !!token && !!storedUser,
    
    login: async (username, password) => {
      try {
        const response = await api.post('/auth/login-json', { username, password })
        const { access_token } = response.data
        safeLocalStorage.setItem('token', access_token)
        
        // Get user info
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` }
        })
        
        safeLocalStorage.setItem('user', JSON.stringify(userResponse.data))
        
        set({
          token: access_token,
          user: userResponse.data,
          isAuthenticated: true
        })
        
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.detail || 'Login failed'
        }
      }
    },
    
    logout: () => {
      safeLocalStorage.removeItem('token')
      safeLocalStorage.removeItem('user')
      set({
        user: null,
        token: null,
        isAuthenticated: false
      })
    },
    
    setUser: (user) => {
      safeLocalStorage.setItem('user', JSON.stringify(user))
      set({ user, isAuthenticated: true })
    },
    setToken: (token) => {
      safeLocalStorage.setItem('token', token)
      set({ token })
    },
    
    checkAuth: async () => {
      const token = safeLocalStorage.getItem('token')
      if (!token) {
        set({ isAuthenticated: false, user: null, token: null })
        return
      }
      
      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        safeLocalStorage.setItem('user', JSON.stringify(response.data))
        set({
          token,
          user: response.data,
          isAuthenticated: true
        })
      } catch (error) {
        safeLocalStorage.removeItem('token')
        safeLocalStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      }
    }
  }
})

