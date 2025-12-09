import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/map', label: 'Map' },
    { path: '/categories', label: 'Categories' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/about', label: 'About' },
  ]
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg text-navy-800">
                Türkiye Water Risk Map
              </span>
            </Link>
            
            <ul className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative
                        ${isActive 
                          ? 'text-accent' 
                          : 'text-gray-600 hover:text-accent hover:bg-gray-50'
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
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-navy-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Türkiye Water Risk Map</h3>
              <p className="text-sm text-gray-300">
                Open-source water risk assessment platform for Turkey's 81 provinces.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://github.com/cemdusenkalkan/turkiye-watermap" className="hover:text-white">GitHub</a></li>
                <li><Link to="/methodology" className="hover:text-white">Methodology</Link></li>
                <li><a href="#" className="hover:text-white">Data Downloads</a></li>
                <li><Link to="/about" className="hover:text-white">Contributing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Disclaimer</h3>
              <p className="text-xs text-gray-400">
                Community-driven, non-official product. Consult official Turkish government 
                agencies (DSİ, MGM, TÜİK) for authoritative information.
              </p>
            </div>
          </div>
          
          <div className="border-t border-navy-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 Türkiye Water Risk Map. Licensed under MIT.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

