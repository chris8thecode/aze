import type { ParsedMessage } from '../messaging/types.js'
import { mention } from './jid.js'

export const resolveTargets = (msg: ParsedMessage, args: string[]): string[] => {
  const out = new Set<string>()

  for (const jid of msg.mentions) out.add(jid)

  if (msg.quoted?.sender) out.add(msg.quoted.sender)

  for (const arg of args) {
    const digits = arg.replace(/\D/g, '')
    if (digits.length >= 5) out.add(mention(digits))
  }

  return [...out]
}
