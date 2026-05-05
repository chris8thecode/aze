import type { Middleware, PipelineContext } from './types.js'

export class Pipeline {
  private readonly stack: Middleware[] = []

  use(...mw: Middleware[]): this {
    this.stack.push(...mw)
    return this
  }

  async run(ctx: PipelineContext, terminal: () => Promise<void>): Promise<void> {
    let i = -1
    const dispatch = async (idx: number): Promise<void> => {
      if (idx <= i) throw new Error('next() called multiple times')
      i = idx
      const fn = idx === this.stack.length ? terminal : this.stack[idx]
      if (!fn) return
      await fn(ctx, () => dispatch(idx + 1))
    }
    await dispatch(0)
  }
}
