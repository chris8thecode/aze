import { env } from '../config/env.js'
import { phoneFromJid } from '../utils/jid.js'
import type { ParsedMessage } from '../messaging/types.js'
import type { Middleware } from './types.js'

const owners = new Set(env.owners.map((p) => p.replace(/\D/g, '')))

const isOwner = (msg: ParsedMessage): boolean => {
  const candidates = [msg.senderPn, msg.sender]
  for (const jid of candidates) {
    if (!jid) continue
    const phone = phoneFromJid(jid)
    if (phone && owners.has(phone)) return true
  }
  return false
}

export const permission: Middleware = async (ctx, next) => {
  const required = ctx.command.permission ?? 'everyone'
  const { message, sock } = ctx

  if (required === 'owner' && !isOwner(message)) {
    await ctx.send.reply(message, 'Owner only.')
    return
  }

  if (required === 'private' && message.isGroup) {
    await ctx.send.reply(message, 'Use this in a private chat.')
    return
  }

  if (required === 'group' || required === 'admin') {
    if (!message.isGroup) {
      await ctx.send.reply(message, 'Use this inside a group.')
      return
    }
  }

  if (required === 'admin') {
    const meta = await sock.groupMetadata(message.chat).catch(() => null)
    const participant = meta?.participants.find((p) => p.id === message.sender)
    const role = participant?.admin
    if (role !== 'admin' && role !== 'superadmin' && !isOwner(message)) {
      await ctx.send.reply(message, 'Group admins only.')
      return
    }
  }

  await next()
}
