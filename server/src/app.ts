import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { config } from './config/envConfig'

export const buildApp = async (
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: config.isDevelopment,
    ...opts,
  })

  return app
}
