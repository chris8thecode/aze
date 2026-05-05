import { defineCommand } from '../../types.js'
import { searchAnime } from '../../../services/jikan.js'
import { getBuffer } from '../../../services/http.js'
import { truncate } from '../../../utils/text.js'

export default defineCommand({
  name: 'animeinfo',
  aliases: ['anime'],
  category: 'anime',
  description: 'Look up an anime by name (Jikan / MAL).',
  usage: 'animeinfo <title>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: animeinfo <title>')
    const query = args.join(' ')
    const anime = await searchAnime(query)
    if (!anime) return send.reply(message, `No results for "${query}".`)

    const lines = [
      `*${anime.title}*${anime.title_english && anime.title_english !== anime.title ? ` — _${anime.title_english}_` : ''}`,
      '',
      anime.type ? `type: ${anime.type}` : '',
      anime.episodes ? `episodes: ${anime.episodes}` : '',
      anime.status ? `status: ${anime.status}` : '',
      anime.year ? `year: ${anime.year}` : '',
      anime.score ? `score: ${anime.score}/10` : '',
      anime.rank ? `rank: #${anime.rank}` : '',
      anime.genres?.length ? `genres: ${anime.genres.map((g) => g.name).join(', ')}` : '',
      anime.studios?.length ? `studios: ${anime.studios.map((s) => s.name).join(', ')}` : '',
      '',
      anime.synopsis ? truncate(anime.synopsis, 600) : '',
      '',
      anime.url
    ].filter(Boolean)

    const caption = lines.join('\n')
    const cover = anime.images.jpg.large_image_url ?? anime.images.jpg.image_url

    try {
      const { data } = await getBuffer(cover)
      await send.reply(message, { image: data, caption })
    } catch {
      await send.reply(message, caption)
    }
  }
})
