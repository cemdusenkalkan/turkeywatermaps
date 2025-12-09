# Real Data Implementation - WRI Aqueduct 4.0

## Overview

The Türkiye Water Risk Map now uses **real data from WRI Aqueduct 4.0**, replacing all synthetic/placeholder data.

## What Changed

### Data Source
- **Before**: Synthetic random data
- **After**: WRI Aqueduct 4.0 global water risk indicators
  - Source: https://www.wri.org/data/aqueduct-global-maps-40-data
  - Model: PCR-GLOBWB 2 hydrological model
  - Coverage: Global sub-basin level (HydroBASINS level 6)

### Indicators (6 total)

1. **Baseline Water Stress** (`bws_raw`)
   - Definition: Total withdrawals / Available renewable supply
   - Source: PCR-GLOBWB 2 + FAO AQUASTAT
   - Weight: 25%

2. **Seasonal Variability** (`sev_raw`)
   - Definition: CV of monthly water supply
   - Source: PCR-GLOBWB 2
   - Weight: 25%

3. **Interannual Variability** (`iav_raw`)
   - Definition: CV of annual water supply (1960-2014)
   - Source: PCR-GLOBWB 2
   - Weight: 25%

4. **Groundwater Table Decline** (`gtd_raw`)
   - Definition: Linear trend in groundwater head (cm/year)
   - Source: PCR-GLOBWB 2
   - Weight: 12.5%

5. **Drought Risk** (`drr_raw`)
   - Definition: Number of drought months (SPI < -1.5, 1950-2014)
   - Source: CRU TS 4.03 precipitation
   - Weight: 6.25%

6. **Riverine Flood Risk** (`rfr_raw`)
   - Definition: % population exposed to 1-in-100 year floods
   - Source: GLOFRIS flood model
   - Weight: 6.25%

### Methodology

All methodologies follow WRI's official documentation:
- **Scoring**: WRI-defined thresholds for each indicator (0-5 scale)
- **Aggregation**: Weighted arithmetic mean (WRI standard)
- **Spatial**: Area-weighted averaging from sub-basins to provinces

## Pipeline Architecture

```
1. Download (scripts/download/)
   ├── turkey_boundaries.py     → GADM province boundaries
   └── aqueduct_data.py         → WRI Aqueduct 4.0 GeoPackage (~500MB)

2. Process (scripts/process/)
   └── aggregate_to_provinces.py → Area-weighted aggregation + scoring

3. Export (scripts/)
   └── build_real_data.py       → Single JSON for frontend

4. Output (data/processed/)
   ├── index.json                      # Manifest
   ├── turkey_water_risk.json          # Main data (GeoJSON)
   ├── turkey_water_risk.geojson       # Backup format
   └── turkey_water_risk_scores.csv    # Tabular format
```

## Running the Pipeline

### Prerequisites
```bash
cd pipeline
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Execute
```bash
./run_pipeline.sh
```

This will:
1. Download Turkey province boundaries from GADM (~2MB)
2. Download WRI Aqueduct 4.0 baseline data (~500MB) 
3. Filter to Turkey bounding box
4. Aggregate sub-basins to 81 provinces
5. Apply WRI scoring thresholds
6. Calculate combined index
7. Export to JSON/GeoJSON/CSV

**Time**: 10-30 minutes (depends on download speed)

**Output**: `data/processed/` directory with all files

### Deploy to Frontend
```bash
# Copy data
cp -r data/processed/* frontend/public/data/

# Build frontend
cd frontend
npm install
npm run build

# Output in frontend/dist/
```

## Data Format

### Main JSON Structure (`turkey_water_risk.json`)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "properties": {
        "province_id": "TUR.1_1",
        "name": "Adana",
        "name_tr": "Adana",
        
        "baseline_stress_score": 3.2,
        "seasonal_variability_score": 2.1,
        "interannual_variability_score": 1.8,
        "groundwater_stress_score": 4.5,
        "drought_hazard_score": 2.7,
        "flood_hazard_score": 1.2,
        
        "combined_score": 2.8,
        
        "bws_raw": 0.65,
        "sev_raw": 0.82,
        ...
      }
    },
    ...
  ]
}
```

### Manifest (`index.json`)

Contains metadata:
- Category definitions with weights
- Data source information
- Statistical summaries (min/max/mean)
- Citations and licenses

## Frontend Integration

### Updated Data Loader

`frontend/src/lib/data-loader.ts` now loads the single JSON file:

```typescript
export async function loadProvincesGeoJSON(): Promise<ProvincesGeoJSON> {
  const response = await fetch(`${DATA_PATH}turkey_water_risk.json`)
  return response.json()
}
```

### Map Rendering

MapLibre GL JS reads the GeoJSON directly:

```typescript
map.addSource('provinces', {
  type: 'geojson',
  data: geoJsonData
})
```

### Category Mapping

Frontend maps WRI indicator IDs to display names:

| WRI Code | Frontend ID | Display Name |
|----------|-------------|--------------|
| `bws_raw` | `baseline_stress` | Baseline Water Stress |
| `sev_raw` | `seasonal_variability` | Seasonal Variability |
| `iav_raw` | `interannual_variability` | Interannual Variability |
| `gtd_raw` | `groundwater_stress` | Groundwater Table Decline |
| `drr_raw` | `drought_hazard` | Drought Risk |
| `rfr_raw` | `flood_hazard` | Riverine Flood Risk |

## Scoring Methodology

### WRI Thresholds (from Aqueduct Technical Note)

**Baseline Water Stress**:
- 0-0.1: Low (score 0)
- 0.1-0.2: Low-Medium (score 1)
- 0.2-0.4: Medium-High (score 2)
- 0.4-0.8: High (score 3)
- 0.8-1.0: Extremely High (score 4)
- >1.0: Extremely High (score 5)

**Seasonal Variability** (CV):
- 0-0.33: Low (score 0)
- 0.33-0.66: Low-Medium (score 1)
- 0.66-1.0: Medium-High (score 2)
- 1.0-1.33: High (score 3)
- 1.33-1.66: Extremely High (score 4)
- >1.66: Extremely High (score 5)

Similar thresholds for other indicators (see `pipeline/scripts/process/aggregate_to_provinces.py`)

### Combined Index Formula

```python
weights = {
    'baseline_stress_score': 0.25,
    'seasonal_variability_score': 0.25,
    'interannual_variability_score': 0.25,
    'groundwater_stress_score': 0.125,
    'drought_hazard_score': 0.0625,
    'flood_hazard_score': 0.0625
}

combined_score = sum(score[i] * weight[i]) / sum(weights)
```

## Validation

### Expected Results for Turkey

Based on WRI Aqueduct global maps, expected patterns:

- **High Water Stress**: Central Anatolia (Konya, Ankara), Southeastern (Şanlıurfa, Mardin)
- **Low Water Stress**: Black Sea coast (Rize, Artvin), Northwestern (Kocaeli)
- **High Drought Risk**: Southeastern provinces
- **High Groundwater Decline**: Konya Plain, Şanlıurfa Plain

### Cross-Checks

1. Compare combined scores with WRI's web tool: https://www.wri.org/applications/aqueduct/water-risk-atlas/
2. Validate against DSİ basin reports
3. Check Konya Plain (known groundwater depletion hotspot)
4. Verify Black Sea coast (water-abundant region)

## Data Provenance

### WRI Aqueduct 4.0 Lineage

```
Climate Forcing Data (ERA-Interim, CRU)
    ↓
PCR-GLOBWB 2 Hydrological Model (Utrecht University)
    ↓
Sub-basin Aggregation (HydroBASINS level 6)
    ↓
WRI Aqueduct 4.0 GeoPackage
    ↓
Our Pipeline (area-weighted to provinces)
    ↓
Turkey Water Risk Map
```

### Citations

**Primary**:
```
Hofste, R.W., Kuzma, S., Walker, S., et al. (2019). Aqueduct 4.0: 
Updated Decision-Relevant Global Water Risk Indicators. 
Technical Note. Washington, DC: World Resources Institute.
```

**Hydrological Model**:
```
Sutanudjaja, E.H., van Beek, R., Wanders, N., et al. (2018). 
PCR-GLOBWB 2: a 5 arcmin global hydrological and water resources model. 
Geoscientific Model Development, 11(6), 2429-2453.
```

## Licensing

- **WRI Aqueduct Data**: CC BY 4.0
- **Our Code**: MIT
- **Combined Product**: CC BY 4.0 (data attribution required)

## Limitations

1. **Spatial Resolution**: Sub-basin to province aggregation loses fine-scale detail
2. **Temporal**: Baseline period varies by indicator (1960-2019)
3. **Model-Based**: PCR-GLOBWB 2 is a global model, not calibrated for Turkey specifically
4. **Coverage**: Some indicators (e.g., coastal flood risk) have limited coverage inland

## Future Enhancements

- [ ] Time-series data (Aqueduct future projections for 2030, 2050, 2080)
- [ ] Basin-level resolution (25 major Turkish basins)
- [ ] Additional indicators (water quality, ecosystem health)
- [ ] Validation with Turkish ground-truth data
- [ ] Uncertainty quantification

## Support

For issues or questions:
- GitHub Issues: https://github.com/cemdusenkalkan/turkeywatermap/issues
- WRI Aqueduct FAQ: https://www.wri.org/initiatives/aqueduct/frequently-asked-questions

---

**Last Updated**: January 2025  
**Implementation Status**: COMPLETE - Production Ready

