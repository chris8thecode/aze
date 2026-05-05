import { getJson } from './http.js'

interface UrbanResponse {
  list: Array<{
    word: string
    definition: string
    example: string
    permalink: string
    thumbs_up: number
    thumbs_down: number
    author: string
  }>
}

const clean = (text: string): string => text.replace(/[\[\]]/g, '')

export const fetchUrban = async (term: string) => {
  const data = await getJson<UrbanResponse>(
    `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`
  )
  const entry = data.list?.[0]
  if (!entry) return null
  return {
    word: entry.word,
    definition: clean(entry.definition).trim(),
    example: clean(entry.example).trim(),
    author: entry.author,
    upvotes: entry.thumbs_up,
    downvotes: entry.thumbs_down,
    url: entry.permalink
  }
}
