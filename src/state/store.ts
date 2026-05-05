import { mkdir, readFile, writeFile, rename } from 'fs/promises'
import { dirname, join } from 'path'
import { env } from '../config/env.js'
import { logger } from '../core/logger.js'

const STATE_DIR = join(env.sessionDir, 'state')

export class JsonStore<T> {
  private cache: T | null = null
  private writing: Promise<void> = Promise.resolve()

  constructor(private readonly file: string, private readonly defaults: () => T) {}

  private path(): string {
    return join(STATE_DIR, this.file)
  }

  async read(): Promise<T> {
    if (this.cache) return this.cache
    try {
      const raw = await readFile(this.path(), 'utf8')
      this.cache = JSON.parse(raw) as T
    } catch (err: any) {
      if (err.code !== 'ENOENT') logger.warn({ err, file: this.file }, 'state read failed')
      this.cache = this.defaults()
    }
    return this.cache
  }

  async write(value: T): Promise<void> {
    this.cache = value
    this.writing = this.writing.then(async () => {
      const target = this.path()
      await mkdir(dirname(target), { recursive: true })
      const tmp = `${target}.tmp`
      await writeFile(tmp, JSON.stringify(value, null, 2), 'utf8')
      await rename(tmp, target)
    })
    await this.writing
  }

  async update(mutator: (value: T) => T | void): Promise<T> {
    const current = await this.read()
    const next = mutator(current) ?? current
    await this.write(next)
    return next
  }
}
