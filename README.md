# Türkiye Water Risk Map

[![Deploy to GitHub Pages](https://github.com/cemdusenkalkan/turkeywatermap/actions/workflows/deploy.yml/badge.svg)](https://github.com/cemdusenkalkan/turkeywatermap/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Data: WRI Aqueduct](https://img.shields.io/badge/Data-WRI_Aqueduct_4.0-blue)](https://www.wri.org/aqueduct)

**Open-source water risk assessment platform for Turkey using WRI Aqueduct 4.0 data**

**[Live Demo](https://cemdusenkalkan.github.io/turkeywatermap)** | **[Data Downloads](https://github.com/cemdusenkalkan/turkeywatermap/releases)** | **[Methodology](docs/METHODOLOGY.md)**

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

### For Users

Visit **[turkiye-watermap](https://cemdusenkalkan.github.io/turkeywatermap)** to explore the interactive map.

Download processed data from [Releases](https://github.com/cemdusenkalkan/turkeywatermap/releases).

### For Developers

#### Prerequisites
- Python 3.10+
- Node.js 18+
- Git
- 1GB free disk space

#### Clone & Setup

```bash
git clone https://github.com/cemdusenkalkan/turkeywatermap.git
cd turkeywatermap

# Setup Python environment
cd pipeline
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download and process WRI Aqueduct data
./run_pipeline.sh

# This downloads ~500MB and processes to province-level
# Takes 10-30 minutes depending on connection

# Copy processed data to frontend
mkdir -p ../frontend/public/data
cp -r ../data/processed/* ../frontend/public/data/

# Install and run frontend
cd ../frontend
npm install
npm run dev
```

Frontend available at `http://localhost:5173/turkeywatermap/`

---

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
4. **Groundwater Table Decline** (12.5%) - Rate of groundwater depletion
5. **Drought Risk** (6.25%) - Frequency of drought months (SPI < -1.5)
6. **Riverine Flood Risk** (6.25%) - Population exposed to 100-year floods

### Data Sources

- **Hydrology**: PCR-GLOBWB 2 model (Utrecht University)
- **Drought**: CRU TS 4.03 precipitation dataset
- **Flood**: GLOFRIS flood model (Deltares)
- **Spatial**: HydroBASINS level 6 sub-basins, aggregated to Turkey provinces

### Combined Index

Weighted arithmetic mean following WRI's methodology:

```
Combined Score = Σ(indicator_score × weight) / Σ(weights)
```

### Spatial Aggregation

Sub-basin indicators aggregated to provinces using area-weighted averaging:

```
Province Score = Σ(sub-basin_score × intersection_area) / total_province_area
```

See [METHODOLOGY.md](docs/METHODOLOGY.md) for full technical details.

---

## Technology Stack

### Data Pipeline
- Python 3.10+ (pandas, geopandas, numpy)
- WRI Aqueduct 4.0 GeoPackage data
- GADM administrative boundaries

### Frontend
- React 18 + TypeScript
- Vite 7
- MapLibre GL JS 5.0
- Motion for animations
- Tailwind CSS 3

### Hosting
- GitHub Pages (static site)
- GitHub Actions (CI/CD)

---

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

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

**Areas of Need**:
- Additional visualizations (time-series, charts)
- Turkish localization
- Basin-level resolution
- Mobile UX improvements
- Performance optimizations

---

## License

- **Code**: [MIT License](LICENSE)
- **Data**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (WRI Aqueduct)
- **Source Data**: See [DATA_SOURCES.md](docs/DATA_SOURCES.md)

---

## Citation

```bibtex
@software{turkiye_watermap_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkeywatermap},
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

This is a community-driven project using WRI Aqueduct global model data. Province-level values are area-weighted averages of sub-basin indicators. For official water management decisions, consult Turkish government agencies (DSİ, MGM, TÜİK).

---

## Acknowledgments

- **World Resources Institute** for Aqueduct 4.0 data and methodology
- **Utrecht University** for PCR-GLOBWB 2 hydrological model
- **GADM** for administrative boundaries
- **MapLibre**, **PMTiles**, and open-source geospatial community

---

**Built with water security in mind for Turkey**
