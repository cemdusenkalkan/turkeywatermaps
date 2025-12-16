import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  
  return (
    <div className="page-bg-academic">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 dark:from-blue-900 dark:via-blue-950 dark:to-gray-950 text-white py-16 md:py-24 overflow-hidden">
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

            {/* Project Info Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block space-y-4"
            >
              {/* Map Preview Card */}
              <Link 
                to="/map"
                className="block bg-blue-950/40 dark:bg-gray-900/40 backdrop-blur-sm border border-blue-400/20 dark:border-gray-700 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out group overflow-hidden"
              >
                <div className="text-sm font-semibold text-blue-200 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t('home.mapPreview.title')}
                  <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* Turkey Map Preview */}
                <div className="relative bg-gradient-to-br from-blue-900/30 to-blue-950/30 dark:from-gray-900/30 dark:to-gray-950/30 rounded-lg p-8 border border-blue-400/20 dark:border-gray-700/50 overflow-hidden transition-all duration-1000 ease-in-out group-hover:bg-blue-900/50 group-hover:border-blue-400/40">
                  <div 
                    className="relative w-full h-full flex items-center justify-center transition-all duration-[1500ms] ease-in-out group-hover:scale-[2.5] group-hover:translate-y-4"
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
                      transformOrigin: 'center center'
                    }}
                  >
                    <img 
                      src={`${import.meta.env.BASE_URL}tr.svg`}
                      alt="Turkey Map"
                      className="w-full h-auto opacity-95 group-hover:opacity-100 transition-all duration-1000"
                      style={{
                        filter: 'brightness(1.4) saturate(1.5) contrast(1.1)',
                      }}
                      onError={(e) => {
                        console.error('Failed to load Turkey map')
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  {/* Gradient overlay for risk colors */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-yellow-500/20 via-orange-500/20 to-red-500/20 mix-blend-screen pointer-events-none transition-opacity duration-1000 group-hover:opacity-50"></div>
                  {/* Bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
                </div>
                
                <div className="mt-3 text-xs text-blue-200/80 dark:text-gray-400 text-center">
                  {t('home.mapPreview.clickToExplore')}
                </div>
              </Link>

              {/* Data Source Card */}
              <div className="bg-blue-950/40 dark:bg-gray-900/40 backdrop-blur-sm border border-blue-400/20 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-300 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-blue-200 dark:text-gray-300 mb-1">{t('home.dataSource.title')}</div>
                    <div className="text-xs text-blue-200/80 dark:text-gray-400 leading-relaxed">
                      {t('home.dataSource.text')}
                    </div>
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
      
      {/* About Project Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-navy-900 dark:text-white">
                {t('home.about.title')}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto px-4">
                {t('home.about.description')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-4 md:p-6 rounded-xl border border-blue-200 dark:border-gray-600"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-gray-900 dark:text-white">{t('home.about.indicators.title')}</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('home.about.indicators.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-4 md:p-6 rounded-xl border border-green-200 dark:border-gray-600"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-gray-900 dark:text-white">{t('home.about.openSource.title')}</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('home.about.openSource.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-gray-800 dark:to-gray-700 p-4 md:p-6 rounded-xl border border-sky-200 dark:border-gray-600"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-500 dark:bg-sky-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-gray-900 dark:text-white">{t('home.about.weather.title')}</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('home.about.weather.description')}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-amber-500 dark:border-amber-600 p-4 md:p-6 rounded-r-xl mx-4 md:mx-0"
            >
              <div className="flex gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2 text-gray-900 dark:text-white">{t('home.about.community.title')}</h3>
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('home.about.community.description')}
                  </p>
                </div>
              </div>
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

