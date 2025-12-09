import { Link } from 'react-router-dom'
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
      <Link
        to={`/category/${category.id}`}
        className="block bg-white rounded-lg shadow-soft p-6 hover:shadow-lg transition-shadow"
      >
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
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Weight: {(category.weight * 100).toFixed(0)}%</span>
          <span className="flex items-center text-accent">
            Learn more
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

