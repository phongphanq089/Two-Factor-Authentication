import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { database } from '@/config/database-fake'
import {
  Enable2FARequest,
  LoginRequest,
  TwoFASecretKey,
  User,
  UserSession,
  Verify2FARequest,
} from '@/types'

export class AuthService {
  private db: typeof database

  constructor(db: typeof database) {
    this.db = db
  }
  /**
   *
   * @param CREATE_USER
   * @returns
   */
  async createUser(userData: Omit<User, '_id'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const user: User = {
      _id: uuidv4(),
      ...userData,
      password: hashedPassword,
      require_2fa: false,
    }

    await this.db.users.insert(user)
    return user
  }
  /**
   *
   * @param LOGIN
   * @returns
   */
  async login(
    loginData: LoginRequest
  ): Promise<{ user: User; session: UserSession; requires2FA: boolean }> {
    console.log(loginData, 'đal;sadkl;a')
    const user = await this.db.users.findOne({ email: loginData.email })

    if (!user) {
      throw new Error('User not found')
    }

    // kiểm tra pass trên db và pass user gửi lên có trùng nhau hay ko
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    )
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const session: UserSession = {
      _id: uuidv4(),
      user_id: user._id,
      device_id: loginData.device_id,
      is_2fa_verified: !user.require_2fa, // Nếu không yêu cầu 2FA thì tự động verified
      last_login: new Date().toISOString(),
    }

    await this.db.userSessions.insert(session)
    return {
      user,
      session,
      requires2FA: user.require_2fa,
    }
  }
  /**
   *
   * @param ENABLE_2FA
   * @returns
   */
  async enable2FA(
    data: Enable2FARequest
  ): Promise<{ secret: string; qrCode: string }> {
    const user = await this.db.users.findOne({ _id: data.user_id })
    if (!user) {
      throw new Error('User not found')
    }

    const secret = authenticator.generateSecret()

    // Lưu secret key vào database
    const secretKeyData: TwoFASecretKey = {
      _id: uuidv4(),
      user_id: data.user_id,
      value: secret,
    }
    // Xóa secret cũ nếu có
    await this.db.twoFASecretKeys.remove(
      { user_id: data.user_id },
      { multi: true }
    )
    await this.db.twoFASecretKeys.insert(secretKeyData)

    // Tạo QR code
    const otpAuth = authenticator.keyuri(user.email, '2FA App', secret)
    const qrCode = await QRCode.toDataURL(otpAuth)

    return { secret, qrCode }
  }

  // Xác thực 2FA và bật yêu cầu 2FA
  async verify2FASetup(data: Verify2FARequest): Promise<boolean> {
    const secretKey = await this.db.twoFASecretKeys.findOne({
      user_id: data.user_id,
    })
    if (!secretKey) {
      throw new Error('2FA not set up for this user')
    }

    const isValid = authenticator.verify({
      token: data.token,
      secret: secretKey.value,
    })

    if (isValid) {
      // Bật yêu cầu 2FA cho user
      await this.db.users.update(
        { _id: data.user_id },
        { $set: { require_2fa: true } }
      )
      return true
    }

    return false
  }
  // Xác thực 2FA khi đăng nhập
  async verify2FALogin(data: Verify2FARequest): Promise<boolean> {
    const secretKey = await this.db.twoFASecretKeys.findOne({
      user_id: data.user_id,
    })
    if (!secretKey) {
      throw new Error('2FA not set up for this user')
    }

    const isValid = authenticator.verify({
      token: data.token,
      secret: secretKey.value,
    })

    if (isValid && data.session_id) {
      // Cập nhật session là đã xác thực 2FA
      await this.db.userSessions.update(
        { _id: data.session_id },
        { $set: { is_2fa_verified: true } }
      )
      return true
    }

    return isValid
  }

  // Tắt 2FA
  async disable2FA(userId: string): Promise<boolean> {
    // Xóa secret key
    await this.db.twoFASecretKeys.remove({ user_id: userId }, { multi: true })

    // Tắt yêu cầu 2FA
    await this.db.users.update(
      { _id: userId },
      { $set: { require_2fa: false } }
    )

    // Cập nhật tất cả session của user là đã verified
    await this.db.userSessions.update(
      { user_id: userId },
      { $set: { is_2fa_verified: true } },
      { multi: true }
    )
    return true
  }

  // Kiểm tra session
  async validateSession(sessionId: string): Promise<UserSession | null> {
    return await this.db.userSessions.findOne({ _id: sessionId })
  }

  // Đăng xuất
  async logout(sessionId: string): Promise<boolean> {
    const result = await this.db.userSessions.remove(
      { _id: sessionId },
      { multi: false }
    )
    return result > 0
  }
}

export const authService = new AuthService(database)
