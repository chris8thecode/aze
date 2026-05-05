import type { WASocket, AnyMessageContent, WAMessageKey, MiscMessageGenerationOptions } from 'baileys'
import type { ParsedMessage, Outgoing } from './types.js'

export class Sender {
  constructor(private readonly sock: WASocket) {}

  send(jid: string, content: Outgoing, options: MiscMessageGenerationOptions = {}) {
    return this.sock.sendMessage(jid, content as AnyMessageContent, options)
  }

  reply(msg: ParsedMessage, content: Outgoing | string) {
    const payload: Outgoing = typeof content === 'string' ? { text: content } : content
    return this.sock.sendMessage(msg.chat, payload as AnyMessageContent, { quoted: msg.raw })
  }

  text(jid: string, text: string, mentions: string[] = []) {
    return this.sock.sendMessage(jid, { text, mentions })
  }

  react(key: WAMessageKey, emoji: string) {
    return this.sock.sendMessage(key.remoteJid!, { react: { text: emoji, key } })
  }

  read(keys: WAMessageKey[]) {
    return this.sock.readMessages(keys)
  }

  typing(jid: string, on = true) {
    return this.sock.sendPresenceUpdate(on ? 'composing' : 'paused', jid)
  }
}
