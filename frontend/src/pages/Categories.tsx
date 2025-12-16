import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CategoryCard } from '@/components/CategoryCard'
import { loadManifest } from '@/lib/data-loader'
import { useLanguage } from '../contexts/LanguageContext'
import type { DataManifest } from '@/types'

export function Categories() {
  const { t } = useLanguage()
  const [manifest, setManifest] = useState<DataManifest | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) {
    return (
      <div className="page-bg-academic min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-300 dark:border-gray-700 border-b-accent" />
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-base md:text-lg">{t('common.loading')}</p>
        </div>
      </div>
      </div>
    )
  }
  
  return (
    <div className="page-bg-academic min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-navy-900 dark:text-white">{t('categories.title')}</h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-10 md:mb-12 leading-relaxed">
          {t('categories.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
          {manifest?.indicator_groups?.groups?.map((group, i) => (
            <CategoryCard key={group.id} category={group} index={i} />
          )) ?? (manifest as any)?.categories?.map((category: any, i: number) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
        
        {/* Weather Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-800 dark:to-blue-900 text-white rounded-2xl p-6 md:p-8 border border-sky-400 dark:border-sky-600/50 shadow-lg mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">{t('categories.weather.name')}</h2>
          </div>
          <p className="text-sky-50 dark:text-blue-100 text-base md:text-lg leading-relaxed mb-6">
            {t('categories.weather.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('categories.weather.currentConditions')}
              </h3>
              <ul className="text-sm space-y-2 text-sky-50 dark:text-blue-100">
                <li>• {t('categories.weather.metrics.temperature')}</li>
                <li>• {t('categories.weather.metrics.feelsLike')}</li>
                <li>• {t('categories.weather.metrics.humidity')}</li>
                <li>• {t('categories.weather.metrics.windSpeed')}</li>
                <li>• {t('categories.weather.metrics.precipitation')}</li>
                <li>• {t('categories.weather.metrics.pressure')}</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('categories.weather.forecast')}
              </h3>
              <ul className="text-sm space-y-2 text-sky-50 dark:text-blue-100">
                <li>• {t('categories.weather.metrics.forecast7day')}</li>
                <li>• {t('categories.weather.metrics.tempMinMax')}</li>
                <li>• {t('categories.weather.metrics.precipProb')}</li>
                <li>• {t('categories.weather.metrics.weatherCodes')}</li>
              </ul>
            </div>
          </div>

          <div className="text-xs md:text-sm text-sky-100 dark:text-blue-200 bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/20">
            <strong>{t('categories.weather.dataSource')}:</strong> {t('categories.weather.dataSourceText')}
          </div>
        </motion.div>

        {/* Combined Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-700 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-2xl p-6 md:p-8 border border-blue-600 dark:border-gray-700 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('categories.combined.name')}</h2>
          <p className="text-blue-50 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            {t('categories.combined.detail')}
          </p>
          <div className="text-sm md:text-base text-blue-100 dark:text-gray-300 bg-blue-900/40 dark:bg-gray-950/50 p-4 md:p-6 rounded-xl border border-blue-600/30 dark:border-gray-800">
            <strong className="text-white">{t('methodology.scoring')}:</strong><br/>
            <span className="mt-2 block">{t('methodology.scoringText')}</span>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}

