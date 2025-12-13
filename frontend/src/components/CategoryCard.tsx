import { motion } from 'motion/react'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  index: number
}

export function CategoryCard({ category, index }: CategoryCardProps) {
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
            style={{ backgroundColor: category.color }}
            role="img"
            aria-label={`Color indicator for ${category.name}`}
          />
        </div>
        
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {category.description}
        </p>
        
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg inline-block border border-gray-200 dark:border-gray-700">
          <span className="text-gray-700">Weight: </span>
          <span className="text-accent font-bold">{(category.weight * 100).toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

