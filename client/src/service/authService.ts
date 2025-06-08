import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TwoFASetupResponse,
} from '@/types/auth'
import { httpClient } from './http'

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await httpClient.post('/register', data)
    return response.data
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post('/login', data)
    return response.data.data
  },
  validateSession: async (sessionId: string) => {
    const response = await httpClient.get(`/validate-session/${sessionId}`)
    return response.data.data.session
  },
  enable2FA: async (userId: string): Promise<TwoFASetupResponse> => {
    const response = await httpClient.post('/enable-2fa', {
      user_id: userId,
    })
    return response.data.data
  },
  verify2FASetup: async (userId: string, token: string) => {
    const response = await httpClient.post('/verify-2fa-setup', {
      user_id: userId,
      token,
    })
    return response.data
  },
  verify2FALogin: async (userId: string, token: string, sessionId: string) => {
    const response = await httpClient.post('/verify-2fa-login', {
      user_id: userId,
      token,
      session_id: sessionId,
    })
    return response.data
  },
  disable2FA: async (userId: string) => {
    const response = await httpClient.post('/disable-2fa', {
      user_id: userId,
    })
    return response.data
  },
  logout: async (sessionId: string) => {
    const response = await httpClient.post('/logout', {
      session_id: sessionId,
    })
    return response.data
  },
}
