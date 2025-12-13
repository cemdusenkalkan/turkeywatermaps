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
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-300 border-b-accent" />
          <p className="text-gray-600 mt-6 text-base md:text-lg">{t('common.loading')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-navy-900">{t('categories.title')}</h1>
        <p className="text-base md:text-lg text-gray-600 mb-10 md:mb-12 leading-relaxed">
          {t('categories.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
          {manifest?.categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
        
        {/* Combined Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-navy-800 text-white rounded-2xl p-6 md:p-8 border border-navy-700"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('categories.combined.name')}</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            {t('categories.combined.detail')}
          </p>
          <div className="text-sm md:text-base text-gray-400 bg-navy-900/50 p-4 md:p-6 rounded-xl border border-navy-700/50">
            <strong className="text-gray-200">{t('methodology.scoring')}:</strong><br/>
            <span className="mt-2 block">{t('methodology.scoringText')}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

