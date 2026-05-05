import { defineCommand } from '../../types.js'
import { fetchUrban } from '../../../services/urban.js'
import { truncate } from '../../../utils/text.js'

export default defineCommand({
  name: 'urban',
  aliases: ['ud'],
  category: 'general',
  description: 'Urban Dictionary lookup.',
  usage: 'urban <term>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: urban <term>')
    const term = args.join(' ')
    const entry = await fetchUrban(term)
    if (!entry) return send.reply(message, `No definition for "${term}".`)

    const lines = [
      `*${entry.word}*`,
      `_by ${entry.author} • 👍 ${entry.upvotes} · 👎 ${entry.downvotes}_`,
      '',
      truncate(entry.definition, 600),
      '',
      entry.example ? `_example_:\n${truncate(entry.example, 400)}` : '',
      '',
      entry.url
    ].filter(Boolean)
    await send.reply(message, lines.join('\n'))
  }
})
