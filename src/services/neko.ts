import { getJson } from './http.js'

interface NekoResponse {
  results: Array<{
    url: string
    artist_name?: string
    artist_href?: string
    source_url?: string
  }>
}

export const fetchNeko = async () => {
  const data = await getJson<NekoResponse>('https://nekos.best/api/v2/neko')
  const result = data.results?.[0]
  if (!result) throw new Error('No image returned')
  return result
}
