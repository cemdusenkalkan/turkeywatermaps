#!/bin/bash
# Quick download script for HydroRIVERS - uses curl which is more reliable than requests
set -e

echo "============================================================"
echo "Quick HydroRIVERS Download for Turkey"
echo "============================================================"

# Create directory
mkdir -p /Users/cem/turkeywatermap/data/raw/hydrosheds

cd /Users/cem/turkeywatermap/data/raw/hydrosheds

# Download Asia region (covers most of Turkey)
if [ ! -f "HydroRIVERS_v10_as.zip" ]; then
    echo "Downloading Asia region..."
    curl -L -o HydroRIVERS_v10_as.zip \
        "https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_as_shp.zip"
    echo "✓ Downloaded Asia region"
else
    echo "✓ Asia region already downloaded"
fi

# Download Europe region (covers western Turkey)
if [ ! -f "HydroRIVERS_v10_eu.zip" ]; then
    echo "Downloading Europe region..."
    curl -L -o HydroRIVERS_v10_eu.zip \
        "https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_eu_shp.zip"
    echo "✓ Downloaded Europe region"
else
    echo "✓ Europe region already downloaded"
fi

echo ""
echo "============================================================"
echo "✓ Download complete!"
echo "============================================================"
echo "Next: Run Python script to process the data"
echo "  python3 pipeline/scripts/download/download_hydrorivers.py"
