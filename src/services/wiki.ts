import { getJson } from './http.js'

export interface WikiSummary {
  title: string
  description?: string
  extract: string
  content_urls: { desktop: { page: string } }
  thumbnail?: { source: string; width: number; height: number }
  type: string
}

export const fetchWikiSummary = async (query: string): Promise<WikiSummary> => {
  const slug = encodeURIComponent(query.replace(/\s+/g, '_'))
  return getJson<WikiSummary>(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`)
}
