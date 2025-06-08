import fs from 'fs'
import path from 'path'
import Datastore from 'nedb-promises'
import { TwoFASecretKey, User, UserSession } from '@/types'

class Database {
  public users: Datastore<User>
  public userSessions: Datastore<UserSession>
  public twoFASecretKeys: Datastore<TwoFASecretKey>

  constructor() {
    // Tạo thư mục nếu chưa tồn tại
    const dbPath = path.join(process.cwd(), 'database-fake')

    console.log('Checking db path ======>:', dbPath)
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true }) // Tạo thư mục nếu chưa có
    }

    this.users = Datastore.create({
      filename: path.join(dbPath, 'users.db'),
      autoload: true,
      onload: (err) => {
        if (err) console.error('Error loading users DB:', err)
      },
    })

    this.userSessions = Datastore.create({
      filename: path.join(dbPath, 'user_sessions.db'),
      autoload: true,
    })

    this.twoFASecretKeys = Datastore.create({
      filename: path.join(dbPath, '2fa_secret_keys.db'),
      autoload: true,
    })
  }

  async createIndexes() {
    await this.users.ensureIndex({ fieldName: 'email', unique: true })
    await this.userSessions.ensureIndex({ fieldName: 'user_id' })
    await this.twoFASecretKeys.ensureIndex({
      fieldName: 'user_id',
      unique: true,
    })
  }
}

export const database = new Database()
