import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'setname',
  aliases: ['groupname'],
  category: 'moderation',
  description: 'Change the group subject.',
  usage: 'setname <new name>',
  permission: 'admin',
  run: async ({ sock, send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: setname <new name>')
    const subject = args.join(' ').slice(0, 100)
    await sock.groupUpdateSubject(message.chat, subject)
    await send.reply(message, `Group renamed to "${subject}".`)
  }
})
