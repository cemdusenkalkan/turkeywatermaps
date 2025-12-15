import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { fetchCurrentWeather, getWeatherIcon, getWeatherDescription } from '@/lib/weather-service'
import type { CurrentWeather } from '@/lib/weather-service'

export function WeatherWidget() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchCurrentWeather()
        setWeather(data)
      } catch (err) {
        console.error('Failed to load weather:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadWeather()
  }, [])
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:border dark:border-gray-700"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-700 border-b-accent" />
        </div>
      </motion.div>
    )
  }
  
  if (!weather) {
    return null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 text-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to="/weather" className="block">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-blue-100 mb-1">Current Weather</div>
            <div className="text-lg font-semibold">Ankara</div>
          </div>
          <div className="text-5xl">
            {getWeatherIcon(weather.weatherCode)}
          </div>
        </div>
        
        <div className="flex items-baseline mb-2">
          <div className="text-4xl font-bold">{weather.temperature.toFixed(1)}°C</div>
        </div>
        
        <div className="text-sm text-blue-100 mb-3">
          {getWeatherDescription(weather.weatherCode)}
        </div>
        
        <div className="flex items-center justify-between text-xs text-blue-100">
          <div>
            Wind: {weather.windSpeed.toFixed(1)} km/h
          </div>
          <div className="text-blue-200 hover:text-white flex items-center">
            View forecast
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
