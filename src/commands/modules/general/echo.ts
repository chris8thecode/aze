import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'echo',
  category: 'general',
  description: 'Repeat the given text back.',
  usage: 'echo <text>',
  permission: 'owner',
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: echo <text>')
    await send.reply(message, args.join(' '))
  }
})
