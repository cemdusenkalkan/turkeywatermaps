#!/usr/bin/env python3
"""
Download Turkey administrative boundaries from GADM
"""

import requests
from pathlib import Path
import geopandas as gpd

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent.parent.parent / "data" / "raw" / "boundaries"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# GADM Turkey data (administrative level 1 = provinces)
GADM_TURKEY_URL = "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_TUR_1.json"


def download_turkey_provinces():
    """Download Turkey province boundaries from GADM"""
    print("Downloading Turkey province boundaries from GADM...")
    
    output_file = DATA_DIR / "turkey_provinces.geojson"
    
    if output_file.exists():
        print(f"  File already exists: {output_file}")
        return output_file
    
    try:
        response = requests.get(GADM_TURKEY_URL)
        response.raise_for_status()
        
        with open(output_file, 'wb') as f:
            f.write(response.content)
        
        print(f"  Downloaded: {output_file}")
        
        # Load and verify
        gdf = gpd.read_file(output_file)
        print(f"  Loaded {len(gdf)} provinces")
        print(f"  CRS: {gdf.crs}")
        
        # Ensure WGS84
        if gdf.crs.to_string() != 'EPSG:4326':
            gdf = gdf.to_crs('EPSG:4326')
            gdf.to_file(output_file, driver="GeoJSON")
            print("  Reprojected to EPSG:4326")
        
        return output_file
        
    except Exception as e:
        print(f"  Error: {e}")
        return None


def main():
    print("=" * 60)
    print("Turkey Boundaries Download")
    print("=" * 60)
    
    provinces_file = download_turkey_provinces()
    
    if provinces_file:
        print("\nSuccess! Boundary data ready.")
    else:
        print("\nFailed to download boundaries.")


if __name__ == "__main__":
    main()

