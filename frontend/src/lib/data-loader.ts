/**
 * Data loading utilities for frontend - WRI Aqueduct 4.0
 * v4.0 structure: data/v4.0/{country}/{admin_level}/
 */

import type { DataManifest, ProvincesGeoJSON } from '@/types'

const BASE_PATH = (import.meta as any).env?.BASE_URL || '/'
const V4_DATA_PATH = `${BASE_PATH}data/v4.0/TUR/adm1/`

// Legacy path for backward compatibility
const LEGACY_DATA_PATH = `${BASE_PATH}data/`

/**
 * Load manifest.json with dataset metadata and indicator definitions
 */
export async function loadManifest(): Promise<DataManifest> {
  try {
    const response = await fetch(`${V4_DATA_PATH}manifest.json`)
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    // Fallback to legacy path
    console.warn('Failed to load v4.0 manifest, trying legacy path...', error)
    const response = await fetch(`${LEGACY_DATA_PATH}index.json`)
    if (!response.ok) {
      throw new Error(`Failed to load manifest from legacy path: ${response.statusText}`)
    }
    return response.json()
  }
}

/**
 * Load baseline annual data (all 13 indicators, province-level)
 */
export async function loadProvincesGeoJSON(): Promise<ProvincesGeoJSON> {
  try {
    const response = await fetch(`${V4_DATA_PATH}baseline_annual.json`)
    if (!response.ok) {
      throw new Error(`Failed to load baseline annual data: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    // Fallback to legacy path
    console.warn('Failed to load v4.0 data, trying legacy path...', error)
    const response = await fetch(`${LEGACY_DATA_PATH}turkey_water_risk.json`)
    if (!response.ok) {
      throw new Error(`Failed to load data from legacy path: ${response.statusText}`)
    }
    return response.json()
  }
}

/**
 * Load monthly baseline data (for Phase 3)
 * Returns null if not yet available
 */
export async function loadMonthlyData(): Promise<any | null> {
  try {
    const response = await fetch(`${V4_DATA_PATH}baseline_monthly.json`)
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

/**
 * Load future projections data (for Phase 3)
 * Returns null if not yet available
 */
export async function loadFutureData(): Promise<any | null> {
  try {
    const response = await fetch(`${V4_DATA_PATH}future_annual.json`)
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

