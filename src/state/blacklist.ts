import { JsonStore } from './store.js'

interface BlacklistFile {
  phones: string[]
}

const store = new JsonStore<BlacklistFile>('blacklist.json', () => ({ phones: [] }))

const normalize = (phone: string): string => phone.replace(/\D/g, '')

export const blacklist = {
  async list(): Promise<string[]> {
    const data = await store.read()
    return [...data.phones]
  },

  async has(phone: string): Promise<boolean> {
    const norm = normalize(phone)
    if (!norm) return false
    const data = await store.read()
    return data.phones.includes(norm)
  },

  async add(phone: string): Promise<boolean> {
    const norm = normalize(phone)
    if (!norm) return false
    let added = false
    await store.update((data) => {
      if (data.phones.includes(norm)) return
      data.phones.push(norm)
      added = true
    })
    return added
  },

  async remove(phone: string): Promise<boolean> {
    const norm = normalize(phone)
    if (!norm) return false
    let removed = false
    await store.update((data) => {
      const idx = data.phones.indexOf(norm)
      if (idx === -1) return
      data.phones.splice(idx, 1)
      removed = true
    })
    return removed
  }
}
