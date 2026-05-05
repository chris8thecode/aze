import { getJson } from './http.js'

export type WaifuTag =
  | 'waifu'
  | 'maid'
  | 'uniform'
  | 'selfies'
  | 'marin-kitagawa'
  | 'mori-calliope'
  | 'raiden-shogun'
  | 'kamisato-ayaka'
  | 'genshin-impact'

interface WaifuImage {
  url: string
  source?: string | null
  width: number
  height: number
  isNsfw: boolean
  artists?: Array<{ name: string; twitter?: string | null; pixiv?: string | null }>
  tags: Array<{ slug: string; name: string }>
}

interface WaifuResponse {
  items: WaifuImage[]
}

export const fetchWaifu = async (tag: WaifuTag): Promise<WaifuImage> => {
  const url = `https://api.waifu.im/images?included_tags=${encodeURIComponent(tag)}&isNsfw=false`
  const data = await getJson<WaifuResponse>(url)
  const image = data.items?.[0]
  if (!image) throw new Error('No image returned')
  if (image.isNsfw) throw new Error('NSFW image filtered')
  return image
}
