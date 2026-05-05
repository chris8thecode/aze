import {
  makeWASocket,
  fetchLatestBaileysVersion,
  Browsers,
  type WASocket
} from 'baileys'
import { env } from '../config/env.js'
import { loadAuthState } from './auth.js'
import { logger } from './logger.js'
import { sleep } from '../utils/time.js'
import { handleMessages } from '../events/messages.js'
import { handleConnection } from '../events/connection.js'
import { handleCalls } from '../events/calls.js'
import { handleGroupParticipants, handleGroupsUpsert } from '../events/groups.js'
import { loadCommands } from '../commands/loader.js'
import { Pipeline } from '../middleware/pipeline.js'
import { logging } from '../middleware/logger.js'
import { rateLimit } from '../middleware/ratelimit.js'
import { permission } from '../middleware/permission.js'

export class Bot {
  private sock!: WASocket
  private reconnecting = false

  async start(): Promise<void> {
    const registry = await loadCommands()
    const pipeline = new Pipeline().use(logging, rateLimit(), permission)
    await this.connect(async (sock) => {
      sock.ev.on('messages.upsert', handleMessages(sock, registry, pipeline))
      sock.ev.on('group-participants.update', handleGroupParticipants(sock))
      sock.ev.on('groups.upsert', handleGroupsUpsert())
      sock.ev.on('call', handleCalls(sock))
    })
  }

  private async connect(register: (sock: WASocket) => Promise<void>): Promise<void> {
    const { state, saveCreds } = await loadAuthState()
    const { version, isLatest } = await fetchLatestBaileysVersion()
    logger.info({ version, isLatest }, 'using baileys version')

    const sock = makeWASocket({
      version,
      auth: state,
      logger: logger.child({ module: 'baileys' }) as any,
      browser: Browsers.appropriate(env.botName),
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      markOnlineOnConnect: false
    })

    this.sock = sock
    sock.ev.on('creds.update', saveCreds)

    sock.ev.on(
      'connection.update',
      handleConnection(sock, {
        onOpen: () => {
          this.reconnecting = false
        },
        onClose: (shouldReconnect) => {
          if (shouldReconnect) void this.reconnect(register)
          else logger.fatal('logged out — delete the session directory and restart')
        }
      })
    )

    if (env.usePairingCode && !state.creds.registered) {
      await sleep(2000)
      const number = env.pairingNumber.replace(/\D/g, '')
      if (!number) throw new Error('PAIRING_NUMBER required when USE_PAIRING_CODE=true')
      const code = await sock.requestPairingCode(number)
      logger.info({ code }, 'pairing code')
    }

    await register(sock)
  }

  private async reconnect(register: (sock: WASocket) => Promise<void>): Promise<void> {
    if (this.reconnecting) return
    this.reconnecting = true
    await sleep(2000)
    await this.connect(register)
  }

  socket(): WASocket {
    return this.sock
  }
}
