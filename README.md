

**Open-source water risk assessment platform for Turkey using WRI Aqueduct 4.0 data**

[Live Demo](https://cemdusenkalkan.github.io/turkeywatermaps) | [Data Downloads](https://github.com/cemdusenkalkan/turkeywatermaps/releases) | [Methodology](docs/METHODOLOGY.md)

---

## Overview

This project provides transparent water risk assessments across Turkey's 81 provinces using real data from the World Resources Institute's Aqueduct 4.0 global water risk atlas. The platform visualizes six water risk dimensions derived from the PCR-GLOBWB 2 hydrological model through an interactive web map.

### Key Features

- **6 WRI Aqueduct Indicators**: Baseline water stress, seasonal/interannual variability, groundwater decline, drought risk, flood risk
- **Combined Risk Index**: WRI's weighted arithmetic mean methodology
- **Interactive Map**: Fast, GPU-accelerated rendering with MapLibre GL JS
- **Province-Level Data**: All 81 Turkish provinces with area-weighted aggregation
- **Real Data**: WRI Aqueduct 4.0 from PCR-GLOBWB 2 hydrological model
- **Open & Reproducible**: Complete pipeline from download to visualization
- **Performant**: Optimized single-file data architecture
- **Accessible**: WCAG 2.1 AA basics implemented

---

## Quick Start

Visit the live site at https://cemdusenkalkan.github.io/turkeywatermaps

Download processed data from releases.

### Development Setup

Requirements:
- Python 3.10+
- Node.js 18+
- Git

Clone and setup:

```bash
git clone https://github.com/cemdusenkalkan/turkeywatermaps.git
cd turkeywatermaps

# Setup Python environment
cd pipeline
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Download and process data
./run_pipeline.sh

# Copy data to frontend
mkdir -p ../frontend/public/data
cp -r ../data/processed/* ../frontend/public/data/

# Install and run frontend
cd ../frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173/turkeywatermaps/

## Project Structure

```
├── pipeline/          # Python data processing
├── frontend/          # React + Vite web app
├── data/             # Generated data (gitignored)
├── docs/             # Documentation
└── .github/workflows/ # CI/CD automation
```

---

## Data & Methodology

### WRI Aqueduct Indicators

This project uses six indicators from WRI Aqueduct 4.0:

1. **Baseline Water Stress** (25% weight) - Ratio of water withdrawals to available supply
2. **Seasonal Variability** (25%) - Intra-annual variation in water availability
3. **Interannual Variability** (25%) - Year-to-year variation (1960-2014)
4. **Groundwater Table Decline** (12.5%) - Rate of groundwat5. **Drought Risk** (6.25%) - Frequency of drought months (SPI < -1.5)
6. **Riverine Flood Risk** (6.25%) - Population exposed to 100-year floods

### Data Sources

- Hydrology: PCR-GLOBWB 2 model (Utrecht University)
- Drought: CRU TS 4.03 precipitation dataset
- Flood: GLOFRIS flood model (Deltares)
- Spatial: HydroBASINS level 6 sub-basins, aggregated to Turkey provinces

### Combined Index

Weighted arithmetic mean following WRI's methodology.

### Spatial Aggregation

Sub-basin indicators aggregated to provinces using area-weighted averaging.

See docs/METHODOLOGY.md for technical details.

## Technology

### Data Pipeline
- Python 3.10+ (pandas, geopandas, numpy)
- WRI Aqueduct 4.0 GeoPackage
- GADM administrative boundaries

### Frontend
- React 18 + TypeScript
- Vite 7
- MapLibre GL JS 5.0
- Tailwind CSS 3

### Hosting
- GitHub Pages
- GitHub Actions

## Development

### Run Python Pipeline

```bash
cd pipeline
source venv/bin/activate

# Download all data
./run_pipeline.sh

# Or run steps individually:
python scripts/download/turkey_boundaries.py
python scripts/download/aqueduct_data.py
python scripts/process/aggregate_to_provinces.py
python scripts/build_real_data.py
```

### Run Frontend

```bash
cd frontend

npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Contributing

Contributions welcome. See docs/CONTRIBUTING.md for guidelines.

## License

- Code: MIT License
- Data: CC BY 4.0 (WRI Aqueduct)
- Source data: See docs/DATA_SOURCES.md

## Citation

```bibtex
@software{turkiye_watermap_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkeywatermaps},
  license = {MIT}
}

@misc{wri_aqueduct_2019,
  title = {Aqueduct 4.0: Updated Decision-Relevant Global Water Risk Indicators},
  author = {Hofste, Rutger W and Kuzma, Samantha and Walker, Susan and Sutanudjaja, Edwin H and Bierkens, Marc FP and Kuijper, Marijn JM and Sanchez, Magdalena Faneca and Van Beek, Rens and Wada, Yoshihide and Rodríguez, Sergio Gálvez and Reig, Paul},
  year = {2019},
  institution = {World Resources Institute}
}
```

---

## Disclaimer

Community-driven project using WRI Aqueduct global model data. Province-level values are area-weighted averages of sub-basin indicators. For official water management decisions, consult Turkish government agencies (DSİ, MGM, TÜİK).

## Acknowledgments

- World Resources Institute for Aqueduct 4.0 data and methodology
- Utrecht University for PCR-GLOBWB 2 hydrological model
- GADM for administrative boundaries
