import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import type { ProvinceDetailData } from '@/types'

interface ProvinceModalProps {
  isOpen: boolean
  data: ProvinceDetailData | null
  onClose: () => void
}

export function ProvinceModal({ isOpen, data, onClose }: ProvinceModalProps) {
  const { t, language } = useLanguage()

  if (!data) return null

  // Calculate max score for bar chart scaling
  const maxScore = 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-navy-800 to-navy-700 dark:from-gray-800 dark:to-gray-900 text-white p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{data.provinceName}</h2>
                  {language === 'en' && data.provinceNameTr && (
                    <p className="text-gray-300 text-sm mt-1">{data.provinceNameTr}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Combined Risk Score */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-blue-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('modal.combinedIndex')}
                    </h3>
                    <span className="text-4xl font-bold text-accent">
                      {data.combinedScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{t('modal.percentile')}: {data.combinedPercentile.toFixed(1)}th</span>
                    <span>{t('modal.outOf100')}</span>
                  </div>
                </div>

                {/* Category Scores with Bar Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    {t('modal.categoryScores')}
                  </h3>

                  <div className="space-y-5">
                    {data.categoryScores.map((item, index) => (
                      <motion.div
                        key={item.categoryId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        {/* Category Name */}
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                            {item.categoryName}
                          </h4>
                          <span className="text-sm md:text-base font-semibold text-accent">
                            {item.score.toFixed(1)}
                          </span>
                        </div>

                        {/* Bar Chart */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.score / maxScore) * 100}%` }}
                              transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
                              className={`h-full rounded-full transition-colors ${
                                item.score >= 70
                                  ? 'bg-red-500'
                                  : item.score >= 50
                                  ? 'bg-orange-500'
                                  : item.score >= 30
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                            />
                          </div>
                          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {item.percentile.toFixed(0)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Risk Level Indicator */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    {t('modal.riskLevel')}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundColor:
                          data.combinedScore >= 70
                            ? '#ef4444'
                            : data.combinedScore >= 50
                            ? '#f97316'
                            : data.combinedScore >= 30
                            ? '#eab308'
                            : '#22c55e',
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.combinedScore >= 70
                        ? t('map.riskLevels.veryHigh')
                        : data.combinedScore >= 50
                        ? t('map.riskLevels.high')
                        : data.combinedScore >= 30
                        ? t('map.riskLevels.medium')
                        : t('map.riskLevels.low')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 md:px-8 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="w-full bg-accent hover:bg-accent-dark text-white py-2 md:py-3 rounded-lg font-medium transition-colors"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
