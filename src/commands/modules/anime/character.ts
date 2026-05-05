import { defineCommand } from '../../types.js'
import { searchCharacter } from '../../../services/jikan.js'
import { getBuffer } from '../../../services/http.js'
import { truncate } from '../../../utils/text.js'

export default defineCommand({
  name: 'character',
  aliases: ['char'],
  category: 'anime',
  description: 'Look up an anime character (Jikan / MAL).',
  usage: 'character <name>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: character <name>')
    const query = args.join(' ')
    const result = await searchCharacter(query)
    if (!result) return send.reply(message, `No character found for "${query}".`)

    const lines = [
      `*${result.name}*${result.name_kanji ? ` (${result.name_kanji})` : ''}`,
      result.nicknames?.length ? `aliases: ${result.nicknames.join(', ')}` : '',
      result.favorites ? `favorites: ${result.favorites}` : '',
      '',
      result.about ? truncate(result.about, 700) : '',
      '',
      result.url
    ].filter(Boolean)

    const caption = lines.join('\n')

    try {
      const { data } = await getBuffer(result.images.jpg.image_url)
      await send.reply(message, { image: data, caption })
    } catch {
      await send.reply(message, caption)
    }
  }
})
