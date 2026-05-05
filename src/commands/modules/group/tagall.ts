import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'tagall',
  aliases: ['everyone'],
  category: 'group',
  description: 'Mention every member of the group.',
  permission: 'admin',
  cooldown: 30_000,
  run: async ({ sock, send, message, args }) => {
    const meta = await sock.groupMetadata(message.chat)
    const ids = meta.participants.map((p) => p.id)
    const heading = args.length ? args.join(' ') : `📣 ${meta.subject}`
    const body = ids.map((id) => `• @${id.split('@')[0]}`).join('\n')
    await send.send(message.chat, {
      text: `${heading}\n\n${body}`,
      mentions: ids
    })
  }
})
