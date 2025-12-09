export function Methodology() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Resources & Links</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Data Source</h2>
            <p className="text-gray-700 mb-2">
              <strong>WRI Aqueduct 4.0</strong>
            </p>
            <p className="text-gray-600 text-sm">
              World Resources Institute. Aqueduct 4.0 Global Water Risk Data.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <a href="https://www.wri.org/aqueduct" className="text-blue-600 hover:underline">
                https://www.wri.org/aqueduct
              </a>
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Methodology</h2>
            <p className="text-gray-700 mb-2">
              Data is aggregated from HydroBASINS sub-basin level to Turkish province boundaries 
              using area-weighted averaging. WRI's official scoring thresholds are applied.
            </p>
            <p className="text-gray-600 text-sm">
              Combined index uses weighted arithmetic mean as per WRI methodology.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">GitHub Repository</h2>
            <p className="text-gray-700 mb-2">
              <a href="https://github.com/cemdusenkalkan/turkeywatermap" className="text-blue-600 hover:underline">
                https://github.com/cemdusenkalkan/turkeywatermap
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              Full code, data processing pipeline, and documentation available.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Citation</h2>
            <pre className="bg-gray-50 p-5 rounded-xl border border-gray-300 text-sm overflow-x-auto text-gray-900 font-mono">
{`@software{turkeywatermap_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkeywatermap},
  license = {MIT}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

