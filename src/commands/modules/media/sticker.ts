import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'sticker',
  aliases: ['s'],
  category: 'media',
  description: 'Convert an image or short video to a sticker.',
  cooldown: 3000,
  run: async ({ send, message }) => {
    const target = message.media ?? message.quoted?.media
    if (!target || (target.kind !== 'image' && target.kind !== 'video')) {
      return send.reply(message, 'Reply to or send an image/video.')
    }
    const buffer = await target.download()
    await send.reply(message, { sticker: buffer })
  }
})
