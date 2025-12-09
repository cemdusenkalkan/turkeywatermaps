/**
 * Data loading utilities for frontend - WRI Aqueduct real data
 */

import type { DataManifest, ProvincesGeoJSON } from '@/types'

const BASE_PATH = (import.meta as any).env?.BASE_URL || '/'
const DATA_PATH = `${BASE_PATH}data/`

export async function loadManifest(): Promise<DataManifest> {
  const response = await fetch(`${DATA_PATH}index.json`)
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.statusText}`)
  }
  return response.json()
}

export async function loadProvincesGeoJSON(): Promise<ProvincesGeoJSON> {
  // Load the main data file which includes GeoJSON features
  const response = await fetch(`${DATA_PATH}turkey_water_risk.json`)
  if (!response.ok) {
    throw new Error(`Failed to load water risk data: ${response.statusText}`)
  }
  return response.json()
}

