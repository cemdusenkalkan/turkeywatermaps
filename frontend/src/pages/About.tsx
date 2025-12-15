import { useLanguage } from '../contexts/LanguageContext'

export function About() {
  const { t } = useLanguage()
  
  return (
    <div className="page-bg-academic min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-navy-900 dark:text-white">{t('about.title')}</h1>
        
        {/* Three-column overview band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-850 border border-blue-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-1">{t('about.overview.purpose')}</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">{t('about.overview.purposeText')}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-850 border border-green-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-green-600 dark:text-green-400 font-bold text-lg mb-1">{t('about.overview.data')}</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">{t('about.overview.dataText')}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-850 border border-purple-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-1">{t('about.overview.license')}</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">{t('about.overview.licenseText')}</div>
          </div>
        </div>
        
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('about.subtitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              {t('about.description')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('about.dataTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              {t('about.dataText')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t('about.licenseTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              {t('about.licenseText')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('about.contributeTitle')}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {t('about.contributeText')}
            </p>
            <a 
              href="https://github.com/cemdusenkalkan/turkeywatermaps" 
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-all hover:scale-105 touch-auto"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository link"
            >
              {t('about.githubLink')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('about.contactTitle')}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              {t('about.contactText')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

