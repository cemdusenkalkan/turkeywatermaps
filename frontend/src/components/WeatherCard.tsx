import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { WeatherIcon } from './WeatherIcon'
import { getCurrentConditions, getSevenDayForecast } from '../lib/weather-service'
import type { WeatherCondition } from '../lib/weather-service'

interface WeatherCardProps {
  provinceName: string
}

interface CurrentConditionsData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  cloudCover: number
  pressure: number
  condition: WeatherCondition
  time: Date
  isDay: boolean
}

interface ForecastDay {
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
  condition: WeatherCondition
}

export function WeatherCard({ provinceName }: WeatherCardProps) {
  const { t, language } = useLanguage()
  const [current, setCurrent] = useState<CurrentConditionsData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true)
        setError(false)
        
        const [currentData, forecastData] = await Promise.all([
          getCurrentConditions(provinceName, language),
          getSevenDayForecast(provinceName)
        ])
        
        setCurrent(currentData)
        setForecast(forecastData)
      } catch (err) {
        console.error('Error loading weather:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    loadWeather()
  }, [provinceName, language])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">{t('weather.loading')}</span>
        </div>
      </div>
    )
  }

  if (error || !current) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🌧️</span>
          <p className="text-gray-600 dark:text-gray-400">{t('weather.error')}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>{t('weather.currentWeather')}</span>
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t('weather.lastUpdated')}: {current.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Current Conditions */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 mb-6 border border-blue-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <WeatherIcon code={current.condition.code} isDay={current.isDay} size={80} />
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {current.temperature}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('weather.feelsLike')}: {current.feelsLike}°C
              </div>
              <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2">
                {t(current.condition.description)}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('weather.humidity')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{current.humidity}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('weather.wind')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{current.windSpeed} km/h</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{current.windDirection}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('weather.precipitation')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{current.precipitation} mm</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('weather.pressure')}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{current.pressure} hPa</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {forecast && forecast.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('weather.forecast')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((day, index) => (
              <motion.div
                key={day.dateString}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {index === 0 
                    ? t('weather.today')
                    : t(`weather.days.${['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day.date.getDay()]}`)
                  }
                </div>
                <div className="my-2">
                  <WeatherIcon code={day.condition.code} isDay={true} size={48} />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {day.tempMax}° / {day.tempMin}°
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    💧 {day.precipitation.toFixed(1)} mm
                  </div>
                )}
                {day.precipitationProb > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {day.precipitationProb}%
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {t('weather.attribution')}
        </p>
      </div>
    </motion.div>
  )
}
