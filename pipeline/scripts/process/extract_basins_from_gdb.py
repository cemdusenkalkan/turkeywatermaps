#!/usr/bin/env python3
"""
Extract sub-basin geometries from Aqueduct GDB for Turkey region.
Creates basin-level GeoJSON with all water risk indicators.
"""

import geopandas as gpd
import fiona
from pathlib import Path
import json

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # Go up to turkeywatermap/
RAW_DATA = PROJECT_ROOT / "data" / "raw"
PROCESSED_DATA = PROJECT_ROOT / "data" / "processed"
FRONTEND_DATA = PROJECT_ROOT / "frontend" / "public" / "data"

# Ensure directories exist
PROCESSED_DATA.mkdir(parents=True, exist_ok=True)
FRONTEND_DATA.mkdir(parents=True, exist_ok=True)

# Turkey bounding box
TURKEY_BBOX = (25.5, 35.8, 44.8, 42.1)

# Key indicators to keep (reduce file size)
KEY_INDICATORS = [
    'pfaf_id',      # Pfafstetter basin ID (for hierarchy)
    'aqid',         # Aqueduct ID
    'name_0',       # Country
    'name_1',       # Province
    'area_km2',     # Basin area
    # Water risk indicators
    'bws_raw', 'bws_score', 'bws_label',  # Baseline water stress
    'bwd_raw', 'bwd_score', 'bwd_label',  # Baseline water depletion
    'iav_raw', 'iav_score', 'iav_label',  # Interannual variability
    'sev_raw', 'sev_score', 'sev_label',  # Seasonal variability
    'gtd_raw', 'gtd_score', 'gtd_label',  # Groundwater table decline
    'rfr_raw', 'rfr_score', 'rfr_label',  # Riverine flood risk
    'cfr_raw', 'cfr_score', 'cfr_label',  # Coastal flood risk
    'drr_raw', 'drr_score', 'drr_label',  # Drought risk
    'ucw_raw', 'ucw_score', 'ucw_label',  # Untreated connected wastewater
    'cep_raw', 'cep_score', 'cep_label',  # Coastal eutrophication potential
    'udw_raw', 'udw_score', 'udw_label',  # Unimproved drinking water
    'usa_raw', 'usa_score', 'usa_label',  # Unimproved sanitation
    'rri_raw', 'rri_score', 'rri_label',  # Reputational risk
]


def extract_basins():
    """Extract basins from Aqueduct GDB"""
    gdb_path = RAW_DATA / "aqueduct" / "GDB" / "Aq40_Y2023D07M05.gdb"
    
    if not gdb_path.exists():
        print(f"ERROR: Aqueduct GDB not found at {gdb_path}")
        print("Please ensure you have downloaded the Aqueduct 4.0 data.")
        return None
    
    print("=" * 60)
    print("Extracting Sub-Basins from Aqueduct GDB")
    print("=" * 60)
    
    # Read baseline_annual layer with bbox filter (much faster!)
    print(f"\nReading layer: baseline_annual")
    print(f"Filtering to Turkey region: {TURKEY_BBOX}")
    print("(This may take 2-3 minutes for 68K features...)")
    
    west, south, east, north = TURKEY_BBOX
    turkey_basins = gpd.read_file(
        gdb_path,
        layer='baseline_annual',
        bbox=(west, south, east, north)  # Filter during read - MUCH faster!
    )
    print(f"  Turkey basins loaded: {len(turkey_basins)}")
    print(f"  CRS: {turkey_basins.crs}")
    
    # Keep only key indicators (reduce file size)
    print(f"\nReducing columns from {len(turkey_basins.columns)} to {len(KEY_INDICATORS)} key indicators")
    available_cols = [col for col in KEY_INDICATORS if col in turkey_basins.columns]
    turkey_basins = turkey_basins[available_cols + ['geometry']]
    
    # Simplify geometries for web (Douglas-Peucker algorithm)
    print("\nSimplifying geometries for web performance...")
    original_size = turkey_basins.geometry.to_json().__sizeof__() / 1024 / 1024
    print(f"  Original size: {original_size:.1f} MB")
    
    turkey_basins['geometry'] = turkey_basins.geometry.simplify(
        tolerance=0.001,  # ~100m at equator
        preserve_topology=True
    )
    
    simplified_size = turkey_basins.geometry.to_json().__sizeof__() / 1024 / 1024
    print(f"  Simplified size: {simplified_size:.1f} MB")
    print(f"  Reduction: {(1 - simplified_size/original_size)*100:.1f}%")
    
    return turkey_basins


def create_hierarchical_levels(basins_gdf):
    """
    Create different aggregation levels from pfaf_id.
    Pfafstetter coding: higher levels = larger basins
    """
    print("\nCreating hierarchical basin levels...")
    
    # Level 6: First 6 digits of pfaf_id (large basins)
    basins_gdf['basin_l6'] = basins_gdf['pfaf_id'].astype(str).str[:6]
    
    # Level 7: First 7 digits (medium basins)
    basins_gdf['basin_l7'] = basins_gdf['pfaf_id'].astype(str).str[:7]
    
    # Level 8: First 8 digits (small basins)
    basins_gdf['basin_l8'] = basins_gdf['pfaf_id'].astype(str).str[:8]
    
    unique_l6 = basins_gdf['basin_l6'].nunique()
    unique_l7 = basins_gdf['basin_l7'].nunique()
    unique_l8 = basins_gdf['basin_l8'].nunique()
    
    print(f"  Level 6 (large): {unique_l6} basins")
    print(f"  Level 7 (medium): {unique_l7} basins")
    print(f"  Level 8 (small): {unique_l8} basins")
    
    return basins_gdf


def aggregate_to_level(basins_gdf, level_col):
    """Aggregate sub-basins to a higher level"""
    print(f"\nAggregating to {level_col}...")
    
    # Group by level and aggregate indicators (area-weighted mean)
    numeric_cols = [col for col in basins_gdf.columns if '_raw' in col or col == 'area_km2']
    
    aggregated = basins_gdf.dissolve(
        by=level_col,
        aggfunc={
            **{col: 'mean' for col in numeric_cols if col in basins_gdf.columns},
            'name_0': 'first',
            'name_1': 'first'
        }
    ).reset_index()
    
    print(f"  Aggregated to {len(aggregated)} basins")
    
    return aggregated


def save_outputs(basins_gdf):
    """Save multiple formats for different use cases"""
    
    # Full detailed basins (all sub-basins)
    output_detailed = FRONTEND_DATA / "basins_turkey_detailed.geojson"
    print(f"\n[1/4] Saving detailed basins: {output_detailed}")
    basins_gdf.to_file(output_detailed, driver="GeoJSON")
    size_mb = output_detailed.stat().st_size / 1024 / 1024
    print(f"  Size: {size_mb:.1f} MB")
    
    # Level 6 (large basins) - recommended for main UI
    basins_l6 = aggregate_to_level(basins_gdf, 'basin_l6')
    output_l6 = FRONTEND_DATA / "basins_turkey_l6.geojson"
    print(f"\n[2/4] Saving Level 6 basins: {output_l6}")
    basins_l6.to_file(output_l6, driver="GeoJSON")
    size_mb = output_l6.stat().st_size / 1024 / 1024
    print(f"  Size: {size_mb:.1f} MB")
    
    # Level 7 (medium basins)
    basins_l7 = aggregate_to_level(basins_gdf, 'basin_l7')
    output_l7 = FRONTEND_DATA / "basins_turkey_l7.geojson"
    print(f"\n[3/4] Saving Level 7 basins: {output_l7}")
    basins_l7.to_file(output_l7, driver="GeoJSON")
    size_mb = output_l7.stat().st_size / 1024 / 1024
    print(f"  Size: {size_mb:.1f} MB")
    
    # Also save to processed directory
    processed_output = PROCESSED_DATA / "turkey_basins_l6.geojson"
    print(f"\n[4/4] Saving to processed: {processed_output}")
    basins_l6.to_file(processed_output, driver="GeoJSON")
    
    # Create index metadata
    metadata = {
        "source": "WRI Aqueduct 4.0 baseline_annual layer",
        "date_processed": "2025-12-16",
        "total_subbasins": len(basins_gdf),
        "level6_basins": len(basins_l6),
        "level7_basins": len(basins_l7),
        "indicators": [col for col in basins_gdf.columns if '_raw' in col],
        "crs": "EPSG:4326",
        "bbox": TURKEY_BBOX
    }
    
    metadata_file = FRONTEND_DATA / "basins_metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"\nSaved metadata: {metadata_file}")


def main():
    """Main execution"""
    
    # Extract basins from GDB
    basins_gdf = extract_basins()
    
    if basins_gdf is None:
        return
    
    # Create hierarchical levels
    basins_gdf = create_hierarchical_levels(basins_gdf)
    
    # Save outputs
    save_outputs(basins_gdf)
    
    print("\n" + "=" * 60)
    print("✓ Basin extraction complete!")
    print("=" * 60)
    print("\nOutput files:")
    print("  - basins_turkey_detailed.geojson (all sub-basins)")
    print("  - basins_turkey_l6.geojson (recommended for UI)")
    print("  - basins_turkey_l7.geojson (higher detail)")
    print("  - basins_metadata.json (index)")
    print("\nNext steps:")
    print("  1. Download HydroRIVERS for river network")
    print("  2. Update frontend to load basin layers")
    print("  3. Add basin/province toggle UI")


if __name__ == "__main__":
    main()
