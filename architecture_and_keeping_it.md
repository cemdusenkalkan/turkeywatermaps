# Turkey Water Risk Map - Architecture & Implementation Guide

## Project Overview

Open-source water risk assessment platform for Turkey using WRI Aqueduct 4.0 data.

**Live Demo:** https://cemdusenkalkan.github.io/turkeywatermaps

---

## Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Map Rendering:** MapLibre GL JS 4.x (GPU-accelerated WebGL)
- **Vector Tiles:** PMTiles 3.x (efficient client-side tile delivery)
- **Data Query:** DuckDB WASM (client-side Parquet querying)
- **Styling:** Tailwind CSS 3.x
- **Animation:** Framer Motion
- **Internationalization:** react-i18next (EN/TR support)
- **Build Tool:** Vite 6.x

### Backend/Pipeline
- **Language:** Python 3.10+
- **GIS Processing:** GeoPandas, Shapely, PyGEOS
- **Data Formats:** Parquet (Apache Arrow), GeoJSON, GeoPackage
- **Coordinate Systems:** WGS84 (EPSG:4326)

### Data Sources
- **Water Risk:** WRI Aqueduct 4.0 (PCR-GLOBWB 2 model, Utrecht University)
- **Weather:** Open-Meteo API (NOAA, DWD, Met Office aggregated data)
- **Boundaries:** Turkish administrative boundaries (provinces, districts)
- **Hydrology:** HydroSHEDS (optional enhancement)

---

## Architecture & File Structure

```
turkeywatermap/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/            # Map components
│   │   │   │   ├── MapShell.tsx           # Main map container
│   │   │   │   ├── LayerPanel.tsx         # Category selector sidebar
│   │   │   │   └── ZoomHint.tsx           # District zoom notification
│   │   │   ├── ProvinceModal.tsx          # Risk & weather detail modal
│   │   │   ├── WeatherCard.tsx            # Weather display
│   │   │   ├── LanguageSelector.tsx       # EN/TR switcher
│   │   │   └── ui/                        # Reusable UI components
│   │   ├── pages/
│   │   │   ├── MapPage.tsx                # Main interactive map page
│   │   │   ├── HomePage.tsx               # Landing page
│   │   │   ├── CategoriesPage.tsx         # Risk categories overview
│   │   │   └── MethodologyPage.tsx        # Methodology documentation
│   │   ├── lib/
│   │   │   ├── data-loader.ts             # DuckDB WASM data loading
│   │   │   ├── weather-service.ts         # Open-Meteo API integration
│   │   │   ├── risk-utils.ts              # Risk calculation utilities
│   │   │   └── constants.ts               # App-wide constants
│   │   ├── locales/
│   │   │   ├── en.json                    # English translations (335 keys)
│   │   │   └── tr.json                    # Turkish translations (335 keys)
│   │   ├── contexts/
│   │   │   ├── LanguageContext.tsx        # i18n context provider
│   │   │   └── ThemeContext.tsx           # Dark/light mode
│   │   └── types/
│   │       └── index.ts                   # TypeScript interfaces
│   ├── public/
│   │   └── data/
│   │       ├── index.json                 # Data manifest
│   │       ├── provinces-coordinates.json # Province centroids
│   │       ├── turkey_water_risk.json     # Province risk data
│   │       ├── turkey_water_risk_scores.csv
│   │       └── v4.0/                      # District Parquet files
│   │           └── TUR/
│   │               └── combined_scores.parquet
│   └── scripts/
│       ├── fetch-weather.js               # Weather data fetcher
│       └── validate-translations.js       # Translation validator
│
├── pipeline/                    # Data processing pipeline
│   ├── scripts/
│   │   ├── download/           # WRI Aqueduct data downloaders
│   │   ├── process/            # GIS processing & aggregation
│   │   └── export/             # Export to web formats
│   ├── config/
│   │   ├── categories_wri.yaml # WRI indicator definitions
│   │   └── sources.yaml        # Data source configurations
│   └── requirements.txt        # Python dependencies
│
├── data/
│   ├── raw/                    # Original downloaded data
│   │   ├── aqueduct/          # WRI Aqueduct 4.0 datasets
│   │   └── boundaries/        # Turkish boundaries
│   └── processed/             # Processed output data
│       └── v4.0/              # District-level Parquet files
│
└── docs/                       # Documentation (legacy - see this file)

```

---

## Data Flow & Architecture

### 1. Data Processing Pipeline (Python)

```
Raw WRI Data → GIS Processing → Area-Weighted Aggregation → Export to Web Formats
     ↓              ↓                      ↓                         ↓
   .gpkg         GeoPandas          Province/District           .parquet
   .csv          Shapely            Centroids                   .json
                 PyGEOS             Boundaries                  .geojson
```

**Key Steps:**
1. Download WRI Aqueduct 4.0 data (GeoPackage + CSV)
2. Load Turkish administrative boundaries
3. Spatial join sub-basin data with provinces/districts
4. Calculate area-weighted averages
5. Compute combined risk scores (WRI methodology)
6. Export to Parquet (DuckDB) and JSON

### 2. Frontend Data Loading

```
User Loads Map → DuckDB WASM Loads Parquet → Query District Data → Render on Map
                       ↓                              ↓
                 In-Memory DB                   Filter by Category
                 SQL Queries                    Dynamic Coloring
```

**Key Components:**
- `data-loader.ts`: Initializes DuckDB WASM, loads Parquet files
- `MapShell.tsx`: Manages map state, layers, interactions
- PMTiles: Vector tiles for province/district boundaries
- MapLibre: Renders styled vector tiles with data-driven colors

### 3. Caching Strategy

**Weather API Caching (10-minute TTL):**
```typescript
const weatherCache = new Map<string, CacheEntry<T>>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Cache keys include location + language
cache_key = `weather_${location}_${language}`
```

**Rate Limiting:**
- 10 requests per 60 seconds per user
- Prevents API abuse on Open-Meteo
- Combined with caching for efficiency

**LocalStorage Caching:**
- Full weather data cached for 1 hour
- Reduces repeated fetches for same province

---

## Component Architecture

### Map Components

**MapShell.tsx** (Main Map Container)
- Manages MapLibre GL instance
- Loads PMTiles vector tiles
- Handles province/district click events
- Updates colors based on selected risk category
- Emits events to parent (MapPage)

**LayerPanel.tsx** (Category Selector)
- Displays 13 WRI risk indicators
- Category selection triggers map re-coloring
- Shows indicator metadata (name, description, weight)

**ZoomHint.tsx** (District Notification)
- Shows when zoomed out (< zoom level 7)
- Notifies user to zoom in for district data
- Auto-dismisses after 8 seconds

### Modal Components

**ProvinceModal.tsx** (Detail View)
- Reusable for provinces AND districts
- Two tabs: Risk + Weather
- Risk Tab:
  - Combined risk score
  - All 13 indicator scores
  - Risk level labels (Low → Extremely High)
  - Percentile ranking (provinces only)
- Weather Tab:
  - Current conditions
  - 7-day forecast
  - Open-Meteo attribution

**WeatherCard.tsx** (Weather Display)
- Shows current temperature, humidity, wind
- 7-day forecast with icons
- Supports both province names and coordinates
- Uses weather-service.ts for API calls

### Data Loading

**data-loader.ts**
```typescript
// Initialize DuckDB WASM
const db = await DuckDB.create()

// Load Parquet file
await db.registerFileURL('districts', parquetUrl)

// Query data
const result = await db.query(`
  SELECT * FROM districts 
  WHERE province_id = '${provinceId}'
`)
```

**weather-service.ts**
```typescript
// Get weather with caching
export async function getCurrentConditions(
  provinceName: string,
  language: 'en' | 'tr'
): Promise<CurrentWeather | null>

// Get weather by coordinates (for districts)
export async function getCurrentConditionsByCoords(
  lat: number,
  lon: number,
  language: 'en' | 'tr'
): Promise<CurrentWeather | null>
```

---

## Translation System

### Implementation
- **Library:** react-i18next
- **Context:** LanguageContext provides `t()` function
- **Hook:** `useLanguage()` for accessing translations
- **Files:** `en.json` and `tr.json` (335 keys each)

### Translation Structure
```json
{
  "nav": { "home": "...", "map": "..." },
  "map": {
    "layerPanel": { "hint": "..." },
    "zoomHint": {
      "title": "Zoom In to See Districts",
      "message": "Zoom in on the map..."
    }
  },
  "categories": {
    "baseline_stress": {
      "name": "...",
      "short": "...",
      "desc": "..."
    }
  },
  "modal": { ... },
  "weather": { ... },
  "common": { ... }
}
```

### Validation
```bash
npm run validate-translations
```

**Output:**
```
✅ All translations are in sync!
   Total keys: 335
```

---

## Risk Calculation Methodology

### WRI Aqueduct 4.0 Indicators

**Physical Risk (8 indicators):**
1. Baseline Water Stress (bws) - 25% weight
2. Baseline Water Depletion (bwd) - 20% weight
3. Groundwater Decline (gtd) - 13% weight
4. Interannual Variability (iav) - 13% weight
5. Seasonal Variability (sev) - 13% weight
6. Drought Risk (drr) - 13% weight
7. Riverine Flood Risk (rfr) - 4% weight
8. Coastal Flood Risk (cfr) - 4% weight

**Quality (2 indicators):**
9. Untreated Wastewater (utw)
10. Coastal Eutrophication (cep)

**Access (3 indicators):**
11. Unimproved Drinking Water (udw)
12. Unimproved Sanitation (usa)
13. RepRisk Index (rri)

### Combined Risk Score

**Formula:**
```
combined_score = Σ(indicator_score × weight) / Σ(weights)
```

**Implementation:**
```typescript
function calculateCombinedScore(indicators: Indicator[]): number {
  const validIndicators = indicators.filter(
    ind => ind.score > -9999 && ind.score > 0
  )
  
  const sum = validIndicators.reduce(
    (acc, ind) => acc + ind.score, 0
  )
  
  return sum / validIndicators.length
}
```

**Note:** -9999 used as sentinel value for missing data

### Risk Levels

| Score Range | Label |
|------------|-------|
| 0.0 - 0.5 | Low |
| 0.5 - 1.0 | Low-Medium |
| 1.0 - 2.0 | Medium-High |
| 2.0 - 3.0 | High |
| 3.0 - 5.0 | Extremely High |

---

## Performance Optimizations

### 1. Vector Tiles (PMTiles)
- Single-file tile archive
- HTTP range requests for on-demand loading
- No tile server required
- Efficient binary format

### 2. Client-Side Data Processing
- DuckDB WASM for SQL queries on Parquet files
- Columnar format for fast filtering
- In-memory processing (no server round trips)

### 3. Caching Layers
- Weather API: 10-minute TTL (Map-based cache)
- LocalStorage: 1-hour TTL for full data
- Browser: Standard HTTP caching

### 4. Lazy Loading
- Code splitting by route
- Dynamic imports for heavy components
- Vite chunk optimization

### 5. GPU Acceleration
- MapLibre GL uses WebGL for rendering
- Hardware-accelerated vector graphics
- Smooth 60fps animations

---

## Development Workflow

### Setup
```bash
# Clone repository
git clone https://github.com/cemdusenkalkan/turkeywatermaps.git
cd turkeywatermap

# Frontend setup
cd frontend
npm install
npm run dev

# Pipeline setup
cd ../pipeline
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Common Tasks

**Run development server:**
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

**Validate translations:**
```bash
npm run validate-translations
```

**Build for production:**
```bash
npm run build
# Output: frontend/dist/
```

**Process new data:**
```bash
cd pipeline
python scripts/process/build_real_data.py
```

**Deploy to GitHub Pages:**
```bash
npm run deploy
```

---

## Key Files Reference

### Configuration Files

**frontend/vite.config.ts**
- Base path for GitHub Pages
- Build optimization
- Plugin configuration

**frontend/tailwind.config.js**
- Design system colors
- Custom utilities
- Dark mode settings

**frontend/tsconfig.json**
- TypeScript compiler options
- Path aliases
- Type checking rules

**pipeline/config/categories_wri.yaml**
- WRI indicator definitions
- Category groupings
- Weights and metadata

### Data Files

**public/data/index.json**
- Data manifest
- File locations
- Version information

**public/data/v4.0/TUR/combined_scores.parquet**
- District-level risk scores
- All 13 indicators
- Columnar Parquet format
- Queried by DuckDB WASM

**public/data/provinces-coordinates.json**
- Province centroids (lat/lon)
- Used for weather API calls
- Province name mapping

---

## API Integration

### Open-Meteo Weather API

**Endpoint:**
```
https://api.open-meteo.com/v1/forecast
```

**Parameters:**
```typescript
{
  latitude: number,
  longitude: number,
  current: 'temperature_2m,relative_humidity_2m,apparent_temperature,...',
  daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,...',
  timezone: 'auto',
  forecast_days: 7
}
```

**Rate Limiting:**
- 10 requests per 60 seconds
- 10-minute cache TTL
- Combined approach prevents abuse

**Attribution:**
- Required by CC BY 4.0 license
- Displayed in weather card footer
- Links to Open-Meteo.com

---

## Testing & Validation

### Translation Validation
```bash
npm run validate-translations
```
- Checks EN/TR key parity
- Reports missing translations
- Exits with error if mismatch

### Type Checking
```bash
npm run build
# Runs tsc before build
# Catches type errors
```

### Build Validation
```bash
npm run build
npm run preview
# Preview production build locally
```

---

## Deployment

### GitHub Pages
```bash
npm run deploy
```

**Process:**
1. Builds production bundle
2. Creates `dist/` directory
3. Pushes to `gh-pages` branch
4. GitHub serves from branch

**Custom Domain:**
- Add `CNAME` file to `public/`
- Configure DNS with GitHub IPs
- Enable HTTPS in repo settings

---

## Troubleshooting

### Common Issues

**Translation keys showing instead of text:**
- Check keys exist in both `en.json` and `tr.json`
- Run `npm run validate-translations`
- Verify component uses `useLanguage()` hook, not `useTranslation()`

**District colors not updating:**
- Check zoom level (districts appear at zoom > 7)
- Verify Parquet file loaded in `data-loader.ts`
- Check DuckDB query returns data

**Weather not loading:**
- Check rate limit (10 req/min)
- Verify cache not returning stale data
- Check Open-Meteo API status
- Verify coordinates in `provinces-coordinates.json`

**Build errors:**
- Clear `node_modules/` and reinstall
- Check TypeScript errors with `tsc --noEmit`
- Verify all imports resolve correctly

---

## License & Attribution

**Code:** Apache 2.0 License  
**Data:** WRI Aqueduct 4.0 (Creative Commons Attribution 4.0)  
**Weather:** Open-Meteo (CC BY 4.0)

**Required Attribution:**
- WRI Aqueduct 4.0: https://www.wri.org/aqueduct
- Open-Meteo: https://open-meteo.com
- PCR-GLOBWB 2: Utrecht University

---

## Contact & Contributing

**Repository:** https://github.com/cemdusenkalkan/turkeywatermaps  
**Issues:** https://github.com/cemdusenkalkan/turkeywatermaps/issues  
**Live Demo:** https://cemdusenkalkan.github.io/turkeywatermaps

Community contributions welcome. Please open issues for bugs or feature requests.

---

**Last Updated:** January 2025  
**Version:** 4.0 (WRI Aqueduct 4.0 based)
