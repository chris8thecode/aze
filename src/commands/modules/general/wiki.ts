import { defineCommand } from '../../types.js'
import { fetchWikiSummary } from '../../../services/wiki.js'
import { getBuffer } from '../../../services/http.js'
import { truncate } from '../../../utils/text.js'

export default defineCommand({
  name: 'wiki',
  category: 'general',
  description: 'Wikipedia summary.',
  usage: 'wiki <query>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: wiki <query>')
    const query = args.join(' ')
    const summary = await fetchWikiSummary(query)

    const caption = [
      `*${summary.title}*`,
      summary.description ? `_${summary.description}_` : '',
      '',
      truncate(summary.extract, 700),
      '',
      summary.content_urls.desktop.page
    ].filter(Boolean).join('\n')

    if (summary.thumbnail?.source) {
      try {
        const { data } = await getBuffer(summary.thumbnail.source)
        return send.reply(message, { image: data, caption })
      } catch {}
    }
    await send.reply(message, caption)
  }
})
