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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white" />
            <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm uppercase tracking-wider">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-gray-950">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
              Data Dictionary
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-8">
              {t('categories.title')}
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('categories.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Risk Categories */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {manifest?.indicator_groups?.groups?.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CategoryCard key={group.id} category={group} />
                </motion.div>
              )) ?? (manifest as any)?.categories?.map((category: any, i: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CategoryCard key={category.id} category={category} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weather Data Section */}
      <section className="bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="border-l-2 border-blue-600 dark:border-blue-500 pl-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">{t('categories.weather.name')}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  {t('categories.weather.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-800 pt-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('categories.weather.currentConditions')}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.temperature')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.feelsLike')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.precipitation')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.windSpeed')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.humidity')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.metrics.cloudCover')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('categories.weather.forecast')}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.forecastMetrics.daily')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.forecastMetrics.range')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.forecastMetrics.conditions')}
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      {t('categories.weather.forecastMetrics.precipitation')}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('categories.weather.source')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
