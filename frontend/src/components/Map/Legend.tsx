import { motion } from 'motion/react'
import type { Category } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'

interface LegendProps {
  category: Category
}

export function Legend({ category }: LegendProps) {
  const colors = getColorScale(category.id)
  const breaks = [0, 1, 2, 3, 4, 5]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 min-w-[220px]"
    >
      <h3 className="font-semibold text-base mb-4 text-gray-900">
        {category.short_name || category.name}
      </h3>
      
      <div className="space-y-1.5">
        {colors.map((color, i) => {
          const min = breaks[i]
          const max = breaks[i + 1] || 5
          
          return (
            <div key={i} className="flex items-center space-x-3">
              <div
                className="w-7 h-7 rounded-lg border border-gray-300 flex-shrink-0 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <div className="text-sm text-gray-800 flex-1">
                <span className="font-medium">{min.toFixed(1)} - {max.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({getRiskLabel(min)})</span>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Min:</span>
            <span className="font-medium">{category.min_score.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Max:</span>
            <span className="font-medium">{category.max_score.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Mean:</span>
            <span className="font-medium">{category.mean_score.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

