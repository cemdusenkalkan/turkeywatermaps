import type { Category, CategoryGroup } from '@/types'

interface CategoryCardProps {
  category: Category | CategoryGroup
}

// Color mapping for category groups
const GROUP_COLORS: Record<string, string> = {
  'quantity_variability': '#3b82f6', // blue
  'flooding': '#f59e0b', // amber
  'quality': '#10b981', // green
  'access_reputational': '#8b5cf6', // purple
}

export function CategoryCard({ category }: CategoryCardProps) {
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
    <div className="border-l-4 hover:border-l-8 transition-all duration-300 pl-6 py-4" style={{ borderColor: color }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-xl text-gray-900 dark:text-white tracking-tight">
          {category.name}
        </h3>
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 ml-3"
          style={{ backgroundColor: color }}
          role="img"
          aria-label={`Color indicator for ${category.name}`}
        />
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {category.description}
      </p>
      
      <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">Weight:</span>
          <span className="font-medium text-gray-900 dark:text-white">{(totalWeight * 100).toFixed(0)}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">Indicators:</span>
          <span className="font-medium text-gray-900 dark:text-white">{indicatorCount}</span>
        </div>
      </div>
    </div>
  )
}
