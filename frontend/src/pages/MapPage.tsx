import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapShell } from '@/components/Map/MapShell'
import { LayerPanel } from '@/components/Map/LayerPanel'
import { ProvinceModal } from '@/components/ProvinceModal'
import { loadManifest, loadProvincesGeoJSON } from '@/lib/data-loader'
import { calculatePercentile } from '@/lib/calculations'
import type { DataManifest, ProvincesGeoJSON, Category, ProvinceDetailData } from '@/types'

export function MapPage() {
  const [manifest, setManifest] = useState<DataManifest | null>(null)
  const [geoData, setGeoData] = useState<ProvincesGeoJSON | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string>('combined_risk')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ProvinceDetailData | null>(null)
  
  useEffect(() => {
    async function loadData() {
      try {
        const [manifestData, geoJsonData] = await Promise.all([
          loadManifest(),
          loadProvincesGeoJSON(),
        ])
        
        setManifest(manifestData)
        setGeoData(geoJsonData)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load map data. Please refresh the page.')
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Handle province click to open modal with all scores
  const handleProvinceClick = (provinceId: string) => {
    if (!geoData || !manifest) return

    // Find province feature
    const province = geoData.features.find(f => f.properties.province_id === provinceId)
    if (!province) return

    const props = province.properties
    
    // Get combined score
    const combinedScore = props.combined_score || 0
    const allCombinedScores = geoData.features.map(f => f.properties.combined_score as number)
    const combinedPercentile = calculatePercentile(combinedScore, allCombinedScores)

    // Build category scores - handle both old and new data structure
    const allIndicators = manifest.indicator_groups 
      ? manifest.indicator_groups.groups.flatMap(g => g.indicators)
      : (manifest as any).categories || []
      
    const categoryScores = allIndicators.map((cat: any) => {
      const scoreKey = `${cat.id}_score`
      const score = props[scoreKey] as number || 0
      const allScores = geoData.features.map(f => f.properties[scoreKey] as number).filter(s => !isNaN(s))
      const percentile = allScores.length > 0 ? calculatePercentile(score, allScores) : 0
      
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        score,
        percentile,
      }
    })

    const modalContent: ProvinceDetailData = {
      provinceName: props.name,
      provinceNameTr: props.name_tr,
      combinedScore,
      combinedPercentile,
      categoryScores,
    }

    setModalData(modalContent)
    setModalOpen(true)
  }
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-gray-300 border-b-accent mb-6" />
          <div className="text-gray-600 text-base md:text-lg font-medium">Loading map data...</div>
        </div>
      </div>
    )
  }
  
  if (error || !manifest || !geoData) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 font-bold">Error</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }
  
  // Get active category object - handle both old and new data structure
  const allIndicators = manifest.indicator_groups 
    ? manifest.indicator_groups.groups.flatMap(g => g.indicators)
    : (manifest as any).categories || []
    
  const activeCategory: Category | null = 
    activeCategoryId === 'combined_risk'
      ? {
          id: 'combined_risk',
          name: manifest.combined_index?.name || 'Combined Water Risk Index',
          short_name: 'Combined Risk',
          description: manifest.combined_index?.description || 'Weighted mean of all risk categories',
          weight: 1.0,
          color: '#440154',
          min_score: manifest.combined_index.min_score,
          max_score: manifest.combined_index.max_score,
          mean_score: manifest.combined_index.mean_score,
        }
      : allIndicators.find((c: any) => c.id === activeCategoryId) || null
  
  return (
    <div className="relative w-full h-[calc(100vh-4rem)]" style={{ minHeight: '600px' }}>
      {/* Layer Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="absolute top-0 left-0 z-20 h-full overflow-y-auto shadow-lg"
          >
            <LayerPanel
              categories={allIndicators}
              categoryGroups={manifest.indicator_groups?.groups}
              activeCategoryId={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
              activeCategory={activeCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle Panel Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 left-4 z-30 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 
          hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 text-gray-900 dark:text-white"
        style={{ marginLeft: showPanel ? '280px' : '0' }}
        aria-label={showPanel ? 'Hide panel' : 'Show panel'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showPanel ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          )}
        </svg>
      </button>
      
      {/* Info Badge - moved below mascots */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[180px] right-4 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="text-gray-700 dark:text-gray-300 font-semibold">
          Aqueduct 4.0
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {manifest.version}
        </div>
      </motion.div>
      
      {/* Map */}
      <MapShell
        data={geoData}
        activeCategory={activeCategory}
        onProvinceClick={handleProvinceClick}
      />

      {/* Province Detail Modal */}
      <ProvinceModal
        isOpen={modalOpen}
        data={modalData}
        onClose={() => {
          setModalOpen(false)
          // Clear modal data after animation completes
          setTimeout(() => setModalData(null), 300)
        }}
      />
    </div>
  )
}

