import type { WASocket, BaileysEventMap } from 'baileys'
import { logger } from '../core/logger.js'
import { env } from '../config/env.js'
import { parseMessage } from '../messaging/parser.js'
import { Sender } from '../messaging/sender.js'
import type { CommandRegistry } from '../commands/registry.js'
import type { Pipeline } from '../middleware/pipeline.js'
import type { PipelineContext } from '../middleware/types.js'

export const handleMessages = (
  sock: WASocket,
  registry: CommandRegistry,
  pipeline: Pipeline
) => {
  const send = new Sender(sock)

  return async ({ messages, type }: BaileysEventMap['messages.upsert']) => {
    if (type !== 'notify' && type !== 'append') return

    for (const raw of messages) {
      const parsed = parseMessage(raw, sock, env.prefix)
      if (!parsed || parsed.fromMe) continue
      if (!parsed.command) continue

      const command = registry.resolve(parsed.command)
      if (!command) continue

      const ctx: PipelineContext = {
        message: parsed,
        sock,
        send,
        logger,
        args: parsed.args,
        prefix: env.prefix,
        registry,
        command
      }

      await pipeline.run(ctx, async () => {
        await command.run(ctx)
      })
    }
  }
}
