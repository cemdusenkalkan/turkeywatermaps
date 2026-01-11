import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import type { Category, Indicator, CategoryGroup } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    quantity_variability: true, // Start with first group expanded
    flooding: false,
    quality: false,
    access_reputational: false
  })
  
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#faf9f7] dark:bg-gray-950 h-full border-r border-gray-200 dark:border-gray-800 p-6 w-80 flex flex-col"
    >
      {/* Header - Academic Style */}
      <div className="mb-6">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {t('map.layers')}
        </h3>
        <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {/* Combined Index - Academic Button */}
          <button
            onClick={() => onCategoryChange('combined_risk')}
            className={`w-full text-left px-4 py-3 border-l-4 transition-all
              ${activeCategoryId === 'combined_risk' 
                ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900/50' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 bg-transparent'
              }`}
          >
            <div className="font-medium text-sm tracking-tight text-gray-900 dark:text-white">
              {t('categories.combined.short')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Physical risk composite
            </div>
          </button>
          
          <div className="h-px bg-gray-200 dark:border-gray-800 my-3" />
          
          {/* Grouped indicators (v4.0) or flat list (legacy) */}
          {useGroupedLayout ? (
            // New: Collapsible category groups - Academic Style
            categoryGroups.map(group => (
              <div key={group.id} className="mb-3">
                {/* Group header - Minimal */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs uppercase tracking-wider font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                
                {/* Group indicators - Border-based */}
                <AnimatePresence>
                  {expandedGroups[group.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 mt-2"
                    >
                      {group.indicators.map(indicator => (
                        <button
                          key={indicator.id}
                          onClick={() => onCategoryChange(indicator.id)}
                          className={`w-full text-left px-4 py-2.5 border-l-4 transition-all
                            ${activeCategoryId === indicator.id 
                              ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900/50' 
                              : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                          <div className="font-medium text-xs text-gray-900 dark:text-white">
                            {t(`categories.${indicator.id}.short` as any) || t(`categories.${indicator.id}.name` as any) || indicator.short_name}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between mt-1">
                            <span>{indicator.weight > 0 ? `${t('categories.weight')}: ${(indicator.weight * 100).toFixed(0)}%` : t('categories.referenceOnly')}</span>
                            {indicator.coverage !== undefined && indicator.coverage < 100 && (
                              <span className="text-[9px] text-amber-600 dark:text-amber-500">
                                {indicator.coverage.toFixed(0)}%
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
            // Legacy: Flat list of categories - Academic Style
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-4 py-3 border-l-4 transition-all
                  ${activeCategoryId === cat.id 
                    ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900/50' 
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
              >
                <div className="font-medium text-xs text-gray-900 dark:text-white">
                  {t(`categories.${cat.id}.short` as any) || t(`categories.${cat.id}.name` as any) || cat.short_name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {t('categories.weight')}: {(cat.weight * 100).toFixed(0)}%
                </div>
              </button>
            ))
          )}
        </div>
        
        {/* Legend integrated in sidebar - Academic Style */}
        {activeCategory && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {activeCategory.short_name}
            </h4>
            
            <div className="space-y-2">
              {colors.map((color, i) => {
                const min = breaks[i]
                const max = breaks[i + 1] || 5
                
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div 
                      className="w-10 h-4 border border-gray-300 dark:border-gray-700"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <div className="text-xs text-gray-900 dark:text-white font-medium">
                        {getRiskLabel(min + 0.5)}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        {min.toFixed(1)} – {max.toFixed(1)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Hint Text - Academic Style */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
          {t('map.layerPanel.hint')}
        </p>
      </div>
    </motion.div>
  )
}
