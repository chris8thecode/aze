import { getJson } from './http.js'

const BASE = 'https://api.jikan.moe/v4'

interface JikanList<T> {
  data: T[]
}

export interface AnimeResult {
  mal_id: number
  url: string
  images: { jpg: { image_url: string; large_image_url?: string } }
  title: string
  title_english?: string | null
  type?: string | null
  episodes?: number | null
  status?: string | null
  score?: number | null
  rank?: number | null
  popularity?: number | null
  year?: number | null
  synopsis?: string | null
  genres?: Array<{ name: string }>
  studios?: Array<{ name: string }>
}

export interface CharacterResult {
  mal_id: number
  url: string
  images: { jpg: { image_url: string } }
  name: string
  name_kanji?: string | null
  nicknames?: string[]
  favorites?: number
  about?: string | null
}

export const searchAnime = async (query: string): Promise<AnimeResult | null> => {
  const url = `${BASE}/anime?q=${encodeURIComponent(query)}&limit=1&sfw=true`
  const res = await getJson<JikanList<AnimeResult>>(url)
  return res.data[0] ?? null
}

export const searchCharacter = async (query: string): Promise<CharacterResult | null> => {
  const url = `${BASE}/characters?q=${encodeURIComponent(query)}&limit=1`
  const res = await getJson<JikanList<CharacterResult>>(url)
  return res.data[0] ?? null
}
