#!/usr/bin/env node

/**
 * Historical Weather Climatology Dataset Builder
 * 
 * Fetches 5-year historical weather data (2020-2024) for all 81 Turkish provinces
 * using the Open-Meteo Historical Weather API
 * 
 * Data collected:
 * - Daily temperature (max, min, mean)
 * - Precipitation sum
 * - Wind speed max
 * - Weather codes
 * 
 * Output: frontend/public/data/weather-climatology-2020-2024.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROVINCES_FILE = join(__dirname, '../public/data/provinces-coordinates.json')
const OUTPUT_FILE = join(__dirname, '../public/data/weather-climatology-2020-2024.json')
const API_BASE = 'https://archive-api.open-meteo.com/v1/archive'
const BATCH_SIZE = 10 // Number of provinces per API call
const DELAY_MS = 150 // Rate limiting delay between batches

// Date range: 2020-01-01 to 2024-12-31
const START_DATE = '2020-01-01'
const END_DATE = '2024-12-31'

/**
 * Load province coordinates
 */
function loadProvinces() {
  try {
    const data = JSON.parse(readFileSync(PROVINCES_FILE, 'utf-8'))
    return data.provinces
  } catch (error) {
    console.error('❌ Error loading provinces:', error.message)
    process.exit(1)
  }
}

/**
 * Fetch historical weather data for a batch of provinces
 */
async function fetchHistoricalBatch(provinces) {
  const latitudes = provinces.map(p => p.latitude).join(',')
  const longitudes = provinces.map(p => p.longitude).join(',')
  
  const params = new URLSearchParams({
    latitude: latitudes,
    longitude: longitudes,
    start_date: START_DATE,
    end_date: END_DATE,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'temperature_2m_mean',
      'precipitation_sum',
      'wind_speed_10m_max',
      'weather_code'
    ].join(','),
    timezone: 'Europe/Istanbul'
  })
  
  const url = `${API_BASE}?${params}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`❌ Error fetching batch:`, error.message)
    return null
  }
}

/**
 * Calculate climatology statistics from daily data
 */
function calculateStatistics(dailyData) {
  const monthlyStats = {}
  
  // Group by month
  dailyData.time.forEach((date, index) => {
    const month = date.substring(0, 7) // YYYY-MM
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        tempMax: [],
        tempMin: [],
        tempMean: [],
        precipitation: [],
        windSpeed: [],
        weatherCodes: []
      }
    }
    
    monthlyStats[month].tempMax.push(dailyData.temperature_2m_max[index])
    monthlyStats[month].tempMin.push(dailyData.temperature_2m_min[index])
    monthlyStats[month].tempMean.push(dailyData.temperature_2m_mean[index])
    monthlyStats[month].precipitation.push(dailyData.precipitation_sum[index])
    monthlyStats[month].windSpeed.push(dailyData.wind_speed_10m_max[index])
    monthlyStats[month].weatherCodes.push(dailyData.weather_code[index])
  })
  
  // Calculate monthly averages
  const result = {}
  Object.keys(monthlyStats).forEach(month => {
    const stats = monthlyStats[month]
    result[month] = {
      tempMax: average(stats.tempMax),
      tempMin: average(stats.tempMin),
      tempMean: average(stats.tempMean),
      precipitationSum: sum(stats.precipitation),
      precipitationMean: average(stats.precipitation),
      windSpeedMax: Math.max(...stats.windSpeed),
      windSpeedMean: average(stats.windSpeed),
      daysCount: stats.tempMax.length,
      mostCommonWeatherCode: mode(stats.weatherCodes)
    }
  })
  
  return result
}

/**
 * Helper: Calculate average
 */
function average(arr) {
  const filtered = arr.filter(v => v !== null && !isNaN(v))
  if (filtered.length === 0) return null
  return filtered.reduce((a, b) => a + b, 0) / filtered.length
}

/**
 * Helper: Calculate sum
 */
function sum(arr) {
  const filtered = arr.filter(v => v !== null && !isNaN(v))
  return filtered.reduce((a, b) => a + b, 0)
}

/**
 * Helper: Find mode (most common value)
 */
function mode(arr) {
  const filtered = arr.filter(v => v !== null && !isNaN(v))
  if (filtered.length === 0) return null
  
  const counts = {}
  filtered.forEach(v => {
    counts[v] = (counts[v] || 0) + 1
  })
  
  let maxCount = 0
  let modeValue = null
  Object.keys(counts).forEach(key => {
    if (counts[key] > maxCount) {
      maxCount = counts[key]
      modeValue = parseInt(key)
    }
  })
  
  return modeValue
}

/**
 * Main execution
 */
async function main() {
  console.log('🌤️  Historical Weather Climatology Dataset Builder')
  console.log('=' .repeat(60))
  console.log(`📅 Date Range: ${START_DATE} to ${END_DATE}`)
  console.log(`🗺️  Processing 81 Turkish provinces`)
  console.log('')
  
  const provinces = loadProvinces()
  console.log(`✅ Loaded ${provinces.length} provinces`)
  
  // Split into batches
  const batches = []
  for (let i = 0; i < provinces.length; i += BATCH_SIZE) {
    batches.push(provinces.slice(i, i + BATCH_SIZE))
  }
  
  console.log(`📦 Created ${batches.length} batches (${BATCH_SIZE} provinces per batch)`)
  console.log('')
  
  const climatologyData = {}
  let successCount = 0
  let failureCount = 0
  
  // Process batches
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const batchNum = i + 1
    
    console.log(`⏳ Fetching batch ${batchNum}/${batches.length}...`)
    
    const startTime = Date.now()
    const data = await fetchHistoricalBatch(batch)
    const duration = Date.now() - startTime
    
    if (data) {
      // Process each province in batch
      batch.forEach((province, index) => {
        const provinceData = {
          latitude: data.latitude ? data.latitude[index] : province.latitude,
          longitude: data.longitude ? data.longitude[index] : province.longitude,
          timezone: data.timezone || 'Europe/Istanbul',
          daily: {
            time: data.time || [],
            temperature_2m_max: data.temperature_2m_max ? data.temperature_2m_max[index] : [],
            temperature_2m_min: data.temperature_2m_min ? data.temperature_2m_min[index] : [],
            temperature_2m_mean: data.temperature_2m_mean ? data.temperature_2m_mean[index] : [],
            precipitation_sum: data.precipitation_sum ? data.precipitation_sum[index] : [],
            wind_speed_10m_max: data.wind_speed_10m_max ? data.wind_speed_10m_max[index] : [],
            weather_code: data.weather_code ? data.weather_code[index] : []
          }
        }
        
        // Calculate statistics
        const monthlyStats = calculateStatistics(provinceData.daily)
        
        climatologyData[province.name] = {
          province: province.name,
          provinceId: province.id,
          region: province.region,
          coordinates: {
            latitude: provinceData.latitude,
            longitude: provinceData.longitude
          },
          period: {
            start: START_DATE,
            end: END_DATE,
            years: 5
          },
          monthlyStatistics: monthlyStats,
          rawDataPoints: provinceData.daily.time.length
        }
        
        successCount++
      })
      
      console.log(`   ✅ Batch ${batchNum} completed in ${duration}ms`)
    } else {
      failureCount += batch.length
      console.log(`   ❌ Batch ${batchNum} failed`)
    }
    
    // Rate limiting delay
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }
  
  console.log('')
  console.log('=' .repeat(60))
  console.log(`✅ Success: ${successCount} provinces`)
  console.log(`❌ Failure: ${failureCount} provinces`)
  
  // Save output
  const output = {
    metadata: {
      description: 'Historical weather climatology for Turkish provinces (2020-2024)',
      source: 'Open-Meteo Historical Weather API',
      sourceUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
      period: {
        start: START_DATE,
        end: END_DATE,
        years: 5
      },
      generatedAt: new Date().toISOString(),
      provincesCount: successCount,
      totalDataPoints: Object.values(climatologyData).reduce((sum, p) => sum + p.rawDataPoints, 0)
    },
    provinces: climatologyData
  }
  
  try {
    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8')
    console.log(`💾 Saved to: ${OUTPUT_FILE}`)
    console.log(`📊 Total data points: ${output.metadata.totalDataPoints.toLocaleString()}`)
  } catch (error) {
    console.error('❌ Error saving file:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
