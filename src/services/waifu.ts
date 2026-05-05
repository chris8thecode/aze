import { getJson } from './http.js'

export type WaifuTag =
  | 'waifu'
  | 'maid'
  | 'uniform'
  | 'marin-kitagawa'
  | 'mori-calliope'
  | 'raiden-shogun'
  | 'kamisato-ayaka'
  | 'selfies'

interface WaifuResponse {
  images: Array<{
    url: string
    source?: string
    width: number
    height: number
    is_nsfw: boolean
    tags: Array<{ name: string }>
  }>
}

export const fetchWaifu = async (tag: WaifuTag) => {
  const url = `https://api.waifu.im/search?included_tags=${encodeURIComponent(tag)}&is_nsfw=false`
  const data = await getJson<WaifuResponse>(url)
  const image = data.images?.[0]
  if (!image) throw new Error('No image returned')
  if (image.is_nsfw) throw new Error('NSFW image filtered')
  return image
}
