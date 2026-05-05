import type { Middleware } from './types.js'

const lastUse = new Map<string, number>()

export const rateLimit = (defaultMs = 2000): Middleware => async (ctx, next) => {
  const cooldown = ctx.command.cooldown ?? defaultMs
  if (cooldown <= 0) return next()

  const key = `${ctx.command.name}:${ctx.message.sender}`
  const now = Date.now()
  const previous = lastUse.get(key) ?? 0
  const remaining = previous + cooldown - now

  if (remaining > 0) {
    await ctx.send.react(ctx.message.key, '⏳').catch(() => {})
    return
  }

  lastUse.set(key, now)
  await next()
}
