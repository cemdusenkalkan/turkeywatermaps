#!/usr/bin/env python3
"""
Download WRI Aqueduct 4.0 water risk data
Uses Resource Watch API and direct downloads
"""

import requests
import zipfile
import io
import shutil
from pathlib import Path
import geopandas as gpd
import pandas as pd

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent.parent.parent / "data" / "raw" / "aqueduct"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# WRI Aqueduct 4.0 download URLs
AQUEDUCT_ZIP_URL = "https://files.wri.org/aqueduct/aqueduct-4-0-water-risk-data.zip"

# Turkey bounding box [west, south, east, north]
TURKEY_BBOX = (25.5, 35.8, 44.8, 42.1)

def download_aqueduct_baseline():
    """
    Download WRI Aqueduct 4.0 data (zipped).
    Extracts and renames the baseline file.
    """
    print("Downloading WRI Aqueduct 4.0 data...")
    
    output_gpkg = DATA_DIR / "aqueduct40_baseline.gpkg"
    zip_file = DATA_DIR / "aqueduct_data.zip"
    
    if output_gpkg.exists():
        print(f"  File already exists: {output_gpkg}")
        return output_gpkg
        
    try:
        print(f"  Downloading from {AQUEDUCT_ZIP_URL}...")
        response = requests.get(AQUEDUCT_ZIP_URL, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(zip_file, 'wb') as f:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    progress = (downloaded / total_size) * 100
                    print(f"\r    Progress: {progress:.1f}%", end='', flush=True)
        print("\n  Download complete. Extracting...")
        
        with zipfile.ZipFile(zip_file, 'r') as z:
            # Extract CSVs
            for name in z.namelist():
                if "baseline_annual" in name and name.endswith(".csv"):
                    print(f"  Extracting {name}...")
                    output_csv = DATA_DIR / "aqueduct40_baseline.csv"
                    with z.open(name) as source, open(output_csv, 'wb') as target:
                        shutil.copyfileobj(source, target)
                    print(f"  Saved to {output_csv}")
                
                elif "future_annual" in name and name.endswith(".csv"):
                    print(f"  Extracting {name}...")
                    output_csv = DATA_DIR / "aqueduct40_future.csv"
                    with z.open(name) as source, open(output_csv, 'wb') as target:
                        shutil.copyfileobj(source, target)
                    print(f"  Saved to {output_csv}")

            # Extract GDB (Spatial Data)
            # We need to extract all files under the GDB directory
            gdb_folder_in_zip = "Aqueduct40_waterrisk_download_Y2023M07D05/GDB/Aq40_Y2023D07M05.gdb/"
            output_gdb = DATA_DIR / "aqueduct40.gdb"
            
            # Create output GDB directory
            if output_gdb.exists():
                shutil.rmtree(output_gdb)
            output_gdb.mkdir(parents=True, exist_ok=True)
            
            print(f"  Extracting GDB to {output_gdb}...")
            count = 0
            for name in z.namelist():
                if name.startswith(gdb_folder_in_zip) and not name.endswith('/'):
                    # Get relative path inside GDB
                    rel_path = name[len(gdb_folder_in_zip):]
                    target_path = output_gdb / rel_path
                    
                    with z.open(name) as source, open(target_path, 'wb') as target:
                        shutil.copyfileobj(source, target)
                    count += 1
            print(f"  Extracted {count} files to GDB.")
            
            return output_gdb
        
    except Exception as e:
        print(f"  Failed: {e}")
        return None

def download_aqueduct_future():
    """
    Download WRI Aqueduct 4.0 future projections.
    (Included in the same zip, so we just extract it)
    """
    print("Downloading WRI Aqueduct 4.0 future projections...")
    
    output_gpkg = DATA_DIR / "aqueduct40_future.gpkg"
    zip_file = DATA_DIR / "aqueduct_data.zip" # Re-download if needed, or check if we can reuse
    
    if output_gpkg.exists():
        print(f"  File already exists: {output_gpkg}")
        return output_gpkg

    # If we already downloaded the zip for baseline, we might have deleted it.
    # For simplicity, let's assume we need to download it again if it's gone, 
    # or better, let's combine the logic.
    
    # For now, let's just return None as the zip logic above handles the main file.
    # We can extend this to extract the future file too if needed.
    # The zip likely contains both.
    
    return None

if __name__ == "__main__":
    download_aqueduct_baseline()
    download_aqueduct_future()
    print("="*60)
    print("\nPlease download WRI Aqueduct 4.0 data manually:")
    print("\n1. Visit: https://www.wri.org/data/aqueduct-global-maps-40-data")
    print("2. Download 'Aqueduct 4.0 Baseline Annual' GeoPackage file")
    print("3. Place the file in:")
    print(f"   {DATA_DIR}")
    print("4. Rename it to: aqueduct40_baseline.gpkg")
    print("\nAlternatively, check for direct download links on:")
    print("  - Resource Watch: https://resourcewatch.org/data/explore")
    print("  - Google Earth Engine: WRI_Aqueduct_Water_Risk_V4 dataset")
    print("\nOnce the file is in place, run the pipeline again.")
    print("="*60)


def filter_turkey_data(input_file):
    """
    Filter Aqueduct data to Turkey region only.
    """
    print("Filtering data for Turkey...")
    
    try:
        # Read the geopackage
        gdf = gpd.read_file(input_file)
        
        # Filter to Turkey bounding box
        west, south, east, north = TURKEY_BBOX
        turkey_data = gdf.cx[west:east, south:north]
        
        print(f"  Found {len(turkey_data)} sub-basins in Turkey region")
        
        # Save filtered data
        output_file = DATA_DIR / "aqueduct40_turkey.gpkg"
        turkey_data.to_file(output_file, driver="GPKG")
        print(f"  Saved to: {output_file}")
        
        # Also save as CSV (without geometry)
        csv_file = DATA_DIR / "aqueduct40_turkey.csv"
        turkey_data.drop(columns='geometry').to_csv(csv_file, index=False)
        print(f"  Saved CSV: {csv_file}")
        
        return output_file
        
    except Exception as e:
        print(f"  Error filtering data: {e}")
        return None


def get_indicator_info():
    """
    Return WRI Aqueduct 4.0 indicator definitions.
    Source: https://www.wri.org/aqueduct/publications
    """
    indicators = {
        'bws_raw': {
            'name': 'Baseline Water Stress',
            'definition': 'Ratio of total water withdrawals to available renewable surface/groundwater',
            'formula': 'Total withdrawals / (Renewable surface water + groundwater recharge)',
            'units': 'dimensionless',
            'source': 'PCR-GLOBWB 2 hydrological model + sectoral demand'
        },
        'bwd_raw': {
            'name': 'Baseline Water Depletion',
            'definition': 'Ratio of consumption to available flow',
            'formula': 'Total consumption / (Renewable surface water + groundwater recharge)',
            'units': 'dimensionless',
            'source': 'PCR-GLOBWB 2'
        },
        'iav_raw': {
            'name': 'Interannual Variability',
            'definition': 'Average between-year variability of available water',
            'formula': 'Coefficient of variation of annual available water',
            'units': 'dimensionless',
            'source': 'PCR-GLOBWB 2 (1960-2014)'
        },
        'sev_raw': {
            'name': 'Seasonal Variability',
            'definition': 'Average within-year variability of available water',
            'formula': 'Coefficient of variation of monthly available water',
            'units': 'dimensionless',
            'source': 'PCR-GLOBWB 2'
        },
        'gtd_raw': {
            'name': 'Groundwater Table Decline',
            'definition': 'Average decline of groundwater table',
            'formula': 'Trend in groundwater head (cm/year)',
            'units': 'cm/year',
            'source': 'PCR-GLOBWB 2'
        },
        'rfr_raw': {
            'name': 'Riverine Flood Risk',
            'definition': 'Percentage of population exposed to floods',
            'formula': '% population in 1-in-100 year floodplain',
            'units': 'percent',
            'source': 'GLOFRIS + population data'
        },
        'cfr_raw': {
            'name': 'Coastal Flood Risk',
            'definition': 'Percentage of population exposed to coastal flooding',
            'formula': '% population in 1-in-100 year coastal floodplain',
            'units': 'percent',
            'source': 'Deltares + population'
        },
        'drr_raw': {
            'name': 'Drought Risk',
            'definition': 'Number of drought months (SPI < -1.5)',
            'formula': 'Count of months with SPI-12 < -1.5',
            'units': 'months',
            'source': 'CRU TS 4.03 precipitation'
        },
        'ucw_raw': {
            'name': 'Untreated Connected Wastewater',
            'definition': 'Percentage of wastewater not treated',
            'formula': '% of collected wastewater not treated',
            'units': 'percent',
            'source': 'National statistics + modeling'
        },
        'cep_raw': {
            'name': 'Coastal Eutrophication Potential',
            'definition': 'Potential for coastal eutrophication',
            'formula': 'Nitrogen + phosphorus export to coast',
            'units': 'kg/km2/year',
            'source': 'IMAGE-GNM nutrient model'
        }
    }
    return indicators


def main():
    """Main execution"""
    print("=" * 60)
    print("WRI Aqueduct 4.0 Data Download")
    print("=" * 60)
    
    # Download baseline data
    baseline_file = download_aqueduct_baseline()
    
    if baseline_file and baseline_file.exists():
        # Filter to Turkey
        turkey_file = filter_turkey_data(baseline_file)
        
        if turkey_file:
            print("\nSuccess! Aqueduct data ready for processing.")
            print(f"Output: {turkey_file}")
            
            # Print indicator info
            print("\nAvailable indicators:")
            indicators = get_indicator_info()
            for key, info in indicators.items():
                print(f"  - {info['name']} ({key})")
    else:
        print("\n" + "="*60)
        print("MANUAL DOWNLOAD REQUIRED")
        print("="*60)
        print("\nThe WRI Aqueduct 4.0 data file is large (~500MB) and")
        print("may require manual download due to server restrictions.")
        print("\nSteps:")
        print("1. Visit: https://www.wri.org/data/aqueduct-global-maps-40-data")
        print("2. Click 'Download' for 'Aqueduct 4.0 Baseline Annual'")
        print("3. Save the .gpkg file to:")
        print(f"   {DATA_DIR}/aqueduct40_baseline.gpkg")
        print("\nThen run this script again to filter for Turkey.")
        print("="*60)


if __name__ == "__main__":
    main()

