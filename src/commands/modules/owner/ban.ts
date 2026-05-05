import { defineCommand } from '../../types.js'
import { blacklist } from '../../../state/blacklist.js'
import { resolveTargets } from '../../../utils/targets.js'
import { phoneFromJid } from '../../../utils/jid.js'

export default defineCommand({
  name: 'ban',
  category: 'owner',
  description: 'Blacklist a user from using the bot.',
  usage: 'ban @user | <phone>',
  permission: 'owner',
  run: async ({ send, message, args }) => {
    const targets = resolveTargets(message, args)
    if (targets.length === 0)
      return send.reply(message, 'Mention, reply to, or pass a phone number to ban.')

    const added: string[] = []
    const skipped: string[] = []
    for (const jid of targets) {
      const phone = phoneFromJid(jid)
      if (!phone) continue
      ;(await blacklist.add(phone) ? added : skipped).push(phone)
    }

    const lines: string[] = []
    if (added.length) lines.push(`Banned: ${added.join(', ')}`)
    if (skipped.length) lines.push(`Already banned: ${skipped.join(', ')}`)
    await send.reply(message, lines.join('\n') || 'Nothing to do.')
  }
})
