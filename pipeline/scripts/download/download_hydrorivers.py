#!/usr/bin/env python3
"""
Download and process HydroRIVERS data for Turkey.
Creates river network with stream order classification.
"""

import requests
import zipfile
import geopandas as gpd
from pathlib import Path
import shutil

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # Go up to turkeywatermap/
RAW_DATA = PROJECT_ROOT / "data" / "raw" / "hydrosheds"
FRONTEND_DATA = PROJECT_ROOT / "frontend" / "public" / "data"

# Ensure directories exist
RAW_DATA.mkdir(parents=True, exist_ok=True)
FRONTEND_DATA.mkdir(parents=True, exist_ok=True)

# HydroRIVERS download URLs
HYDRORIVERS_URLS = {
    'asia': 'https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_as_shp.zip',
    'europe': 'https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_eu_shp.zip'
}

# Turkey bounding box
TURKEY_BBOX = (25.5, 35.8, 44.8, 42.1)


def download_file(url, output_path):
    """Download file with progress"""
    print(f"  Downloading: {url}")
    
    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    total_size = int(response.headers.get('content-length', 0))
    
    with open(output_path, 'wb') as f:
        if total_size == 0:
            f.write(response.content)
        else:
            downloaded = 0
            chunk_size = 8192
            for chunk in response.iter_content(chunk_size=chunk_size):
                downloaded += len(chunk)
                f.write(chunk)
                done = int(50 * downloaded / total_size)
                print(f"\r  Progress: [{'=' * done}{' ' * (50-done)}] {downloaded/1024/1024:.1f}MB", end='')
    
    print()  # New line after progress bar


def download_hydrorivers():
    """Download HydroRIVERS datasets"""
    print("=" * 60)
    print("Downloading HydroRIVERS Data")
    print("=" * 60)
    
    downloaded_files = []
    
    for region, url in HYDRORIVERS_URLS.items():
        print(f"\n[{region.upper()}] Region")
        
        zip_path = RAW_DATA / f"HydroRIVERS_v10_{region}.zip"
        
        if zip_path.exists():
            print(f"  ✓ Already downloaded: {zip_path}")
            downloaded_files.append(zip_path)
            continue
        
        try:
            download_file(url, zip_path)
            print(f"  ✓ Downloaded: {zip_path}")
            downloaded_files.append(zip_path)
        except Exception as e:
            print(f"  ✗ Error downloading {region}: {e}")
    
    return downloaded_files


def extract_and_merge_regions(zip_files):
    """Extract shapefiles and filter to Turkey region"""
    print("\n" + "=" * 60)
    print("Extracting Turkey Rivers (Europe Region)")
    print("=" * 60)
    
    # Turkey is in Europe region only (Asia file covers far east Asia)
    # Filter to only Europe file - check filename, not full path
    europe_zip = [z for z in zip_files if 'europe' in z.name.lower() or '_eu' in z.name]
    if not europe_zip:
        print("✗ Europe region file not found")
        print(f"Available files: {[z.name for z in zip_files]}")
        return None
    
    zip_path = europe_zip[0]
    extract_dir = RAW_DATA / "HydroRIVERS_europe"
    
    print(f"\n[EUROPE] Extracting...")
    
    # Extract zip
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    # Find shapefile (in subdirectory HydroRIVERS_v10_eu_shp/)
    shp_files = list(extract_dir.glob("**/*_eu.shp"))  # Match Europe shapefile specifically
    if not shp_files:
        print(f"  ✗ No shapefile found in {extract_dir}")
        return None
    
    shp_path = shp_files[0]
    print(f"  Reading: {shp_path.name}")
    print(f"  Filtering to Turkey bbox (25.5-44.8°E, 35.8-42.1°N)...")
    
    # Read with bbox parameter for server-side filtering (much faster!)
    west, south, east, north = TURKEY_BBOX
    turkey_rivers = gpd.read_file(shp_path, bbox=(west, south, east, north))
    
    print(f"  ✓ Found {len(turkey_rivers):,} river segments in Turkey")
    
    if len(turkey_rivers) == 0:
        print("\n✗ No river data found for Turkey region")
        return None
    
    return turkey_rivers


def process_river_network(rivers_gdf):
    """Process and classify river network"""
    print("\n" + "=" * 60)
    print("Processing River Network")
    print("=" * 60)
    
    # Keep essential attributes
    essential_cols = [
        'HYRIV_ID',     # Unique river ID
        'MAIN_RIV',     # Main river name
        'ORD_STRA',     # Strahler stream order (1-10)
        'LENGTH_KM',    # River length
        'UPLAND_SKM',   # Upstream area (km²)
        'geometry'
    ]
    
    available_cols = [col for col in essential_cols if col in rivers_gdf.columns]
    rivers_gdf = rivers_gdf[available_cols]
    
    print(f"\nStream order distribution:")
    if 'ORD_STRA' in rivers_gdf.columns:
        order_counts = rivers_gdf['ORD_STRA'].value_counts().sort_index()
        for order, count in order_counts.items():
            print(f"  Order {int(order)}: {count:,} segments")
    
    # Simplify geometries
    print("\nSimplifying geometries...")
    original_size = len(rivers_gdf.to_json())
    
    rivers_gdf['geometry'] = rivers_gdf.geometry.simplify(
        tolerance=0.001,  # ~100m
        preserve_topology=True
    )
    
    simplified_size = len(rivers_gdf.to_json())
    reduction = (1 - simplified_size/original_size) * 100
    print(f"  Reduction: {reduction:.1f}%")
    
    # Create stream order categories for styling
    if 'ORD_STRA' in rivers_gdf.columns:
        rivers_gdf['order_category'] = pd.cut(
            rivers_gdf['ORD_STRA'],
            bins=[0, 3, 6, 10],
            labels=['small', 'medium', 'large']
        )
    
    return rivers_gdf


def create_stream_order_layers(rivers_gdf):
    """Split into separate files by stream order (for better web performance)"""
    print("\n" + "=" * 60)
    print("Creating Stream Order Layers")
    print("=" * 60)
    
    if 'ORD_STRA' not in rivers_gdf.columns:
        print("  ✗ No stream order data available")
        return
    
    # Convert categorical columns to string (GeoJSON doesn't support categorical dtype)
    if 'order_category' in rivers_gdf.columns:
        rivers_gdf = rivers_gdf.copy()
        rivers_gdf['order_category'] = rivers_gdf['order_category'].astype(str)
    
    layers = {
        'small': rivers_gdf[rivers_gdf['ORD_STRA'] <= 3],
        'medium': rivers_gdf[(rivers_gdf['ORD_STRA'] > 3) & (rivers_gdf['ORD_STRA'] <= 6)],
        'large': rivers_gdf[rivers_gdf['ORD_STRA'] > 6]
    }
    
    for layer_name, layer_gdf in layers.items():
        if len(layer_gdf) == 0:
            continue
        
        # Make a copy to avoid SettingWithCopyWarning
        layer_gdf = layer_gdf.copy()
        
        output_path = FRONTEND_DATA / f"rivers_turkey_{layer_name}.geojson"
        layer_gdf.to_file(output_path, driver="GeoJSON")
        size_mb = output_path.stat().st_size / 1024 / 1024
        print(f"  ✓ {layer_name.capitalize()}: {len(layer_gdf):,} segments ({size_mb:.1f} MB)")


def save_full_network(rivers_gdf):
    """Save complete river network"""
    output_path = FRONTEND_DATA / "rivers_turkey_full.geojson"
    print(f"\nSaving full network: {output_path}")
    
    # Convert categorical to string if exists
    rivers_gdf = rivers_gdf.copy()
    if 'order_category' in rivers_gdf.columns:
        rivers_gdf['order_category'] = rivers_gdf['order_category'].astype(str)
    
    rivers_gdf.to_file(output_path, driver="GeoJSON")
    size_mb = output_path.stat().st_size / 1024 / 1024
    print(f"  Size: {size_mb:.1f} MB")
    
    # Also save to processed
    processed_path = PROJECT_ROOT / "data" / "processed" / "turkey_rivers.geojson"
    rivers_gdf.to_file(processed_path, driver="GeoJSON")


def main():
    """Main execution"""
    
    # Download data
    zip_files = download_hydrorivers()
    
    if not zip_files:
        print("\n✗ Failed to download HydroRIVERS data")
        return
    
    # Extract and merge
    rivers_gdf = extract_and_merge_regions(zip_files)
    
    if rivers_gdf is None:
        return
    
    # Process network
    rivers_gdf = process_river_network(rivers_gdf)
    
    # Create layered outputs
    create_stream_order_layers(rivers_gdf)
    save_full_network(rivers_gdf)
    
    print("\n" + "=" * 60)
    print("✓ HydroRIVERS processing complete!")
    print("=" * 60)
    print("\nOutput files:")
    print("  - rivers_turkey_small.geojson (orders 1-3)")
    print("  - rivers_turkey_medium.geojson (orders 4-6)")
    print("  - rivers_turkey_large.geojson (orders 7-10)")
    print("  - rivers_turkey_full.geojson (complete network)")
    print("\nNext steps:")
    print("  1. Add river layers to frontend")
    print("  2. Implement stream order styling")
    print("  3. Add river interaction (hover/click)")


if __name__ == "__main__":
    import pandas as pd  # Import here to avoid error if not used
    main()
