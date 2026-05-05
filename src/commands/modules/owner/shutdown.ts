import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'shutdown',
  category: 'owner',
  description: 'Gracefully stop the bot.',
  permission: 'owner',
  run: async ({ send, message }) => {
    await send.reply(message, 'Shutting down…')
    setTimeout(() => process.exit(0), 250)
  }
})
