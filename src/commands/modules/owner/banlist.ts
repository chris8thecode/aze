import { defineCommand } from '../../types.js'
import { blacklist } from '../../../state/blacklist.js'

export default defineCommand({
  name: 'banlist',
  category: 'owner',
  description: 'Show the current blacklist.',
  permission: 'owner',
  run: async ({ send, message }) => {
    const phones = await blacklist.list()
    if (phones.length === 0) return send.reply(message, 'Blacklist is empty.')
    await send.reply(message, `Banned (${phones.length}):\n${phones.map((p) => `• ${p}`).join('\n')}`)
  }
})
