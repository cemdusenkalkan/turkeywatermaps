import { useLanguage } from '../contexts/LanguageContext'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-accent shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('tr')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          language === 'tr'
            ? 'bg-white text-accent shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Türkçe'ye geç"
      >
        TR
      </button>
    </div>
  )
}
