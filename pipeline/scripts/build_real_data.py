#!/usr/bin/env python3
"""
Build complete water risk dataset for frontend from WRI Aqueduct data.
Creates single JSON file with all data + GeoJSON with geometries.
"""

import json
from pathlib import Path
import pandas as pd
import geopandas as gpd
import numpy as np
from datetime import datetime, timezone

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
PROCESSED_DIR = DATA_DIR / "processed"

def create_category_definitions():
    """
    Define categories based on WRI Aqueduct indicators.
    Uses actual WRI methodology and definitions.
    """
    return [
        {
            "id": "baseline_stress",
            "name": "Baseline Water Stress",
            "short_name": "Water Stress",
            "description": "Ratio of total water withdrawals to available renewable water supply (WRI Aqueduct indicator)",
            "weight": 0.25,
            "color": "#d73027",
            "source": "WRI Aqueduct 4.0 - PCR-GLOBWB 2",
            "methodology": "Total withdrawals / (Surface water + groundwater recharge)",
            "units": "ratio"
        },
        {
            "id": "seasonal_variability",
            "name": "Seasonal Variability",
            "short_name": "Seasonal Var",
            "description": "Coefficient of variation of monthly available water supply (WRI Aqueduct indicator)",
            "weight": 0.25,
            "color": "#fc8d59",
            "source": "WRI Aqueduct 4.0 - PCR-GLOBWB 2",
            "methodology": "CV = StdDev(monthly_supply) / Mean(monthly_supply)",
            "units": "coefficient_of_variation"
        },
        {
            "id": "interannual_variability",
            "name": "Interannual Variability",
            "short_name": "Interannual Var",
            "description": "Coefficient of variation of annual available water supply (WRI Aqueduct indicator)",
            "weight": 0.25,
            "color": "#e0f3f8",
            "source": "WRI Aqueduct 4.0 - PCR-GLOBWB 2 (1960-2014)",
            "methodology": "CV = StdDev(annual_supply) / Mean(annual_supply)",
            "units": "coefficient_of_variation"
        },
        {
            "id": "groundwater_stress",
            "name": "Groundwater Table Decline",
            "short_name": "Groundwater",
            "description": "Average groundwater table decline rate (WRI Aqueduct indicator)",
            "weight": 0.125,
            "color": "#4575b4",
            "source": "WRI Aqueduct 4.0 - PCR-GLOBWB 2",
            "methodology": "Linear trend in groundwater head over time",
            "units": "cm_per_year"
        },
        {
            "id": "drought_hazard",
            "name": "Drought Risk",
            "short_name": "Drought",
            "description": "Number of months with drought conditions (SPI < -1.5) from 1950-2014 (WRI Aqueduct indicator)",
            "weight": 0.0625,
            "color": "#fee08b",
            "source": "WRI Aqueduct 4.0 - CRU TS 4.03",
            "methodology": "Count of months where SPI-12 < -1.5",
            "units": "drought_months"
        },
        {
            "id": "flood_hazard",
            "name": "Riverine Flood Risk",
            "short_name": "Flood Risk",
            "description": "Percentage of population exposed to 1-in-100 year riverine floods (WRI Aqueduct indicator)",
            "weight": 0.0625,
            "color": "#91bfdb",
            "source": "WRI Aqueduct 4.0 - GLOFRIS",
            "methodology": "% population in 100-year floodplain",
            "units": "percent"
        }
    ]


def load_processed_data():
    """Load processed water risk scores"""
    csv_file = PROCESSED_DIR / "turkey_water_risk_scores.csv"
    geojson_file = PROCESSED_DIR / "turkey_water_risk.geojson"
    
    if not csv_file.exists():
        raise FileNotFoundError(f"Processed data not found: {csv_file}")
    
    df = pd.read_csv(csv_file)
    gdf = gpd.read_file(geojson_file)
    
    return df, gdf


def compute_statistics(df, categories):
    """Compute min/max/mean for each category"""
    stats = []
    
    for cat in categories:
        score_col = f"{cat['id']}_score"
        
        if score_col in df.columns:
            values = df[score_col].dropna()
            
            stats.append({
                **cat,
                "min_score": float(values.min()) if len(values) > 0 else 0.0,
                "max_score": float(values.max()) if len(values) > 0 else 5.0,
                "mean_score": float(values.mean()) if len(values) > 0 else 2.5,
                "std_score": float(values.std()) if len(values) > 0 else 1.0
            })
        else:
            stats.append({
                **cat,
                "min_score": 0.0,
                "max_score": 5.0,
                "mean_score": 2.5,
                "std_score": 1.0
            })
    
    return stats


def create_index_json(df, categories_with_stats):
    """Create index.json manifest for frontend"""
    
    combined_scores = df['combined_risk_score'].dropna()
    
    manifest = {
        "version": "1.0.0",
        "generated": datetime.now(timezone.utc).isoformat(),
        "mode": "production",
        "data_source": "WRI Aqueduct 4.0",
        "spatial_resolution": "province",
        "n_provinces": len(df),
        "temporal_coverage": "Baseline (1960-2019, varies by indicator)",
        "categories": categories_with_stats,
        "combined_index": {
            "method": "weighted_arithmetic_mean",
            "description": "WRI Aqueduct aggregation: weighted average of physical risk indicators",
            "min_score": float(combined_scores.min()) if len(combined_scores) > 0 else 0.0,
            "max_score": float(combined_scores.max()) if len(combined_scores) > 0 else 5.0,
            "mean_score": float(combined_scores.mean()) if len(combined_scores) > 0 else 2.5
        },
        "files": {
            "geojson": "turkey_water_risk.geojson",
            "main_data": "turkey_water_risk.json"
        },
        "license": "CC BY 4.0",
        "citation": "WRI (2019). Aqueduct 4.0. World Resources Institute. https://www.wri.org/aqueduct",
        "disclaimer": "Data derived from WRI Aqueduct global model. Province-level values are area-weighted averages of sub-basin data. For official water management decisions, consult Turkish government agencies (DSİ, MGM, TÜİK)."
    }
    
    return manifest


def create_main_data_json(df, gdf):
    """
    Create single JSON file with all data for frontend.
    Includes geometry as GeoJSON features.
    """
    
    # Merge dataframe with geometry
    # Drop geometry from gdf temporarily to avoid conflicts, keep only essential columns
    gdf_merge = gdf[['GID_1', 'NAME_1', 'VARNAME_1', 'geometry']].copy()
    
    merged = gdf_merge.merge(
        df,
        left_on='GID_1',
        right_on='province_id',
        how='left'
    )
    
    # Convert to GeoJSON structure
    features = []
    
    # Debug: check merge result
    print(f"  Merged dataframe shape: {merged.shape}")
    print(f"  Score columns in merged: {[c for c in merged.columns if 'score' in c.lower()][:5]}")
    
    for idx, row in merged.iterrows():
        # Get all score columns
        properties = {
            'province_id': str(row.get('GID_1', row.get('province_id', ''))),
            'name': str(row.get('NAME_1', row.get('province_name', ''))),
            'name_tr': str(row.get('VARNAME_1', row.get('province_name', ''))),
        }
        
        # Add all score columns from dataframe
        for col in df.columns:
            if col.endswith('_score') or col.endswith('_raw'):
                if col in merged.columns:
                    val = row[col]
                    if pd.notna(val) and val != -9999:
                        try:
                            properties[col] = float(val)
                        except (ValueError, TypeError):
                            pass
        
        # Add combined score (rename from combined_risk_score to combined_score)
        if 'combined_risk_score' in merged.columns:
            val = row['combined_risk_score']
            if pd.notna(val) and val != -9999:
                try:
                    properties['combined_score'] = float(val)
                except (ValueError, TypeError):
                    pass
        
        features.append({
            'type': 'Feature',
            'geometry': json.loads(gpd.GeoSeries([row.geometry]).to_json())['features'][0]['geometry'],
            'properties': properties
        })
    
    geojson_data = {
        'type': 'FeatureCollection',
        'features': features
    }
    
    return geojson_data


def main():
    """Build final dataset for frontend"""
    print("=" * 60)
    print("Building Real Water Risk Dataset from WRI Aqueduct")
    print("=" * 60)
    
    # Load processed data
    print("\nLoading processed data...")
    df, gdf = load_processed_data()
    print(f"  Loaded {len(df)} provinces with scores")
    
    # Define categories
    categories = create_category_definitions()
    print(f"\nDefined {len(categories)} categories from WRI Aqueduct")
    
    # Compute statistics
    print("\nComputing statistics...")
    categories_with_stats = compute_statistics(df, categories)
    
    # Create index.json
    print("\nCreating index.json manifest...")
    manifest = create_index_json(df, categories_with_stats)
    manifest_file = PROCESSED_DIR / "index.json"
    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {manifest_file}")
    
    # Create main data JSON
    print("\nCreating turkey_water_risk.json (GeoJSON with all data)...")
    main_data = create_main_data_json(df, gdf)
    main_data_file = PROCESSED_DIR / "turkey_water_risk.json"
    with open(main_data_file, 'w', encoding='utf-8') as f:
        json.dump(main_data, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {main_data_file}")
    
    # File sizes
    print("\nOutput files:")
    for file in [manifest_file, main_data_file]:
        size_mb = file.stat().st_size / 1024 / 1024
        print(f"  {file.name}: {size_mb:.2f} MB")
    
    print("\n" + "=" * 60)
    print("BUILD COMPLETE - Real data ready for frontend!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Copy data/processed/ to frontend/public/data/")
    print("2. Update frontend data loader to use turkey_water_risk.json")
    print("3. Deploy!")


if __name__ == "__main__":
    main()

