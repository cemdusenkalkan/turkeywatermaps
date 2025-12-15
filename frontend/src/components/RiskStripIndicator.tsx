// Risk Strip Indicator - Quantile visualization for WRI scores

interface RiskStripIndicatorProps {
  score: number
  percentile: number
  rank: number
  total: number
  showLabel?: boolean
}

const RISK_BINS = [
  { max: 0.5, label: 'Low', color: '#22c55e' },
  { max: 1.0, label: 'Low-Med', color: '#84cc16' },
  { max: 2.0, label: 'Med-High', color: '#eab308' },
  { max: 3.0, label: 'High', color: '#f97316' },
  { max: 5.0, label: 'Ext High', color: '#ef4444' },
]

export function RiskStripIndicator({ score, percentile, rank, total, showLabel = true }: RiskStripIndicatorProps) {
  // Calculate position (0-100% across the strip)
  const position = Math.min(100, Math.max(0, (score / 5) * 100))
  
  return (
    <div className="space-y-2">
      {/* Strip with bins */}
      <div className="relative h-8 flex rounded overflow-hidden border border-gray-300 dark:border-gray-600">
        {RISK_BINS.map((bin, idx) => {
          const binWidth = idx === 0 ? 10 : idx === 1 ? 10 : idx === 2 ? 20 : idx === 3 ? 20 : 40
          return (
            <div
              key={idx}
              className="flex items-center justify-center text-[10px] font-medium text-white/80"
              style={{ 
                backgroundColor: bin.color,
                width: `${binWidth}%`,
              }}
            >
              <span className="hidden sm:inline">{bin.label}</span>
            </div>
          )
        })}
        
        {/* Position marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-white z-10"
          style={{ left: `${position}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 dark:bg-white border-2 border-white dark:border-gray-900 rounded-full" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 dark:bg-white border-2 border-white dark:border-gray-900 rounded-full" />
        </div>
      </div>
      
      {/* Values */}
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">{score.toFixed(2)}</span>
            <span className="mx-1">/</span>
            <span>5.0</span>
          </div>
          <div className="text-right">
            <span>{percentile.toFixed(0)}th percentile</span>
            <span className="mx-2">•</span>
            <span>#{rank} of {total}</span>
          </div>
        </div>
      )}
    </div>
  )
}
