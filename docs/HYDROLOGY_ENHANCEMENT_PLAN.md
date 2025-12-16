# Turkey Water Map - Hydrology Enhancement Implementation Plan

**Date:** December 16, 2025  
**Status:** Research & Planning Phase  
**Goal:** Transform from static province-level risk map to comprehensive hydrological analysis platform

---

## Executive Summary

This document outlines a comprehensive plan to enhance the Turkey Water Risk Map with 8 major hydrological features that will elevate it from a basic risk visualization tool to a world-class water intelligence platform. All enhancements are designed to work within GitHub Pages constraints (static hosting, no backend).

---

## 1. River Network with Stream Order & Flow Analysis

### 🎯 Goal
Replace basic blue lines with analytical river network showing hierarchy, drainage areas, and upstream catchment tracing.

### 📊 Data Sources

#### Primary: HydroSHEDS / HydroRIVERS
- **URL:** https://www.hydrosheds.org/products
- **Coverage:** Global, including Turkey region
- **Products:**
  - **HydroRIVERS:** Vector river network with Strahler stream order (1-10)
  - **Flow Accumulation Rasters:** Upstream contributing area grids
  - **Flow Direction Grids:** D8 or D-infinity flow routing
- **Resolution:** Multiple scales (3", 15", 30")
- **Format:** Shapefile, GeoPackage, GeoTIFF
- **License:** Free for non-commercial use with attribution
- **Turkey Region:** Download via HydroSHEDS regional tiles (Asia, Europe tiles)

#### Data Requirements for Turkey:
1. **HydroRIVERS Turkey subset:**
   - Strahler order attribute (`ORD_STRA`)
   - Upstream area attribute (`UPLAND_SKM`)
   - River length, width estimates
   - Basin ID linkage (`HYBAS_ID`)

2. **Flow Accumulation Grid:**
   - 15 arc-second resolution (~500m)
   - Coverage: Turkey bounding box (25.5°E-45°E, 35.8°N-42.1°N)
   - Format: GeoTIFF
   - Size estimate: ~100-200 MB

3. **Flow Direction Grid:**
   - Same resolution as accumulation
   - D8 format (8 directions encoded)

### 🛠️ Implementation Strategy

#### Phase 1: Data Acquisition
```bash
# Download from HydroSHEDS
# Region: Asia (as) and Europe (eu) tiles covering Turkey
wget https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_as_shp.zip
wget https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_eu_shp.zip
wget https://data.hydrosheds.org/file/hydrosheds-core/hydrosheds-v1-con/as_con_15s.zip
wget https://data.hydrosheds.org/file/hydrosheds-core/hydrosheds-v1-dir/as_dir_15s.zip
```

#### Phase 2: Processing Pipeline
```python
# pipeline/scripts/process/process_river_network.py

import geopandas as gpd
import rasterio
from shapely.geometry import Point

# 1. Clip HydroRIVERS to Turkey
rivers_gdf = gpd.read_file('HydroRIVERS_v10_as.shp')
turkey_bbox = (25.5, 35.8, 44.8, 42.1)
rivers_turkey = rivers_gdf.cx[25.5:44.8, 35.8:42.1]

# 2. Simplify for web (Douglas-Peucker)
rivers_turkey_simplified = rivers_turkey.simplify(0.001)  # ~100m tolerance

# 3. Create stream order layers (1-3, 4-6, 7-10 for styling)
rivers_low = rivers_turkey[rivers_turkey['ORD_STRA'] <= 3]
rivers_mid = rivers_turkey[(rivers_turkey['ORD_STRA'] >= 4) & (rivers_turkey['ORD_STRA'] <= 6)]
rivers_high = rivers_turkey[rivers_turkey['ORD_STRA'] >= 7]

# 4. Export as GeoJSON with properties
rivers_turkey.to_file('frontend/public/data/rivers_turkey.geojson', driver='GeoJSON')

# 5. Optional: Convert to vector tiles (tippecanoe)
# For better performance with large datasets
```

#### Phase 3: Frontend Visualization (MapLibre GL + deck.gl)

**MapLibre GL Layers (Lightweight):**
```typescript
// frontend/src/components/Map/RiverLayers.tsx

const riverLayerConfig = {
  'id': 'rivers',
  'type': 'line',
  'source': {
    'type': 'geojson',
    'data': `${BASE_URL}data/rivers_turkey.geojson`
  },
  'paint': {
    'line-color': [
      'interpolate',
      ['linear'],
      ['get', 'ORD_STRA'],
      1, '#cfe2f3',  // Small streams - light blue
      5, '#6fa8dc',  // Medium rivers - medium blue
      10, '#0066cc'  // Major rivers - dark blue
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, ['*', ['get', 'ORD_STRA'], 0.2],  // Thin at low zoom
      12, ['*', ['get', 'ORD_STRA'], 1.5]  // Thicker at high zoom
    ]
  }
};
```

**Deck.gl Layer (Advanced 3D):**
```typescript
import {GeoJsonLayer} from '@deck.gl/layers';

const riverLayer = new GeoJsonLayer({
  id: 'rivers-3d',
  data: riverData,
  getLineColor: f => STREAM_ORDER_COLORS[f.properties.ORD_STRA],
  getLineWidth: f => f.properties.ORD_STRA * 200,  // meters
  lineWidthUnits: 'meters',
  pickable: true,
  onHover: info => {
    if (info.object) {
      const props = info.object.properties;
      return {
        html: `
          <strong>${props.RIVER_NAME || 'River'}</strong><br/>
          Stream Order: ${props.ORD_STRA}<br/>
          Upstream Area: ${props.UPLAND_SKM} km²<br/>
          Length: ${props.LENGTH_KM} km
        `
      };
    }
  }
});
```

#### Phase 4: Upstream Catchment Tracing Tool

**Using Turf.js for Spatial Analysis:**
```typescript
// frontend/src/lib/upstream-tracer.ts

import * as turf from '@turf/turf';

export async function traceUpstreamCatchment(
  clickPoint: [number, number],
  riverNetwork: GeoJSON.FeatureCollection,
  basinBoundaries: GeoJSON.FeatureCollection
) {
  // 1. Find nearest river segment
  const point = turf.point(clickPoint);
  let nearestRiver = null;
  let minDist = Infinity;
  
  riverNetwork.features.forEach(river => {
    const dist = turf.pointToLineDistance(point, river);
    if (dist < minDist) {
      minDist = dist;
      nearestRiver = river;
    }
  });
  
  // 2. Get basin ID from river properties
  const basinId = nearestRiver.properties.HYBAS_ID;
  
  // 3. Find all upstream basins (recursive)
  const upstreamBasins = findUpstreamBasins(basinId, basinBoundaries);
  
  // 4. Merge basin geometries
  const catchmentArea = turf.union(...upstreamBasins.map(b => b.geometry));
  
  // 5. Calculate stats
  const upstreamArea = turf.area(catchmentArea) / 1e6;  // km²
  const provinces = findIntersectingProvinces(catchmentArea);
  const dams = findDamsInCatchment(catchmentArea);
  
  return {
    geometry: catchmentArea,
    area: upstreamArea,
    provinces,
    dams,
    riverName: nearestRiver.properties.RIVER_NAME
  };
}
```

### 📦 File Size Estimates
- **Rivers GeoJSON (simplified):** ~15-25 MB
- **Flow accumulation grid (Turkey):** ~100-150 MB (convert to COG for web delivery)
- **Vector tiles (optional):** ~50 MB total (better performance)

### ✅ Deliverables
1. Multi-scale river network layer (stream orders 1-10)
2. Upstream catchment boundary tool (click → highlight basin)
3. Drainage area calculator for any river point
4. Province/dam/land-cover aggregation for traced basins

---

## 2. Basin / Sub-basin Atlas (HydroBASINS)

### 🎯 Goal
Switch aggregation unit from administrative provinces to hydrological basins - the natural unit of water flow.

### 📊 Data Source: HydroBASINS

- **URL:** https://www.hydrosheds.org/products
- **Levels:**
  - **Level 6:** Large basins (~5,000-20,000 km²) - **Recommended for Turkey**
  - **Level 7:** Sub-basins (~2,000-10,000 km²)
  - **Level 8:** Micro-basins (~500-5,000 km²)
- **Format:** Shapefile, GeoPackage
- **Attributes:**
  - `HYBAS_ID`: Unique basin identifier
  - `NEXT_DOWN`: Downstream basin ID (for flow routing)
  - `MAIN_BAS`: Main basin ID (hierarchical grouping)
  - `SUB_AREA`: Basin area (km²)
  - `UP_AREA`: Upstream contributing area (km²)
  - `PFAF_ID`: Pfafstetter coding system

### 🛠️ Implementation

#### Data Processing
```python
# pipeline/scripts/process/process_basins.py

import geopandas as gpd

# Load HydroBASINS Level 6 for Turkey region
basins_l6 = gpd.read_file('hybas_as_lev06_v1c.shp')
basins_turkey = basins_l6.cx[25.5:44.8, 35.8:42.1]

# Join with Aqueduct data by basin ID
aqueduct_basins = gpd.read_file('aqueduct40_baseline.gpkg')
basins_with_risk = basins_turkey.merge(
    aqueduct_basins[['HYBAS_ID', 'bws_raw', 'bwd_raw', 'gtd_raw', ...]],
    on='HYBAS_ID',
    how='left'
)

# Save
basins_with_risk.to_file('frontend/public/data/basins_turkey_l6.geojson')
```

#### Frontend UI: Admin Unit Selector
```typescript
// Toggle between province and basin aggregation

<select value={adminUnit} onChange={e => setAdminUnit(e.target.value)}>
  <option value="province">Province (Administrative)</option>
  <option value="basin-l6">Basin Level 6 (Hydrological)</option>
  <option value="basin-l7">Basin Level 7 (Sub-basins)</option>
</select>

// Dynamically load different GeoJSON layers
const dataSource = adminUnit === 'province' 
  ? 'data/turkey_water_risk.geojson'
  : 'data/basins_turkey_l6.geojson';
```

### 📦 File Size
- **Level 6:** ~5-10 MB for Turkey region
- **Level 7:** ~15-25 MB
- **Level 8:** ~40-60 MB (may need vector tiles)

---

## 3. Surface Water Dynamics (JRC Global Surface Water)

### 🎯 Goal
Show temporal changes in water bodies (permanent vs. seasonal water, water loss/gain since 1980s).

### 📊 Data Source: JRC Global Surface Water

- **URL:** https://global-surface-water.appspot.com/
- **Provider:** European Commission Joint Research Centre
- **Resolution:** 30m (Landsat-based)
- **Temporal Coverage:** 1984-2021
- **Products:**
  1. **Water Occurrence:** 0-100% (how often water present)
  2. **Water Seasonality:** 0-12 months (permanent vs. seasonal)
  3. **Change Detection:** Permanent water gain/loss
  4. **Transitions:** Water → land, land → water
  5. **Maximum Water Extent:** Envelope of all water observations

### 🛠️ Implementation

#### Data Download
```bash
# Google Earth Engine (requires authentication)
# Or direct download tiles for Turkey from JRC server
# Tiles: 40N_030E, 40N_035E, 40N_040E, 40N_045E (Turkey coverage)

wget https://storage.googleapis.com/global-surface-water/downloads2021/occurrence/occurrence_40N_030E_v1_4.tif
# ... download all relevant tiles
```

#### Processing
```python
# Convert raster to vector polygons for web display
import rasterio
from rasterio import features
import geopandas as gpd

# Threshold occurrence > 50% for "persistent water"
with rasterio.open('occurrence_40N_030E.tif') as src:
    occurrence = src.read(1)
    water_mask = occurrence > 50
    
    # Vectorize
    shapes = features.shapes(water_mask.astype('uint8'), transform=src.transform)
    water_polygons = [
        {'geometry': geom, 'properties': {'occurrence': val}}
        for geom, val in shapes if val == 1
    ]

water_gdf = gpd.GeoDataFrame.from_features(water_polygons, crs=src.crs)
water_gdf = water_gdf.to_crs('EPSG:4326')

# Simplify for web
water_gdf['geometry'] = water_gdf.simplify(0.0005)
water_gdf.to_file('frontend/public/data/surface_water_occurrence.geojson')
```

#### Frontend Visualization
```typescript
// Time-slider UI for before/after comparison

<Slider
  value={year}
  min={1984}
  max={2021}
  onChange={(val) => setYear(val)}
  label={`Water Extent - ${year}`}
/>

// MapLibre layer with opacity based on occurrence
map.addLayer({
  id: 'surface-water',
  type: 'fill',
  source: 'water-occurrence',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'occurrence'],
      0, '#ffffcc',      // Rare water (yellow)
      50, '#41b6c4',     // Seasonal (cyan)
      100, '#225ea8'     // Permanent (dark blue)
    ],
    'fill-opacity': 0.6
  }
});
```

### 📦 File Size
- **Occurrence raster (Turkey):** ~500 MB-1 GB (raw)
- **Vectorized simplified:** ~50-100 MB
- **Cloud-optimized GeoTIFF (COG):** ~200-300 MB (better for web tiling)

---

## 4. Reservoirs & Regulation (Global Dam Watch / GRanD)

### 🎯 Goal
Show dam locations, reservoir capacities, and calculate regulation density (storage per basin area).

### 📊 Data Sources

#### Primary: Global Dam Watch (GDW)
- **URL:** https://www.globaldamwatch.org/database
- **Products:**
  - **GOODD:** Global Geo-referenced Database of Dams (~38,000 dams)
  - **GRanD:** Global Reservoir and Dam Database (~7,000 major dams)
  - **FHReD:** Future HydroReservoir Database
- **Attributes:**
  - Dam name, location
  - Storage capacity (million m³)
  - Dam height, year commissioned
  - River name, basin ID
  - Purpose (hydropower, irrigation, flood control)

#### Turkey-Specific: DSİ Database
- **URL:** https://www.dsi.gov.tr/
- **Data:** Turkish State Hydraulic Works maintains detailed dam registry
- **Attributes:** ~1,400 dams in Turkey with operational data

### 🛠️ Implementation

#### Data Processing
```python
# Combine GRanD + GOODD + DSİ data
import pandas as pd
import geopandas as gpd

# Load datasets
grand = pd.read_csv('GRanD_v1_3.csv')
goodd = pd.read_csv('GOODD_v1_1.csv')
dsi_dams = pd.read_csv('turkey_dsi_dams.csv')  # Manual scrape/request

# Filter for Turkey
dams_turkey = grand[grand['COUNTRY'] == 'Turkey']

# Merge and deduplicate
all_dams = pd.concat([
    dams_turkey[['DAM_NAME', 'LAT', 'LON', 'CAP_MCM', 'YEAR', 'RIVER']],
    dsi_dams[['name', 'latitude', 'longitude', 'capacity', 'year', 'river']]
], ignore_index=True)

# Convert to GeoDataFrame
dams_gdf = gpd.GeoDataFrame(
    all_dams,
    geometry=gpd.points_from_xy(all_dams.LON, all_dams.LAT),
    crs='EPSG:4326'
)

# Calculate regulation metrics per basin
basins_gdf = gpd.read_file('basins_turkey_l6.geojson')
basins_gdf['total_storage_mcm'] = 0
basins_gdf['dam_count'] = 0

for idx, basin in basins_gdf.iterrows():
    dams_in_basin = dams_gdf[dams_gdf.within(basin.geometry)]
    basins_gdf.at[idx, 'total_storage_mcm'] = dams_in_basin['CAP_MCM'].sum()
    basins_gdf.at[idx, 'dam_count'] = len(dams_in_basin)
    
# Regulation density = storage / basin area
basins_gdf['regulation_density'] = (
    basins_gdf['total_storage_mcm'] / basins_gdf['SUB_AREA']
)

basins_gdf.to_file('frontend/public/data/basins_with_regulation.geojson')
dams_gdf.to_file('frontend/public/data/turkey_dams.geojson')
```

#### Frontend Visualization
```typescript
// Deck.gl ScatterplotLayer for dams
import {ScatterplotLayer} from '@deck.gl/layers';

const damsLayer = new ScatterplotLayer({
  id: 'dams',
  data: damsData,
  getPosition: d => [d.LON, d.LAT],
  getRadius: d => Math.sqrt(d.CAP_MCM) * 100,  // Size by capacity
  getFillColor: [41, 128, 185],
  pickable: true,
  radiusScale: 10,
  radiusMinPixels: 3,
  radiusMaxPixels: 50,
  onHover: info => {
    if (info.object) {
      return {
        html: `
          <strong>${info.object.DAM_NAME}</strong><br/>
          Capacity: ${info.object.CAP_MCM} million m³<br/>
          Year: ${info.object.YEAR}<br/>
          River: ${info.object.RIVER}
        `
      };
    }
  }
});

// Choropleth layer for regulation density
map.addLayer({
  id: 'regulation-density',
  type: 'fill',
  source: 'basins',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'regulation_density'],
      0, '#f7fbff',      // Low regulation
      100, '#08519c'     // High regulation
    ]
  }
});
```

### 📦 File Size
- **Dams point data:** ~500 KB (Turkey only)
- **Basins with regulation metrics:** +2-3 MB to basin GeoJSON

---

## 5. Groundwater Depletion (GRACE Data)

### 🎯 Goal
Show groundwater storage anomalies and depletion trends using NASA GRACE satellite data.

### 📊 Data Source: GRACE/GRACE-FO

- **URL:** https://grace.jpl.nasa.gov/
- **Provider:** NASA JPL
- **Product:** Total Water Storage Anomaly (TWSA)
- **Resolution:** ~100-300 km (coarse grid)
- **Temporal:** Monthly from 2002-present
- **Format:** NetCDF, GeoTIFF
- **Access:** NASA EarthData portal or Google Earth Engine

### 🛠️ Implementation

#### Data Processing
```python
# Process GRACE mascon data for Turkey
import xarray as xr
import numpy as np

# Load GRACE mascons
grace_ds = xr.open_dataset('GRCTellus.JPL.200204_202312.GLO.RL06.1M.MSCNv03.nc')

# Extract Turkey region
turkey_bbox = (25.5, 35.8, 44.8, 42.1)
grace_turkey = grace_ds.sel(
    lon=slice(turkey_bbox[0], turkey_bbox[2]),
    lat=slice(turkey_bbox[1], turkey_bbox[3])
)

# Calculate trend (mm/year equivalent water thickness)
time_numeric = (grace_turkey.time - grace_turkey.time[0]).dt.days / 365.25
lwe_anomaly = grace_turkey['lwe_thickness']  # Liquid water equivalent

# Linear regression per pixel
from scipy.stats import linregress

trends = np.zeros((len(grace_turkey.lat), len(grace_turkey.lon)))
for i, lat in enumerate(grace_turkey.lat):
    for j, lon in enumerate(grace_turkey.lon):
        values = lwe_anomaly[:, i, j].values
        if not np.isnan(values).all():
            slope, _, _, _, _ = linregress(time_numeric, values)
            trends[i, j] = slope  # mm/year

# Convert to GeoTIFF
from rasterio import Affine
from rasterio.transform import from_bounds

transform = from_bounds(
    turkey_bbox[0], turkey_bbox[1], turkey_bbox[2], turkey_bbox[3],
    len(grace_turkey.lon), len(grace_turkey.lat)
)

with rasterio.open(
    'frontend/public/data/grace_groundwater_trend.tif',
    'w',
    driver='GTiff',
    height=trends.shape[0],
    width=trends.shape[1],
    count=1,
    dtype=trends.dtype,
    crs='EPSG:4326',
    transform=transform
) as dst:
    dst.write(trends, 1)
```

#### Aggregate to Provinces/Basins
```python
import rasterstats

provinces_gdf = gpd.read_file('turkey_provinces.geojson')

# Zonal statistics
provinces_gdf['grace_trend_mm_yr'] = rasterstats.zonal_stats(
    provinces_gdf,
    'grace_groundwater_trend.tif',
    stats=['mean']
)['mean']

# Classification
provinces_gdf['depletion_category'] = pd.cut(
    provinces_gdf['grace_trend_mm_yr'],
    bins=[-np.inf, -10, -5, 5, 10, np.inf],
    labels=['Severe Depletion', 'Moderate Depletion', 'Stable', 'Moderate Gain', 'Significant Gain']
)
```

#### Frontend Visualization
```typescript
// Heatmap layer for GRACE trends
map.addLayer({
  id: 'grace-heatmap',
  type: 'raster',
  source: {
    type: 'raster',
    url: `${BASE_URL}data/grace_groundwater_trend.tif`,
    tileSize: 256
  },
  paint: {
    'raster-opacity': 0.7,
    'raster-color': [
      'interpolate',
      ['linear'],
      ['raster-value'],
      -20, '#d73027',   // Severe depletion
      -10, '#fc8d59',
      0, '#ffffbf',     // Stable
      10, '#91cf60',
      20, '#1a9850'     // Recharge
    ]
  }
});
```

### 📦 File Size
- **Monthly GRACE data (Turkey):** ~50-100 MB (raw NetCDF)
- **Processed trend raster:** ~5-10 MB (GeoTIFF)
- **Province/basin aggregated values:** +50 KB to existing GeoJSON

---

## 6. Water Demand & Exposure Layers

### 🎯 Goal
Overlay population, irrigation, and industrial activity to identify high-stress + high-exposure hotspots.

### 📊 Data Sources

#### Population Density
- **WorldPop:** https://www.worldpop.org/
- **Resolution:** 100m gridded population
- **Coverage:** Turkey 2020

#### Irrigated Area
- **GMIA:** Global Map of Irrigation Areas
- **URL:** https://www.fao.org/aquastat/en/geospatial-information/global-maps-irrigated-areas/
- **Resolution:** 5 arc-minute (~10 km)

#### Cropland
- **ESA WorldCover:** https://esa-worldcover.org/
- **Resolution:** 10m land cover classification
- **Classes:** Cropland, irrigated cropland

#### Nightlights (Industrial Proxy)
- **VIIRS:** https://eogdata.mines.edu/products/vnl/
- **Product:** Annual composite nighttime lights
- **Resolution:** ~500m

### 🛠️ Implementation

```python
# Aggregate all demand proxies to provinces/basins

import rasterio
import rasterstats

provinces_gdf = gpd.read_file('turkey_provinces.geojson')

# Population density
provinces_gdf['population'] = rasterstats.zonal_stats(
    provinces_gdf, 'worldpop_turkey_2020.tif', stats=['sum']
)['sum']

# Irrigated area (km²)
provinces_gdf['irrigated_area_km2'] = rasterstats.zonal_stats(
    provinces_gdf, 'gmia_irrigated_area.tif', stats=['sum']
)['sum']

# Nightlights (industrial activity proxy)
provinces_gdf['nightlights_mean'] = rasterstats.zonal_stats(
    provinces_gdf, 'viirs_nightlights_2023.tif', stats=['mean']
)['mean']

# Calculate demand pressure index (0-100)
provinces_gdf['demand_index'] = (
    0.5 * normalize(provinces_gdf['population']) +
    0.3 * normalize(provinces_gdf['irrigated_area_km2']) +
    0.2 * normalize(provinces_gdf['nightlights_mean'])
) * 100

# Mismatch hotspots: high stress + high demand
provinces_gdf['priority_score'] = (
    provinces_gdf['combined_water_risk_score'] * 
    provinces_gdf['demand_index']
)

provinces_gdf.to_file('frontend/public/data/provinces_with_demand.geojson')
```

### 📦 File Size
- **Population raster (Turkey):** ~200-300 MB (can aggregate to vector)
- **Irrigated area:** ~10-20 MB
- **Nightlights:** ~50-100 MB
- **Final aggregated attributes:** +100 KB to GeoJSON

---

## 7. Transboundary Water Politics Layer

### 🎯 Goal
Highlight basins that cross international borders (Tigris, Euphrates, etc.) and show upstream/downstream relationships.

### 📊 Data Sources

#### Basin Boundaries
- **Transboundary Water Assessment Programme (TWAP):** http://twap-rivers.org/
- **FAO AQUASTAT:** https://www.fao.org/aquastat/en/databases/

#### Turkey's Transboundary Basins:
1. **Tigris-Euphrates:** Turkey (upstream), Syria, Iraq (downstream)
2. **Asi (Orontes):** Turkey, Syria, Lebanon
3. **Aras:** Turkey, Armenia, Azerbaijan, Iran
4. **Çoruh:** Turkey, Georgia
5. **Meriç (Maritsa):** Turkey, Bulgaria, Greece

### 🛠️ Implementation

```python
# Identify transboundary basins
basins_gdf = gpd.read_file('basins_turkey_l6.geojson')
country_borders = gpd.read_file('world_countries.geojson')

# Find basins intersecting multiple countries
for idx, basin in basins_gdf.iterrows():
    intersecting_countries = country_borders[
        country_borders.intersects(basin.geometry)
    ]['NAME'].tolist()
    
    basins_gdf.at[idx, 'countries'] = ', '.join(intersecting_countries)
    basins_gdf.at[idx, 'is_transboundary'] = len(intersecting_countries) > 1
    
    # Calculate share outside Turkey
    turkey_geom = country_borders[country_borders['NAME'] == 'Turkey'].iloc[0].geometry
    basin_in_turkey = basin.geometry.intersection(turkey_geom)
    turkey_share = basin_in_turkey.area / basin.geometry.area * 100
    basins_gdf.at[idx, 'turkey_share_pct'] = turkey_share

basins_gdf.to_file('frontend/public/data/basins_transboundary.geojson')
```

#### Frontend UI
```typescript
// Highlight transboundary basins
map.addLayer({
  id: 'transboundary-basins',
  type: 'line',
  source: 'basins',
  paint: {
    'line-color': [
      'case',
      ['get', 'is_transboundary'],
      '#e74c3c',  // Red border for transboundary
      '#3498db'   // Blue for domestic
    ],
    'line-width': 3,
    'line-dasharray': [2, 2]  // Dashed for transboundary
  }
});

// Click to show upstream/downstream countries
onClick: (info) => {
  const basin = info.object;
  if (basin.is_transboundary) {
    showModal({
      title: basin.MAIN_BAS_NAME,
      content: `
        <h3>Transboundary Basin</h3>
        <p>Countries: ${basin.countries}</p>
        <p>Turkey's share: ${basin.turkey_share_pct}%</p>
        <p>Upstream countries: ${basin.upstream_countries}</p>
        <p>Downstream countries: ${basin.downstream_countries}</p>
      `
    });
  }
}
```

### 📦 File Size
- **Transboundary basin attributes:** +50 KB to basin GeoJSON

---

## 8. "Flow Path to the Sea" Storytelling Tool

### 🎯 Goal
Interactive animation: click a point → trace downstream flow to sea, showing provinces/dams/rivers along the way.

### 🛠️ Implementation

```typescript
// frontend/src/lib/flow-tracer.ts

import * as turf from '@turf/turf';

export async function traceFlowPath(
  startPoint: [number, number],
  riverNetwork: GeoJSON.FeatureCollection,
  basins: GeoJSON.FeatureCollection,
  dams: GeoJSON.FeatureCollection
) {
  const path = [];
  let currentPoint = turf.point(startPoint);
  let currentBasin = findContainingBasin(currentPoint, basins);
  
  while (currentBasin && currentBasin.properties.NEXT_DOWN !== 0) {
    // Add current basin to path
    path.push({
      type: 'basin',
      geometry: currentBasin.geometry,
      name: currentBasin.properties.MAIN_BAS_NAME,
      area: currentBasin.properties.SUB_AREA
    });
    
    // Find downstream basin
    const nextBasinId = currentBasin.properties.NEXT_DOWN;
    currentBasin = basins.features.find(b => b.properties.HYBAS_ID === nextBasinId);
    
    // Check for dams along the way
    if (currentBasin) {
      const damsInBasin = dams.features.filter(d =>
        turf.booleanPointInPolygon(d, currentBasin)
      );
      damsInBasin.forEach(dam => {
        path.push({
          type: 'dam',
          geometry: dam.geometry,
          name: dam.properties.DAM_NAME,
          capacity: dam.properties.CAP_MCM
        });
      });
    }
  }
  
  // Find sea endpoint
  path.push({
    type: 'sea',
    name: determineSeaBasin(currentBasin),  // Black Sea, Mediterranean, etc.
    geometry: null
  });
  
  return path;
}

// Animate path on map
export function animateFlowPath(map, path) {
  const duration = 5000;  // 5 seconds
  const steps = path.length;
  const stepDuration = duration / steps;
  
  path.forEach((segment, index) => {
    setTimeout(() => {
      if (segment.type === 'basin') {
        map.addLayer({
          id: `flow-${index}`,
          type: 'fill',
          source: {type: 'geojson', data: segment.geometry},
          paint: {
            'fill-color': '#3498db',
            'fill-opacity': 0.5
          }
        });
      } else if (segment.type === 'dam') {
        // Pulse animation at dam location
        pulseMarker(map, segment.geometry.coordinates);
      }
      
      // Show info panel
      updateInfoPanel(segment);
    }, index * stepDuration);
  });
}
```

### 📦 File Size
- No additional data required (uses rivers + basins + dams)

---

## Technology Stack Summary

### Libraries Required

```json
{
  "dependencies": {
    "@deck.gl/core": "^9.0.0",
    "@deck.gl/layers": "^9.0.0",
    "@deck.gl/geo-layers": "^9.0.0",
    "@turf/turf": "^7.0.0",
    "maplibre-gl": "^5.0.0",
    "d3-scale": "^4.0.0",
    "d3-interpolate": "^3.0.0"
  }
}
```

### Data Processing Tools

```bash
# Python environment
pip install geopandas rasterio rasterstats xarray netCDF4 fiona shapely

# Optional: Vector tile generation
npm install -g @mapbox/tippecanoe

# Optional: COG conversion
pip install rio-cogeo
```

---

## Implementation Priority (ROI Order)

### Phase 1: Foundation (2-3 weeks)
1. ✅ **River network + stream order** (deck.gl LineLayer)
2. ✅ **HydroBASINS Level 6** (basin boundaries, admin toggle)

### Phase 2: Visual Impact (2 weeks)
3. ✅ **Surface water occurrence layer** (JRC data, time slider)
4. ✅ **Dams + regulation density** (ScatterplotLayer + choropleth)

### Phase 3: Advanced Analytics (2 weeks)
5. ✅ **Upstream catchment tracing tool** (Turf.js + HydroBASINS)
6. ✅ **GRACE groundwater depletion** (raster overlay)

### Phase 4: Policy Relevance (1 week)
7. ✅ **Demand pressure layers** (population, irrigation, nightlights)
8. ✅ **Transboundary water layer** (political context)

### Phase 5: Storytelling (1 week)
9. ✅ **Flow path animation** (interactive tracing to sea)

---

## File Size Budget (GitHub Pages Limit: ~1 GB)

| Dataset | Size | Format | Priority |
|---------|------|--------|----------|
| Turkey provinces (current) | 5 MB | GeoJSON | ✅ Existing |
| HydroRIVERS (simplified) | 20 MB | GeoJSON | HIGH |
| HydroBASINS L6 | 8 MB | GeoJSON | HIGH |
| HydroBASINS L7 | 25 MB | GeoJSON | MEDIUM |
| Surface water occurrence | 80 MB | Vector | MEDIUM |
| Dams (points) | 0.5 MB | GeoJSON | HIGH |
| GRACE trend raster | 10 MB | GeoTIFF | MEDIUM |
| Population density (aggregated) | 2 MB | GeoJSON | LOW |
| **TOTAL** | **~150 MB** | | **Well within budget** |

---

## Next Steps

### Immediate Actions (Week 1):
1. ✅ **Download HydroSHEDS data** for Turkey region
2. ✅ **Process river network** (clip, simplify, export GeoJSON)
3. ✅ **Download HydroBASINS Level 6**
4. ✅ **Test deck.gl integration** with existing MapLibre setup
5. ✅ **Create river layer component** with stream order styling

### Research Needed:
- [ ] Verify DSİ dam database access
- [ ] Check JRC Global Surface Water download speeds
- [ ] Test GRACE data processing pipeline
- [ ] Evaluate vector tile vs. GeoJSON performance for rivers

### Questions for User:
1. Which features are **must-have** vs. nice-to-have?
2. Preference: Simple GeoJSON or advanced vector tiles?
3. Should we prioritize Turkish language support for new UI elements?
4. Timeline expectations for first phase delivery?

---

**End of Plan Document**

_Last Updated: December 16, 2025_
