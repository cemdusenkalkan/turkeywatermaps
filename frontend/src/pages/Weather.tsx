import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { fetchWeatherForecast, getWeatherDescription, getWeatherIcon } from '@/lib/weather-service'
import type { WeatherForecast } from '@/lib/weather-service'

export function Weather() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeatherForecast()
        setForecast(data)
      } catch (err) {
        console.error('Failed to load weather:', err)
        setError('Failed to load weather data')
      } finally {
        setLoading(false)
      }
    }
    
    loadWeather()
  }, [])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-300 dark:border-gray-700 border-b-accent" />
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-base md:text-lg">Loading weather data...</p>
        </div>
      </div>
    )
  }
  
  if (error || !forecast) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-navy-900 dark:text-white">
          Weather Forecast
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          7-day weather forecast for Ankara, Turkey
        </p>
        
        {/* Current Weather Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Current Weather</h2>
              <p className="text-blue-100 text-sm">Ankara, Turkey</p>
            </div>
            <div className="text-6xl">
              {getWeatherIcon(forecast.current.weatherCode)}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-blue-200 text-sm">Temperature</div>
              <div className="text-3xl font-bold">{forecast.current.temperature.toFixed(1)}°C</div>
            </div>
            <div>
              <div className="text-blue-200 text-sm">Condition</div>
              <div className="text-lg font-medium">{getWeatherDescription(forecast.current.weatherCode)}</div>
            </div>
            <div>
              <div className="text-blue-200 text-sm">Wind Speed</div>
              <div className="text-lg font-medium">{forecast.current.windSpeed.toFixed(1)} km/h</div>
            </div>
            <div>
              <div className="text-blue-200 text-sm">Wind Direction</div>
              <div className="text-lg font-medium">{forecast.current.windDirection}°</div>
            </div>
          </div>
        </motion.div>
        
        {/* 7-Day Forecast */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">7-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {forecast.daily.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(day.dateString)}
                </div>
                <div className="text-3xl">
                  {getWeatherIcon(day.weatherCode)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {day.tempMax.toFixed(0)}°
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / {day.tempMin.toFixed(0)}°
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Precipitation</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {day.precipitation.toFixed(1)} mm
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wind</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {day.windSpeed.toFixed(1)} km/h
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Condition</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {getWeatherDescription(day.weatherCode)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Data Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Weather data provided by{' '}
            <a 
              href="https://open-meteo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-dark font-medium"
            >
              Open-Meteo
            </a>
            {' '}• Open-source weather API
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
