import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapShell } from '@/components/Map/MapShell'
import { LayerPanel } from '@/components/Map/LayerPanel'
import { loadManifest, loadProvincesGeoJSON } from '@/lib/data-loader'
import type { DataManifest, ProvincesGeoJSON, Category } from '@/types'

export function MapPage() {
  const [manifest, setManifest] = useState<DataManifest | null>(null)
  const [geoData, setGeoData] = useState<ProvincesGeoJSON | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string>('combined_risk')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(true)
  
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
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4" />
          <div className="text-gray-600">Loading map data...</div>
        </div>
      </div>
    )
  }
  
  if (error || !manifest || !geoData) {
    return (
      <div className="h-screen flex items-center justify-center">
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
  
  // Get active category object
  const activeCategory: Category | null = 
    activeCategoryId === 'combined_risk'
      ? {
          id: 'combined_risk',
          name: 'Combined Water Risk Index',
          short_name: 'Combined Risk',
          description: 'Weighted geometric mean of all risk categories',
          weight: 1.0,
          color: '#440154',
          min_score: manifest.combined_index.min_score,
          max_score: manifest.combined_index.max_score,
          mean_score: manifest.combined_index.mean_score,
        }
      : manifest.categories.find(c => c.id === activeCategoryId) || null
  
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
              categories={manifest.categories}
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
        className="absolute top-4 left-4 z-30 bg-white rounded-full shadow-lg p-3 
          hover:bg-gray-50 transition-all hover:scale-105"
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
      
      {/* Info Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-20 bg-white rounded-xl shadow-md px-4 py-2.5 text-sm"
      >
        <div className="text-gray-700">
          Data: <span className="font-semibold text-gray-900">{manifest.mode === 'synthetic_demo' ? 'Synthetic Demo' : 'Production'}</span>
        </div>
        <div className="text-xs text-gray-600">
          {manifest.temporal_coverage}
        </div>
      </motion.div>
      
      {/* Map */}
      <MapShell
        data={geoData}
        activeCategory={activeCategory}
        onProvinceClick={(id) => console.log('Clicked province:', id)}
      />
    </div>
  )
}

