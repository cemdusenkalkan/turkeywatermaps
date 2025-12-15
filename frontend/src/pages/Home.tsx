import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  
  return (
    <div className="page-bg-academic">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-gray-950 text-white py-16 md:py-24 overflow-hidden">
        {/* Animated Contour Lines Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <motion.path
              d="M0,100 Q250,80 500,100 T1000,100"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,150 Q250,130 500,150 T1000,150"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,200 Q250,180 500,200 T1000,200"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,250 Q250,230 500,250 T1000,250"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('home.title')}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Link
                  to="/map"
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-8 py-3.5 rounded-xl font-semibold 
                    transition-all hover:scale-105 inline-flex items-center justify-center shadow-lg text-white"
                >
                  {t('home.viewMap')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/methodology"
                  className="border-2 border-blue-300/30 dark:border-gray-600 hover:border-blue-300/60 dark:hover:border-gray-500 hover:bg-white/5 px-8 py-3.5 rounded-xl font-medium 
                    transition-all inline-flex items-center justify-center text-blue-100 dark:text-gray-300"
                >
                  {t('home.methodologyBtn')}
                </Link>
              </div>
            </motion.div>

            {/* Mini Map Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-blue-950/40 dark:bg-gray-900/40 backdrop-blur-sm border border-blue-400/20 dark:border-gray-700 rounded-2xl p-6 shadow-2xl">
                <div className="text-sm font-semibold text-blue-200 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Risk Layer Preview
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
                    <span className="text-sm text-blue-100 dark:text-gray-300">Low (0-1)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
                    <span className="text-sm text-blue-100 dark:text-gray-300">Low-Medium (1-2)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-orange-500"></div>
                    <span className="text-sm text-blue-100 dark:text-gray-300">Medium-High (2-3)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
                    <span className="text-sm text-blue-100 dark:text-gray-300">High (3-4)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-red-700 to-red-800"></div>
                    <span className="text-sm text-blue-100 dark:text-gray-300">Extremely High (4-5)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Key Statistics */}
      <section className="py-12 md:py-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:border dark:border-gray-700"
            >
              <div className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-500 mb-2">81</div>
              <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-semibold mb-2">{t('home.stats.provinces')}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t('home.stats.provinceDetail')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:border dark:border-gray-700"
            >
              <div className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-500 mb-2">7</div>
              <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-semibold mb-2">{t('home.stats.categories')}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t('home.stats.categoriesDetail')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:border dark:border-gray-700"
            >
              <div className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-500 mb-2">100%</div>
              <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-semibold mb-2">{t('home.stats.openSource')}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t('home.stats.openSourceDetail')}</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 md:py-16 bg-white/60 dark:bg-gray-800/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-navy-900 dark:text-white">
            {t('home.whatsIncluded')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: t('home.features.waterStress.title'),
                description: t('home.features.waterStress.desc'),
              },
              {
                title: t('home.features.drought.title'),
                description: t('home.features.drought.desc'),
              },
              {
                title: t('home.features.flood.title'),
                description: t('home.features.flood.desc'),
              },
              {
                title: t('home.features.openSource.title'),
                description: t('home.features.openSource.desc'),
              },
              {
                title: t('home.features.interactive.title'),
                description: t('home.features.interactive.desc'),
              },
              {
                title: t('home.features.free.title'),
                description: t('home.features.free.desc'),
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ delay: i * 0.08, duration: 0.2 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow touch-auto"
              >
                <h3 className="text-xl md:text-lg font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{t('home.cta.title')}</h2>
          <p className="text-lg md:text-xl text-blue-100 dark:text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/map"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold 
              transition-all hover:scale-105 inline-flex items-center text-base md:text-lg shadow-lg touch-auto"
          >
            {t('home.cta.button')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

