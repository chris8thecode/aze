import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'setdesc',
  aliases: ['groupdesc'],
  category: 'moderation',
  description: 'Change the group description.',
  usage: 'setdesc <new description>',
  permission: 'admin',
  run: async ({ sock, send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: setdesc <new description>')
    const description = args.join(' ').slice(0, 512)
    await sock.groupUpdateDescription(message.chat, description)
    await send.reply(message, 'Group description updated.')
  }
})
