import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { ThemeSelector } from './ThemeSelector'
import { Mascots } from './Mascots'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/map', label: t('nav.map') },
    { path: '/categories', label: t('nav.categories') },
    { path: '/methodology', label: t('nav.methodology') },
    { path: '/about', label: t('nav.about') },
  ]
  
  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f7] dark:bg-gray-950 transition-colors">
      <Mascots />
      
      {/* Header - Academic Style */}
      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <nav className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo - Academic Typography */}
            <Link 
              to="/" 
              className="flex items-center flex-shrink-0" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-base md:text-lg font-light tracking-tight text-gray-900 dark:text-white">
                Türkiye Water Risk Map
              </span>
            </Link>
            
            {/* Desktop Navigation - Minimal */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-1">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.path
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors relative
                          ${isActive 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="navActiveTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
                <ThemeSelector />
                <LanguageSelector />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeSelector />
              <button 
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </nav>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 mt-2"
            >
              <ul className="space-y-1 pt-4">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.path
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-sm uppercase tracking-wider font-medium transition-colors border-l-2
                          ${isActive 
                            ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900/50' 
                            : 'text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <LanguageSelector />
              </div>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer - Academic Style */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Brand */}
            <div className="md:col-span-4">
              <h3 className="text-lg font-light tracking-tight text-gray-900 dark:text-white mb-4">
                Türkiye Water Risk Map
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('footer.subtitle')}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/yourusername/turkeywatermap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div className="md:col-span-4">
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {t('footer.resources')}
              </div>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* External Links */}
            <div className="md:col-span-4">
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {t('footer.externalLinks')}
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.wri.org/aqueduct"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {t('footer.wriAqueduct')}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Open-Meteo
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span>{t('footer.license')}</span>
              <span>•</span>
              <span>{t('footer.dataSource')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
