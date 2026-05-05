import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'ping',
  category: 'general',
  description: 'Measure round-trip latency.',
  cooldown: 1000,
  run: async ({ send, message }) => {
    const start = Date.now()
    await send.reply(message, 'pong')
    const latency = Date.now() - start
    await send.reply(message, `latency: ${latency}ms`)
  }
})
