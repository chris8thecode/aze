import { spawn } from 'child_process'
import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'restart',
  aliases: ['reboot', 'boot', 'start'],
  category: 'owner',
  description: 'Restart the bot process.',
  permission: 'owner',
  run: async ({ send, message }) => {
    await send.reply(message, 'Restarting…')

    setTimeout(() => {
      const child = spawn(process.argv[0]!, process.argv.slice(1), {
        cwd: process.cwd(),
        env: process.env,
        detached: true,
        stdio: 'inherit'
      })
      child.unref()
      process.exit(0)
    }, 500)
  }
})
