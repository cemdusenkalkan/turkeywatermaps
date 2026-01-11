#!/usr/bin/env python3
"""
Build PMTiles for Turkey Water Risk Map.
Uses tippecanoe to convert GeoJSON to vector tiles.
"""

import subprocess
from pathlib import Path
import shutil

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent.parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
V4_DIR = PROCESSED_DIR / "v4.0" / "TUR" / "adm2"
V4_DIR.mkdir(parents=True, exist_ok=True)

# Input Files
DISTRICTS_FILE = RAW_DIR / "boundaries" / "turkey_districts.geojson"

# Output Files
OUTPUT_PMTILES = V4_DIR / "turkey_districts.pmtiles"

def check_tippecanoe():
    """Check if tippecanoe is installed"""
    if shutil.which("tippecanoe") is None:
        print("Error: tippecanoe is not installed.")
        print("Please install it: brew install tippecanoe (macOS) or sudo apt install tippecanoe (Linux)")
        return False
    return True

def build_tiles():
    if not DISTRICTS_FILE.exists():
        print(f"Error: {DISTRICTS_FILE} not found. Run download scripts first.")
        return

    print(f"Building PMTiles from {DISTRICTS_FILE}...")
    
    # Tippecanoe command
    # -o: output file
    # -l: layer name
    # -zg: automatically choose max zoom
    # --drop-densest-as-needed: drop features if too many
    # --extend-zooms-if-still-dropping: extend zoom range if needed
    # --force: overwrite output
    
    cmd = [
        "tippecanoe",
        "-o", str(OUTPUT_PMTILES),
        "-l", "districts",
        "-zg",
        "--drop-densest-as-needed",
        "--extend-zooms-if-still-dropping",
        "--force",
        str(DISTRICTS_FILE)
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"Success! Created {OUTPUT_PMTILES}")
        print(f"Size: {OUTPUT_PMTILES.stat().st_size / 1024 / 1024:.2f} MB")
    except subprocess.CalledProcessError as e:
        print(f"Error running tippecanoe: {e}")

if __name__ == "__main__":
    if check_tippecanoe():
        build_tiles()
