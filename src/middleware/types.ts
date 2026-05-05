import type { CommandContext, Command } from '../commands/types.js'

export interface PipelineContext extends CommandContext {
  command: Command
}

export type Next = () => Promise<void>
export type Middleware = (ctx: PipelineContext, next: Next) => Promise<void> | void
