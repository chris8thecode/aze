import { defineCommand } from '../../types.js'
import { formatDuration } from '../../../utils/time.js'

const startedAt = Date.now()

export default defineCommand({
  name: 'uptime',
  category: 'general',
  description: 'Show how long the bot has been running.',
  run: async ({ send, message }) => {
    await send.reply(message, `up for ${formatDuration(Date.now() - startedAt)}`)
  }
})
