import { defineCommand } from '../../types.js'
import { messagesCache } from '../../../state/messages-cache.js'
import { sleep } from '../../../utils/time.js'

export default defineCommand({
  name: 'purge',
  category: 'moderation',
  description: 'Delete a quoted message, or the last N messages in the chat.',
  usage: 'purge [count]   |   reply to a message with !purge',
  permission: 'admin',
  cooldown: 5000,
  run: async ({ sock, send, message, args }) => {
    if (message.quoted) {
      try {
        await sock.sendMessage(message.chat, { delete: message.quoted.key })
        return send.reply(message, 'Message deleted.')
      } catch (err) {
        return send.reply(message, `Failed to delete (am I admin?): ${(err as Error).message}`)
      }
    }

    const requested = Math.max(1, Math.min(50, Number(args[0]) || 10))
    const cached = messagesCache.size(message.chat)
    const recent = messagesCache.recent(message.chat, requested, { excludeKey: message.id })

    if (recent.length === 0) {
      return send.reply(
        message,
        `Nothing to delete. The cache only tracks messages seen since the bot last started (currently ${cached} in this chat).`
      )
    }

    let deleted = 0
    let firstError: string | null = null
    for (const entry of recent) {
      try {
        await sock.sendMessage(message.chat, { delete: entry.key })
        deleted++
      } catch (err) {
        if (!firstError) firstError = (err as Error).message
      }
      await sleep(200)
    }

    const lines = [
      `requested ${requested}, found ${recent.length} (cache has ${cached}), deleted ${deleted}`
    ]
    if (firstError) lines.push(`first error: ${firstError}`)
    if (deleted < recent.length) lines.push('note: I need group-admin to delete other people\'s messages.')
    await send.reply(message, lines.join('\n'))
  }
})
