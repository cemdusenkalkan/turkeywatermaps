# Detailed Methodology

## Overview

This document provides a comprehensive technical description of the water risk assessment methodology used in the TÃ¼rkiye Water Risk Map project.

## Framework Inspiration

Our approach is inspired by the **World Resources Institute (WRI) Aqueduct Water Risk Atlas** methodology but adapted for:
- Turkey-specific data availability
- Open-source reproducibility
- Province-level spatial resolution
- Integration of Turkish government data sources

### Key Differences from Aqueduct
- **Spatial Unit:** Provinces (81 units) vs. watersheds
- **Data Sources:** Prioritize Turkish national data when available
- **Transparency:** Fully open pipeline vs. proprietary implementation
- **Scoring:** Quantile-based normalization within Turkey

---

## Risk Categories

### 1. Baseline Water Stress

**Definition:** Annual ratio of total water withdrawals to available renewable supply.

**Calculation:**
```
stress_ratio = total_withdrawal / renewable_supply

where:
  total_withdrawal = municipal + industrial + agricultural (mÂ³/year)
  renewable_supply = surface_water + groundwater_recharge (mÂ³/year)
```

**Data Sources:**
- Withdrawals: TÃÄ°K water use statistics by province
- Supply: DSÄ° water potential reports + ERA5-Land runoff climatology

**Normalization:**
```
score = min(5, (stress_ratio / 0.8) * 5)
# 0.8 = critical threshold (80% withdrawal-to-availability)
```

**Uncertainty:** HIGH
- Agricultural withdrawals estimated from irrigated area where direct measurements unavailable
- Groundwater recharge uncertain in karst regions

---

### 2. Seasonal Variability

**Definition:** Intra-annual variation in water availability.

**Calculation:**
```
cv_seasonal = std(monthly_runoff) / mean(monthly_runoff)

where:
  monthly_runoff = ERA5-Land runoff for each month (2000-2023 climatology)
```

**Normalization:**
```
score = min(5, (cv_seasonal / 2.0) * 5)
# Assume max CV ~200% for normalization
```

**Uncertainty:** MEDIUM
- Reanalysis validated against MGM gauge stations
- Snow-dominated regions have known biases in ERA5

---

### 3. Drought Hazard

**Definition:** Frequency and severity of meteorological droughts.

**Method:** Standardized Precipitation Index (SPI) at 12-month scale.

**Calculation:**
```
1. Compute SPI-12 from ERA5-Land precipitation (2000-2023)
2. Count drought months: months where SPI-12 < -1.5
3. Drought frequency = drought_months / total_months * 120
   (expressed as months per decade)
```

**Normalization:**
```
score = min(5, (drought_months_per_decade / 12) * 5)
# 12 months/decade = 10% of time in drought †’ score 5
```

**Uncertainty:** LOW
- Precipitation is well-constrained in ERA5
- Does not account for groundwater buffering

---

### 4. Flood Hazard

**Definition:** Exposure to riverine flooding and extreme precipitation.

**Proxy Model (multi-component):**

**Component A: Extreme Precipitation**
```
p99_precipitation = 99th percentile of daily precip (ERA5-Land)
precip_score = normalize_quantile(p99_precipitation, n_quantiles=5)
```

**Component B: Topographic Wetness**
```
TWI = ln(catchment_area / tan(slope))  # From MERIT-Hydro DEM
topo_score = normalize_quantile(mean_TWI_by_province, n_quantiles=5)
```

**Component C: Historical Flood Events**
```
event_score = normalize_quantile(flood_count_2000_2023, n_quantiles=5)
# From AFAD disaster database
```

**Combined Score:**
```
flood_score = 0.4 * precip_score + 0.3 * topo_score + 0.3 * event_score
```

**Uncertainty:** HIGH
- Lacks detailed floodplain delineations
- Topographic wetness is a coarse proxy
- Historical events may be under-reported in some provinces

---

### 5. Groundwater Stress

**Definition:** Declining groundwater levels or over-extraction.

**Primary Data:** GRACE/GRACE-FO satellite groundwater storage anomalies (2002-2023).

**Processing:**
```
1. Remove soil moisture component using hydrological models
2. Compute linear trend in groundwater storage anomaly
3. Normalize to province-level via spatial interpolation
   (GRACE native resolution ~300 km)
```

**Calculation:**
```
trend = linear_regression(GW_storage_anomaly_time_series)
# Negative trend †’ declining groundwater â†’ high risk

score = -trend * scaling_factor
score = clip(score, 0, 5)
```

**Supplementary:** DSÄ° groundwater monitoring network (where available) for validation.

**Uncertainty:** HIGH
- GRACE has coarse spatial resolution; provinces smaller than footprint
- Does not distinguish confined vs. unconfined aquifers
- Gap 2017-2018 (GRACE-FO transition)

---

### 6. Interannual Variability

**Definition:** Year-to-year volatility in total water availability.

**Calculation:**
```
annual_runoff = sum(monthly_runoff) for each year (2000-2023)
cv_interannual = std(annual_runoff) / mean(annual_runoff)

score = min(5, (cv_interannual / 1.0) * 5)
# Assume max CV ~100% for normalization
```

**Uncertainty:** MEDIUM
- Similar to seasonal variability; reanalysis-based

---

### 7. Water Demand Pressure

**Definition:** Rate of change in water demand driven by growth.

**Components:**
```
pop_growth = (population_2023 - population_2010) / population_2010
irrig_growth = (irrigated_area_2023 - irrigated_area_2010) / irrigated_area_2010
industrial_growth = (industrial_permits_2023 - industrial_permits_2010) / industrial_permits_2010
```

**Data Sources:**
- Population: TÃÄ°K census and projections
- Irrigation: CORINE/Copernicus land cover change
- Industrial: DSÄ° water use permits (if available)

**Combined Score:**
```
demand_growth_index = 0.4 * pop_growth + 0.4 * irrig_growth + 0.2 * industrial_growth
score = normalize_quantile(demand_growth_index, n_quantiles=5)
```

**Uncertainty:** MEDIUM
- Assumes constant per-capita and per-hectare use rates
- Industrial data sparse

---

## Combined Water Risk Index

### Weighted Geometric Mean

**Formula:**
```
combined_score = (
  baseline_stress^w1 * 
  seasonal_variability^w2 * 
  drought_hazard^w3 * 
  flood_hazard^w4 * 
  groundwater_stress^w5 * 
  interannual_variability^w6 * 
  demand_pressure^w7
)^(1 / Îw)
```

**Default Weights:**
```yaml
w1 (baseline_stress): 0.20
w2 (seasonal_variability): 0.15
w3 (drought_hazard): 0.20
w4 (flood_hazard): 0.10
w5 (groundwater_stress): 0.15
w6 (interannual_variability): 0.10
w7 (demand_pressure): 0.10
```

**Rationale for Geometric Mean:**
- Penalizes extreme values in any single category
- Prevents compensation (high risk in one dimension cannot be "averaged out" by low risk in others)
- More conservative than arithmetic mean

**Alternative (for comparison):**
```
arithmetic_mean = Î(score_i * w_i) / Î£w_i
```

---

## Normalization

### Quantile-Based Scaling

All scores are normalized to 0-5 range using quantile breaks within Turkey:

```python
def normalize_quantile(values, n_quantiles=5):
    breaks = np.quantile(values, np.linspace(0, 1, n_quantiles+1))
    
    scores = np.zeros_like(values)
    for i in range(n_quantiles):
        mask = (values >= breaks[i]) & (values < breaks[i+1])
        scores[mask] = i
    
    # Top quantile gets score = 5
    scores[values >= breaks[-1]] = n_quantiles
    
    return scores
```

**Advantages:**
- Even distribution of provinces across risk levels
- Robust to outliers
- Facilitates province-level comparisons

---

## Validation Strategy

### Cross-Reference with Known Issues
- **Konya Plain:** Expected high groundwater stress (validated against studies)
- **Southeastern Anatolia:** Expected high baseline stress (GAP region)
- **Black Sea Coast:** Expected low drought hazard
- **Marmara Region:** Expected high demand pressure

### Sensitivity Analysis
Test combined index with Â±20% weight variations:
```
If index rank order of top 10 high-risk provinces remains stable †’ robust
```

### Ground Truth Comparison
Where available, compare with:
- DSÄ° basin management plans
- Academic studies (e.g., YÄ±lmaz et al. 2020 on water stress)
- Municipal reports

---

## Limitations

1. **Spatial Resolution:** Province-level masks sub-regional heterogeneity (e.g., Istanbul urban core vs. rural outskirts)
2. **Temporal Snapshot:** Current version represents 2020-2023 average; no future projections
3. **Proxy Models:** Flood and groundwater categories rely on proxies due to data gaps
4. **Sectoral Aggregation:** Does not distinguish agricultural vs. municipal vs. industrial vulnerabilities
5. **Climate Change:** Static climatology; does not model future scenarios

---

## Future Improvements

- **Basin-Level Resolution:** Integrate DSÄ°'s 25 major river basins
- **Time-Series Analysis:** Track risk trends 2000-2023
- **Climate Projections:** Incorporate CMIP6 scenarios for 2050/2070
- **Water Quality:** Add pollution and contamination dimensions
- **Ecosystem Health:** Include environmental flow requirements

---

## References

- **WRI Aqueduct:** Hofste et al. (2019). "Aqueduct 3.0: Updated Decision-Relevant Global Water Risk Indicators." WRI Technical Report.
- **SPI Methodology:** McKee et al. (1993). "The relationship of drought frequency and duration to time scales."
- **GRACE Processing:** Landerer & Swenson (2012). "Accuracy of scaled GRACE terrestrial water storage estimates."
- **Turkey Water Studies:** 
  - YÄ±lmaz et al. (2020). "Assessment of water stress using remote sensing in Turkey."
  - Aktas et al. (2019). "Climate change impacts on water resources in Turkey."

---

## Contact

For methodology questions or suggested improvements:
- Open an issue: https://github.com/cemdusenkalkan/turkiye-watermap/issues
- Discussion forum: https://github.com/cemdusenkalkan/turkiye-watermap/discussions

---

**Version:** 1.0.0  
**Last Updated:** January 2025

