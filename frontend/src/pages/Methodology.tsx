import { useLanguage } from '../contexts/LanguageContext'

export function Methodology() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('methodology.title')}</h1>
        <p className="text-gray-600 mb-8">{t('methodology.subtitle')}</p>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('methodology.dataSource')}</h2>
            <p className="text-gray-700 mb-2">
              {t('methodology.dataSourceText')}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <a href="https://www.wri.org/aqueduct" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://www.wri.org/aqueduct
              </a>
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('methodology.processing')}</h2>
            <p className="text-gray-700 mb-2">
              {t('methodology.processingText')}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('methodology.scoring')}</h2>
            <p className="text-gray-700 mb-2">
              {t('methodology.scoringText')}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">GitHub Repository</h2>
            <p className="text-gray-700 mb-2">
              <a href="https://github.com/cemdusenkalkan/s" className="text-blue-600 hover:underline">
                https://github.com/cemdusenkalkan/turkeywatermaps
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              Full code, data processing pipeline, and documentation available.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Citation</h2>
            <pre className="bg-gray-50 p-5 rounded-xl border border-gray-300 text-sm overflow-x-auto text-gray-900 font-mono">
{`@software{turkeywatermaps_2025,
  title = {Türkiye Water Risk Map},
  author = {Community Contributors},
  year = {2025},
  url = {https://github.com/cemdusenkalkan/turkeywatermaps},
  license = {MIT}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

