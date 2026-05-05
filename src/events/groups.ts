import type { WASocket, BaileysEventMap } from 'baileys'
import { logger } from '../core/logger.js'

export const handleGroupParticipants = (sock: WASocket) => {
  return async (update: BaileysEventMap['group-participants.update']) => {
    const { id, participants, action } = update
    logger.info({ chat: id, action, participants }, 'group participants updated')

    if (action === 'add') {
      const meta = await sock.groupMetadata(id).catch(() => null)
      if (!meta) return
      const mentions = participants.map((p) => p.id)
      const text = mentions.map((id) => `@${id.split('@')[0]}`).join(' ')
      await sock.sendMessage(id, {
        text: `Welcome ${text} to *${meta.subject}*.`,
        mentions
      })
    }
  }
}

export const handleGroupsUpsert = () => {
  return (groups: BaileysEventMap['groups.upsert']) => {
    logger.debug({ count: groups.length }, 'groups upsert')
  }
}
