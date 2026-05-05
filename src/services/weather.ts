import { getJson } from './http.js'

interface GeoResult {
  results?: Array<{
    name: string
    country: string
    admin1?: string
    latitude: number
    longitude: number
    timezone: string
  }>
}

interface ForecastResult {
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    wind_speed_10m: number
    weather_code: number
  }
  current_units: Record<string, string>
}

const codes: Record<number, string> = {
  0: 'clear',
  1: 'mostly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'rime fog',
  51: 'light drizzle',
  53: 'drizzle',
  55: 'heavy drizzle',
  61: 'light rain',
  63: 'rain',
  65: 'heavy rain',
  71: 'light snow',
  73: 'snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'rain showers',
  81: 'heavy rain showers',
  82: 'violent rain showers',
  85: 'snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with hail',
  99: 'severe thunderstorm'
}

export const describeWeatherCode = (code: number): string => codes[code] ?? `code ${code}`

export const fetchWeather = async (city: string) => {
  const geo = await getJson<GeoResult>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  )
  const place = geo.results?.[0]
  if (!place) throw new Error(`Could not find "${city}"`)

  const forecast = await getJson<ForecastResult>(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
  )

  return { place, forecast }
}
