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
V4_DIR = PROCESSED_DIR / "v4.0" / "TUR" / "adm1"
V4_DIR.mkdir(parents=True, exist_ok=True)

def create_category_definitions():
    """
    Define all 13 Aqueduct 4.0 indicators organized into 4 groups.
    Clean, defensible grouping that matches how users think about water risk.
    """
    return {
        "groups": [
            {
                "id": "quantity_variability",
                "name": "Quantity & Variability",
                "description": "Physical water availability, demand, and temporal fluctuations",
                "indicators": [
                    {
                        "id": "baseline_stress",
                        "code": "bws",
                        "name": "Baseline Water Stress",
                        "short_name": "Water Stress",
                        "description": "Ratio of total water withdrawals to available renewable water supply",
                        "weight": 0.25,
                        "color": "#d73027",
                        "source": "PCR-GLOBWB 2",
                        "units": "ratio"
                    },
                    {
                        "id": "baseline_depletion",
                        "code": "bwd",
                        "name": "Baseline Water Depletion",
                        "short_name": "Water Depletion",
                        "description": "Ratio of consumption to available renewable water supply",
                        "weight": 0.20,
                        "color": "#fc8d59",
                        "source": "PCR-GLOBWB 2",
                        "units": "ratio"
                    },
                    {
                        "id": "groundwater_decline",
                        "code": "gtd",
                        "name": "Groundwater Table Decline",
                        "short_name": "Groundwater Decline",
                        "description": "Average decline rate of groundwater table",
                        "weight": 0.125,
                        "color": "#4575b4",
                        "source": "PCR-GLOBWB 2",
                        "units": "cm/year"
                    },
                    {
                        "id": "interannual_variability",
                        "code": "iav",
                        "name": "Interannual Variability",
                        "short_name": "Year-to-Year Variation",
                        "description": "Year-to-year variation in water supply",
                        "weight": 0.125,
                        "color": "#abd9e9",
                        "source": "PCR-GLOBWB 2",
                        "units": "coefficient"
                    },
                    {
                        "id": "seasonal_variability",
                        "code": "sev",
                        "name": "Seasonal Variability",
                        "short_name": "Seasonal Variation",
                        "description": "Month-to-month variation in water supply",
                        "weight": 0.125,
                        "color": "#e0f3f8",
                        "source": "PCR-GLOBWB 2",
                        "units": "coefficient"
                    },
                    {
                        "id": "drought_risk",
                        "code": "drr",
                        "name": "Drought Risk",
                        "short_name": "Drought",
                        "description": "Frequency of drought conditions (SPI < -1.5)",
                        "weight": 0.05,
                        "color": "#fee090",
                        "source": "CRU TS 4.03",
                        "units": "months"
                    }
                ]
            },
            {
                "id": "flooding",
                "name": "Flooding",
                "description": "Flood risk from rivers and coastal areas",
                "indicators": [
                    {
                        "id": "riverine_flood_risk",
                        "code": "rfr",
                        "name": "Riverine Flood Risk",
                        "short_name": "River Flooding",
                        "description": "Population exposed to 1-in-100 year riverine floods",
                        "weight": 0.05,
                        "color": "#91bfdb",
                        "source": "GLOFRIS",
                        "units": "percent"
                    },
                    {
                        "id": "coastal_flood_risk",
                        "code": "cfr",
                        "name": "Coastal Flood Risk",
                        "short_name": "Coastal Flooding",
                        "description": "Population exposed to 1-in-100 year coastal floods",
                        "weight": 0.025,
                        "color": "#4393c3",
                        "source": "WRI coastal model",
                        "units": "percent"
                    }
                ]
            },
            {
                "id": "quality",
                "name": "Quality",
                "description": "Water pollution and contamination indicators",
                "indicators": [
                    {
                        "id": "untreated_wastewater",
                        "code": "ucw",
                        "name": "Untreated Connected Wastewater",
                        "short_name": "Untreated Wastewater",
                        "description": "Percentage of collected wastewater not treated before discharge",
                        "weight": 0.03,
                        "color": "#8c510a",
                        "source": "Jones et al. 2021",
                        "units": "percent"
                    },
                    {
                        "id": "coastal_eutrophication",
                        "code": "cep",
                        "name": "Coastal Eutrophication Potential",
                        "short_name": "Eutrophication",
                        "description": "Nitrogen and phosphorus export to coastal waters",
                        "weight": 0.02,
                        "color": "#bf812d",
                        "source": "NEWS2 model",
                        "units": "kg/km²/year"
                    }
                ]
            },
            {
                "id": "access_reputational",
                "name": "Access & Reputational",
                "description": "Water access, sanitation, and governance risk",
                "indicators": [
                    {
                        "id": "unimproved_drinking_water",
                        "code": "udw",
                        "name": "Unimproved Drinking Water",
                        "short_name": "Unsafe Water Access",
                        "description": "Population without access to improved drinking water sources",
                        "weight": 0.0,
                        "color": "#762a83",
                        "source": "WHO/UNICEF JMP",
                        "units": "percent"
                    },
                    {
                        "id": "unimproved_sanitation",
                        "code": "usa",
                        "name": "Unimproved Sanitation",
                        "short_name": "Unsafe Sanitation",
                        "description": "Population without access to improved sanitation facilities",
                        "weight": 0.0,
                        "color": "#9970ab",
                        "source": "WHO/UNICEF JMP",
                        "units": "percent"
                    },
                    {
                        "id": "reputational_risk",
                        "code": "rri",
                        "name": "RepRisk Index",
                        "short_name": "Governance Risk",
                        "description": "Peak RepRisk country ESG risk index (country-level)",
                        "weight": 0.0,
                        "color": "#c2a5cf",
                        "source": "RepRisk",
                        "units": "index"
                    }
                ]
            }
        ]
    }


def load_processed_data():
    """Load processed water risk scores"""
    csv_file = PROCESSED_DIR / "turkey_water_risk_scores.csv"
    geojson_file = PROCESSED_DIR / "turkey_water_risk.geojson"
    
    if not csv_file.exists():
        raise FileNotFoundError(f"Processed data not found: {csv_file}")
    
    df = pd.read_csv(csv_file)
    gdf = gpd.read_file(geojson_file)
    
    return df, gdf


def compute_statistics(df, category_structure):
    """Compute min/max/mean for each indicator across all groups"""
    groups_with_stats = []
    
    for group in category_structure['groups']:
        indicators_with_stats = []
        
        for indicator in group['indicators']:
            score_col = f"{indicator['id']}_score"
            
            if score_col in df.columns:
                values = df[score_col].dropna()
                
                # Filter valid scores (0-5 range, exclude -9999)
                values = values[(values >= 0) & (values <= 5)]
                
                indicator_stats = {
                    **indicator,
                    "min_score": float(values.min()) if len(values) > 0 else 0.0,
                    "max_score": float(values.max()) if len(values) > 0 else 5.0,
                    "mean_score": float(values.mean()) if len(values) > 0 else 2.5,
                    "std_score": float(values.std()) if len(values) > 0 else 1.0,
                    "coverage": float(len(values) / len(df) * 100) if len(df) > 0 else 0.0
                }
            else:
                indicator_stats = {
                    **indicator,
                    "min_score": 0.0,
                    "max_score": 5.0,
                    "mean_score": 2.5,
                    "std_score": 1.0,
                    "coverage": 0.0
                }
            
            indicators_with_stats.append(indicator_stats)
        
        groups_with_stats.append({
            "id": group['id'],
            "name": group['name'],
            "description": group['description'],
            "indicators": indicators_with_stats
        })
    
    return {"groups": groups_with_stats}


def create_index_json(df, categories_with_stats):
    """Create index.json manifest for frontend"""
    
    combined_scores = df['combined_risk_score'].dropna()
    
    # Extract weighting scheme from indicator definitions
    weighting_scheme = {}
    for group in categories_with_stats['groups']:
        for indicator in group['indicators']:
            if indicator['weight'] > 0:
                weighting_scheme[indicator['id']] = indicator['weight']
    
    manifest = {
        "version": "4.0.0",
        "aqueduct_version": "4.0 (July 2023)",
        "generated": datetime.now(timezone.utc).isoformat(),
        "mode": "baseline_annual",
        "data_source": "WRI Aqueduct 4.0",
        "baseline_period": "1960-2019 (varies by indicator)",
        "spatial_resolution": "province (admin level 1)",
        "country": "TUR",
        "n_features": len(df),
        "indicator_groups": categories_with_stats,
        "combined_index": {
            "name": "Physical Water Risk (Default)",
            "method": "weighted_arithmetic_mean",
            "description": "Weighted average of quantity, variability, and quality indicators. Access/reputational indicators displayed separately.",
            "weighting_scheme": weighting_scheme,
            "min_score": float(combined_scores.min()) if len(combined_scores) > 0 else 0.0,
            "max_score": float(combined_scores.max()) if len(combined_scores) > 0 else 5.0,
            "mean_score": float(combined_scores.mean()) if len(combined_scores) > 0 else 2.5,
            "aggregation_note": "Province scores are area-weighted averages of sub-basin data"
        },
        "available_datasets": {
            "baseline_annual": "baseline_annual.json",
            "baseline_monthly": None,
            "future_annual": None
        },
        "license": "CC BY 4.0",
        "citation": "WRI (2023). Aqueduct 4.0. World Resources Institute. https://www.wri.org/aqueduct",
        "attribution": "Data: WRI Aqueduct 4.0 | Boundaries: GADM 4.1",
        "disclaimer": "Province-level values are area-weighted aggregations of WRI sub-basin data. For official water management decisions, consult Turkish government agencies (DSİ, MGM, TÜİK)."
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
    category_structure = create_category_definitions()
    total_indicators = sum(len(group['indicators']) for group in category_structure['groups'])
    print(f"\nDefined {total_indicators} indicators in {len(category_structure['groups'])} groups")
    
    # Compute statistics
    print("\nComputing statistics...")
    categories_with_stats = compute_statistics(df, category_structure)
    
    # Create manifest.json
    print("\nCreating manifest.json...")
    manifest = create_index_json(df, categories_with_stats)
    manifest_file = V4_DIR / "manifest.json"
    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {manifest_file}")
    
    # Create baseline_annual.json (GeoJSON with all data)
    print("\nCreating baseline_annual.json (GeoJSON with all indicators)...")
    main_data = create_main_data_json(df, gdf)
    main_data_file = V4_DIR / "baseline_annual.json"
    with open(main_data_file, 'w', encoding='utf-8') as f:
        json.dump(main_data, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {main_data_file}")
    
    # Also keep legacy files in old location for backward compatibility
    print("\nCreating legacy files (backward compatibility)...")
    legacy_index = PROCESSED_DIR / "index.json"
    legacy_data = PROCESSED_DIR / "turkey_water_risk.json"
    with open(legacy_index, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(legacy_data, 'w', encoding='utf-8') as f:
        json.dump(main_data, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {legacy_index.name}, {legacy_data.name}")
    
    # File sizes
    print("\nOutput files:")
    for file in [manifest_file, main_data_file]:
        size_mb = file.stat().st_size / 1024 / 1024
        print(f"  {file.name}: {size_mb:.2f} MB")
    
    print("\n" + "=" * 60)
    print("BUILD COMPLETE - 13 indicators ready!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Copy data/processed/v4.0/ to frontend/public/data/v4.0/")
    print("2. Update frontend data loader to use v4.0/TUR/adm1/ paths")
    print("3. Test locally, then deploy!")
    print("\nDirectory structure:")
    print(f"  {V4_DIR}/")
    print("    ├── manifest.json")
    print("    ├── baseline_annual.json")
    print("    ├── baseline_monthly.json (TODO: Phase 3)")
    print("    └── future_annual.json (TODO: Phase 3)")


if __name__ == "__main__":
    main()

