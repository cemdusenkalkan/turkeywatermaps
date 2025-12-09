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
      <div className="block bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-800">
            {category.name}
          </h3>
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {category.description}
        </p>
        
        <div className="text-xs text-gray-500">
          <span>Weight: {(category.weight * 100).toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

