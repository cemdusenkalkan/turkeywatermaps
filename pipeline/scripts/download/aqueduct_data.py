#!/usr/bin/env python3
"""
Download WRI Aqueduct 4.0 water risk data
Uses Resource Watch API and direct downloads
"""

import requests
import zipfile
import io
from pathlib import Path
import geopandas as gpd
import pandas as pd

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent.parent.parent / "data" / "raw" / "aqueduct"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# WRI Aqueduct 4.0 download URLs (try multiple sources)
# Official download page: https://www.wri.org/data/aqueduct-global-maps-40-data
AQUEDUCT_URLS = [
    # Try direct S3 (may vary by region/version)
    "https://wri-public-data.s3.amazonaws.com/Aqueduct40/baseline/annual/y2019m07d11_aqueduct40_annual_baseline_v01.gpkg",
    # Alternative S3 path
    "https://s3.amazonaws.com/wri-public-data/Aqueduct40/baseline/annual/y2019m07d11_aqueduct40_annual_baseline_v01.gpkg",
    # Resource Watch API endpoint (if available)
    "https://api.resourcewatch.org/v1/dataset/aqueduct-water-risk-indicators/data",
]

# Turkey bounding box [west, south, east, north]
TURKEY_BBOX = (25.5, 35.8, 44.8, 42.1)

def download_aqueduct_baseline():
    """
    Download WRI Aqueduct 4.0 baseline water risk indicators.
    Data includes 13 indicators at sub-basin level (HydroBASINS level 6).
    
    If automatic download fails, user must download manually from:
    https://www.wri.org/data/aqueduct-global-maps-40-data
    """
    print("Downloading WRI Aqueduct 4.0 baseline data...")
    
    output_file = DATA_DIR / "aqueduct40_baseline.gpkg"
    
    if output_file.exists():
        print(f"  File already exists: {output_file}")
        print(f"  Size: {output_file.stat().st_size / 1024 / 1024:.1f} MB")
        return output_file
    
    # Try each URL
    for i, url in enumerate(AQUEDUCT_URLS, 1):
        print(f"  Trying URL {i}/{len(AQUEDUCT_URLS)}...")
        try:
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            if total_size == 0:
                print(f"    No content-length header, skipping...")
                continue
                
            print(f"  Downloading {total_size / 1024 / 1024:.1f} MB from {url[:60]}...")
            
            with open(output_file, 'wb') as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            progress = (downloaded / total_size) * 100
                            print(f"\r    Progress: {progress:.1f}%", end='', flush=True)
            
            print("\n  Download complete!")
            return output_file
            
        except requests.exceptions.RequestException as e:
            print(f"    Failed: {e}")
            continue
        except Exception as e:
            print(f"    Error: {e}")
            continue
    
    # All URLs failed - provide manual download instructions
    print("\n" + "="*60)
    print("AUTOMATIC DOWNLOAD FAILED")
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
    
    return None


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

