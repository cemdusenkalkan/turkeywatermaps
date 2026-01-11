import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import type { ProvincesGeoJSON, Category } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'
import { calculatePercentile } from '@/lib/calculations'
import { initDuckDB, loadParquetFile, query } from '@/lib/duckdb'
import { ZoomHint } from './ZoomHint'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapShellProps {
  data: ProvincesGeoJSON
  activeCategory: Category | null
  onProvinceClick?: (provinceId: string) => void
  onDistrictClick?: (districtId: string, districtName: string, districtData: any) => void
}

export function MapShell({ data, activeCategory, onProvinceClick, onDistrictClick }: MapShellProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popup = useRef<maplibregl.Popup | null>(null)
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [showZoomHint, setShowZoomHint] = useState(true)
  const [districtDataLoaded, setDistrictDataLoaded] = useState(false)
  const districtDataCache = useRef<Record<string, any>>({})
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    // Add PMTiles protocol (for future use)
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    
    // Detect dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')
    
    // Initialize map with CartoDB Positron (includes labels)
    // This basemap has built-in place labels that stay on top of our choropleth
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-base': {
            type: 'raster',
            tiles: isDarkMode ? [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
            ] : [
              'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxzoom: 19
          },
          'carto-labels': {
            type: 'raster',
            tiles: isDarkMode ? [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png'
            ] : [
              'https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            maxzoom: 19
          },
          'districts': {
            type: 'vector',
            url: 'pmtiles://' + window.location.origin + import.meta.env.BASE_URL + 'data/v4.0/TUR/adm2/turkey_districts.pmtiles',
            attribution: 'GADM'
          }
        },
        layers: [
          {
            id: 'carto-base-tiles',
            type: 'raster',
            source: 'carto-base',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-opacity': 1.0
            }
          },
          // Province layers will be inserted here
          // District layers will be inserted here
          // Labels layer will be added after province data
        ],
      },
      center: [35.0, 39.0], // Center of Turkey
      zoom: 5.5,
      minZoom: 5,
      maxZoom: 10,
    })
    
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      })
    )
    
    // Add data source and layer after map loads
    map.current.on('load', async () => {
      if (!map.current) return
      
      // Construct base URL for data
      const baseUrl = window.location.origin + import.meta.env.BASE_URL;
      
      // Initialize DuckDB and load data
      try {
        await initDuckDB();
        await loadParquetFile(baseUrl + 'data/v4.0/TUR/adm2/water_risk.parquet', 'water_risk');
        
        // Cache all district data for quick access
        const allData = await query('SELECT * FROM water_risk')
        const rows = allData.toArray()
        rows.forEach((row: any) => {
          if (row.district_id) {
            // Calculate combined score as average of main risk indicators
            // Filter out null, NaN, and sentinel values (-9999)
            const scores = [
              row.bws_score,
              row.bwd_score,
              row.iav_score,
              row.sev_score,
              row.gtd_score,
              row.drr_score,
              row.rfr_score,
              row.cfr_score
            ].filter(s => s != null && !isNaN(s) && s > -9999)
            
            const combined_score = scores.length > 0 
              ? scores.reduce((sum, s) => sum + s, 0) / scores.length
              : 0
            
            districtDataCache.current[row.district_id] = {
              ...row,
              combined_score // Add computed combined score
            }
          }
        })
        
        setDistrictDataLoaded(true);
        console.log('District data loaded:', Object.keys(districtDataCache.current).length, 'districts');
      } catch (e) {
        console.error("Error loading district data:", e);
      }

      // Add source
      if (map.current.getSource('provinces')) {
        (map.current.getSource('provinces') as maplibregl.GeoJSONSource).setData(data as any)
      } else {
        map.current.addSource('provinces', {
          type: 'geojson',
          data: data as any,
        })
      }
      
      // Province fill layer - initialize with Combined Risk colors
      // Set opacity to 0.6 so labels remain readable
      if (!map.current.getLayer('provinces-fill')) {
        const colors = getColorScale()
        const colorExpression: any = [
          'step',
          ['get', 'combined_score'],
          colors[0], // Default color for score 0
          1, colors[1],
          2, colors[2],
          3, colors[3],
          4, colors[4],
        ]
        
        map.current.addLayer({
          id: 'provinces-fill',
          type: 'fill',
          source: 'provinces',
          maxzoom: 7, // Hide provinces when zoomed in
          paint: {
            'fill-color': colorExpression,
            'fill-opacity': 0.35, // Reduced significantly for much better basemap visibility
          },
        })
      }
      
      // Province outline layer
      if (!map.current.getLayer('provinces-outline')) {
        map.current.addLayer({
          id: 'provinces-outline',
          type: 'line',
          source: 'provinces',
          maxzoom: 7,
          paint: {
            'line-color': '#334e68',
            'line-width': 1,
          },
        })
      }

      // District fill layer (initially hidden or empty until data loads)
      if (!map.current.getLayer('districts-fill')) {
        map.current.addLayer({
          id: 'districts-fill',
          source: 'districts',
          'source-layer': 'districts',
          type: 'fill',
          minzoom: 7, // Show districts when zoomed in
          paint: {
            'fill-color': '#ccc', // Default color
            'fill-opacity': 0.5,
            'fill-outline-color': '#fff'
          }
        })
      }

      // District outline layer
      if (!map.current.getLayer('districts-line')) {
        map.current.addLayer({
          id: 'districts-line',
          source: 'districts',
          'source-layer': 'districts',
          type: 'line',
          minzoom: 7,
          paint: {
            'line-color': '#fff',
            'line-width': 0.5,
            'line-opacity': 0.5
          }
        })
      }
      
      // Hover effect layer
      if (!map.current.getLayer('provinces-hover')) {
        map.current.addLayer({
          id: 'provinces-hover',
          type: 'line',
          source: 'provinces',
          maxzoom: 7,
          paint: {
            'line-color': '#2b6cb0',
            'line-width': 2,
          },
          filter: ['==', 'province_id', ''],
        })
      }
      
      // Add labels layer on top of everything
      // This ensures city names stay visible above the choropleth
      if (!map.current.getLayer('carto-labels')) {
        map.current.addLayer({
          id: 'carto-labels',
          type: 'raster',
          source: 'carto-labels',
          minzoom: 0,
          maxzoom: 22,
        })
      }
      
      // Mouse events
      map.current.on('mousemove', 'provinces-fill', (e) => {
        if (!map.current || !e.features || e.features.length === 0) return
        
        map.current.getCanvas().style.cursor = 'pointer'
        
        const feature = e.features[0]
        const provinceId = feature.properties?.province_id
        
        if (provinceId !== hoveredProvince) {
          setHoveredProvince(provinceId)
          
          // Update hover filter
          map.current.setFilter('provinces-hover', ['==', 'province_id', provinceId])
          
          // Show popup
          const properties = feature.properties
          const categoryId = activeCategory?.id || 'combined_risk'
          
          // Get combined score
          const combinedScore = properties?.combined_score || 0
          const allCombinedScores = data.features.map(f => f.properties.combined_score as number)
          const combinedPercentile = calculatePercentile(combinedScore, allCombinedScores)
          
          // Get selected category score (if not combined)
          let selectedCategoryScore = null
          let selectedCategoryPercentile = null
          let selectedCategoryName = ''
          
          if (categoryId !== 'combined_risk') {
            const scoreKey = `${categoryId}_score`
            selectedCategoryScore = properties?.[scoreKey] || 0
            const allCategoryScores = data.features.map(f => f.properties[scoreKey] as number)
            selectedCategoryPercentile = calculatePercentile(selectedCategoryScore, allCategoryScores)
            // Use translated name: try short name first, then full name, then fallback to English name
            selectedCategoryName = activeCategory?.short_name || activeCategory?.name || ''
          }
          
          if (!popup.current) {
            popup.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 10,
            })
          }
          
          // Build popup with both scores
          let popupContent = `
            <div class="text-sm" style="min-width: 220px;">
              <div class="font-semibold text-base mb-1" style="color: #111827;">${properties?.name}</div>
              <div class="text-xs mb-2" style="color: #6b7280;">${properties?.name_tr}</div>
              
              <!-- Combined Score -->
              <div class="border-t pt-2 mt-2" style="border-color: #e5e7eb;">
                <div class="text-xs font-semibold mb-1.5" style="color: #6b7280;">Combined Risk</div>
                <div class="flex justify-between mb-1">
                  <span style="color: #4b5563;">Score:</span>
                  <span class="font-semibold" style="color: #111827;">${combinedScore.toFixed(2)} / 5.0</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span style="color: #4b5563;">Risk Level:</span>
                  <span class="font-semibold" style="color: #111827;">${getRiskLabel(combinedScore)}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: #4b5563;">Percentile:</span>
                  <span class="font-semibold" style="color: #111827;">${combinedPercentile}th</span>
                </div>
              </div>
          `
          
          // Add selected category section if not combined
          if (selectedCategoryScore !== null) {
            popupContent += `
              <div class="border-t pt-2 mt-2" style="border-color: #e5e7eb;">
                <div class="text-xs font-semibold mb-1.5" style="color: #6b7280;">${selectedCategoryName}</div>
                <div class="flex justify-between mb-1">
                  <span style="color: #4b5563;">Score:</span>
                  <span class="font-semibold" style="color: #111827;">${selectedCategoryScore.toFixed(2)} / 5.0</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span style="color: #4b5563;">Risk Level:</span>
                  <span class="font-semibold" style="color: #111827;">${getRiskLabel(selectedCategoryScore)}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: #4b5563;">Percentile:</span>
                  <span class="font-semibold" style="color: #111827;">${selectedCategoryPercentile}th</span>
                </div>
              </div>
            `
          }
          
          popupContent += `</div>`
          
          popup.current
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map.current)
        }
      })
      
      map.current.on('mouseleave', 'provinces-fill', () => {
        if (!map.current) return
        
        map.current.getCanvas().style.cursor = ''
        setHoveredProvince(null)
        map.current.setFilter('provinces-hover', ['==', 'province_id', ''])
        
        if (popup.current) {
          popup.current.remove()
        }
      })

      // District mouse events
      map.current.on('mousemove', 'districts-fill', (e) => {
        if (!map.current || !e.features || e.features.length === 0) return
        
        map.current.getCanvas().style.cursor = 'pointer'
        
        const feature = e.features[0]
        const districtId = feature.properties?.GID_2
        const districtName = feature.properties?.NAME_2
        
        // Get data from cache
        const row = districtDataCache.current[districtId]
        
        // Debug logging
        if (!row && Object.keys(districtDataCache.current).length > 0) {
          console.log('District not found in cache. GID_2:', districtId)
          console.log('Sample cached IDs:', Object.keys(districtDataCache.current).slice(0, 3))
        }
        
        if (row) {
          // Map category ID to column name based on selected category
          const categoryId = activeCategory?.id || 'combined_risk'
          
          // Category ID to column name mapping
          const categoryCodeMap: Record<string, string> = {
            'combined_risk': 'combined',
            'baseline_stress': 'bws',
            'baseline_depletion': 'bwd',
            'groundwater_decline': 'gtd',
            'interannual_variability': 'iav',
            'seasonal_variability': 'sev',
            'drought_risk': 'drr',
            'riverine_flood_risk': 'rfr',
            'coastal_flood_risk': 'cfr',
          }
          
          const columnCode = categoryCodeMap[categoryId] || 'bws'
          const scoreKey = `${columnCode}_score`
          let score = row[scoreKey]
          
          // Handle missing data (null, undefined, or sentinel value -9999)
          const hasData = score != null && !isNaN(score) && score > -9999
          if (!hasData) {
            score = 0
          }
          
          // Get category name for display
          const categoryName = activeCategory?.short_name || activeCategory?.name || 'Water Stress'
          
          if (!popup.current) {
            popup.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 10,
            })
          }
          
          const popupContent = `
            <div class="text-sm" style="min-width: 200px;">
              <div class="font-semibold text-base mb-1" style="color: #111827;">${districtName}</div>
              <div class="text-xs mb-2" style="color: #6b7280;">District (İlçe)</div>
              <div class="border-t pt-2 mt-2" style="border-color: #e5e7eb;">
                <div class="flex justify-between mb-1.5">
                  <span style="color: #4b5563;">${categoryName}:</span>
                  <span class="font-semibold" style="color: #111827;">${hasData ? score.toFixed(2) + ' / 5.0' : 'No data'}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: #4b5563;">Risk Level:</span>
                  <span class="font-semibold" style="color: #111827;">${hasData ? getRiskLabel(score) : 'N/A'}</span>
                </div>
              </div>
            </div>
          `
          
          popup.current
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map.current!)
        }
      })

      map.current.on('mouseleave', 'districts-fill', () => {
        if (!map.current) return
        map.current.getCanvas().style.cursor = ''
        if (popup.current) {
          popup.current.remove()
        }
      })
      
      // District click handler
      map.current.on('click', 'districts-fill', (e) => {
        if (e.features && e.features.length > 0 && onDistrictClick) {
          const feature = e.features[0]
          const districtId = feature.properties?.GID_2
          const districtName = feature.properties?.NAME_2
          const districtData = districtDataCache.current[districtId]
          
          if (districtData && e.lngLat) {
            // Pass coordinates for weather
            onDistrictClick(districtId, districtName, {
              ...districtData,
              coordinates: { lat: e.lngLat.lat, lon: e.lngLat.lng }
            })
          }
        }
      })
      
      map.current.on('click', 'provinces-fill', (e) => {
        if (e.features && e.features.length > 0 && onProvinceClick) {
          const provinceId = e.features[0].properties?.province_id
          onProvinceClick(provinceId)
        }
      })
    })
    
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [data])
  
  // Update colors when category changes
  useEffect(() => {
    if (!map.current || !activeCategory || !map.current.isStyleLoaded()) return
    
    const categoryId = activeCategory.id
    const scoreKey = categoryId === 'combined_risk' ? 'combined_score' : `${categoryId}_score`
    const colors = getColorScale()
    
    // Create color expression for MapLibre
    const colorExpression: any = [
      'step',
      ['get', scoreKey],
      colors[0], // Default color for score 0
      1, colors[1],
      2, colors[2],
      3, colors[3],
      4, colors[4],
    ]
    
    if (map.current.getLayer('provinces-fill')) {
      map.current.setPaintProperty('provinces-fill', 'fill-color', colorExpression)
    }
  }, [activeCategory, data])
  
  // Update district colors when category changes or data loads
  useEffect(() => {
    if (!map.current || !districtDataLoaded) return
    
    const updateDistrictColors = () => {
      if (!map.current || !map.current.isStyleLoaded() || !map.current.getLayer('districts-fill')) return
      
      const categoryId = activeCategory?.id || 'combined_risk'
      
      // Category ID to column name mapping
      const categoryCodeMap: Record<string, string> = {
        'combined_risk': 'combined',
        'baseline_stress': 'bws',
        'baseline_depletion': 'bwd',
        'groundwater_decline': 'gtd',
        'interannual_variability': 'iav',
        'seasonal_variability': 'sev',
        'drought_risk': 'drr',
        'riverine_flood_risk': 'rfr',
        'coastal_flood_risk': 'cfr',
      }
      
      const columnCode = categoryCodeMap[categoryId] || 'bws'
      const scoreKey = `${columnCode}_score`
      const colors = getColorScale()
      
      console.log('Updating district colors for category:', categoryId, 'column:', scoreKey)
      
      // Build a mapbox expression for coloring based on GID_2
      // We'll use a match expression with all district IDs and their colors
      const matchExpression: any = ['match', ['get', 'GID_2']]
      
      let coloredCount = 0
      Object.entries(districtDataCache.current).forEach(([districtId, row]) => {
        let score = row[scoreKey]
        
        // Handle missing data (null, undefined, or sentinel value -9999)
        if (score == null || isNaN(score) || score <= -9999) {
          score = 0
        }
        
        // Determine color based on score
        let color = colors[0]
        if (score >= 4) color = colors[4]
        else if (score >= 3) color = colors[3]
        else if (score >= 2) color = colors[2]
        else if (score >= 1) color = colors[1]
        
        matchExpression.push(districtId, color)
        coloredCount++
      })
      
      console.log('Applied colors to', coloredCount, 'districts')
      
      // Default color for districts not in cache
      matchExpression.push('#e0e0e0')
      
      // Update district layer
      map.current.setPaintProperty('districts-fill', 'fill-color', matchExpression)
      map.current.setPaintProperty('districts-fill', 'fill-opacity', 0.7)
    }
    
    // Wait for style to load if it hasn't yet, then update
    if (map.current.isStyleLoaded()) {
      updateDistrictColors()
    } else {
      map.current.once('styledata', updateDistrictColors)
    }
    
    // Also listen for zoom events to ensure colors appear when user first zooms in
    const handleZoom = () => {
      const zoom = map.current?.getZoom()
      if (zoom && zoom >= 7) {
        // Only update if we're at district zoom level
        setTimeout(updateDistrictColors, 100)
      }
    }
    
    map.current.on('zoomend', handleZoom)
    
    return () => {
      if (map.current) {
        map.current.off('zoomend', handleZoom)
      }
    }
  }, [activeCategory, districtDataLoaded])
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      {showZoomHint && (
        <ZoomHint onDismiss={() => setShowZoomHint(false)} />
      )}
    </div>
  )
}

