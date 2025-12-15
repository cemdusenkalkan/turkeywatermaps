// Type definitions for Türkiye Water Risk Map - Aqueduct 4.0

export interface Indicator {
  id: string
  code: string
  name: string
  short_name: string
  description: string
  weight: number
  color: string
  source: string
  units: string
  min_score: number
  max_score: number
  mean_score: number
  std_score?: number
  coverage?: number
}

export interface CategoryGroup {
  id: string
  name: string
  description: string
  indicators: Indicator[]
}

export interface IndicatorGroups {
  groups: CategoryGroup[]
}

export interface DataManifest {
  version: string
  aqueduct_version: string
  generated: string
  mode: 'baseline_annual' | 'baseline_monthly' | 'future_annual'
  data_source: string
  baseline_period: string
  spatial_resolution: string
  country: string
  n_features: number
  indicator_groups: IndicatorGroups
  combined_index: {
    name: string
    method: string
    description: string
    weighting_scheme: Record<string, number>
    min_score: number
    max_score: number
    mean_score: number
    aggregation_note: string
  }
  available_datasets: {
    baseline_annual: string | null
    baseline_monthly: string | null
    future_annual: string | null
  }
  license: string
  citation: string
  attribution: string
  disclaimer: string
}

// Legacy support
export interface Category extends Indicator {}

export type CategoryCompat = Category

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

export interface ProvinceCategoryScore {
  categoryId: string
  categoryName: string
  score: number
  percentile: number
}

export interface ProvinceDetailData {
  provinceName: string
  provinceNameTr: string
  combinedScore: number
  combinedPercentile: number
  categoryScores: ProvinceCategoryScore[]
}
