import { defineCommand } from '../../types.js'
import { chats } from '../../../state/chats.js'
import { sleep } from '../../../utils/time.js'

export default defineCommand({
  name: 'broadcast',
  aliases: ['bc'],
  category: 'owner',
  description: 'Send a message to every chat the bot has seen.',
  usage: 'broadcast <message>',
  permission: 'owner',
  cooldown: 60_000,
  run: async ({ sock, send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: broadcast <message>')

    const text = `📣 *Broadcast*\n\n${args.join(' ')}`
    const targets = await chats.list()
    if (targets.length === 0) return send.reply(message, 'No known chats yet.')

    await send.reply(message, `Broadcasting to ${targets.length} chat(s)…`)

    let ok = 0
    let failed = 0
    for (const jid of targets) {
      try {
        await sock.sendMessage(jid, { text })
        ok++
      } catch {
        failed++
      }
      await sleep(750)
    }

    await send.reply(message, `Done. delivered: ${ok}, failed: ${failed}`)
  }
})
