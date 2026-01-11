import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import type { ProvinceDetailData, AreaDetailData } from '@/types'
import { getWRIRiskLabel, getWRIRiskColor } from '@/lib/calculations'
import { RiskStripIndicator } from './RiskStripIndicator'
import { WeatherCard } from './WeatherCard'
import { getCurrentConditions, getCurrentConditionsByCoords } from '../lib/weather-service'

interface ProvinceModalProps {
  isOpen: boolean
  data: ProvinceDetailData | AreaDetailData | null
  onClose: () => void
  totalProvinces?: number
  selectedCategoryId?: string
}

type TabType = 'risk' | 'weather'

// Rate limiting: max 10 weather requests per minute
const weatherRateLimit = {
  requests: [] as number[],
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  canRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    return this.requests.length < this.maxRequests
  },
  addRequest(): void {
    this.requests.push(Date.now())
  }
}

export function ProvinceModal({ isOpen, data, onClose, totalProvinces = 81, selectedCategoryId = 'combined_risk' }: ProvinceModalProps) {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('risk')
  const [showAllIndicators, setShowAllIndicators] = useState(false)
  const [weatherPreview, setWeatherPreview] = useState<{ temp: number; condition: string } | null>(null)

  // Reset tab to Risk when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('risk')
      setShowAllIndicators(false)
    }
  }, [isOpen])

  // Load weather preview for Risk tab with rate limiting
  useEffect(() => {
    if (data && activeTab === 'risk') {
      if (!weatherRateLimit.canRequest()) {
        setWeatherPreview(null)
        return
      }

      weatherRateLimit.addRequest()

      // Use different weather fetch based on type
      const isDistrict = 'type' in data && data.type === 'district'
      const fetchWeather = isDistrict && data.coordinates
        ? getCurrentConditionsByCoords(data.coordinates.lat, data.coordinates.lon, language)
        : getCurrentConditions((data as ProvinceDetailData).provinceName, language)

      fetchWeather.then(current => {
        if (current) {
          setWeatherPreview({
            temp: current.temperature,
            condition: t(current.condition.description)
          })
        }
      }).catch(() => setWeatherPreview(null))
    }
  }, [data, activeTab, t, language])

  // Don't render anything if modal is closed or no data
  if (!isOpen || !data) return null

  if (!data.categoryScores || data.categoryScores.length === 0) {
    return null
  }

  const isDistrict = 'type' in data && data.type === 'district'
  const hasPercentile = 'combinedPercentile' in data || ('percentile' in data && data.percentile !== undefined)
  const percentile = 'combinedPercentile' in data ? data.combinedPercentile : (data.percentile || 0)
  const combinedRank = hasPercentile ? Math.round((100 - percentile) / 100 * totalProvinces) || 1 : null
  const combinedRiskLabel = getWRIRiskLabel(data.combinedScore)
  
  // Sort indicators by score descending for "top drivers"
  const sortedIndicators = [...data.categoryScores].sort((a, b) => b.score - a.score)
  const topDrivers = sortedIndicators.slice(0, 3)
  const displayIndicators = showAllIndicators ? sortedIndicators : topDrivers

  // Count available indicators (coverage check)
  // const availableCount = data.categoryScores.filter(c => c.score > 0).length
  const totalCount = data.categoryScores.length

  return (
    <AnimatePresence mode="wait">
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm pointer-events-auto"
        />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col pointer-events-auto border border-gray-200 dark:border-gray-800">
              
              {/* HEADER - Fixed */}
              <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {(() => {
                        const isDistrict = 'type' in data && data.type === 'district'
                        if (isDistrict) {
                          return language === 'tr' ? (data.nameTr || data.name) : data.name
                        } else {
                          const provinceData = data as ProvinceDetailData
                          return language === 'tr' ? (provinceData.provinceNameTr && provinceData.provinceNameTr !== 'NA' ? provinceData.provinceNameTr : provinceData.provinceName) : provinceData.provinceName
                        }
                      })()}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('type' in data && data.type === 'district' ? 'common.district' : 'common.province')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors text-sm font-medium print:hidden"
                      title={t('modal.exportPDF')}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">{t('modal.exportPDF')}</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 print:hidden"
                      aria-label={t('common.close')}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION - Sticky */}
              <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 print:hidden">
                <div className="flex px-6">
                  <button
                    onClick={() => setActiveTab('risk')}
                    className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'risk'
                        ? 'text-accent dark:text-accent'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t('modal.tabs.risk')}
                    {activeTab === 'risk' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('weather')}
                    className={`relative px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'weather'
                        ? 'text-accent dark:text-accent'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    {t('modal.tabs.weather')}
                    {activeTab === 'weather' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* CONTENT - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'risk' ? (
                    <motion.div
                      key="risk"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 py-6"
                    >
                      {/* Combined Risk Summary */}
                      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            {t('modal.combinedWaterRisk')}
                          </h3>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: getWRIRiskColor(data.combinedScore) }}
                          >
                            {combinedRiskLabel}
                          </span>
                        </div>
                        <RiskStripIndicator
                          score={data.combinedScore}
                          percentile={percentile}
                          rank={combinedRank ?? 0}
                          total={totalProvinces}
                        />
                      </div>

                      {/* Selected Category Score */}
                      {selectedCategoryId !== 'combined_risk' && (() => {
                        const selectedCategory = data.categoryScores.find(c => c.categoryId === selectedCategoryId)
                        if (!selectedCategory) return null
                        
                        const selectedRiskLabel = getWRIRiskLabel(selectedCategory.score)
                        const selectedRank = hasPercentile ? Math.round((100 - selectedCategory.percentile) / 100 * totalProvinces) || 1 : null
                        
                        return (
                          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {language === 'tr' ? (
                                  t(`categories.${selectedCategoryId}.short`) || t(`categories.${selectedCategoryId}.name`)
                                ) : (
                                  t(`categories.${selectedCategoryId}.short`) || t(`categories.${selectedCategoryId}.name`)
                                )}
                              </h3>
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: getWRIRiskColor(selectedCategory.score) }}
                              >
                                {selectedRiskLabel}
                              </span>
                            </div>
                            <RiskStripIndicator
                              score={selectedCategory.score}
                              percentile={selectedCategory.percentile}
                              rank={selectedRank ?? 0}
                              total={totalProvinces}
                            />
                          </div>
                        )
                      })()}

                      {/* Weather Preview Chip */}
                      {weatherPreview && (
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                          <button
                            onClick={() => setActiveTab('weather')}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-200 dark:border-sky-800 rounded-lg hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/40 dark:hover:to-blue-900/40 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                              </svg>
                              <div className="text-left">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('weather.currentWeather')}</div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {weatherPreview.temp}°C · {weatherPreview.condition}
                                </div>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Top Risk Drivers Table */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            {showAllIndicators ? t('modal.allIndicators') : t('modal.topDrivers')}
                          </h3>
                          <button
                            onClick={() => setShowAllIndicators(!showAllIndicators)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            {showAllIndicators ? t('modal.showTop3') : `${t('modal.showAll')} (${totalCount})`}
                          </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left py-2 px-2 font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                  {t('modal.indicator')}
                                </th>
                                <th className="text-right py-2 px-2 font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                  {t('modal.score')}
                                </th>
                                <th className="text-right py-2 px-2 font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                  %ile
                                </th>
                                <th className="text-right py-2 px-2 font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                  {t('modal.level')}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayIndicators.map((indicator, idx) => {
                                const indicatorRank = Math.round((100 - indicator.percentile) / 100 * totalProvinces) || 1
                                const riskLabel = getWRIRiskLabel(indicator.score)
                                const riskColor = getWRIRiskColor(indicator.score)
                                
                                return (
                                  <motion.tr
                                    key={indicator.categoryName}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                  >
                                    <td className="py-3 px-2">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-1 h-8 rounded-full"
                                          style={{ backgroundColor: riskColor }}
                                        />
                                        <div>
                                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                                            {indicator.categoryName}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            #{indicatorRank}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                        {indicator.score.toFixed(2)}
                                      </span>
                                      <span className="text-gray-400 dark:text-gray-600 ml-1">/5.0</span>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {indicator.percentile.toFixed(0)}
                                      </span>
                                      <span className="text-gray-400 dark:text-gray-600 text-xs">th</span>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span 
                                        className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                                        style={{ backgroundColor: riskColor }}
                                      >
                                        {riskLabel.split(' ')[0]}
                                      </span>
                                    </td>
                                  </motion.tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Coverage Note */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                          {t('modal.coverage')}
                        </p>
                      </div>

                      {/* Footer Note */}
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          {t('modal.footerNote')}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="weather"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 py-6"
                    >
                      {isDistrict && data.coordinates ? (
                        <WeatherCard 
                          provinceName={data.name} 
                          coordinates={data.coordinates}
                        />
                      ) : (
                        <WeatherCard provinceName={(data as ProvinceDetailData).provinceName} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
      </>
    </AnimatePresence>
  )
}


