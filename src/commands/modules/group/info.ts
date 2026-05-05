import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'groupinfo',
  aliases: ['ginfo'],
  category: 'group',
  description: 'Show group metadata.',
  permission: 'group',
  run: async ({ sock, send, message }) => {
    const meta = await sock.groupMetadata(message.chat)
    const admins = meta.participants.filter((p) => p.admin).length
    const lines = [
      `*${meta.subject}*`,
      meta.desc ? `\n${meta.desc}\n` : '',
      `members: ${meta.participants.length}`,
      `admins: ${admins}`,
      meta.owner ? `owner: @${meta.owner.split('@')[0]}` : '',
      `created: ${new Date((Number(meta.creation) || 0) * 1000).toISOString().slice(0, 10)}`
    ].filter(Boolean)
    await send.reply(message, lines.join('\n'))
  }
})
