import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { ThemeSelector } from './ThemeSelector'

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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-bold text-lg text-navy-800 dark:text-white">
                Türkiye Water Risk Map
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ul className="flex items-center space-x-1">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.path
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative
                          ${isActive 
                            ? 'text-accent dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="flex items-center space-x-3">
                <ThemeSelector />
                <LanguageSelector />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeSelector />
              <button 
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </nav>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4"
            >
              <ul className="space-y-1">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.path
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors
                          ${isActive 
                            ? 'text-accent dark:text-blue-400 bg-gray-50 dark:bg-gray-800' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                <LanguageSelector />
              </div>
            </motion.div>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-navy-800 dark:bg-gray-900 text-white py-12 mt-auto border-t border-gray-200 dark:border-gray-800" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Türkiye Water Risk Map</h3>
              <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">
                Open-source water risk assessment platform using real WRI Aqueduct 4.0 data. Free, transparent, and reproducible.
              </p>
            </div>
            
            {/* Resources Section */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Interactive Map</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Risk Categories</Link></li>
                <li><Link to="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
              </ul>
            </div>
            
            {/* External Links Section */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">External Links</h3>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li>
                  <a 
                    href="https://github.com/cemdusenkalkan/turkeywatermaps" 
                    className="hover:text-white transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.wri.org/aqueduct" 
                    className="hover:text-white transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="WRI Aqueduct"
                  >
                    WRI Aqueduct
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/cemdusenkalkan" 
                    className="hover:text-white transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                  >
                    LinkedIn Profile
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Info Section */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">About</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                Community-driven, non-official product. Consult official Turkish government agencies (DSİ, MGM, TÜİK) for authoritative information.
              </p>
            </div>
          </div>
          
          {/* Divider and Copyright */}
          <div className="border-t border-navy-700 dark:border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
              <p>&copy; 2025 Türkiye Water Risk Map. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to="/about" className="hover:text-white transition-colors">Terms</Link>
                <a href="https://opensource.org/licenses/MIT" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">License (MIT)</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

