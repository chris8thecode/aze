import { defineCommand, type Command } from '../../types.js'
import { env } from '../../../config/env.js'
import { formatDuration } from '../../../utils/time.js'

const REPO_URL = 'https://github.com/ni5arga/aze'
const RULE = '─'.repeat(28)

const detail = (cmd: Command, prefix: string): string => {
  const lines = [
    `┌── *${prefix}${cmd.name}*`,
    `│ ${cmd.description}`,
    cmd.aliases?.length ? `│ aliases : ${cmd.aliases.join(', ')}` : '',
    cmd.usage ? `│ usage   : ${prefix}${cmd.usage}` : '',
    `│ category: ${cmd.category}`,
    cmd.permission ? `│ access  : ${cmd.permission}` : '',
    cmd.cooldown ? `│ cooldown: ${formatDuration(cmd.cooldown)}` : '',
    '└────────────'
  ].filter(Boolean)
  return lines.join('\n')
}

const startedAt = Date.now()

export default defineCommand({
  name: 'help',
  aliases: ['menu', 'commands'],
  category: 'general',
  description: 'List available commands or detail one.',
  usage: 'help [command]',
  run: async ({ send, message, args, prefix, registry }) => {
    if (args[0]) {
      const cmd = registry.resolve(args[0])
      if (!cmd) return send.reply(message, `Unknown command: ${args[0]}`)
      return send.reply(message, `${detail(cmd, prefix)}\n\n— ${REPO_URL}`)
    }

    const groups = registry.byCategory()
    const total = registry.list().length
    const uptime = formatDuration(Date.now() - startedAt)

    const out: string[] = [
      `╭─ *${env.botName}*`,
      `│ prefix : ${prefix}`,
      `│ commands: ${total}`,
      `│ uptime : ${uptime}`,
      `╰${RULE}`,
      ''
    ]

    for (const [category, cmds] of Object.entries(groups).sort()) {
      out.push(`▸ *${category}* — ${cmds.length}`)
      for (const cmd of cmds.sort((a, b) => a.name.localeCompare(b.name))) {
        out.push(`  · ${prefix}${cmd.name.padEnd(12)} ${cmd.description}`)
      }
      out.push('')
    }

    out.push(RULE, `try \`${prefix}help <command>\` for details`, `source: ${REPO_URL}`)
    await send.reply(message, out.join('\n').trim())
  }
})
