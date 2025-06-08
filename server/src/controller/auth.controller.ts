import { authService } from '@/services/authService'
import { FastifyReply, FastifyRequest } from 'fastify'

export const registerUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // tạm thời ko validate vì đây chì là code demo
    const userData = request.body as any

    const user = await authService.createUser(userData)

    // Không trả về password
    const { password, ...userResponse } = user

    reply.code(200).send({
      success: true,
      message: 'User created successfully',
      data: { user: userResponse },
    })
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const LoginUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const loginData = request.body as any
    const result = await authService.login(loginData)

    const { password, ...userResponse } = result.user

    reply.send({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        session: result.session,
        requires2FA: result.requires2FA,
      },
    })
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const validateSessionController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { sessionId } = request.params as any
    const session = await authService.validateSession(sessionId)

    if (session) {
      reply.send({
        success: true,
        message: 'Session is valid',
        data: { session },
      })
    } else {
      reply.code(401).send({
        success: false,
        message: 'Invalid session',
      })
    }
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const enable2faController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body as any
    const result = await authService.enable2FA(data)

    reply.send({
      success: true,
      message: '2FA setup initiated',
      data: {
        secret: result.secret,
        qrCode: result.qrCode,
      },
    })
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const verify2faSetupController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body as any
    const isValid = await authService.verify2FASetup(data)

    if (isValid) {
      reply.send({
        success: true,
        message: '2FA enabled successfully',
      })
    } else {
      reply.code(400).send({
        success: false,
        message: 'Invalid 2FA token',
      })
    }
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const verify2faLoginSetupController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body as any
    const isValid = await authService.verify2FALogin(data)

    if (isValid) {
      reply.send({
        success: true,
        message: '2FA verification successful',
      })
    } else {
      reply.code(400).send({
        success: false,
        message: 'Invalid 2FA token',
      })
    }
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const disable2faController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { user_id } = request.body as any
    await authService.disable2FA(user_id)

    reply.send({
      success: true,
      message: '2FA disabled successfully',
    })
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}

export const logOutController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { session_id } = request.body as any
    await authService.logout(session_id)

    reply.send({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      message: error.message,
    })
  }
}
