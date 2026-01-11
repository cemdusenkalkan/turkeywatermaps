import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-gray-950">
      
      {/* HERO SECTION - Editorial/Academic Layout */}
      <section className="relative border-b border-gray-200 dark:border-gray-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT: Main Content - Academic Left-Aligned */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Overline - Academic Style */}
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 font-medium">
                  {t('home.mapPreview.title')}
                </div>
                
                {/* Main Heading - Left Aligned, Light Font */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                  {t('home.title')}
                </h1>
                
                {/* Body - Academic Justified */}
                <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl">
                  <p>{t('home.subtitle')}</p>
                </div>
                
                {/* CTA - Minimal Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/map"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
                  >
                    {t('home.viewMap')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/methodology"
                    className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-sm uppercase tracking-wider font-medium"
                  >
                    {t('home.methodologyBtn')}
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* RIGHT: Interactive Map Preview */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Map Container - No Card, Just Border */}
                <Link to="/map" className="block group">
                  <div className="relative border-2 border-gray-200 dark:border-gray-800 group-hover:border-gray-900 dark:group-hover:border-white transition-all duration-500 overflow-hidden aspect-[4/3] bg-gray-50 dark:bg-gray-900">
                    {/* Turkey Map SVG Preview */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <img 
                          src={`${import.meta.env.BASE_URL}tr.svg`}
                          alt="Turkey Map"
                          className="w-full h-auto max-h-full object-contain"
                          style={{
                            filter: 'brightness(0.9) saturate(1.2) contrast(1.1)',
                          }}
                        />
                      </div>
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 via-yellow-500/10 to-red-500/10 mix-blend-overlay pointer-events-none"></div>
                    </div>
                    
                    {/* Corner Markers - Academic Detail */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-white" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-white" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-white" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-white" />
                  </div>
                  
                  {/* Caption - Academic Style */}
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('home.mapPreview.clickToView')}
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATISTICS - Bloomberg Terminal Style */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-[#f5f3f0] dark:bg-gray-900/30 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                81
              </div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('home.stats.provinces')}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed max-w-xs">
                {t('home.stats.provinceDetail')}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                7
              </div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('home.stats.categories')}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed max-w-xs">
                {t('home.stats.categoriesDetail')}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                100%
              </div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('home.stats.openSource')}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed max-w-xs">
                {t('home.stats.openSourceDetail')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT PROJECT - Academic Journal Style */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-4xl">
            
            {/* Section Header - Academic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">
                {t('home.sections.overview')}
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
                {t('home.about.title')}
              </h2>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('home.about.description')}
              </p>
            </motion.div>

            {/* Feature Grid - No Cards, Just Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800 border-t border-b border-gray-200 dark:border-gray-800">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8 md:py-12 md:pr-8 lg:pr-12"
              >
                <div className="w-10 h-10 mb-6 border border-gray-900 dark:border-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white tracking-tight">
                  {t('home.about.indicators.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('home.about.indicators.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="py-8 md:py-12 md:px-8 lg:px-12"
              >
                <div className="w-10 h-10 mb-6 border border-gray-900 dark:border-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white tracking-tight">
                  {t('home.about.openSource.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('home.about.openSource.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="py-8 md:py-12 md:pl-8 lg:pl-12"
              >
                <div className="w-10 h-10 mb-6 border border-gray-900 dark:border-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white tracking-tight">
                  {t('home.about.weather.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('home.about.weather.description')}
                </p>
              </motion.div>
            </div>

            {/* Note Section - Editorial */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 pl-6 border-l-2 border-gray-900 dark:border-white"
            >
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('home.sections.note')}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('home.about.community.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES - List Style */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-5xl">
            
            <div className="mb-12">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">
                {t('home.sections.features')}
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white tracking-tight">
                {t('home.whatsIncluded')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
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
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-2"
                >
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    
      {/* CTA - Minimal */}
      <section className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
                {t('home.sections.getStarted')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 tracking-tight">
                {t('home.cta.title')}
              </h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl">
                {t('home.cta.subtitle')}
              </p>
              <Link
                to="/map"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
              >
                {t('home.cta.button')}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

