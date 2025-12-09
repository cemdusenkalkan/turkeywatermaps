import { motion } from 'motion/react'

export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6">About This Project</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead">
            Türkiye Water Risk Map is a community-driven, open-source platform providing 
            transparent water risk assessments across Turkey's 81 provinces.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Water security is one of the defining challenges of the 21st century. Turkey, 
            positioned at the intersection of water-rich and water-scarce regions, faces 
            diverse water challenges—from groundwater depletion in central Anatolia to 
            seasonal droughts in the southeast and flood risks in coastal areas.
          </p>
          
          <p>
            This project aims to make water risk information accessible, understandable, 
            and actionable for researchers, policymakers, NGOs, and the public. By combining 
            open data sources with transparent methodology, we provide a foundation for 
            evidence-based water management and adaptation planning.
          </p>
          
          <h2>Why Open Source?</h2>
          <ul>
            <li>
              <strong>Reproducibility:</strong> Anyone can verify our methods and reproduce 
              our results
            </li>
            <li>
              <strong>Continuous Improvement:</strong> Community contributions enhance data 
              quality and methodology
            </li>
            <li>
              <strong>Democratized Access:</strong> Free for all users, forever
            </li>
            <li>
              <strong>Educational Value:</strong> Serves as a learning resource for students 
              and researchers
            </li>
          </ul>
          
          <h2>Contributing</h2>
          <p>We welcome contributions in many forms:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="font-semibold text-lg mb-2">💻 Code</h3>
              <p className="text-gray-600 text-sm">
                Improve the data pipeline, add features to the frontend, optimize performance
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="font-semibold text-lg mb-2">📊 Data</h3>
              <p className="text-gray-600 text-sm">
                Help acquire and process additional data sources, improve spatial resolution
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="font-semibold text-lg mb-2">📝 Documentation</h3>
              <p className="text-gray-600 text-sm">
                Enhance methodology explanations, translate to Turkish, write tutorials
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="font-semibold text-lg mb-2">🔬 Validation</h3>
              <p className="text-gray-600 text-sm">
                Conduct validation studies, compare with ground truth, suggest improvements
              </p>
            </div>
          </div>
          
          <p>
            Visit our{' '}
            <a href="https://github.com/cemdusenkalkan/turkiye-watermap" className="text-accent">
              GitHub repository
            </a>{' '}
            to get started.
          </p>
          
          <h2>Technology Stack</h2>
          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Data Pipeline:</strong>
                <ul className="mt-2 space-y-1">
                  <li>Python 3.10+</li>
                  <li>pandas, geopandas</li>
                  <li>xarray, rioxarray</li>
                  <li>tippecanoe (PMTiles)</li>
                </ul>
              </div>
              <div>
                <strong>Frontend:</strong>
                <ul className="mt-2 space-y-1">
                  <li>React 18 + TypeScript</li>
                  <li>Vite 7</li>
                  <li>MapLibre GL JS + PMTiles</li>
                  <li>Motion for animations</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h2>Acknowledgments</h2>
          <p>This project stands on the shoulders of giants:</p>
          <ul>
            <li>
              <strong>World Resources Institute (WRI)</strong> for the Aqueduct methodology 
              that inspired our approach
            </li>
            <li>
              <strong>ECMWF</strong> for ERA5-Land reanalysis data
            </li>
            <li>
              <strong>Turkish Government Open Data</strong> initiatives (TÜİK, DSİ, MGM)
            </li>
            <li>
              <strong>NASA/GFZ</strong> for GRACE groundwater data
            </li>
            <li>
              <strong>Open-source geospatial community</strong> (MapLibre, PMTiles, GDAL, 
              and countless libraries)
            </li>
          </ul>
          
          <h2>License</h2>
          <p>
            <strong>Code:</strong> MIT License<br />
            <strong>Processed Data:</strong> CC BY 4.0<br />
            <strong>Source Data:</strong> See individual source licenses in documentation
          </p>
          
          <h2>Contact</h2>
          <p>
            Questions, feedback, or collaboration inquiries?<br />
            Open an issue on{' '}
            <a href="https://github.com/cemdusenkalkan/turkiye-watermap/issues" className="text-accent">
              GitHub
            </a>{' '}
            or reach out to the community.
          </p>
          
          <div className="bg-accent/10 border-l-4 border-accent p-6 mt-12">
            <p className="font-semibold mb-2">Made with 🌊 for a water-secure Turkey</p>
            <p className="text-sm mb-0">
              This is a community project. Together, we can build better water risk 
              understanding and foster more resilient water management.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

