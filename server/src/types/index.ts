export interface User {
  _id: string
  email: string
  password: string
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

export interface TwoFASecretKey {
  _id: string
  user_id: string
  value: string
}

export interface LoginRequest {
  email: string
  password: string
  device_id: string
}

export interface Enable2FARequest {
  user_id: string
}

export interface Verify2FARequest {
  user_id: string
  token: string
  session_id?: string
}
