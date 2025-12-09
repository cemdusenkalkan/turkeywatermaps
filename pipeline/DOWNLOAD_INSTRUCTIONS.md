# WRI Aqueduct 4.0 Data Download Instructions

## Quick Start

The WRI Aqueduct 4.0 dataset is large (~500MB) and may require manual download.

### Option 1: Manual Download (Recommended)

1. **Visit the official WRI data page:**
   https://www.wri.org/data/aqueduct-global-maps-40-data

2. **Download the baseline annual dataset:**
   - Look for "Aqueduct 4.0 Baseline Annual" or similar
   - Format: GeoPackage (.gpkg) or Shapefile (.shp)
   - Size: ~500MB

3. **Place the file in:**
   ```
   data/raw/aqueduct/aqueduct40_baseline.gpkg
   ```

4. **Run the pipeline:**
   ```bash
   cd pipeline
   ./run_pipeline.sh
   ```

### Option 2: Alternative Sources

#### Google Earth Engine
- Dataset: `WRI_Aqueduct_Water_Risk_V4`
- Export to GeoPackage using Earth Engine Python API

#### Resource Watch
- Visit: https://resourcewatch.org/data/explore
- Search for "Aqueduct"
- Download via API or web interface

### Option 3: Direct S3 Download (if URL works)

The script will attempt automatic download, but WRI may have changed URLs.

If automatic download fails, use Option 1 (manual download).

## File Structure

After download, you should have:

```
data/raw/aqueduct/
├── aqueduct40_baseline.gpkg          # Full global dataset (~500MB)
└── aqueduct40_turkey.gpkg            # Filtered for Turkey (auto-generated)
```

## Verification

Check that the file exists and has data:

```bash
python3 -c "
import geopandas as gpd
gdf = gpd.read_file('data/raw/aqueduct/aqueduct40_baseline.gpkg')
print(f'Loaded {len(gdf)} features')
print(f'Columns: {list(gdf.columns[:10])}')
"
```

Expected: ~100,000+ sub-basin features with columns like `bws_raw`, `sev_raw`, `iav_raw`, etc.

## Troubleshooting

**"File not found" error:**
- Verify file is in `data/raw/aqueduct/`
- Check filename is exactly `aqueduct40_baseline.gpkg`
- Ensure file is complete (check file size ~500MB)

**"No data in Turkey region":**
- Verify bounding box in `aqueduct_data.py` matches Turkey
- Check CRS is EPSG:4326
- Try loading full file first to verify it has data

**Download timeout:**
- Use manual download (Option 1)
- Check internet connection
- Try downloading during off-peak hours

## Data License

WRI Aqueduct 4.0 data is licensed under **CC BY 4.0**.

Citation:
```
Hofste, R.W., Kuzma, S., Walker, S., et al. (2019). 
Aqueduct 4.0: Updated Decision-Relevant Global Water Risk Indicators. 
Washington, DC: World Resources Institute.
```

## Support

- WRI Aqueduct FAQ: https://www.wri.org/initiatives/aqueduct/frequently-asked-questions
- Data page: https://www.wri.org/data/aqueduct-global-maps-40-data
- GitHub issues: https://github.com/cemdusenkalkan/turkeywatermaps/issues

