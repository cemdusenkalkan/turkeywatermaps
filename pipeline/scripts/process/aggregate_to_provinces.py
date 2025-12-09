#!/usr/bin/env python3
"""
Aggregate Aqueduct sub-basin data to Turkey provinces
Uses area-weighted averaging
"""

import geopandas as gpd
import pandas as pd
from pathlib import Path
import numpy as np

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent
RAW_DATA = PROJECT_ROOT / "data" / "raw"
PROCESSED_DATA = PROJECT_ROOT / "data" / "processed"
PROCESSED_DATA.mkdir(parents=True, exist_ok=True)


def load_aqueduct_data():
    """Load Aqueduct Turkey data"""
    # Check for filtered Turkey data first
    aqueduct_file = RAW_DATA / "aqueduct" / "aqueduct40_turkey.gpkg"
    
    # If filtered doesn't exist, check for full baseline and filter it
    if not aqueduct_file.exists():
        baseline_file = RAW_DATA / "aqueduct" / "aqueduct40_baseline.gpkg"
        
        if baseline_file.exists():
            print(f"Found baseline file, filtering for Turkey...")
            # Import filter function
            import sys
            download_script = SCRIPT_DIR.parent / "download" / "aqueduct_data.py"
            if download_script.exists():
                # Filter inline
                TURKEY_BBOX = (25.5, 35.8, 44.8, 42.1)
                baseline_gdf = gpd.read_file(baseline_file)
                west, south, east, north = TURKEY_BBOX
                turkey_gdf = baseline_gdf.cx[west:east, south:north]
                turkey_gdf.to_file(aqueduct_file, driver="GPKG")
                print(f"  Filtered to {len(turkey_gdf)} sub-basins in Turkey")
            else:
                raise FileNotFoundError("Cannot filter baseline data - download script not found")
        else:
            raise FileNotFoundError(
                f"Aqueduct data not found.\n"
                f"Expected: {aqueduct_file} OR {baseline_file}\n"
                f"\nPlease download WRI Aqueduct 4.0 data:\n"
                f"1. Visit: https://www.wri.org/data/aqueduct-global-maps-40-data\n"
                f"2. Download 'Aqueduct 4.0 Baseline Annual' GeoPackage\n"
                f"3. Place in: {baseline_file.parent}\n"
                f"4. Name it: aqueduct40_baseline.gpkg"
            )
    
    print(f"Loading Aqueduct data from {aqueduct_file}...")
    gdf = gpd.read_file(aqueduct_file)
    print(f"  Loaded {len(gdf)} sub-basins")
    
    return gdf


def load_province_boundaries():
    """Load Turkey province boundaries"""
    provinces_file = RAW_DATA / "boundaries" / "turkey_provinces.geojson"
    
    if not provinces_file.exists():
        raise FileNotFoundError(f"Province boundaries not found: {provinces_file}")
    
    print(f"Loading province boundaries from {provinces_file}...")
    gdf = gpd.read_file(provinces_file)
    print(f"  Loaded {len(gdf)} provinces")
    
    return gdf


def area_weighted_aggregate(aqueduct_gdf, provinces_gdf, indicator_cols):
    """
    Aggregate sub-basin indicators to provinces using area-weighted averaging.
    
    For each province, compute the weighted average of overlapping sub-basins,
    where weights are proportional to the intersection area.
    """
    print("Performing spatial overlay and area-weighted aggregation...")
    
    # Ensure same CRS
    if aqueduct_gdf.crs != provinces_gdf.crs:
        aqueduct_gdf = aqueduct_gdf.to_crs(provinces_gdf.crs)
    
    # Spatial overlay (intersection)
    overlay = gpd.overlay(aqueduct_gdf, provinces_gdf, how='intersection')
    
    # Calculate intersection areas (in km²)
    overlay['intersection_area'] = overlay.geometry.to_crs('EPSG:3857').area / 1e6
    
    # Group by province and compute area-weighted averages
    results = []
    
    for province_id, group in overlay.groupby('GID_1'):
        province_name = group['NAME_1'].iloc[0]
        total_area = group['intersection_area'].sum()
        
        # Compute weighted average for each indicator
        weighted_scores = {}
        for col in indicator_cols:
            if col in group.columns:
                # Area-weighted average
                weighted_avg = (group[col] * group['intersection_area']).sum() / total_area
                weighted_scores[col] = weighted_avg
        
        results.append({
            'province_id': province_id,
            'province_name': province_name,
            **weighted_scores
        })
    
    result_df = pd.DataFrame(results)
    print(f"  Aggregated to {len(result_df)} provinces")
    
    return result_df


def apply_wri_scoring(df):
    """
    Apply WRI Aqueduct scoring thresholds to raw indicators.
    Scores range from 0-5 based on defined thresholds.
    
    Source: WRI Aqueduct Technical Note (2019)
    https://www.wri.org/research/aqueduct-30-updated-decision-relevant-global-water-risk-indicators
    """
    print("Applying WRI Aqueduct scoring thresholds...")
    
    # Baseline Water Stress (bws)
    # Raw values: 0-1+ (ratio)
    # Scoring: 0-0.1=0, 0.1-0.2=1, 0.2-0.4=2, 0.4-0.8=3, 0.8-1.0=4, >1.0=5
    if 'bws_raw' in df.columns:
        df['baseline_stress_score'] = pd.cut(
            df['bws_raw'],
            bins=[-np.inf, 0.1, 0.2, 0.4, 0.8, 1.0, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Baseline Water Depletion (bwd)
    # Similar thresholds
    if 'bwd_raw' in df.columns:
        df['water_depletion_score'] = pd.cut(
            df['bwd_raw'],
            bins=[-np.inf, 0.1, 0.2, 0.4, 0.8, 1.0, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Interannual Variability (iav)
    # Raw: 0-1+ (CV)
    # Scoring: 0-0.25=0, 0.25-0.5=1, 0.5-0.75=2, 0.75-1.0=3, 1.0-1.25=4, >1.25=5
    if 'iav_raw' in df.columns:
        df['interannual_variability_score'] = pd.cut(
            df['iav_raw'],
            bins=[-np.inf, 0.25, 0.5, 0.75, 1.0, 1.25, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Seasonal Variability (sev)
    # Raw: 0-1+ (CV)
    if 'sev_raw' in df.columns:
        df['seasonal_variability_score'] = pd.cut(
            df['sev_raw'],
            bins=[-np.inf, 0.33, 0.66, 1.0, 1.33, 1.66, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Groundwater Table Decline (gtd)
    # Raw: cm/year (negative = decline)
    # Scoring: 0 to -2=0, -2 to -4=1, ..., <-10=5
    if 'gtd_raw' in df.columns:
        df['groundwater_stress_score'] = pd.cut(
            -df['gtd_raw'],  # Negate so positive = decline
            bins=[-np.inf, 2, 4, 6, 8, 10, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Riverine Flood Risk (rfr)
    # Raw: % population exposed
    # Scoring: 0-0.1%=0, 0.1-1%=1, 1-5%=2, 5-10%=3, 10-25%=4, >25%=5
    if 'rfr_raw' in df.columns:
        df['flood_hazard_score'] = pd.cut(
            df['rfr_raw'],
            bins=[-np.inf, 0.1, 1, 5, 10, 25, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    # Drought Risk (drr)
    # Raw: number of drought months (1950-2014, 780 total months)
    # Scoring: 0-10%=0, 10-20%=1, 20-30%=2, 30-40%=3, 40-50%=4, >50%=5
    if 'drr_raw' in df.columns:
        drought_pct = (df['drr_raw'] / 780) * 100
        df['drought_hazard_score'] = pd.cut(
            drought_pct,
            bins=[-np.inf, 10, 20, 30, 40, 50, np.inf],
            labels=[0, 1, 2, 3, 4, 5]
        ).astype(float)
    
    print("  Scoring complete")
    return df


def calculate_combined_index(df):
    """
    Calculate combined water risk index using WRI's aggregation method.
    
    WRI uses weighted arithmetic mean for overall water risk.
    Weights from WRI Aqueduct Technical Note.
    """
    print("Calculating combined water risk index...")
    
    # WRI Aqueduct weights (for physical risk quantity)
    weights = {
        'baseline_stress_score': 0.25,
        'interannual_variability_score': 0.25,
        'seasonal_variability_score': 0.25,
        'groundwater_stress_score': 0.125,
        'drought_hazard_score': 0.0625,
        'flood_hazard_score': 0.0625
    }
    
    # Calculate weighted sum
    available_scores = [col for col in weights.keys() if col in df.columns]
    
    if not available_scores:
        print("  Warning: No scores available for combined index")
        df['combined_risk_score'] = np.nan
        return df
    
    total_weight = sum(weights[col] for col in available_scores)
    
    df['combined_risk_score'] = sum(
        df[col] * weights[col] for col in available_scores
    ) / total_weight
    
    print(f"  Combined index calculated (mean: {df['combined_risk_score'].mean():.2f})")
    
    return df


def main():
    """Main processing pipeline"""
    print("=" * 60)
    print("Aggregate Aqueduct Data to Turkey Provinces")
    print("=" * 60)
    
    # Load data
    aqueduct_gdf = load_aqueduct_data()
    provinces_gdf = load_province_boundaries()
    
    # Identify indicator columns (all *_raw columns)
    indicator_cols = [col for col in aqueduct_gdf.columns if col.endswith('_raw')]
    print(f"\nFound {len(indicator_cols)} indicators:")
    for col in indicator_cols:
        print(f"  - {col}")
    
    # Aggregate to provinces
    province_data = area_weighted_aggregate(aqueduct_gdf, provinces_gdf, indicator_cols)
    
    # Apply WRI scoring
    province_data = apply_wri_scoring(province_data)
    
    # Calculate combined index
    province_data = calculate_combined_index(province_data)
    
    # Save results
    output_csv = PROCESSED_DATA / "turkey_water_risk_scores.csv"
    province_data.to_csv(output_csv, index=False)
    print(f"\nSaved: {output_csv}")
    
    # Merge with geometry for GeoJSON
    provinces_with_scores = provinces_gdf.merge(
        province_data,
        left_on='GID_1',
        right_on='province_id',
        how='left'
    )
    
    output_geojson = PROCESSED_DATA / "turkey_water_risk.geojson"
    provinces_with_scores.to_file(output_geojson, driver="GeoJSON")
    print(f"Saved: {output_geojson}")
    
    print("\nProcessing complete!")
    print(f"Provinces with data: {province_data['province_name'].notna().sum()}")


if __name__ == "__main__":
    main()

