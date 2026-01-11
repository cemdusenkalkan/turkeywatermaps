# Process Scripts

## `build_database.py`
Aggregates WRI Aqueduct 4.0 data to District (Admin Level 2) level and saves it as a Parquet file for DuckDB.
- Input: `data/raw/boundaries/turkey_districts.geojson`, `data/raw/aqueduct/aqueduct40_baseline.gpkg`
- Output: `data/processed/v4.0/TUR/adm2/water_risk.parquet`

## `build_tiles.py`
Converts District GeoJSON to PMTiles using `tippecanoe`.
- Input: `data/raw/boundaries/turkey_districts.geojson`
- Output: `data/processed/v4.0/TUR/adm2/turkey_districts.pmtiles`

## Usage
Run these scripts after downloading the raw data.
```bash
python pipeline/scripts/process/build_database.py
python pipeline/scripts/process/build_tiles.py
```
