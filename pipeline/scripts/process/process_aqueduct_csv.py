#!/usr/bin/env python3
"""
Process WRI Aqueduct CSV data and join with Turkey province boundaries.
Uses CSV data which already has all indicators and scores.
"""

import pandas as pd
import geopandas as gpd
from pathlib import Path
import numpy as np

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent
RAW_DATA = PROJECT_ROOT / "data" / "raw"
PROCESSED_DATA = PROJECT_ROOT / "data" / "processed"
PROCESSED_DATA.mkdir(parents=True, exist_ok=True)

# All 13 Aqueduct 4.0 baseline annual indicators
# Organized into 4 groups (clean, defensible, matches user mental models)
INDICATORS = {
    # Group 1: Quantity & Variability (6 indicators)
    'bws': 'baseline_stress',
    'bwd': 'baseline_depletion',
    'gtd': 'groundwater_decline',
    'iav': 'interannual_variability',
    'sev': 'seasonal_variability',
    'drr': 'drought_risk',
    
    # Group 2: Flooding (2 indicators)
    'rfr': 'riverine_flood_risk',
    'cfr': 'coastal_flood_risk',
    
    # Group 3: Quality (2 indicators)
    'ucw': 'untreated_wastewater',
    'cep': 'coastal_eutrophication',
    
    # Group 4: Access & Reputational (3 indicators)
    'udw': 'unimproved_drinking_water',
    'usa': 'unimproved_sanitation',
    'rri': 'reputational_risk'
}


def load_aqueduct_csv():
    """Load Aqueduct CSV and filter for Turkey"""
    csv_file = RAW_DATA / "aqueduct" / "CVS" / "Aqueduct40_baseline_annual_y2023m07d05.csv"
    
    if not csv_file.exists():
        raise FileNotFoundError(f"Aqueduct CSV not found: {csv_file}")
    
    print(f"Loading Aqueduct CSV from {csv_file}...")
    df = pd.read_csv(csv_file, low_memory=False)
    print(f"  Loaded {len(df)} rows")
    
    # Filter for Turkey
    turkey_df = df[df['gid_0'] == 'TUR'].copy()
    print(f"  Found {len(turkey_df)} Turkey sub-basins")
    
    return turkey_df


def load_province_boundaries():
    """Load Turkey province boundaries"""
    provinces_file = RAW_DATA / "boundaries" / "turkey_provinces.geojson"
    
    if not provinces_file.exists():
        raise FileNotFoundError(f"Province boundaries not found: {provinces_file}")
    
    print(f"Loading province boundaries from {provinces_file}...")
    gdf = gpd.read_file(provinces_file)
    print(f"  Loaded {len(gdf)} provinces")
    
    return gdf


def aggregate_to_provinces(turkey_df, provinces_gdf):
    """
    Aggregate sub-basin data to provinces.
    Since CSV doesn't have geometry, we use gid_1 matching and area-weighted aggregation.
    """
    print("Aggregating sub-basin data to provinces...")
    
    # Group by province (gid_1)
    results = []
    
    for province_id, group in turkey_df.groupby('gid_1'):
        # Get province name
        province_name = group['name_1'].iloc[0] if 'name_1' in group.columns else province_id
        
        # Calculate area-weighted averages for each indicator
        # Use area_km2 as weight
        total_area = group['area_km2'].sum()
        
        if total_area == 0:
            continue
        
        province_data = {
            'province_id': province_id,
            'province_name': province_name,
        }
        
        # Aggregate raw indicators (area-weighted)
        for code, name in INDICATORS.items():
            raw_col = f'{code}_raw'
            score_col = f'{code}_score'
            
            if raw_col in group.columns:
                # Filter out missing values (-9999) and NaN
                valid_mask = (group[raw_col] != -9999) & (group[raw_col].notna())
                if valid_mask.sum() > 0:
                    valid_data = group[valid_mask]
                    valid_area = valid_data['area_km2'].sum()
                    if valid_area > 0:
                        weighted_raw = (valid_data[raw_col] * valid_data['area_km2']).sum() / valid_area
                        province_data[f'{raw_col}'] = float(weighted_raw)
                    else:
                        province_data[f'{raw_col}'] = np.nan
                else:
                    province_data[f'{raw_col}'] = np.nan
            
            if score_col in group.columns:
                # Filter out invalid scores (-9999, negative, or > 5)
                valid_mask = (
                    (group[score_col] != -9999) & 
                    (group[score_col].notna()) &
                    (group[score_col] >= 0) &
                    (group[score_col] <= 5)
                )
                if valid_mask.sum() > 0:
                    valid_data = group[valid_mask]
                    valid_area = valid_data['area_km2'].sum()
                    if valid_area > 0:
                        weighted_score = (valid_data[score_col] * valid_data['area_km2']).sum() / valid_area
                        province_data[f'{name}_score'] = float(weighted_score)
                    else:
                        province_data[f'{name}_score'] = np.nan
                else:
                    province_data[f'{name}_score'] = np.nan
        
        results.append(province_data)
    
    result_df = pd.DataFrame(results)
    print(f"  Aggregated to {len(result_df)} provinces")
    
    return result_df


def calculate_combined_index(df):
    """
    Calculate combined water risk index using WRI weights.
    Uses pre-calculated scores from Aqueduct.
    """
    print("Calculating combined water risk index...")
    
    # WRI Aqueduct default composite weights (Physical Risk - Quantity focused)
    # These are the standard weights; sector-specific weights will be added later
    weights = {
        # Quantity & Variability (total: 0.875)
        'baseline_stress_score': 0.25,
        'baseline_depletion_score': 0.20,
        'groundwater_decline_score': 0.125,
        'interannual_variability_score': 0.125,
        'seasonal_variability_score': 0.125,
        'drought_risk_score': 0.05,
        
        # Flooding (total: 0.075)
        'riverine_flood_risk_score': 0.05,
        'coastal_flood_risk_score': 0.025,
        
        # Quality (total: 0.05)
        'untreated_wastewater_score': 0.03,
        'coastal_eutrophication_score': 0.02,
        
        # Access & Reputational (not included in default physical risk composite)
        # These are displayed separately but not weighted in combined score
        # 'unimproved_drinking_water_score': 0.0,
        # 'unimproved_sanitation_score': 0.0,
        # 'reputational_risk_score': 0.0
    }
    
    # Calculate weighted sum - only use valid scores (0-5 range)
    available_scores = [col for col in weights.keys() if col in df.columns]
    
    if not available_scores:
        print("  Warning: No scores available for combined index")
        df['combined_risk_score'] = np.nan
        return df
    
    # Calculate for each row, only using valid scores
    combined_scores = []
    for idx, row in df.iterrows():
        valid_scores = []
        valid_weights = []
        
        for col in available_scores:
            score_val = row[col]
            if pd.notna(score_val) and 0 <= score_val <= 5:
                valid_scores.append(score_val)
                valid_weights.append(weights[col])
        
        if valid_scores and sum(valid_weights) > 0:
            combined = sum(s * w for s, w in zip(valid_scores, valid_weights)) / sum(valid_weights)
            combined_scores.append(combined)
        else:
            combined_scores.append(np.nan)
    
    df['combined_risk_score'] = combined_scores
    
    print(f"  Combined index calculated (mean: {df['combined_risk_score'].mean():.2f})")
    
    return df


def merge_with_geometry(province_data, provinces_gdf):
    """Merge province data with geometry"""
    print("Merging with province geometries...")
    
    # Merge on GID_1
    merged = provinces_gdf.merge(
        province_data,
        left_on='GID_1',
        right_on='province_id',
        how='left'
    )
    
    print(f"  Merged {merged['province_id'].notna().sum()} provinces with data")
    
    return merged


def main():
    """Main processing pipeline"""
    print("=" * 60)
    print("Process WRI Aqueduct CSV Data for Turkey")
    print("=" * 60)
    
    # Load data
    turkey_df = load_aqueduct_csv()
    provinces_gdf = load_province_boundaries()
    
    # Aggregate to provinces
    province_data = aggregate_to_provinces(turkey_df, provinces_gdf)
    
    # Calculate combined index
    province_data = calculate_combined_index(province_data)
    
    # Save CSV
    output_csv = PROCESSED_DATA / "turkey_water_risk_scores.csv"
    province_data.to_csv(output_csv, index=False)
    print(f"\nSaved: {output_csv}")
    
    # Merge with geometry
    provinces_with_scores = merge_with_geometry(province_data, provinces_gdf)
    
    # Save GeoJSON
    output_geojson = PROCESSED_DATA / "turkey_water_risk.geojson"
    provinces_with_scores.to_file(output_geojson, driver="GeoJSON")
    print(f"Saved: {output_geojson}")
    
    # Summary
    print("\nSummary:")
    print(f"  Provinces with data: {province_data['province_id'].notna().sum()}")
    print(f"  Combined risk - Min: {province_data['combined_risk_score'].min():.2f}, "
          f"Max: {province_data['combined_risk_score'].max():.2f}, "
          f"Mean: {province_data['combined_risk_score'].mean():.2f}")
    
    print("\nProcessing complete!")


if __name__ == "__main__":
    main()

