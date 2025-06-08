import { useAuth } from '@/hook/useAuth'
import { Navigate, useLocation } from 'react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, session } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // Kiểm tra 2FA verification
  if (session && !session.is_2fa_verified) {
    return <Navigate to='/verify-2fa' replace />
  }

  return <>{children}</>
}
