import { motion } from 'motion/react'
import type { TooltipData } from '@/types'
import { getRiskLabel } from '@/lib/color-scales'

interface TooltipCardProps {
  data: TooltipData
  position: { x: number; y: number }
}

export function TooltipCard({ data, position }: TooltipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y + 10,
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{data.provinceName}</h4>
        
        {data.category && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{data.category}</div>
        )}
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Score:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.score.toFixed(2)} / 5.0</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
            <span className="font-medium text-gray-900 dark:text-white">{getRiskLabel(data.score)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Percentile:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.percentile}th</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

