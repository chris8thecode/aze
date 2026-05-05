import { defineCommand } from '../../types.js'
import { blacklist } from '../../../state/blacklist.js'
import { resolveTargets } from '../../../utils/targets.js'
import { phoneFromJid } from '../../../utils/jid.js'

export default defineCommand({
  name: 'unban',
  category: 'owner',
  description: 'Remove a user from the blacklist.',
  usage: 'unban @user | <phone>',
  permission: 'owner',
  run: async ({ send, message, args }) => {
    const targets = resolveTargets(message, args)
    if (targets.length === 0)
      return send.reply(message, 'Mention, reply to, or pass a phone number to unban.')

    const removed: string[] = []
    const missing: string[] = []
    for (const jid of targets) {
      const phone = phoneFromJid(jid)
      if (!phone) continue
      ;(await blacklist.remove(phone) ? removed : missing).push(phone)
    }

    const lines: string[] = []
    if (removed.length) lines.push(`Unbanned: ${removed.join(', ')}`)
    if (missing.length) lines.push(`Not banned: ${missing.join(', ')}`)
    await send.reply(message, lines.join('\n') || 'Nothing to do.')
  }
})
