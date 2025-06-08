import { Navigate, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './hook/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import LoginForm from './pages/LoginForm'
import RegisterForm from './pages/RegisterForm'
import TwoFAVerification from './pages/TwoFAVerification'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/verify-2fa' element={<TwoFAVerification />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='/' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
