import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import type { ProvinceDetailData } from '@/types'
import { formatOrdinal, getWRIRiskLabel, getWRIRiskColor } from '@/lib/calculations'
import { RiskStripIndicator } from './RiskStripIndicator'

interface ProvinceModalProps {
  isOpen: boolean
  data: ProvinceDetailData | null
  onClose: () => void
  totalProvinces?: number
}

export function ProvinceModal({ isOpen, data, onClose, totalProvinces = 81 }: ProvinceModalProps) {
  const { t, language } = useLanguage()
  const [showAllIndicators, setShowAllIndicators] = useState(false)

  if (!data) return null

  const combinedRank = Math.round((100 - data.combinedPercentile) / 100 * totalProvinces) || 1
  const combinedRiskLabel = getWRIRiskLabel(data.combinedScore)
  
  // Sort indicators by score descending for "top drivers"
  const sortedIndicators = [...data.categoryScores].sort((a, b) => b.score - a.score)
  const topDrivers = sortedIndicators.slice(0, 3)
  const displayIndicators = showAllIndicators ? sortedIndicators : topDrivers

  // Count available indicators (coverage check)
  const availableCount = data.categoryScores.filter(c => c.score > 0).length
  const totalCount = data.categoryScores.length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200 dark:border-gray-800">
              
              {/* HEADER BLOCK */}
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {language === 'tr' ? (data.provinceNameTr || data.provinceName) : data.provinceName}
                    </h2>
                    {language === 'en' && data.provinceNameTr && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.provinceNameTr}</p>
                    )}
                    {language === 'tr' && data.provinceName && data.provinceName !== data.provinceNameTr && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.provinceName}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {t('common.province')} • Aqueduct 4.0 • Baseline 1960–2019
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                    aria-label={t('common.close')}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* SUMMARY BLOCK */}
              <div className="px-6 py-6 space-y-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <div>
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
                    percentile={data.combinedPercentile}
                    rank={combinedRank}
                    total={totalProvinces}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('modal.coverage')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {availableCount}/{totalCount} {t('modal.indicators')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('modal.rank')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatOrdinal(combinedRank)} {t('modal.of')} {totalProvinces}
                    </p>
                  </div>
                </div>
              </div>

              {/* INDICATORS TABLE BLOCK */}
              <div className="px-6 py-6">
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

                {/* Footer note */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 italic">
                  {t('modal.footerNote')}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
