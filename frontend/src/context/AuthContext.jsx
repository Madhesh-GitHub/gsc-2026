import { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../utils/api'
import { getToken, getUser, saveToken, saveUser, clearAuth } from '../utils/auth'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = getUser()
    const savedToken = getToken()
    
    if (savedUser && savedToken) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      saveToken(response.access_token)
      saveUser(response.user)
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const register = async (data) => {
    try {
      const response = await apiClient.register(data)
      setUser(response.user)
      saveToken(response.access_token)
      saveUser(response.user)
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    clearAuth()
    apiClient.logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
