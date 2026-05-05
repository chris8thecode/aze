import { defineCommand } from '../../types.js'
import { messagesCache } from '../../../state/messages-cache.js'
import { sleep } from '../../../utils/time.js'

export default defineCommand({
  name: 'selfpurge',
  category: 'moderation',
  description: 'Delete the bot\'s recent messages in this chat.',
  usage: 'selfpurge [count]',
  permission: 'admin',
  cooldown: 5000,
  run: async ({ sock, send, message, args }) => {
    const requested = Math.max(1, Math.min(50, Number(args[0]) || 10))
    const cached = messagesCache.size(message.chat)
    const recent = messagesCache.recent(message.chat, requested, {
      fromMe: true,
      excludeKey: message.id
    })

    if (recent.length === 0) {
      return send.reply(
        message,
        `Nothing of mine to delete. The cache only tracks messages seen since startup (currently ${cached} in this chat).`
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

    const lines = [`requested ${requested}, found ${recent.length}, deleted ${deleted}`]
    if (firstError) lines.push(`first error: ${firstError}`)
    await send.reply(message, lines.join('\n'))
  }
})
