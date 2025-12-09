# Data Pipeline

Python-based data processing pipeline for TÃ¼rkiye Water Risk Map.

## Directory Structure

```
pipeline/
”œâ”€â”€ config/              # Configuration files (YAML)
”‚   â”œâ”€â”€ categories.yaml  # Risk category definitions, weights
”‚   â””â”€â”€ sources.yaml     # Data source URLs, access info
”œâ”€â”€ scripts/
”‚   â”œâ”€â”€ download/        # Data acquisition modules
”‚   â”œâ”€â”€ process/         # Scoring, normalization, spatial joins
”‚   â”œâ”€â”€ export/          # CSV, GeoJSON, PMTiles exporters
”‚   â”œâ”€â”€ synthetic_demo.py  # Generate demo data instantly
”‚   â””â”€â”€ build_artifacts.py # Main orchestrator (production mode)
””â”€â”€ requirements.txt
```

## Quick Start

### 1. Setup Environment

```bash
cd pipeline
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Generate Synthetic Demo Data

For immediate frontend testing without downloading external data:

```bash
python scripts/synthetic_demo.py
```

This creates plausible province-level scores in `../data/processed/`:
- `provinces.geojson` - Province boundaries with all scores
- `category_*.csv` - Individual category CSVs
- `index.json` - Manifest file

### 3. Production Mode (Real Data)

**Prerequisites:**
- Acquire Turkey province shapefiles (GADM or TÃÄ°K)
- Set up Copernicus CDS API credentials for ERA5-Land
- Manually download TÃÄ°K and DSÄ° data (no public APIs for some datasets)

**Steps:**
1. Update `config/sources.yaml` with local paths or API keys
2. Run individual download scripts:
   ```bash
   python scripts/download/era5_land.py
   python scripts/download/shapefiles.py
   # etc.
   ```
3. Run main build:
   ```bash
   python scripts/build_artifacts.py --mode=production
   ```

## Configuration

### Categories (`config/categories.yaml`)
Define:
- Category IDs, names, descriptions
- Weights for combined index
- Color schemes
- Uncertainty levels

### Data Sources (`config/sources.yaml`)
Specify:
- Download URLs
- Bounding boxes (for Turkey)
- Time periods
- File paths

## Modules

### Download (`scripts/download/`)
- `era5_land.py` - ECMWF reanalysis via CDS API
- `tuik_stats.py` - Turkish Statistical Institute scraper
- `dsi_data.py` - State Hydraulic Works processor
- `grace.py` - Groundwater storage anomalies
- `shapefiles.py` - Province boundaries

### Process (`scripts/process/`)
- `spatial_join.py` - Aggregate grid data to provinces
- `compute_categories.py` - Calculate risk scores per category
- `normalize.py` - Quantile-based 0-5 scaling
- `combined_index.py` - Weighted geometric mean

### Export (`scripts/export/`)
- `to_csv.py` - Tabular data export
- `to_geojson.py` - Spatial export with geometries
- `to_pmtiles.py` - Vector tiles (requires tippecanoe)

## Data Flow

```
Raw Data Sources
    †“
Download Modules †’ data/raw/
    †“
Process & Score †’ data/intermediate/
    †“
Normalize & Combine †’ data/processed/
    †“
Export (CSV, GeoJSON, PMTiles)
    †“
Frontend Consumes
```

## Adding New Categories

1. Define in `config/categories.yaml`:
   ```yaml
   - id: new_category
     name: New Category
     description: ...
     weight: 0.10
   ```

2. Implement scoring in `scripts/process/compute_categories.py`:
   ```python
   def compute_new_category(province_data):
       # Your calculation logic
       scores = ...
       return normalize_scores(scores)
   ```

3. Update `build_artifacts.py` to include new category

## Testing

Run unit tests (when implemented):
```bash
pytest
```

Manual validation:
```bash
python scripts/synthetic_demo.py
# Check outputs in data/processed/
```

## Performance

- **Synthetic mode:** <10 seconds
- **Production mode:** ~10-30 minutes (depends on downloads)
- **Caching:** Enabled by default (90-day TTL)

## Troubleshooting

### CDS API Issues
- Verify API key in `~/.cdsapirc`
- Check quota limits at CDS dashboard

### Memory Errors
- Reduce spatial resolution in config
- Process provinces in batches
- Increase swap space

### Missing Data
- Check `config/sources.yaml` paths
- Verify download success in `data/raw/`
- Review logs for HTTP errors

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.

Key areas for improvement:
- Add more data sources
- Improve spatial resolution (basin-level)
- Time-series functionality
- Automated data quality checks

---

**For questions:** Open an issue on GitHub

