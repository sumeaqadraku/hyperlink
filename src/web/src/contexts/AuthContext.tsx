import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  name: string
  email: string
  role: string
  isAdmin: boolean
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  logout: () => void
}

interface SignUpData {
  fullName: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', 
        { email, password },
        { withCredentials: true } // Important: sends and receives cookies
      )
      
      const { token, role } = response.data
      
      const userData: User = {
        name: email.split('@')[0],
        email: email,
        role: role,
        isAdmin: role === 'Admin',
      }
      
      setUser(userData)
      setIsLoggedIn(true)
      
      // Store access token in localStorage (refreshToken is now in HttpOnly cookie)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Invalid email or password')
    }
  }

  const signup = async (data: SignUpData) => {
    try {
      const [firstName, ...lastNameParts] = data.fullName.split(' ')
      const lastName = lastNameParts.join(' ')
      
      const response = await axios.post('/auth/register', 
        {
          email: data.email,
          password: data.password,
          firstName: firstName || undefined,
          lastName: lastName || undefined
        },
        { withCredentials: true } // Important: sends and receives cookies
      )
      
      const { token, role } = response.data
      
      const userData: User = {
        name: data.email.split('@')[0],
        email: data.email,
        role: role,
        isAdmin: role === 'Admin',
      }
      
      setUser(userData)
      setIsLoggedIn(true)
      
      // Store access token in localStorage (refreshToken is now in HttpOnly cookie)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('Signup successful')
    } catch (error: any) {
      console.error('Signup failed:', error)
      if (error.response?.status === 400) {
        throw new Error('Email already exists')
      }
      throw new Error('Registration failed. Please try again.')
    }
  }

  const logout = async () => {
    try {
      // Call backend to revoke refresh token and clear cookie
      await axios.post('/auth/logout', {}, { withCredentials: true })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of backend response
      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      console.log('User logged out')
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
