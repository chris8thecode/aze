import { defineCommand } from '../../types.js'

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
      const lines = [
        `*${prefix}${cmd.name}*`,
        cmd.description,
        cmd.aliases?.length ? `aliases: ${cmd.aliases.join(', ')}` : '',
        cmd.usage ? `usage: ${prefix}${cmd.usage}` : '',
        `category: ${cmd.category}`,
        cmd.permission ? `permission: ${cmd.permission}` : ''
      ].filter(Boolean)
      return send.reply(message, lines.join('\n'))
    }

    const groups = registry.byCategory()
    const out: string[] = ['*Available commands*', '']
    for (const [category, cmds] of Object.entries(groups).sort()) {
      out.push(`*${category}*`)
      for (const cmd of cmds.sort((a, b) => a.name.localeCompare(b.name))) {
        out.push(`  ${prefix}${cmd.name} — ${cmd.description}`)
      }
      out.push('')
    }
    await send.reply(message, out.join('\n').trimEnd())
  }
})
