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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y + 10,
      }}
    >
      {/* Academic Style Tooltip - No rounded corners, thin border */}
      <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border border-gray-300 dark:border-gray-700 p-4 max-w-xs">
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white tracking-tight">
          {data.provinceName}
        </h4>
        
        {data.category && (
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            {data.category}
          </div>
        )}
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-l-2 border-gray-200 dark:border-gray-800 pl-3">
            <span className="text-gray-600 dark:text-gray-400">Score</span>
            <span className="font-medium text-gray-900 dark:text-white tabular-nums">
              {data.score.toFixed(2)} / 5.0
            </span>
          </div>
          
          <div className="flex justify-between border-l-2 border-gray-200 dark:border-gray-800 pl-3">
            <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {getRiskLabel(data.score)}
            </span>
          </div>
          
          <div className="flex justify-between border-l-2 border-gray-200 dark:border-gray-800 pl-3">
            <span className="text-gray-600 dark:text-gray-400">Percentile</span>
            <span className="font-medium text-gray-900 dark:text-white tabular-nums">
              {data.percentile}<span className="text-[10px]">th</span>
            </span>
          </div>
        </div>
        
        {/* Corner accent - Bloomberg style */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
      </div>
    </motion.div>
  )
}
