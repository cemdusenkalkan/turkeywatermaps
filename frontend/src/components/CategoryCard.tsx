import { motion } from 'motion/react'
import type { Category, CategoryGroup } from '@/types'

interface CategoryCardProps {
  category: Category | CategoryGroup
  index: number
}

// Color mapping for category groups
const GROUP_COLORS: Record<string, string> = {
  'quantity_variability': '#3b82f6', // blue
  'flooding': '#f59e0b', // amber
  'quality': '#10b981', // green
  'access_reputational': '#8b5cf6', // purple
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  // Check if it's a CategoryGroup (has indicators array) or legacy Category
  const isCategoryGroup = 'indicators' in category
  
  // Calculate total weight for groups from their indicators
  const totalWeight = isCategoryGroup
    ? category.indicators.reduce((sum, ind) => sum + ind.weight, 0)
    : (category as Category).weight
  
  const color = isCategoryGroup
    ? GROUP_COLORS[category.id] || '#64748b'
    : (category as Category).color
  
  const indicatorCount = isCategoryGroup ? category.indicators.length : 1
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 hover:shadow-md dark:hover:shadow-lg transition-shadow shadow-sm touch-auto">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white flex-1">
            {category.name}
          </h3>
          <div
            className="w-5 h-5 md:w-6 md:h-6 rounded-full flex-shrink-0 ml-3 border-2 border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: color }}
            role="img"
            aria-label={`Color indicator for ${category.name}`}
          />
        </div>
        
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {category.description}
        </p>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-400">Weight: </span>
            <span className="text-accent font-bold">{(totalWeight * 100).toFixed(0)}%</span>
          </div>
          
          {isCategoryGroup && (
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-400">Indicators: </span>
              <span className="text-accent font-bold">{indicatorCount}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

