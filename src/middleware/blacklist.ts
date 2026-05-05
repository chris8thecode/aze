import { blacklist } from '../state/blacklist.js'
import { phoneFromJid } from '../utils/jid.js'
import type { Middleware } from './types.js'

export const banGate: Middleware = async (ctx, next) => {
  const phones = [
    phoneFromJid(ctx.message.senderPn),
    phoneFromJid(ctx.message.sender)
  ].filter(Boolean)

  for (const phone of phones) {
    if (await blacklist.has(phone)) return
  }

  await next()
}
