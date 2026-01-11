#!/usr/bin/env python3
"""
Build DuckDB Parquet database for Turkey Water Risk Map.
Aggregates WRI Aqueduct 4.0 data to District (Admin Level 2) level.
"""

import geopandas as gpd
import pandas as pd
import duckdb
from pathlib import Path
import numpy as np

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent.parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
V4_DIR = PROCESSED_DIR / "v4.0" / "TUR" / "adm2"  # Admin Level 2
V4_DIR.mkdir(parents=True, exist_ok=True)

# Input Files
DISTRICTS_FILE = RAW_DIR / "boundaries" / "turkey_districts.geojson"
AQUEDUCT_BASELINE_FILE = RAW_DIR / "aqueduct" / "aqueduct40_turkey.gpkg"
AQUEDUCT_FUTURE_FILE = RAW_DIR / "aqueduct" / "aqueduct40_future.gpkg"

# Output Files
OUTPUT_PARQUET = V4_DIR / "water_risk.parquet"

def load_districts():
    print(f"Loading districts from {DISTRICTS_FILE}...")
    gdf = gpd.read_file(DISTRICTS_FILE)
    # Ensure unique ID
    if 'GID_2' not in gdf.columns:
        print("Warning: GID_2 not found, using index as ID")
        gdf['GID_2'] = gdf.index.astype(str)
    return gdf

def load_aqueduct_data(file_path, bbox=None):
    print(f"Loading Aqueduct data from {file_path}...")
    # Load only necessary columns if possible, but for now load all
    # Clip to Turkey to speed up
    gdf = gpd.read_file(file_path, bbox=bbox)
    return gdf

def aggregate_scores(districts, aqueduct_data, prefix=""):
    """
    Calculate area-weighted average of risk scores for each district.
    """
    print(f"Intersecting districts with Aqueduct data ({prefix})...")
    
    # Ensure same CRS
    if districts.crs != aqueduct_data.crs:
        aqueduct_data = aqueduct_data.to_crs(districts.crs)

    # Spatial intersection
    # This splits aqueduct polygons by district boundaries
    intersection = gpd.overlay(districts, aqueduct_data, how='intersection')
    
    # Calculate area of each piece
    intersection['intersect_area'] = intersection.geometry.area
    
    # Identify score columns (usually end with _score or _raw)
    score_cols = [c for c in aqueduct_data.columns if 'score' in c or 'raw' in c or 'label' in c]
    
    # Group by District ID and calculate weighted average
    print("Aggregating scores...")
    results = []
    
    for district_id in districts['GID_2'].unique():
        district_pieces = intersection[intersection['GID_2'] == district_id]
        
        if district_pieces.empty:
            continue
            
        total_area = district_pieces['intersect_area'].sum()
        
        row = {'district_id': district_id}
        
        for col in score_cols:
            # Skip non-numeric columns for averaging
            if not pd.api.types.is_numeric_dtype(district_pieces[col]):
                # For categorical/label columns, take the mode (most common by area)
                # This is complex, skipping for now or taking first
                continue
                
            # Weighted average: sum(score * area) / sum(area)
            # Handle NaNs: ignore them or treat as 0? WRI uses -9999 for No Data.
            # We should filter out -9999 before averaging.
            
            valid_pieces = district_pieces[district_pieces[col] != -9999]
            if valid_pieces.empty:
                row[col] = -9999
            else:
                weighted_sum = (valid_pieces[col] * valid_pieces['intersect_area']).sum()
                valid_area = valid_pieces['intersect_area'].sum()
                if valid_area > 0:
                    row[col] = weighted_sum / valid_area
                else:
                    row[col] = -9999
                    
        results.append(row)
        
    return pd.DataFrame(results)

def main():
    if not DISTRICTS_FILE.exists():
        print(f"Error: {DISTRICTS_FILE} not found. Run download scripts first.")
        return

    districts = load_districts()
    turkey_bbox = tuple(districts.total_bounds)
    
    # 1. Process Baseline
    if AQUEDUCT_BASELINE_FILE.exists():
        aqueduct_baseline = load_aqueduct_data(AQUEDUCT_BASELINE_FILE, bbox=turkey_bbox)
        baseline_scores = aggregate_scores(districts, aqueduct_baseline, prefix="baseline")
        baseline_scores['scenario'] = 'baseline'
        baseline_scores['year'] = 2019
    else:
        print("Warning: Baseline data not found.")
        baseline_scores = pd.DataFrame()

    # 2. Process Future (TODO: Add logic when file structure is known)
    # For now, just save baseline
    
    final_df = baseline_scores
    
    if final_df.empty:
        print("No data to save.")
        return

    # Save to Parquet using DuckDB
    print(f"Saving to {OUTPUT_PARQUET}...")
    conn = duckdb.connect()
    conn.execute("CREATE TABLE water_risk AS SELECT * FROM final_df")
    conn.execute(f"COPY water_risk TO '{OUTPUT_PARQUET}' (FORMAT PARQUET)")
    print("Done.")

if __name__ == "__main__":
    main()
