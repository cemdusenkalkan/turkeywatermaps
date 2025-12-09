# Data Sources & Citations

This document lists all data sources used in the Türkiye Water Risk Map project.

## Climate & Hydrology

### ERA5-Land Reanalysis (ECMWF)
- **Provider:** European Centre for Medium-Range Weather Forecasts (ECMWF)
- **Product:** ERA5-Land hourly and monthly data
- **Variables:** Total precipitation, runoff, surface runoff, sub-surface runoff
- **Resolution:** 0.1° (~10 km)
- **Temporal Coverage:** 2000-2023
- **Access:** Copernicus Climate Data Store (CDS)
- **URL:** https://cds.climate.copernicus.eu/
- **License:** Copernicus License (free for all users)
- **Citation:**
  ```
  Muñoz Sabater, J., (2019): ERA5-Land hourly data from 1950 to present. 
  Copernicus Climate Change Service (C3S) Climate Data Store (CDS). 
  DOI: 10.24381/cds.e2161bac
  ```

**Quality Notes:**
- Validated against Turkish Meteorological Service (MGM) station observations
- Known to perform well over Turkey (see Karger et al. 2020)

---

## Socioeconomic Data

### T�İK (Turkish Statistical Institute)
- **Provider:** Türkiye İstatistik Kurumu
- **Datasets:**
  - Water use statistics by province
  - Population data and projections
  - Irrigated agriculture areas
- **Temporal Coverage:** Various, typically 2000-2023
- **Access:** https://data.tuik.gov.tr/ (manual download required for some datasets)
- **License:** Open Government License (Turkey)
- **Citation:**
  ```
  Turkish Statistical Institute (T�İK). (2024). [Dataset Name]. 
  Retrieved from https://data.tuik.gov.tr/
  ```

---

## Groundwater

### GRACE/GRACE-FO Groundwater Storage
- **Provider:** NASA/GFZ
- **Product:** GRACE/GRACE-FO Level 3 Terrestrial Water Storage Anomalies
- **Resolution:** 0.25° native, ~300 km effective (due to spatial filtering)
- **Temporal Coverage:** 2002-2023 (with gap 2017-2018)
- **Access:** NASA GES DISC or JPL TELLUS
- **URL:** https://grace.jpl.nasa.gov/data/get-data/
- **License:** NASA Open Data Policy (free for all users)
- **Citation:**
  ```
  Landerer, F.W. and S.C. Swenson, Accuracy of scaled GRACE terrestrial water 
  storage estimates. Water Resources Research, Vol 48, W04531, 
  DOI: 10.1029/2011WR011453, 2012.
  ```

**Quality Notes:**
- Coarse resolution requires spatial interpolation for province-level estimates
- Represents total water storage change (not groundwater alone); soil moisture component removed using models

---

## Hydro-Infrastructure

### DSİ (State Hydraulic Works)
- **Provider:** Devlet Su İ�leri Genel Müdürlüğü
- **Datasets:**
  - Water potential reports by basin
  - Groundwater monitoring network data
  - Dam inventories and operational statistics
- **Temporal Coverage:** Various reports, typically 2000-2023
- **Access:** https://www.dsi.gov.tr/ (mostly PDF reports, manual extraction required)
- **License:** Public domain (government reports)
- **Citation:**
  ```
  DSI (State Hydraulic Works). (2023). Water Potential Report [in Turkish]. 
  Retrieved from https://www.dsi.gov.tr/
  ```

---

## Topography & Flood Proxies

### MERIT-Hydro
- **Provider:** University of Tokyo
- **Product:** Multi-Error-Removed Improved-Terrain DEM and hydrography
- **Variables:** Elevation, height above nearest drainage, flow direction
- **Resolution:** 3 arc-seconds (~90 m)
- **Access:** http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_Hydro/
- **License:** Free for academic and non-commercial use
- **Citation:**
  ```
  Yamazaki, D., et al. (2019). MERIT Hydro: A high-resolution global hydrography map 
  based on latest topography datasets. Water Resources Research, 55. 
  DOI: 10.1029/2019WR024873
  ```

---

## Disaster Events

### AFAD (Disaster and Emergency Management Authority)
- **Provider:** Afet ve Acil Durum Yönetimi Ba�kanlığı
- **Datasets:** Historical flood event database
- **Temporal Coverage:** 2000-2023
- **Access:** https://www.afad.gov.tr/ (manual scraping required)
- **License:** Public domain (government records)
- **Citation:**
  ```
  AFAD (Disaster and Emergency Management Authority). (2024). 
  Historical Disaster Database [in Turkish]. Retrieved from https://www.afad.gov.tr/
  ```

---

## Spatial Boundaries

### Turkey Province Boundaries
- **Option 1: GADM (preferred for open access)**
  - **URL:** https://gadm.org/
  - **License:** Free for academic and non-commercial use
  - **Citation:**
    ```
    GADM. (2024). Database of Global Administrative Areas, version 4.1. 
    Retrieved from https://gadm.org/
    ```

- **Option 2: T�İK Official Boundaries**
  - **URL:** https://cbs.tuik.gov.tr/ (requires manual request)
  - **License:** Public domain (government data)

---

## Auxiliary Data

### OpenStreetMap (Basemap)
- **Provider:** OpenStreetMap contributors
- **Usage:** Background map tiles via CartoCDN
- **License:** Open Data Commons Open Database License (ODbL)
- **Attribution:** © OpenStreetMap contributors
- **URL:** https://www.openstreetmap.org/copyright

---

## Data Processing

### PMTiles (Vector Tile Format)
- **Provider:** Protomaps
- **License:** BSD-3-Clause
- **Citation:**
  ```
  Brandon Liu. (2024). PMTiles: Single-file archive format for tiled data.
  https://github.com/protomaps/PMTiles
  ```

---

## Notes on Data Availability

### Challenges
1. **T�İK Data:** Some datasets require manual download or scraping; no unified API for all statistics
2. **DSİ Reports:** Mostly in PDF format (Turkish); requires manual extraction and digitization
3. **GRACE Resolution:** Coarse spatial resolution necessitates gap-filling for province-level estimates
4. **Flood Maps:** Detailed floodplain delineations not publicly available for all regions

### Data Updates
- We aim to update datasets annually
- Users can check `data/processed/index.json` for the `generated` timestamp
- Contribution of more recent or higher-resolution data is welcome

---

## Acknowledgments

We gratefully acknowledge:
- **ECMWF** for making ERA5-Land freely available
- **NASA/GFZ** for GRACE mission data
- **Turkish government agencies** (T�İK, DSİ, MGM, AFAD) for open data initiatives
- **GADM** and **OpenStreetMap** communities for spatial data
- All open-source software maintainers whose tools enable this project

---

## How to Cite This Project

If you use data or methods from this project, please cite:

```bibtex
@software{turkiye_watermap_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkiye-watermap},
  license = {MIT (Code), CC BY 4.0 (Data)}
}
```

---

**Last Updated:** January 2025

