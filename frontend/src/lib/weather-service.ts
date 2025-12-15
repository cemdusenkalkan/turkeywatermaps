// Open-Meteo Weather Service for Turkey
// Using Ankara coordinates as the reference point for Turkey weather
// Latitude: 39.93, Longitude: 32.85

export interface CurrentWeather {
  temperature: number
  weatherCode: number
  windSpeed: number
  windDirection: number
  time: string
}

export interface DailyForecast {
  date: string
  temperatureMax: number
  temperatureMin: number
  precipitation: number
  windSpeedMax: number
  weatherCode: number
}

export interface WeatherForecast {
  current: CurrentWeather
  daily: DailyForecast[]
}

// Weather codes mapping for icon display
export function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return weatherCodes[code] || 'Unknown'
}

export function getWeatherIcon(code: number): string {
  // Simple emoji-based icons for weather
  if (code === 0 || code === 1) return '☀️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code >= 45 && code <= 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌦️'
  if (code >= 61 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '🌨️'
  if (code >= 95 && code <= 99) return '⛈️'
  return '🌤️'
}

/**
 * Fetch current weather for Ankara (representing Turkey)
 */
export async function fetchCurrentWeather(): Promise<CurrentWeather> {
  const latitude = 39.93
  const longitude = 32.85
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Istanbul`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }
  
  const data = await response.json()
  
  return {
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    windSpeed: data.current_weather.windspeed,
    windDirection: data.current_weather.winddirection,
    time: data.current_weather.time,
  }
}

/**
 * Fetch 7-day weather forecast for Ankara (representing Turkey)
 */
export async function fetchWeatherForecast(): Promise<WeatherForecast> {
  const latitude = 39.93
  const longitude = 32.85
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=Europe/Istanbul&forecast_days=7`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch weather forecast')
  }
  
  const data = await response.json()
  
  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[i],
    temperatureMin: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    windSpeedMax: data.daily.windspeed_10m_max[i],
    weatherCode: data.daily.weathercode[i],
  }))
  
  return {
    current: {
      temperature: data.current_weather.temperature,
      weatherCode: data.current_weather.weathercode,
      windSpeed: data.current_weather.windspeed,
      windDirection: data.current_weather.winddirection,
      time: data.current_weather.time,
    },
    daily,
  }
}
