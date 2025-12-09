import { motion } from 'motion/react'
import type { Category } from '@/types'

interface LayerPanelProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
}

export function LayerPanel({ categories, activeCategoryId, onCategoryChange }: LayerPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-soft p-4 max-w-xs"
    >
      <h3 className="font-semibold text-sm mb-3 text-gray-800">Risk Categories</h3>
      
      <div className="space-y-1">
        {/* Combined Index */}
        <button
          onClick={() => onCategoryChange('combined_risk')}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
            ${activeCategoryId === 'combined_risk' 
              ? 'bg-accent text-white' 
              : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          <div className="font-medium">Combined Risk Index</div>
          <div className="text-xs opacity-80 mt-0.5">
            Weighted geometric mean
          </div>
        </button>
        
        <div className="border-t border-gray-200 my-2" />
        
        {/* Individual categories */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
              ${activeCategoryId === cat.id 
                ? 'bg-accent text-white' 
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            <div className="font-medium">{cat.short_name}</div>
            <div className="text-xs opacity-80 mt-0.5">
              Weight: {(cat.weight * 100).toFixed(0)}%
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p>
          Click on a category to visualize it on the map. Hover over provinces for details.
        </p>
      </div>
    </motion.div>
  )
}

