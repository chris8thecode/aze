import { defineCommand } from '../../types.js'
import { fetchNeko } from '../../../services/neko.js'
import { getBuffer } from '../../../services/http.js'

export default defineCommand({
  name: 'neko',
  category: 'anime',
  description: 'Send a random SFW neko image.',
  cooldown: 4000,
  run: async ({ send, message }) => {
    const result = await fetchNeko()
    const { data } = await getBuffer(result.url)
    const caption = result.artist_name
      ? `artist: ${result.artist_name}${result.source_url ? `\nsource: ${result.source_url}` : ''}`
      : undefined
    await send.reply(message, { image: data, caption })
  }
})
