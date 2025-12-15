import { createContext, useContext, useState, ReactNode } from 'react'

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

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call to your backend
    // Example: const response = await api.post('/auth/login', { email, password })
    
    console.log('Login attempt:', { email, password })
    
    // Simulate successful login with mock data
    const mockUser: User = {
      name: 'John Smith',
      email: email,
      role: 'Premium Member',
      isAdmin: false,
    }
    
    setUser(mockUser)
    setIsLoggedIn(true)
    
    // Store token in localStorage (in real app, you'd get this from backend)
    localStorage.setItem('authToken', 'mock-token-123')
  }

  const signup = async (data: SignUpData) => {
    // TODO: Replace with actual API call to your backend
    // Example: const response = await api.post('/auth/signup', data)
    
    console.log('Sign up attempt:', data)
    
    // Simulate successful signup
    // In real app, redirect to login or auto-login after signup
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('authToken')
    console.log('User logged out')
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
