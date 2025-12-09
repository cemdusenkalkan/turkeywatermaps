import { motion } from 'motion/react'
import type { Category } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'

interface LayerPanelProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  activeCategory: Category | null
}

export function LayerPanel({ categories, activeCategoryId, onCategoryChange, activeCategory }: LayerPanelProps) {
  const colors = activeCategory ? getColorScale() : []
  const breaks = [0, 1, 2, 3, 4, 5]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white h-full rounded-r-2xl shadow-xl p-5 w-72"
    >
      <h3 className="font-semibold text-base mb-3 text-gray-900">Risk Categories</h3>
      
      <div className="space-y-1.5">
        {/* Combined Index */}
        <button
          onClick={() => onCategoryChange('combined_risk')}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all transform hover:scale-[1.01]
            ${activeCategoryId === 'combined_risk' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
        >
          <div className="font-medium text-xs">Combined Risk</div>
          <div className="text-xs opacity-70 mt-0.5">
            Weighted mean
          </div>
        </button>
        
        <div className="border-t border-gray-200 my-2" />
        
        {/* Individual categories */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all transform hover:scale-[1.01]
              ${activeCategoryId === cat.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="font-medium text-xs">{cat.short_name}</div>
            <div className="text-xs opacity-70 mt-0.5">
              {(cat.weight * 100).toFixed(0)}%
            </div>
          </button>
        ))}
      </div>
      
      {/* Legend integrated in sidebar */}
      {activeCategory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-sm mb-3 text-gray-900">
            {activeCategory.short_name}
          </h4>
          
          <div className="space-y-1.5">
            {colors.map((color, i) => {
              const min = breaks[i]
              const max = breaks[i + 1] || 5
              
              return (
                <div key={i} className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs text-gray-700 flex-1">
                    <span className="font-medium">{min.toFixed(1)}-{max.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({getRiskLabel(min)})</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Min:</span>
                <span className="font-medium">{activeCategory.min_score.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max:</span>
                <span className="font-medium">{activeCategory.max_score.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mean:</span>
                <span className="font-medium">{activeCategory.mean_score.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p>
          Click a category to visualize. Hover provinces for details.
        </p>
      </div>
    </motion.div>
  )
}

