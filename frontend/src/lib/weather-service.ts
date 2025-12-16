/**
 * Weather Service - Open-Meteo Integration
 * 
 * Provides weather data for Turkish provinces with caching and error handling
 */

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface WeatherCurrent {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  wind_speed_10m: number
  wind_direction_10m: number
}

export interface WeatherHourly {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
}

export interface WeatherDaily {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  wind_gusts_10m_max: number[]
  wind_direction_10m_dominant: number[]
}

export interface ProvinceWeather {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: Record<string, string>
  current: WeatherCurrent
  hourly_units: Record<string, string>
  hourly: WeatherHourly
  daily_units: Record<string, string>
  daily: WeatherDaily
}

export interface WeatherData {
  metadata: {
    lastUpdate: string
    updateTimestamp: number
    provincesCount: number
    expectedCount: number
    source: string
    attribution: string
    timezone: string
    forecastDays: number
  }
  provinces: Record<string, ProvinceWeather>
}

export interface WeatherCondition {
  code: number
  description: string
  icon: string
  color: string
}

// Simplified types for components
export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  cloudCover: number
  pressure: number
  condition: WeatherCondition
  weatherCode: number
  time: Date
  isDay: boolean
}

export interface DailyForecast {
  date: Date
  dateString: string
  tempMax: number
  tempMin: number
  precipitation: number
  precipitationProb: number
  windSpeed: number
  windGusts: number
  uvIndex: number
  sunrise: Date
  sunset: Date
  weatherCode: number
  condition: WeatherCondition
}

export interface WeatherForecast {
  current: CurrentWeather
  daily: DailyForecast[]
  location: {
    name: string
    latitude: number
    longitude: number
  }
}

// ============================================================================
// Weather Code Mapping (WMO Weather interpretation codes)
// ============================================================================

// Helper functions for backward compatibility
export function getWeatherIcon(code: number, isDay: boolean = true): string {
  return getWeatherCondition(code, isDay).icon
}

export function getWeatherDescription(code: number, isDay: boolean = true): string {
  return getWeatherCondition(code, isDay).description
}

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  // Returns translation key for description - must be translated in component using t()
  const conditions: Record<number, Omit<WeatherCondition, 'code'>> = {
    0: { description: 'weather.conditions.clearSky', icon: isDay ? '☀️' : '🌙', color: isDay ? '#FDB813' : '#4A5568' },
    1: { description: 'weather.conditions.mainlyClear', icon: isDay ? '🌤️' : '🌙', color: isDay ? '#FDB813' : '#4A5568' },
    2: { description: 'weather.conditions.partlyCloudy', icon: '⛅', color: '#94A3B8' },
    3: { description: 'weather.conditions.overcast', icon: '☁️', color: '#64748B' },
    45: { description: 'weather.conditions.foggy', icon: '🌫️', color: '#94A3B8' },
    48: { description: 'weather.conditions.depositingRimeFog', icon: '🌫️', color: '#94A3B8' },
    51: { description: 'weather.conditions.lightDrizzle', icon: '🌦️', color: '#60A5FA' },
    53: { description: 'weather.conditions.moderateDrizzle', icon: '🌦️', color: '#3B82F6' },
    55: { description: 'weather.conditions.denseDrizzle', icon: '🌧️', color: '#2563EB' },
    56: { description: 'weather.conditions.lightFreezingDrizzle', icon: '🌧️', color: '#60A5FA' },
    57: { description: 'weather.conditions.denseFreezingDrizzle', icon: '🌧️', color: '#3B82F6' },
    61: { description: 'weather.conditions.slightRain', icon: '🌧️', color: '#60A5FA' },
    63: { description: 'weather.conditions.moderateRain', icon: '🌧️', color: '#3B82F6' },
    65: { description: 'weather.conditions.heavyRain', icon: '🌧️', color: '#1E40AF' },
    66: { description: 'weather.conditions.lightFreezingRain', icon: '🌨️', color: '#60A5FA' },
    67: { description: 'weather.conditions.heavyFreezingRain', icon: '🌨️', color: '#3B82F6' },
    71: { description: 'weather.conditions.slightSnowfall', icon: '🌨️', color: '#93C5FD' },
    73: { description: 'weather.conditions.moderateSnowfall', icon: '❄️', color: '#60A5FA' },
    75: { description: 'weather.conditions.heavySnowfall', icon: '❄️', color: '#3B82F6' },
    77: { description: 'weather.conditions.snowGrains', icon: '❄️', color: '#93C5FD' },
    80: { description: 'weather.conditions.slightRainShowers', icon: '🌦️', color: '#60A5FA' },
    81: { description: 'weather.conditions.moderateRainShowers', icon: '🌧️', color: '#3B82F6' },
    82: { description: 'weather.conditions.violentRainShowers', icon: '⛈️', color: '#1E40AF' },
    85: { description: 'weather.conditions.slightSnowShowers', icon: '🌨️', color: '#93C5FD' },
    86: { description: 'weather.conditions.heavySnowShowers', icon: '❄️', color: '#3B82F6' },
    95: { description: 'weather.conditions.thunderstorm', icon: '⛈️', color: '#7C3AED' },
    96: { description: 'weather.conditions.thunderstormLightHail', icon: '⛈️', color: '#7C3AED' },
    99: { description: 'weather.conditions.thunderstormHeavyHail', icon: '⛈️', color: '#6D28D9' }
  }
  
  const condition = conditions[code] || conditions[0]
  return { code, ...condition }
}

// ============================================================================
// Wind Direction Helper
// ============================================================================

export function getWindDirection(degrees: number, language: 'en' | 'tr' = 'en'): string {
  const directionsEN = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const directionsTR = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB']
  const directions = language === 'tr' ? directionsTR : directionsEN
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// ============================================================================
// Caching
// ============================================================================

const CACHE_KEY = 'turkey_water_map_weather'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

interface CachedWeather {
  data: WeatherData
  timestamp: number
}

function getCachedWeather(): WeatherData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { data, timestamp }: CachedWeather = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data
    }
    
    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Error reading weather cache:', error)
    return null
  }
}

function setCachedWeather(data: WeatherData): void {
  try {
    const cached: CachedWeather = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch (error) {
    console.error('Error saving weather cache:', error)
  }
}

// ============================================================================
// Main API Functions
// ============================================================================

/**
 * Fetch all weather data (with caching)
 */
export async function getAllWeatherData(): Promise<WeatherData | null> {
  // Check cache first
  const cached = getCachedWeather()
  if (cached) {
    console.log('Using cached weather data')
    return cached
  }
  
  try {
    const response = await fetch('/turkeywatermaps/data/weather-current.json')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data: WeatherData = await response.json()
    
    // Cache the data
    setCachedWeather(data)
    
    return data
  } catch (error) {
    console.error('Failed to fetch weather data:', error)
    return null
  }
}

// Province name mapping: English -> Turkish (for weather API)
const PROVINCE_NAME_MAP: Record<string, string> = {
  'Afyonkarahisar': 'Afyonkarahisar',
  'Agri': 'Ağrı',
  'Aydin': 'Aydın',
  'Balikesir': 'Balıkesir',
  'Bingol': 'Bingöl',
  'Canakkale': 'Çanakkale',
  'Cankiri': 'Çankırı',
  'Corum': 'Çorum',
  'Diyarbakir': 'Diyarbakır',
  'Elazig': 'Elazığ',
  'Eskisehir': 'Eskişehir',
  'Gumushane': 'Gümüşhane',
  'Igdir': 'Iğdır',
  'Kahramanmaras': 'Kahramanmaraş',
  'Kirikkale': 'Kırıkkale',
  'Kirklareli': 'Kırklareli',
  'Kirsehir': 'Kırşehir',
  'Kutahya': 'Kütahya',
  'Mus': 'Muş',
  'Nevsehir': 'Nevşehir',
  'Nigde': 'Niğde',
  'Sanliurfa': 'Şanlıurfa',
  'Sirnak': 'Şırnak',
  'Tekirdag': 'Tekirdağ',
  'Usak': 'Uşak',
  'Zonguldak': 'Zonguldak'
}

/**
 * Get weather for a specific province (handles English and Turkish names)
 */
export async function getProvinceWeather(provinceName: string): Promise<ProvinceWeather | null> {
  const data = await getAllWeatherData()
  if (!data) return null
  
  // Try direct match first (Turkish name or already correct)
  let weather = data.provinces[provinceName]
  
  // If not found, try the mapping (English -> Turkish)
  if (!weather && PROVINCE_NAME_MAP[provinceName]) {
    weather = data.provinces[PROVINCE_NAME_MAP[provinceName]]
  }
  
  // If still not found, try case-insensitive search
  if (!weather) {
    const normalizedName = provinceName.toLowerCase()
    const matchingKey = Object.keys(data.provinces).find(
      key => key.toLowerCase() === normalizedName
    )
    if (matchingKey) {
      weather = data.provinces[matchingKey]
    }
  }
  
  return weather || null
}

/**
 * Get current conditions for a province
 */
export async function getCurrentConditions(provinceName: string, language: 'en' | 'tr' = 'en') {
  const weather = await getProvinceWeather(provinceName)
  if (!weather) return null
  
  const condition = getWeatherCondition(weather.current.weather_code, weather.current.is_day === 1)
  
  return {
    temperature: Math.round(weather.current.temperature_2m),
    feelsLike: Math.round(weather.current.apparent_temperature),
    humidity: weather.current.relative_humidity_2m,
    windSpeed: Math.round(weather.current.wind_speed_10m),
    windDirection: getWindDirection(weather.current.wind_direction_10m, language),
    precipitation: weather.current.precipitation,
    cloudCover: weather.current.cloud_cover,
    pressure: Math.round(weather.current.pressure_msl),
    condition,
    time: new Date(weather.current.time),
    isDay: weather.current.is_day === 1
  }
}

/**
 * Get 7-day forecast for a province
 */
export async function getSevenDayForecast(provinceName: string) {
  const weather = await getProvinceWeather(provinceName)
  if (!weather) return null
  
  return weather.daily.time.map((date, index) => ({
    date: new Date(date),
    dateString: date,
    tempMax: Math.round(weather.daily.temperature_2m_max[index]),
    tempMin: Math.round(weather.daily.temperature_2m_min[index]),
    precipitation: weather.daily.precipitation_sum[index],
    precipitationProb: weather.daily.precipitation_probability_max[index],
    windSpeed: Math.round(weather.daily.wind_speed_10m_max[index]),
    windGusts: Math.round(weather.daily.wind_gusts_10m_max[index]),
    uvIndex: weather.daily.uv_index_max[index],
    sunrise: new Date(weather.daily.sunrise[index]),
    sunset: new Date(weather.daily.sunset[index]),
    condition: getWeatherCondition(weather.daily.weather_code[index])
  }))
}

/**
 * Clear weather cache (useful for manual refresh)
 */
export function clearWeatherCache(): void {
  localStorage.removeItem(CACHE_KEY)
}

/**
 * Get cache age in minutes
 */
export function getCacheAge(): number | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { timestamp }: CachedWeather = JSON.parse(cached)
    return Math.floor((Date.now() - timestamp) / 1000 / 60)
  } catch {
    return null
  }
}

/**
 * Fetch current weather for Ankara (representing Turkey)
 */
export async function fetchCurrentWeather(): Promise<CurrentWeather | null> {
  const conditions = await getCurrentConditions('Ankara', 'en')
  if (!conditions) return null
  
  return {
    ...conditions,
    weatherCode: conditions.condition.code
  }
}

/**
 * Fetch weather forecast for Ankara
 */
export async function fetchWeatherForecast(): Promise<WeatherForecast | null> {
  const current = await fetchCurrentWeather()
  const forecast = await getSevenDayForecast('Ankara')
  
  if (!current || !forecast) return null
  
  return {
    current,
    daily: forecast.map(day => ({
      ...day,
      weatherCode: day.condition.code
    })),
    location: {
      name: 'Ankara',
      latitude: 39.9334,
      longitude: 32.8597
    }
  }
}

