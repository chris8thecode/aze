import { defineCommand } from '../../types.js'
import { resolveTargets } from '../../../utils/targets.js'

export default defineCommand({
  name: 'promote',
  category: 'moderation',
  description: 'Promote a user to group admin.',
  usage: 'promote @user',
  permission: 'admin',
  run: async ({ sock, send, message, args }) => {
    const targets = resolveTargets(message, args)
    if (targets.length === 0)
      return send.reply(message, 'Mention, reply to, or pass a number for the user to promote.')

    await sock.groupParticipantsUpdate(message.chat, targets, 'promote')
    const list = targets.map((j) => `@${j.split('@')[0]}`).join(' ')
    await send.send(message.chat, { text: `Promoted ${list}.`, mentions: targets })
  }
})
