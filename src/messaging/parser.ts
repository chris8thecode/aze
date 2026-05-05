import {
  downloadMediaMessage,
  getContentType,
  isLidUser,
  jidNormalizedUser,
  type WAMessage,
  type WAMessageContent,
  type WASocket
} from 'baileys'
import { logger } from '../core/logger.js'
import { isGroup, normalize } from '../utils/jid.js'
import { stripPrefix, tokenize } from '../utils/text.js'
import type { Media, MediaKind, ParsedMessage } from './types.js'

const MEDIA_TYPES: Record<string, MediaKind> = {
  imageMessage: 'image',
  videoMessage: 'video',
  audioMessage: 'audio',
  documentMessage: 'document',
  stickerMessage: 'sticker'
}

const extractText = (content: WAMessageContent | null | undefined): string => {
  if (!content) return ''
  if (content.conversation) return content.conversation
  if (content.extendedTextMessage?.text) return content.extendedTextMessage.text
  if (content.imageMessage?.caption) return content.imageMessage.caption
  if (content.videoMessage?.caption) return content.videoMessage.caption
  if (content.documentMessage?.caption) return content.documentMessage.caption
  if (content.buttonsResponseMessage?.selectedDisplayText)
    return content.buttonsResponseMessage.selectedDisplayText
  if (content.listResponseMessage?.title) return content.listResponseMessage.title
  if (content.templateButtonReplyMessage?.selectedId)
    return content.templateButtonReplyMessage.selectedId
  return ''
}

const extractMentions = (content: WAMessageContent | null | undefined): string[] => {
  const ctx = content?.extendedTextMessage?.contextInfo
  return ctx?.mentionedJid?.map(normalize) ?? []
}

const buildMedia = (msg: WAMessage, sock: WASocket): Media | undefined => {
  const content = msg.message
  if (!content) return undefined
  const type = getContentType(content)
  if (!type || !(type in MEDIA_TYPES)) return undefined
  const node = (content as Record<string, any>)[type]
  return {
    kind: MEDIA_TYPES[type]!,
    mimetype: node?.mimetype,
    caption: node?.caption,
    fileName: node?.fileName,
    download: async () =>
      (await downloadMediaMessage(msg, 'buffer', {}, {
        logger,
        reuploadRequest: sock.updateMediaMessage
      })) as Buffer
  }
}

const extractQuoted = (msg: WAMessage): WAMessage | undefined => {
  const ctx = msg.message?.extendedTextMessage?.contextInfo
  const stanzaId = ctx?.stanzaId
  const quotedMessage = ctx?.quotedMessage
  if (!stanzaId || !quotedMessage) return undefined
  return {
    key: {
      remoteJid: msg.key.remoteJid,
      id: stanzaId,
      participant: ctx.participant ?? undefined,
      fromMe: false
    },
    message: quotedMessage,
    messageTimestamp: msg.messageTimestamp
  } as WAMessage
}

const resolveSenderPn = (msg: WAMessage, sock: WASocket): string => {
  const key = msg.key
  if (key.fromMe) {
    const me = sock.user?.id
    return me ? normalize(me) : ''
  }
  const inGroup = isGroup(key.remoteJid ?? '')
  if (inGroup) {
    const candidate = key.participantAlt ?? key.participant
    if (candidate && !isLidUser(candidate)) return normalize(candidate)
    return ''
  }
  const candidate = key.remoteJidAlt ?? key.remoteJid
  if (candidate && !isLidUser(candidate)) return normalize(candidate)
  return ''
}

export const parseMessage = (
  msg: WAMessage,
  sock: WASocket,
  prefix: string
): ParsedMessage | null => {
  if (!msg.message || !msg.key.remoteJid) return null

  const chat = jidNormalizedUser(msg.key.remoteJid)
  const fromMe = msg.key.fromMe ?? false
  const sender = normalize(
    fromMe ? msg.key.remoteJid : msg.key.participant ?? msg.key.remoteJid
  )
  const senderPn = resolveSenderPn(msg, sock)

  const text = extractText(msg.message).trim()
  const hasPrefix = text.startsWith(prefix)
  const body = hasPrefix ? stripPrefix(text, prefix) : text
  const tokens = hasPrefix ? tokenize(body) : []
  const command = hasPrefix ? tokens.shift()?.toLowerCase() : undefined

  const quotedRaw = extractQuoted(msg)
  const quoted = quotedRaw ? parseMessage(quotedRaw, sock, prefix) ?? undefined : undefined

  return {
    raw: msg,
    key: msg.key,
    id: msg.key.id ?? '',
    chat,
    sender,
    senderPn,
    pushName: msg.pushName ?? undefined,
    fromMe,
    isGroup: isGroup(chat),
    text,
    body,
    args: tokens,
    command,
    mentions: extractMentions(msg.message),
    quoted,
    media: buildMedia(msg, sock),
    timestamp: Number(msg.messageTimestamp ?? Date.now() / 1000) * 1000
  }
}
