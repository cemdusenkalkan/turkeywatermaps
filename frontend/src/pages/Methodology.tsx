import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { loadManifest } from '@/lib/data-loader'
import type { DataManifest } from '@/types'

type Tab = 'methodology' | 'dataDictionary'

export function Methodology() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<Tab>('methodology')
  const [manifest, setManifest] = useState<DataManifest | null>(null)
  
  useEffect(() => {
    loadManifest().then(setManifest)
  }, [])
  
  // Flatten all indicators from groups
  const allIndicators = manifest?.indicator_groups?.groups?.flatMap(g => g.indicators) ?? []
  
  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-gray-950">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800 relative">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
              Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-8">
              {t('methodology.title')}
            </h1>
            
            {/* Tab Navigation - Minimal */}
            <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setActiveTab('methodology')}
                className={`pb-4 text-sm uppercase tracking-wider font-medium transition-colors relative ${
                  activeTab === 'methodology'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('methodology.tabs.methodology')}
                {activeTab === 'methodology' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('dataDictionary')}
                className={`pb-4 text-sm uppercase tracking-wider font-medium transition-colors relative ${
                  activeTab === 'dataDictionary'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('methodology.tabs.dataDictionary')}
                {activeTab === 'dataDictionary' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                  />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-4xl">
            {activeTab === 'methodology' ? (
              <div className="space-y-16">
                {/* Data Sources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-l-2 border-gray-900 dark:border-white pl-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 border-2 border-gray-900 dark:border-white flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                      1
                    </div>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">
                      {t('methodology.dataSource')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                        {t('methodology.waterRiskData')}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {t('methodology.dataSourceText')}
                      </p>
                      
                      <div className="border border-gray-200 dark:border-gray-800 p-4 text-sm">
                        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          {t('methodology.citation')}
                        </div>
                        <p className="text-gray-900 dark:text-white mb-3 font-mono text-xs">
                          {t('methodology.citationWri')}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>{t('methodology.baseline')}</span>
                          <span>•</span>
                          <span>{t('methodology.release')}</span>
                          <span>•</span>
                          <span>{t('methodology.version')}</span>
                        </div>
                      </div>
                      
                      <a
                        href="https://www.wri.org/aqueduct"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-gray-900 dark:text-white hover:underline"
                      >
                        {t('methodology.visitWri')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                        {t('methodology.weatherData')}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {t('methodology.weatherDataText')}
                      </p>
                      
                      <a
                        href="https://open-meteo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:underline"
                      >
                        Open-Meteo API
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Processing Pipeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-l-2 border-gray-900 dark:border-white pl-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 border-2 border-gray-900 dark:border-white flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                      2
                    </div>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">
                      {t('methodology.processing')}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {t('methodology.processingText')}
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      t('methodology.step1'),
                      t('methodology.step2'),
                      t('methodology.step3'),
                      t('methodology.step4'),
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Aggregation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-l-2 border-gray-900 dark:border-white pl-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 border-2 border-gray-900 dark:border-white flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                      3
                    </div>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">
                      {t('methodology.aggregation')}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('methodology.aggregationText')}
                  </p>
                </motion.div>

                {/* Limitations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-600 dark:border-amber-500 p-6"
                >
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                        {t('methodology.limitations')}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {t('methodology.limitationsText')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Data Dictionary Tab */
              <div className="space-y-8">
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {t('methodology.dataDictionary.subtitle')}
                </p>
                
                {allIndicators.map((indicator, i) => (
                  <motion.div
                    key={indicator.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-2"
                  >
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                      {indicator.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {t(`categories.${indicator.id}.desc`)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {t(`categories.${indicator.id}.detail`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
