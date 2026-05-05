import type { Middleware } from './types.js'

export const logging: Middleware = async (ctx, next) => {
  const start = Date.now()
  ctx.logger.debug(
    { command: ctx.command.name, sender: ctx.message.sender, chat: ctx.message.chat },
    'command start'
  )
  try {
    await next()
    ctx.logger.info(
      { command: ctx.command.name, ms: Date.now() - start },
      'command ok'
    )
  } catch (err) {
    ctx.logger.error(
      { err, command: ctx.command.name, ms: Date.now() - start },
      'command failed'
    )
    await ctx.send.reply(ctx.message, 'Something went wrong.').catch(() => {})
  }
}
