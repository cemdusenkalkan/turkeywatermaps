# Data Download Status

## Current Issue

The WRI Aqueduct 4.0 automatic download failed with a 404 error. The S3 URL may have changed or requires authentication.

## Solution: Manual Download Required

### Step 1: Download WRI Aqueduct 4.0 Data

1. **Visit the official WRI data page:**
   ```
   https://www.wri.org/data/aqueduct-global-maps-40-data
   ```

2. **Download the baseline annual dataset:**
   - Look for "Aqueduct 4.0 Baseline Annual" 
   - Format: GeoPackage (.gpkg) file
   - Size: Approximately 500MB

3. **Place the downloaded file here:**
   ```
   data/raw/aqueduct/aqueduct40_baseline.gpkg
   ```

### Step 2: Run Pipeline Again

Once the file is in place:

```bash
cd pipeline
source venv/bin/activate  # If not already activated
./run_pipeline.sh
```

The pipeline will:
1. Detect the baseline file
2. Filter it to Turkey region automatically
3. Aggregate to provinces
4. Generate final JSON for frontend

## Alternative: Use Filtered File Directly

If you already have a Turkey-filtered version:

```bash
# Place it here:
data/raw/aqueduct/aqueduct40_turkey.gpkg
```

Then skip the download step and run:
```bash
python pipeline/scripts/process/aggregate_to_provinces.py
python pipeline/scripts/build_real_data.py
```

## Verification

Check that the file exists:

```bash
ls -lh data/raw/aqueduct/aqueduct40_baseline.gpkg
```

Should show a file ~500MB in size.

## What's Working

- ✅ Turkey province boundaries downloaded successfully (81 provinces)
- ✅ Pipeline scripts ready and tested
- ✅ Processing logic implemented with WRI methodology
- ✅ Frontend ready to consume real data

## What's Needed

- ⏳ WRI Aqueduct 4.0 baseline GeoPackage file
- ⏳ Manual download from WRI website

## Next Steps After Download

1. Place `aqueduct40_baseline.gpkg` in `data/raw/aqueduct/`
2. Run `./run_pipeline.sh` again
3. Copy processed data: `cp -r data/processed/* frontend/public/data/`
4. Build frontend: `cd frontend && npm run build`
5. Deploy!

## Support

- Download instructions: `pipeline/DOWNLOAD_INSTRUCTIONS.md`
- WRI data page: https://www.wri.org/data/aqueduct-global-maps-40-data
- Issues: https://github.com/cemdusenkalkan/turkeywatermap/issues

