import { useLanguage } from '../contexts/LanguageContext'

export function About() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-navy-900">{t('about.title')}</h1>
        
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('about.subtitle')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('about.description')}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('about.dataTitle')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('about.dataText')}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('about.licenseTitle')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('about.licenseText')}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('about.contributeTitle')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
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
          
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{t('about.contactTitle')}</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t('about.contactText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

