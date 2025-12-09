export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About This Project</h1>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-700">
              Türkiye Water Risk Map is a community-driven, open-source platform providing 
              transparent water risk assessments across Turkey's 81 provinces using WRI Aqueduct 4.0 data.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Project Information</h2>
            <p className="text-gray-700 mb-4">
              This project uses WRI Aqueduct 4.0 global water risk data, aggregated to Turkish 
              province boundaries using area-weighted averaging. All methodology is documented 
              and reproducible.
            </p>
            <p className="text-gray-700">
              The platform provides interactive maps, downloadable datasets, and transparent 
              methodology documentation for researchers, policymakers, and the public.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Data Sources</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>WRI Aqueduct 4.0 (Baseline Annual Indicators)</li>
              <li>GADM Administrative Boundaries (Turkey Provinces)</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">License</h2>
            <p className="text-gray-700">
              Code: MIT License<br />
              Processed Data: CC BY 4.0
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-gray-700">
              <a href="https://github.com/cemdusenkalkan/turkeywatermap" className="text-blue-600 hover:underline">
                GitHub Repository
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

