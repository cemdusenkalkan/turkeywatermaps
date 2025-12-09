// Type definitions for Türkiye Water Risk Map

export interface Category {
  id: string
  name: string
  short_name: string
  description: string
  weight: number
  color: string
  min_score: number
  max_score: number
  mean_score: number
  std_score?: number
}

export interface DataManifest {
  version: string
  generated: string
  mode: 'synthetic_demo' | 'production'
  spatial_resolution: string
  n_provinces: number
  temporal_coverage: string
  categories: Category[]
  combined_index: {
    method: string
    min_score: number
    max_score: number
    mean_score: number
  }
  files: {
    geojson: string
    csv_all: string
    csv_categories: string[]
  }
}

export interface ProvinceProperties {
  province_id: string
  name: string
  name_tr: string
  combined_score: number
  [key: string]: string | number  // Dynamic category scores
}

export interface ProvinceFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
  properties: ProvinceProperties
}

export interface ProvincesGeoJSON {
  type: 'FeatureCollection'
  features: ProvinceFeature[]
}

export interface LayerConfig {
  id: string
  name: string
  propertyName: string
  colorScale: string[]
  breaks: number[]
}

export interface TooltipData {
  provinceName: string
  score: number
  percentile: number
  category?: string
}

