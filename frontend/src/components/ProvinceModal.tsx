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
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal - Academic Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
        >
          <div className="bg-[#faf9f7] dark:bg-gray-950 border-2 border-gray-900 dark:border-white max-w-4xl w-full max-h-[90vh] flex flex-col pointer-events-auto relative">
            
            {/* Corner accents - Bloomberg style */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
            
            {/* HEADER - Academic */}
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-light tracking-tight text-gray-900 dark:text-white">
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
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-2">
                    {t('type' in data && data.type === 'district' ? 'common.district' : 'common.province')}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all text-xs uppercase tracking-wider font-medium print:hidden"
                    title={t('modal.exportPDF')}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">{t('modal.exportPDF')}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:border-gray-900 dark:hover:text-white dark:hover:border-white transition-all print:hidden"
                    aria-label={t('common.close')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION - Academic */}
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 print:hidden">
              <div className="flex px-8">
                <button
                  onClick={() => setActiveTab('risk')}
                  className={`relative px-6 py-4 text-xs uppercase tracking-wider font-medium transition-colors ${
                    activeTab === 'risk'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t('modal.tabs.risk')}
                  {activeTab === 'risk' && (
                    <motion.div
                      layoutId="activeModalTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`relative px-6 py-4 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 ${
                    activeTab === 'weather'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  {t('modal.tabs.weather')}
                  {activeTab === 'weather' && (
                    <motion.div
                      layoutId="activeModalTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-8 py-8"
                  >
                    {/* Combined Risk Summary - Academic Style */}
                    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                          {t('modal.combinedWaterRisk')}
                        </h3>
                        <span 
                          className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium text-white"
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
                        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                              {language === 'tr' ? (
                                t(`categories.${selectedCategoryId}.short`) || t(`categories.${selectedCategoryId}.name`) || selectedCategory.categoryName
                              ) : (
                                t(`categories.${selectedCategoryId}.short`) || t(`categories.${selectedCategoryId}.name`) || selectedCategory.categoryName
                              )}
                            </h3>
                            <span 
                              className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium text-white"
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

                    {/* Weather Preview - Academic Style */}
                    {weatherPreview && (
                      <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                        <button
                          onClick={() => setActiveTab('weather')}
                          className="w-full flex items-center justify-between px-6 py-4 border-l-4 border-sky-500 dark:border-sky-400 bg-white dark:bg-gray-900/50 hover:border-sky-600 dark:hover:border-sky-300 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <div className="text-left">
                              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{t('weather.currentWeather')}</div>
                              <div className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                                {weatherPreview.temp}°C · {weatherPreview.condition}
                              </div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Top Risk Drivers Table - Academic Style */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                          {showAllIndicators ? t('modal.allIndicators') : t('modal.topDrivers')}
                        </h3>
                        <button
                          onClick={() => setShowAllIndicators(!showAllIndicators)}
                          className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                        >
                          {showAllIndicators ? t('modal.showTop3') : `${t('modal.showAll')} (${totalCount})`}
                        </button>
                      </div>

                      {/* Table - Academic Style */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-gray-900 dark:border-white">
                              <th className="text-left py-3 px-3 font-medium text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                                {t('modal.indicator')}
                              </th>
                              <th className="text-right py-3 px-3 font-medium text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                                {t('modal.score')}
                              </th>
                              <th className="text-right py-3 px-3 font-medium text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                                %ile
                              </th>
                              <th className="text-right py-3 px-3 font-medium text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                                {t('modal.level')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayIndicators.map((indicator, idx) => {
                              const indicatorRank = Math.round((100 - indicator.percentile) / 100 * totalProvinces) || 1
                              const riskLabel = getWRIRiskLabel(indicator.score)
                              const riskColor = getWRIRiskColor(indicator.score)
                              
                              // Get translated name
                              const translatedName = language === 'tr' 
                                ? (t(`categories.${indicator.categoryId}.short`) || t(`categories.${indicator.categoryId}.name`) || indicator.categoryName)
                                : (t(`categories.${indicator.categoryId}.short`) || t(`categories.${indicator.categoryId}.name`) || indicator.categoryName)
                              
                              return (
                                <motion.tr
                                  key={indicator.categoryName}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.02 }}
                                  className="border-b border-gray-200 dark:border-gray-800"
                                >
                                  <td className="py-4 px-3">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="w-1 h-10 "
                                        style={{ backgroundColor: riskColor }}
                                      />
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm tracking-tight">
                                          {translatedName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          #{indicatorRank}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-3 text-right">
                                    <span className="font-mono font-medium text-gray-900 dark:text-white tabular-nums">
                                      {indicator.score.toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-600 ml-1 text-xs">/5.0</span>
                                  </td>
                                  <td className="py-4 px-3 text-right">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium tabular-nums">
                                      {indicator.percentile.toFixed(0)}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-600 text-xs">th</span>
                                  </td>
                                  <td className="py-4 px-3 text-right">
                                    <span 
                                      className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-medium text-white"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 leading-relaxed">
                        {t('modal.coverage')}
                      </p>
                    </div>

                    {/* Footer Note - Academic */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t('modal.footerNote')}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="weather"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-8 py-8"
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
