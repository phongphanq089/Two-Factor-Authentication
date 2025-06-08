/* eslint-disable @typescript-eslint/no-unused-vars */
import { authService } from '@/service/authService'
import type { User, UserSession } from '@/types/auth'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface AuthContextType {
  user: User | null
  session: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, session: UserSession) => void
  logout: () => void
  updateUser: (user: User) => void
  updateSession: (session: UserSession) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const sessionId = localStorage.getItem('session_id')
      const userData = localStorage.getItem('user_data')

      if (sessionId && userData) {
        try {
          const validSession = await authService.validateSession(sessionId)
          setUser(JSON.parse(userData))
          setSession(validSession)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // Session không hợp lệ, xóa dữ liệu
          localStorage.removeItem('session_id')
          localStorage.removeItem('user_data')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (user: User, session: UserSession) => {
    setUser(user)
    setSession(session)
    localStorage.setItem('session_id', session._id)
    localStorage.setItem('user_data', JSON.stringify(user))
  }
  const logout = async () => {
    if (session) {
      try {
        await authService.logout(session._id)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    setUser(null)
    setSession(null)
    localStorage.removeItem('session_id')
    localStorage.removeItem('user_data')
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
  }

  const updateSession = (updatedSession: UserSession) => {
    setSession(updatedSession)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        logout,
        updateUser,
        updateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
