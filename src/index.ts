import { Bot } from './core/client.js'
import { logger } from './core/logger.js'

const bot = new Bot()

const shutdown = (signal: string) => {
  logger.info({ signal }, 'shutting down')
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandled rejection'))
process.on('uncaughtException', (err) => logger.error({ err }, 'uncaught exception'))

bot.start().catch((err) => {
  logger.fatal({ err }, 'failed to start')
  process.exit(1)
})
