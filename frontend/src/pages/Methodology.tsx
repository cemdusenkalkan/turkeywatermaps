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
  
  // Get current page title based on active tab
  const pageTitle = activeTab === 'methodology' 
    ? t('methodology.title') 
    : t('methodology.dataDictionary.title')
  
  const pageSubtitle = activeTab === 'methodology'
    ? t('methodology.subtitle')
    : t('methodology.dataDictionary.subtitle')
  
  return (
    <div className="page-bg-academic min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-navy-900 dark:text-white">{pageTitle}</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'methodology'
                ? 'text-accent'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t('methodology.tabs.methodology')}
            {activeTab === 'methodology' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('dataDictionary')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'dataDictionary'
                ? 'text-accent'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t('methodology.tabs.dataDictionary')}
            {activeTab === 'dataDictionary' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </div>
        
        {activeTab === 'methodology' ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">{pageSubtitle}</p>
        
        <div className="space-y-6 md:space-y-8">
          {/* Step 1: Data Source */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('methodology.dataSource')}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                  {t('methodology.dataSourceText')}
                </p>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
                    <strong className="text-gray-900 dark:text-white">{t('methodology.citation')}:</strong> {t('methodology.citationWri')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    {t('methodology.baseline')} | {t('methodology.release')} | {t('methodology.version')}
                  </p>
                  <a 
                    href="https://www.wri.org/aqueduct" 
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('methodology.linkText')}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2: Processing */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('methodology.processing')}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  {t('methodology.processingText')}
                </p>
                <div className="mt-4 font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                  {t('methodology.processingFormula')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Scoring */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-l-orange-500 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('methodology.scoring')}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  {t('methodology.scoringText')}
                </p>
                <div className="mt-4 font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                  {t('methodology.scoringFormula')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">GitHub Repository</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-3">
              <a href="https://github.com/cemdusenkalkan/turkeywatermaps" className="text-accent hover:text-accent-dark font-medium break-all" target="_blank" rel="noopener noreferrer">
                https://github.com/cemdusenkalkan/turkeywatermaps
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Full code, data processing pipeline, and documentation available.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Citation</h2>
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-300 dark:border-gray-700 text-xs md:text-sm overflow-x-auto text-gray-900 dark:text-gray-200 font-mono leading-relaxed">
{`@software{turkeywatermaps_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkeywatermaps},
  license = {MIT}
}`}
            </pre>
          </div>
        </div>
          </>
        ) : (
          <>
            {/* Data Dictionary Content */}
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">{pageSubtitle}</p>
            
            <div className="space-y-6 md:space-y-8">
              {/* Water Risk Indicators */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{t('methodology.dataDictionary.indicators')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('methodology.dataDictionary.indicatorsDesc')}</p>
                
                <div className="space-y-4">
                  {allIndicators.map((indicator) => (
                    <div key={indicator.id} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-accent">
                          {indicator.code}
                        </code>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{indicator.short_name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (weight: {(indicator.weight * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{indicator.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Technical Variables */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{t('methodology.dataDictionary.technical')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('methodology.dataDictionary.technicalDesc')}</p>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">province_id</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.province_id.desc')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">name</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.name.desc')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">name_tr</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.name_tr.desc')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">combined_score</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.combined_score.desc')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">area_km2</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.area_km2.desc')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">percentile</code>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('methodology.dataDictionary.vars.percentile.desc')}</p>
                  </div>
                </div>
              </div>
              
              {/* Risk Scales */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{t('methodology.dataDictionary.scales')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('methodology.dataDictionary.scalesDesc')}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: '#22c55e' }} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('methodology.dataDictionary.scaleLabels.low')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: '#84cc16' }} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('methodology.dataDictionary.scaleLabels.lowMedium')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: '#eab308' }} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('methodology.dataDictionary.scaleLabels.mediumHigh')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: '#f97316' }} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('methodology.dataDictionary.scaleLabels.high')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: '#ef4444' }} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('methodology.dataDictionary.scaleLabels.extremelyHigh')}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

