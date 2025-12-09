#!/bin/bash
# Master script to download and process WRI Aqueduct data for Turkey Water Risk Map

set -e  # Exit on error

echo "======================================================================"
echo "Turkey Water Risk Map - Real Data Pipeline"
echo "Using WRI Aqueduct 4.0 data"
echo "======================================================================"
echo ""

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "ERROR: Virtual environment not activated!"
    echo "Please run: source venv/bin/activate"
    exit 1
fi

# Check Python dependencies
echo "[1/5] Checking dependencies..."
python -c "import geopandas, pandas, numpy, requests" 2>/dev/null || {
    echo "ERROR: Missing Python dependencies!"
    echo "Please run: pip install -r requirements.txt"
    exit 1
}
echo "  ✓ Dependencies OK"
echo ""

# Step 1: Download Turkey boundaries
echo "[2/5] Downloading Turkey province boundaries..."
python scripts/download/turkey_boundaries.py
echo ""

# Step 2: Download Aqueduct data
echo "[3/5] Downloading WRI Aqueduct 4.0 data..."
echo "  This may take a few minutes (large file ~500MB)..."
echo "  If automatic download fails, see DOWNLOAD_INSTRUCTIONS.md"
python scripts/download/aqueduct_data.py

# Check if download succeeded or file exists
if [ ! -f "../data/raw/aqueduct/aqueduct40_baseline.gpkg" ] && [ ! -f "../data/raw/aqueduct/aqueduct40_turkey.gpkg" ]; then
    echo ""
    echo "WARNING: Aqueduct data not found!"
    echo "Please download manually and place in: data/raw/aqueduct/"
    echo "See: DOWNLOAD_INSTRUCTIONS.md"
    echo ""
    echo "Continuing anyway (will fail at aggregation step if data missing)..."
fi
echo ""

# Step 3: Process Aqueduct CSV data
echo "[4/5] Processing Aqueduct CSV data and aggregating to provinces..."
python scripts/process/process_aqueduct_csv.py
echo ""

# Step 4: Build final JSON
echo "[5/5] Building final JSON for frontend..."
python scripts/build_real_data.py
echo ""

echo "======================================================================"
echo "PIPELINE COMPLETE!"
echo "======================================================================"
echo ""
echo "Output files in data/processed/:"
echo "  - index.json (manifest)"
echo "  - turkey_water_risk.json (main data file)"
echo "  - turkey_water_risk.geojson (GeoJSON with geometries)"
echo "  - turkey_water_risk_scores.csv (province scores)"
echo ""
echo "Next steps:"
echo "  1. Copy data to frontend: cp -r data/processed/* frontend/public/data/"
echo "  2. Build frontend: cd frontend && npm run build"
echo "  3. Deploy to GitHub Pages"
echo ""

