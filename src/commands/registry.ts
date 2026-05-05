import type { Command } from './types.js'

export class CommandRegistry {
  private readonly byName = new Map<string, Command>()
  private readonly byAlias = new Map<string, string>()

  register(cmd: Command): void {
    const name = cmd.name.toLowerCase()
    if (this.byName.has(name)) throw new Error(`Duplicate command: ${name}`)
    this.byName.set(name, cmd)
    for (const alias of cmd.aliases ?? []) {
      const a = alias.toLowerCase()
      if (this.byAlias.has(a) || this.byName.has(a)) throw new Error(`Alias conflict: ${a}`)
      this.byAlias.set(a, name)
    }
  }

  resolve(name: string): Command | undefined {
    const key = name.toLowerCase()
    return this.byName.get(key) ?? this.byName.get(this.byAlias.get(key) ?? '')
  }

  list(): Command[] {
    return [...this.byName.values()]
  }

  byCategory(): Record<string, Command[]> {
    const groups: Record<string, Command[]> = {}
    for (const cmd of this.byName.values()) {
      ;(groups[cmd.category] ??= []).push(cmd)
    }
    return groups
  }
}
