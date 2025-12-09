import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import type { ProvincesGeoJSON, Category } from '@/types'
import { getColorScale, getRiskLabel } from '@/lib/color-scales'
import { calculatePercentile } from '@/lib/calculations'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapShellProps {
  data: ProvincesGeoJSON
  activeCategory: Category | null
  onProvinceClick?: (provinceId: string) => void
}

export function MapShell({ data, activeCategory, onProvinceClick }: MapShellProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popup = useRef<maplibregl.Popup | null>(null)
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    // Add PMTiles protocol (for future use)
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    
    // Initialize map with simple OSM basemap
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxzoom: 19
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22,
          },
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
    map.current.on('load', () => {
      if (!map.current) return
      
      // Add source
      if (map.current.getSource('provinces')) {
        (map.current.getSource('provinces') as maplibregl.GeoJSONSource).setData(data as any)
      } else {
        map.current.addSource('provinces', {
          type: 'geojson',
          data: data as any,
        })
      }
      
      // Province fill layer
      if (!map.current.getLayer('provinces-fill')) {
        map.current.addLayer({
          id: 'provinces-fill',
          type: 'fill',
          source: 'provinces',
          paint: {
            'fill-color': '#627d98',
            'fill-opacity': 0.7,
          },
        })
      }
      
      // Province outline layer
      if (!map.current.getLayer('provinces-outline')) {
        map.current.addLayer({
          id: 'provinces-outline',
          type: 'line',
          source: 'provinces',
          paint: {
            'line-color': '#334e68',
            'line-width': 1,
          },
        })
      }
      
      // Hover effect layer
      if (!map.current.getLayer('provinces-hover')) {
        map.current.addLayer({
          id: 'provinces-hover',
          type: 'line',
          source: 'provinces',
          paint: {
            'line-color': '#2b6cb0',
            'line-width': 2,
          },
          filter: ['==', 'province_id', ''],
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
          const scoreKey = categoryId === 'combined_risk' ? 'combined_score' : `${categoryId}_score`
          const score = properties?.[scoreKey] || 0
          
          // Calculate percentile
          const allScores = data.features.map(f => f.properties[scoreKey] as number)
          const percentile = calculatePercentile(score, allScores)
          
          if (!popup.current) {
            popup.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 10,
            })
          }
          
          const popupContent = `
            <div class="text-sm" style="min-width: 200px;">
              <div class="font-semibold text-base mb-1" style="color: #111827;">${properties?.name}</div>
              <div class="text-xs mb-2" style="color: #6b7280;">${properties?.name_tr}</div>
              <div class="border-t pt-2 mt-2" style="border-color: #e5e7eb;">
                <div class="flex justify-between mb-1.5">
                  <span style="color: #4b5563;">Score:</span>
                  <span class="font-semibold" style="color: #111827;">${score.toFixed(2)} / 5.0</span>
                </div>
                <div class="flex justify-between mb-1.5">
                  <span style="color: #4b5563;">Risk Level:</span>
                  <span class="font-semibold" style="color: #111827;">${getRiskLabel(score)}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: #4b5563;">Percentile:</span>
                  <span class="font-semibold" style="color: #111827;">${percentile}th</span>
                </div>
              </div>
            </div>
          `
          
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
    const colors = getColorScale(categoryId)
    
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
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

