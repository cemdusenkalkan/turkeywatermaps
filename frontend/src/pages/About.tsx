import { useLanguage } from '../contexts/LanguageContext'

export function About() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('about.subtitle')}</h2>
            <p className="text-gray-700">
              {t('about.description')}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('about.dataTitle')}</h2>
            <p className="text-gray-700">
              {t('about.dataText')}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('about.licenseTitle')}</h2>
            <p className="text-gray-700">
              {t('about.licenseText')}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('about.contributeTitle')}</h2>
            <p className="text-gray-700 mb-4">
              {t('about.contributeText')}
            </p>
            <a 
              href="https://github.com/cemdusenkalkan/turkeywatermaps" 
              className="inline-flex items-center text-accent hover:text-accent-dark font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('about.githubLink')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">{t('about.contactTitle')}</h2>
            <p className="text-gray-700">
              {t('about.contactText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

