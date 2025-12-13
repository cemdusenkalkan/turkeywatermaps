import { useLanguage } from '../contexts/LanguageContext'

export function Methodology() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-navy-900 dark:text-white">{t('methodology.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">{t('methodology.subtitle')}</p>
        
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('methodology.dataSource')}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-3">
              {t('methodology.dataSourceText')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <a href="https://www.wri.org/aqueduct" className="text-accent hover:text-accent-dark font-medium break-all" target="_blank" rel="noopener noreferrer">
                https://www.wri.org/aqueduct
              </a>
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('methodology.processing')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('methodology.processingText')}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('methodology.scoring')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('methodology.scoringText')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">GitHub Repository</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-3">
              <a href="https://github.com/cemdusenkalkan/turkeywatermaps" className="text-accent hover:text-accent-dark font-medium break-all" target="_blank" rel="noopener noreferrer">
                https://github.com/cemdusenkalkan/turkeywatermaps
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Full code, data processing pipeline, and documentation available.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Citation</h2>
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-300 dark:border-gray-700 text-xs md:text-sm overflow-x-auto text-gray-900 dark:text-gray-200 font-mono leading-relaxed">
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

