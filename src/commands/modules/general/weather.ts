import { defineCommand } from '../../types.js'
import { describeWeatherCode, fetchWeather } from '../../../services/weather.js'

export default defineCommand({
  name: 'weather',
  category: 'general',
  description: 'Current weather for a city.',
  usage: 'weather <city>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: weather <city>')
    const query = args.join(' ')
    const { place, forecast } = await fetchWeather(query)
    const c = forecast.current
    const u = forecast.current_units
    const where = [place.name, place.admin1, place.country].filter(Boolean).join(', ')

    const lines = [
      `*${where}*`,
      '```',
      `condition  ${describeWeatherCode(c.weather_code)}`,
      `temp       ${c.temperature_2m}${u.temperature_2m} (feels ${c.apparent_temperature}${u.apparent_temperature})`,
      `humidity   ${c.relative_humidity_2m}${u.relative_humidity_2m}`,
      `wind       ${c.wind_speed_10m} ${u.wind_speed_10m}`,
      '```'
    ]
    await send.reply(message, lines.join('\n'))
  }
})
