import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import enTranslations from '../locales/en.json'
import trTranslations from '../locales/tr.json'

type Language = 'en' | 'tr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = { 
  en: enTranslations, 
  tr: trTranslations 
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initial language from localStorage or browser preference
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem('language')
    if (stored === 'en' || stored === 'tr') return stored
    
    // Check browser language - if Turkish, use TR, otherwise EN
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('tr') ? 'tr' : 'en'
  }

  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  // Get nested translation by key path (e.g., "nav.home")
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation missing for key: ${key} (language: ${language})`)
        return key // Return key as fallback
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
