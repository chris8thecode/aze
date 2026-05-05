import { getJson } from './http.js'

export interface CoinMarket {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  high_24h: number
  low_24h: number
  market_cap_rank: number
  image: string
}

export const fetchCoins = async (symbols: string[]): Promise<CoinMarket[]> => {
  const csv = symbols.map((s) => s.toLowerCase()).join(',')
  return getJson<CoinMarket[]>(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${encodeURIComponent(csv)}`
  )
}
