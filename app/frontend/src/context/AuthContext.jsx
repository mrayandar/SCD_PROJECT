import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserProfile(token)
    } else {
      setLoading(false)
    }
  }, [])
  
  // Fetch user profile with token
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCurrentUser(response.data)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email, password
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setCurrentUser(user)
      
      toast.success('Login successful')
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    }
  }
  
  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name, email, password
      })
      
      toast.success('Registration successful. Please log in.')
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    }
  }
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    toast.info('You have been logged out')
  }
  
  // Value to be provided
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}