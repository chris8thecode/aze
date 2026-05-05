import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { logger } from '../core/logger.js'
import { CommandRegistry } from './registry.js'
import type { Command } from './types.js'

const here = dirname(fileURLToPath(import.meta.url))

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (e) => {
      const path = join(dir, e.name)
      if (e.isDirectory()) return walk(path)
      if (e.isFile() && /\.(js|ts)$/.test(e.name) && !e.name.endsWith('.d.ts')) return [path]
      return []
    })
  )
  return files.flat()
}

export const loadCommands = async (): Promise<CommandRegistry> => {
  const registry = new CommandRegistry()
  const root = join(here, 'modules')
  const files = await walk(root).catch(() => [])

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href)
    const cmd = (mod.default ?? mod.command) as Command | undefined
    if (!cmd?.name || typeof cmd.run !== 'function') {
      logger.warn({ file }, 'skipping invalid command module')
      continue
    }
    registry.register(cmd)
  }

  logger.info({ count: registry.list().length }, 'commands loaded')
  return registry
}
