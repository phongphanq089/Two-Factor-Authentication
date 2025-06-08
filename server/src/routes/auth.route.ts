import {
  disable2faController,
  enable2faController,
  LoginUserController,
  logOutController,
  registerUserController,
  validateSessionController,
  verify2faLoginSetupController,
  verify2faSetupController,
} from '@/controller/auth.controller'

import { FastifyInstance } from 'fastify'

export const authRoutes = (server: FastifyInstance) => {
  server.post('/register', registerUserController),
    server.post('/login', LoginUserController),
    server.get('/validate-session/:sessionId', validateSessionController),
    server.post('/enable-2fa', enable2faController),
    server.post('/verify-2fa-setup', verify2faSetupController),
    server.post('/verify-2fa-login', verify2faLoginSetupController),
    server.post('/logout', logOutController)
  server.post('/disable-2fa', disable2faController)
}

export default authRoutes
