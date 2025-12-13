import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CategoryCard } from '@/components/CategoryCard'
import { loadManifest } from '@/lib/data-loader'
import { useLanguage } from '../contexts/LanguageContext'
import type { DataManifest } from '@/types'

export function Categories() {
  const { t } = useLanguage()
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
          <p className="text-gray-600 mt-4">{t('common.loading')}</p>
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
        <h1 className="text-4xl font-bold mb-4">{t('categories.title')}</h1>
        <p className="text-lg text-gray-600 mb-12">
          {t('categories.subtitle')}
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
          <h2 className="text-2xl font-bold mb-4">{t('categories.combined.name')}</h2>
          <p className="text-gray-300 mb-4">
            {t('categories.combined.detail')}
          </p>
          <div className="text-sm text-gray-400">
            <strong>{t('methodology.scoring')}:</strong> {t('methodology.scoringText')}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

