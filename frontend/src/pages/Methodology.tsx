import { motion } from 'motion/react'

export function Methodology() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto prose prose-lg"
      >
        <h1>Methodology</h1>
        
        <p className="lead">
          Our water risk assessment methodology is inspired by the World Resources Institute's 
          Aqueduct framework but adapted specifically for Turkey's data landscape and context.
        </p>
        
        <h2>Core Principles</h2>
        <ul>
          <li><strong>Transparency:</strong> Every transformation step is documented and reproducible</li>
          <li><strong>Multi-Source Integration:</strong> Combines authoritative national data with global products</li>
          <li><strong>Clear Uncertainty:</strong> Limitations and proxy assumptions explicitly stated</li>
          <li><strong>Open & Reproducible:</strong> Code and data published for external validation</li>
        </ul>
        
        <h2>Data Sources</h2>
        
        <h3>Climate & Hydrology</h3>
        <p>
          <strong>ERA5-Land Reanalysis (ECMWF):</strong> High-resolution climate data including 
          precipitation, temperature, runoff at 0.1° (~10km) resolution from 2000-2023. 
          Validated against Turkish Meteorological Service (MGM) station observations.
        </p>
        
        <h3>Socioeconomic Data</h3>
        <p>
          <strong>TÜİK (Turkish Statistical Institute):</strong> Water use statistics, 
          population data, irrigated agriculture areas by province.
        </p>
        
        <h3>Groundwater</h3>
        <p>
          <strong>GRACE Satellite Mission:</strong> Groundwater storage anomalies from 2002-2023. 
          Note: Coarse resolution (~300km effective) requires spatial interpolation for provinces.
        </p>
        
        <h3>Hydro-Infrastructure</h3>
        <p>
          <strong>DSİ (State Hydraulic Works):</strong> Water potential reports, dam inventories, 
          groundwater monitoring network data.
        </p>
        
        <h2>Scoring Methodology</h2>
        
        <h3>Individual Categories</h3>
        <p>
          Each of the seven risk categories is scored on a 0-5 scale:
        </p>
        <ul>
          <li><strong>0-1:</strong> Very Low Risk</li>
          <li><strong>1-2:</strong> Low Risk</li>
          <li><strong>2-3:</strong> Medium Risk</li>
          <li><strong>3-4:</strong> High Risk</li>
          <li><strong>4-5:</strong> Very High Risk</li>
        </ul>
        
        <p>
          Scores are normalized using quantile-based scaling within Turkey to ensure 
          appropriate differentiation across provinces.
        </p>
        
        <h3>Combined Index</h3>
        <p>
          The Combined Water Risk Index uses a <strong>weighted geometric mean</strong>:
        </p>
        
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`Combined Score = (
  baseline_stress^0.20 × 
  seasonal_variability^0.15 × 
  drought_hazard^0.20 × 
  flood_hazard^0.10 × 
  groundwater_stress^0.15 × 
  interannual_variability^0.10 × 
  demand_pressure^0.10
)^(1/1.0)`}
        </pre>
        
        <p>
          The geometric mean ensures that extreme values in any single category significantly 
          influence the overall risk score, preventing high risk in one dimension from being 
          masked by low risk in others.
        </p>
        
        <h2>Limitations & Uncertainty</h2>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="font-semibold">Important Disclaimers</p>
          <ul className="mb-0">
            <li>This is a community-driven, non-official assessment</li>
            <li>Some categories rely on proxy models due to data availability constraints</li>
            <li>Spatial resolution (province-level) may mask sub-regional variations</li>
            <li>Groundwater data has limited spatial coverage and coarse satellite resolution</li>
            <li>Flood hazard assessment lacks detailed floodplain maps for many regions</li>
          </ul>
        </div>
        
        <h2>Validation</h2>
        <p>
          We cross-reference high-risk provinces with known problem areas documented in 
          academic literature and government reports. For example, the Konya Plain's 
          groundwater depletion and southeastern Turkey's water stress patterns align with 
          our model outputs.
        </p>
        
        <h2>For Researchers</h2>
        <p>
          Full methodology documentation, code, and processed datasets are available on our 
          <a href="https://github.com/cemdusenkalkan/turkiye-watermap" className="text-accent">
            GitHub repository
          </a>. We welcome feedback, validation studies, and contributions.
        </p>
        
        <h2>Citation</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`@software{turkiye_watermap_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkiye-watermap},
  license = {MIT}
}`}
        </pre>
      </motion.div>
    </div>
  )
}

