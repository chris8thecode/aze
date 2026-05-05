import type { ParsedMessage } from '../messaging/types.js'
import type { Sender } from '../messaging/sender.js'
import type { WASocket } from 'baileys'
import type { Logger } from '../core/logger.js'
import type { CommandRegistry } from './registry.js'

export type Permission = 'everyone' | 'group' | 'private' | 'admin' | 'owner'

export interface CommandContext {
  message: ParsedMessage
  sock: WASocket
  send: Sender
  logger: Logger
  args: string[]
  prefix: string
  registry: CommandRegistry
}

export interface Command {
  name: string
  description: string
  category: string
  aliases?: string[]
  usage?: string
  cooldown?: number
  permission?: Permission
  run: (ctx: CommandContext) => Promise<unknown> | unknown
}

export const defineCommand = (cmd: Command): Command => cmd
