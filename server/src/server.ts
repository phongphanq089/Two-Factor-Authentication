import fastifyCors from '@fastify/cors'
import { buildApp } from './app'
import { database } from './config/database-fake'
import { config } from './config/envConfig'
import authRoutes from './routes/auth.route'
import { logger } from './utils/logger'

const start = async (): Promise<void> => {
  try {
    const app = await buildApp({ logger: true })

    await app.register(fastifyCors, {
      origin: true,
      credentials: true,
    })

    // Khởi tạo database

    await database.createIndexes()

    // Đăng ký routes
    await app.register(
      async function (fastify) {
        await authRoutes(fastify)
      },
      { prefix: '/api/auth' }
    )

    // Health check
    app.get('/', async (request, reply) => {
      return { status: 'OK', timestamp: new Date().toISOString() }
    })

    await app.listen({
      port: config.port,
      host: config.host,
    })

    logger.info(`Server listening on ${config.host}:${config.port}`)
  } catch (error) {
    logger.error('Error starting server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

start()
