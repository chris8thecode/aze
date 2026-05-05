import { jidNormalizedUser, isJidGroup, isJidBroadcast, isJidNewsletter, areJidsSameUser } from 'baileys'

export const normalize = (jid: string | undefined | null): string =>
  jid ? jidNormalizedUser(jid) : ''

export const isGroup = (jid: string): boolean => isJidGroup(jid) ?? false
export const isBroadcast = (jid: string): boolean => isJidBroadcast(jid) ?? false
export const isNewsletter = (jid: string): boolean => isJidNewsletter(jid) ?? false
export const sameUser = (a: string, b: string): boolean => areJidsSameUser(a, b)

export const phoneFromJid = (jid: string): string =>
  normalize(jid).split('@')[0]?.split(':')[0] ?? ''

export const mention = (phone: string): string =>
  `${phone.replace(/\D/g, '')}@s.whatsapp.net`
