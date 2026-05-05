import type { WASocket, BaileysEventMap } from 'baileys'
import { logger } from '../core/logger.js'

export const handleCalls = (sock: WASocket, rejectCalls = true) => {
  return async (calls: BaileysEventMap['call']) => {
    for (const call of calls) {
      logger.info({ from: call.from, status: call.status }, 'call event')
      if (rejectCalls && call.status === 'offer') {
        await sock.rejectCall(call.id, call.from).catch((err) => {
          logger.error({ err }, 'failed to reject call')
        })
      }
    }
  }
}
