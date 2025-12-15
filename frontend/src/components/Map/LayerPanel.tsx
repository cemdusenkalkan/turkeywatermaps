import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import type { Category, Indicator, CategoryGroup } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'
import { fetchCurrentWeather, getWeatherIcon } from '@/lib/weather-service'
import type { CurrentWeather } from '@/lib/weather-service'
import { useLanguage } from '@/contexts/LanguageContext'

interface LayerPanelProps {
  categories: Category[] | Indicator[] // Support both old and new format
  categoryGroups?: CategoryGroup[] // New: grouped structure
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  activeCategory: Category | Indicator | null
}

export function LayerPanel({ categories, categoryGroups, activeCategoryId, onCategoryChange, activeCategory }: LayerPanelProps) {
  const { t } = useLanguage()
  const colors = activeCategory ? getColorScale() : []
  const breaks = [0, 1, 2, 3, 4, 5]
  const [showWeather, setShowWeather] = useState(false)
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    quantity_variability: true, // Start with first group expanded
    flooding: false,
    quality: false,
    access_reputational: false
  })
  
  useEffect(() => {
    if (showWeather && !weather) {
      setWeatherLoading(true)
      fetchCurrentWeather()
        .then(setWeather)
        .catch(console.error)
        .finally(() => setWeatherLoading(false))
    }
  }, [showWeather, weather])
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }
  
  // Use new grouped structure if available, otherwise fall back to flat list
  const useGroupedLayout = categoryGroups && categoryGroups.length > 0
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-900 h-full rounded-r-2xl shadow-xl p-5 w-72 flex flex-col"
    >
      <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">
        {t('map.layers')}
      </h3>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          {/* Combined Index */}
          <button
            onClick={() => onCategoryChange('combined_risk')}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all transform hover:scale-[1.01]
              ${activeCategoryId === 'combined_risk' 
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md' 
                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
          >
            <div className="font-semibold text-xs">{t('categories.combined.short')}</div>
            <div className="text-[10px] opacity-70">Physical risk composite</div>
          </button>
          
          <div className="border-t border-gray-200 dark:border-gray-700 my-1.5" />
          
          {/* Grouped indicators (v4.0) or flat list (legacy) */}
          {useGroupedLayout ? (
            // New: Collapsible category groups
            categoryGroups.map(group => (
              <div key={group.id} className="mb-2">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  <span>{t(`categories.groups.${group.id}` as any) || group.name}</span>
                  <svg 
                    className={`w-3 h-3 transition-transform ${expandedGroups[group.id] ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Group indicators */}
                <AnimatePresence>
                  {expandedGroups[group.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 mt-1"
                    >
                      {group.indicators.map(indicator => (
                        <button
                          key={indicator.id}
                          onClick={() => onCategoryChange(indicator.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-all transform hover:scale-[1.01]
                            ${activeCategoryId === indicator.id 
                              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md' 
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                          <div className="font-semibold text-xs">{indicator.short_name}</div>
                          <div className="text-[10px] opacity-70 flex items-center justify-between">
                            <span>{indicator.weight > 0 ? `${(indicator.weight * 100).toFixed(0)}%` : 'Info only'}</span>
                            {indicator.coverage !== undefined && indicator.coverage < 100 && (
                              <span className="text-[9px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1 rounded">
                                {indicator.coverage.toFixed(0)}% coverage
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            // Legacy: Flat list of categories
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all transform hover:scale-[1.01]
                  ${activeCategoryId === cat.id 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <div className="font-semibold text-xs">{cat.short_name}</div>
                <div className="text-[10px] opacity-70">Weight: {(cat.weight * 100).toFixed(0)}%</div>
              </button>
            ))
          )}
        </div>
        
        {/* Legend integrated in sidebar */}
        {activeCategory && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white">
              {activeCategory.short_name}
            </h4>
            
            <div className="space-y-1.5">
              {colors.map((color, i) => {
                const min = breaks[i]
                const max = breaks[i + 1] || 5
                
                return (
                  <div key={i} className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                      <span className="font-medium">{min.toFixed(1)}-{max.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({getRiskLabel(min)})</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Min:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{activeCategory.min_score.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{activeCategory.max_score.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mean:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{activeCategory.mean_score.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-2 italic">Scale: 0–5</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {/* Weather Toggle */}
        <button
          onClick={() => setShowWeather(!showWeather)}
          className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium text-gray-700 dark:text-gray-300">Show Weather</span>
          <div className={`transform transition-transform ${showWeather ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* Weather Display */}
        {showWeather && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            {weatherLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-700 border-b-accent" />
              </div>
            ) : weather ? (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs opacity-80">Ankara</div>
                    <div className="text-xl font-bold">{weather.temperature.toFixed(1)}°C</div>
                  </div>
                  <div className="text-3xl">{getWeatherIcon(weather.weatherCode)}</div>
                </div>
                <div className="text-xs opacity-90">
                  Wind: {weather.windSpeed.toFixed(1)} km/h
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
        
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Click a category to visualize. Hover provinces for details.
        </p>
      </div>
    </motion.div>
  )
}

