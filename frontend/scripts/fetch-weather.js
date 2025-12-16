#!/usr/bin/env node

/**
 * Fetch Weather Data from Open-Meteo API
 * 
 * This script fetches current weather and 7-day forecast for all 81 Turkish provinces
 * from the Open-Meteo API and saves it to a JSON file for static hosting.
 * 
 * Rate limits: Free tier allows 10,000 calls/day, we use ~9 calls (81 provinces / 10 per batch)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load province coordinates
const provincesData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../public/data/provinces-coordinates.json'),
    'utf-8'
  )
);

const BATCH_SIZE = 10; // Open-Meteo allows multiple locations per request
const API_DELAY = 150; // ms delay between batches (rate limiting)
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // ms

/**
 * Sleep helper function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch weather data with retry logic and exponential backoff
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${attempt}/${retries} failed: ${error.message}`);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff: 2s, 4s, 8s
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
}

/**
 * Fetch weather for a batch of provinces
 */
async function fetchBatch(provinces) {
  const lats = provinces.map(p => p.latitude).join(',');
  const lons = provinces.map(p => p.longitude).join(',');
  
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lats);
  url.searchParams.set('longitude', lons);
  url.searchParams.set('current', [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'wind_speed_10m',
    'wind_direction_10m'
  ].join(','));
  url.searchParams.set('hourly', [
    'temperature_2m',
    'precipitation_probability',
    'precipitation',
    'weather_code'
  ].join(','));
  url.searchParams.set('daily', [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant'
  ].join(','));
  url.searchParams.set('timezone', 'Europe/Istanbul');
  url.searchParams.set('forecast_days', '7');
  
  console.log(`Fetching weather for ${provinces.length} provinces...`);
  
  const data = await fetchWithRetry(url.toString());
  
  // Open-Meteo returns array when multiple locations requested
  const results = Array.isArray(data) ? data : [data];
  
  // Map results back to province names
  const mapped = {};
  results.forEach((location, idx) => {
    if (provinces[idx]) {
      mapped[provinces[idx].name] = location;
    }
  });
  
  return mapped;
}

/**
 * Main function
 */
async function main() {
  console.log('🌤️  Fetching weather data for 81 Turkish provinces...\n');
  
  const provinces = provincesData.provinces;
  const allWeatherData = {};
  const startTime = Date.now();
  
  // Process in batches
  const totalBatches = Math.ceil(provinces.length / BATCH_SIZE);
  
  for (let i = 0; i < provinces.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const batch = provinces.slice(i, i + BATCH_SIZE);
    
    console.log(`\n📦 Batch ${batchNumber}/${totalBatches} (Provinces ${i + 1}-${Math.min(i + BATCH_SIZE, provinces.length)})`);
    
    try {
      const batchData = await fetchBatch(batch);
      Object.assign(allWeatherData, batchData);
      
      console.log(`✅ Batch ${batchNumber} completed successfully`);
      
      // Rate limiting delay (except for last batch)
      if (i + BATCH_SIZE < provinces.length) {
        await sleep(API_DELAY);
      }
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} failed after all retries: ${error.message}`);
      // Continue with other batches even if one fails
    }
  }
  
  // Prepare output
  const output = {
    metadata: {
      lastUpdate: new Date().toISOString(),
      updateTimestamp: Date.now(),
      provincesCount: Object.keys(allWeatherData).length,
      expectedCount: 81,
      source: 'Open-Meteo API',
      attribution: 'Weather data by Open-Meteo.com (CC BY 4.0)',
      timezone: 'Europe/Istanbul',
      forecastDays: 7
    },
    provinces: allWeatherData
  };
  
  // Save to file
  const outputPath = path.join(__dirname, '../public/data/weather-current.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`\n✨ Weather data update complete!`);
  console.log(`   • Provinces fetched: ${output.metadata.provincesCount}/${output.metadata.expectedCount}`);
  console.log(`   • Duration: ${duration}s`);
  console.log(`   • Saved to: ${outputPath}`);
  console.log(`   • Timestamp: ${output.metadata.lastUpdate}`);
  
  if (output.metadata.provincesCount < output.metadata.expectedCount) {
    console.warn(`\n⚠️  Warning: Only ${output.metadata.provincesCount}/${output.metadata.expectedCount} provinces were successfully fetched`);
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
