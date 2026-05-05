import { defineCommand } from '../../types.js'
import { resolveTargets } from '../../../utils/targets.js'

export default defineCommand({
  name: 'demote',
  category: 'moderation',
  description: 'Remove a user from group admin.',
  usage: 'demote @user',
  permission: 'admin',
  run: async ({ sock, send, message, args }) => {
    const targets = resolveTargets(message, args)
    if (targets.length === 0)
      return send.reply(message, 'Mention, reply to, or pass a number for the user to demote.')

    await sock.groupParticipantsUpdate(message.chat, targets, 'demote')
    const list = targets.map((j) => `@${j.split('@')[0]}`).join(' ')
    await send.send(message.chat, { text: `Demoted ${list}.`, mentions: targets })
  }
})
