import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CategoryCard } from '@/components/CategoryCard'
import { loadManifest } from '@/lib/data-loader'
import type { DataManifest } from '@/types'

export function Categories() {
  const [manifest, setManifest] = useState<DataManifest | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4">Water Risk Categories</h1>
        <p className="text-lg text-gray-600 mb-12">
          We assess seven distinct dimensions of water-related risk across Turkey's provinces. 
          Each category captures a unique aspect of water security challenges.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {manifest?.categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
        
        {/* Combined Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-navy-800 text-white rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Combined Water Risk Index</h2>
          <p className="text-gray-300 mb-4">
            The Combined Water Risk Index aggregates all seven categories using a weighted 
            geometric mean. This approach ensures that extreme values in any single category 
            are appropriately reflected in the overall risk assessment.
          </p>
          <div className="text-sm text-gray-400">
            <strong>Method:</strong> Weighted Geometric Mean<br />
            <strong>Formula:</strong> (∏ score<sub>i</sub><sup>w<sub>i</sub></sup>)<sup>1/Σw<sub>i</sub></sup>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

