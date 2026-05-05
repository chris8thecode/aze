import { defineCommand } from '../../types.js'
import { fetchWaifu } from '../../../services/waifu.js'
import { getBuffer } from '../../../services/http.js'

export default defineCommand({
  name: 'waifu',
  category: 'anime',
  description: 'Send a random SFW waifu image.',
  cooldown: 4000,
  run: async ({ send, message }) => {
    const image = await fetchWaifu('waifu')
    const { data } = await getBuffer(image.url)
    await send.reply(message, {
      image: data,
      caption: image.source ? `source: ${image.source}` : undefined
    })
  }
})
