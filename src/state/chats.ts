import { JsonStore } from './store.js'

interface ChatsFile {
  jids: string[]
}

const store = new JsonStore<ChatsFile>('chats.json', () => ({ jids: [] }))

export const chats = {
  async list(): Promise<string[]> {
    const data = await store.read()
    return [...data.jids]
  },

  async track(jid: string): Promise<void> {
    if (!jid) return
    await store.update((data) => {
      if (data.jids.includes(jid)) return
      data.jids.push(jid)
    })
  }
}
