import type { WAMessage, WAMessageKey, AnyMessageContent } from 'baileys'

export type MediaKind = 'image' | 'video' | 'audio' | 'document' | 'sticker'

export interface Media {
  kind: MediaKind
  mimetype?: string
  caption?: string
  fileName?: string
  download: () => Promise<Buffer>
}

export interface ParsedMessage {
  raw: WAMessage
  key: WAMessageKey
  id: string
  chat: string
  sender: string
  pushName?: string
  fromMe: boolean
  isGroup: boolean
  text: string
  body: string
  args: string[]
  command?: string
  mentions: string[]
  quoted?: ParsedMessage
  media?: Media
  timestamp: number
}

export type Outgoing = AnyMessageContent
