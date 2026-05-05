import { defineCommand } from '../../types.js'
import { fetchCoins } from '../../../services/crypto.js'

const fmtUsd = (n: number): string =>
  n >= 1000 ? `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : `$${n.toPrecision(4)}`

const fmtPct = (n: number): string => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export default defineCommand({
  name: 'crypto',
  aliases: ['coin'],
  category: 'general',
  description: 'Crypto market data (Coingecko).',
  usage: 'crypto <symbol> [symbol …]',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: crypto <symbol> [symbol …]')
    const coins = await fetchCoins(args)
    if (coins.length === 0) return send.reply(message, `No matches for ${args.join(', ')}`)

    const blocks = coins.map((c) =>
      [
        `*${c.name}* (${c.symbol.toUpperCase()})`,
        '```',
        `price    ${fmtUsd(c.current_price)}`,
        `24h      ${fmtPct(c.price_change_percentage_24h)}`,
        `high/low ${fmtUsd(c.high_24h)} / ${fmtUsd(c.low_24h)}`,
        `mcap     ${fmtUsd(c.market_cap)}  (#${c.market_cap_rank})`,
        `volume   ${fmtUsd(c.total_volume)}`,
        '```'
      ].join('\n')
    )

    await send.reply(message, blocks.join('\n\n'))
  }
})
