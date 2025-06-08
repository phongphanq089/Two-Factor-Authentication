export interface User {
  _id: string
  email: string
  username: string
  youtube: string
  require_2fa: boolean
}

export interface UserSession {
  _id: string
  user_id: string
  device_id: string
  is_2fa_verified: boolean
  last_login: string
}

export interface LoginRequest {
  email: string
  password: string
  device_id: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  youtube: string
}

export interface LoginResponse {
  user: User
  session: UserSession
  requires2FA: boolean
}

export interface TwoFASetupResponse {
  secret: string
  qrCode: string
}
