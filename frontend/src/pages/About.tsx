import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'

export function About() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-gray-950">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
              Project Information
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-8">
              {t('about.title')}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Overview Band */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('about.overview.purpose')}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {t('about.overview.purposeText')}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('about.overview.data')}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {t('about.overview.dataText')}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="py-8 md:py-0 md:px-8 lg:px-12 text-left"
            >
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('about.overview.license')}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {t('about.overview.licenseText')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="max-w-4xl space-y-16">
            
            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-2 border-gray-900 dark:border-white pl-6"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('about.subtitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {t('about.description')}
              </p>
            </motion.div>
            
            {/* Data Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-2 border-gray-900 dark:border-white pl-6"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('about.dataTitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {t('about.dataText')}
              </p>
            </motion.div>
            
            {/* Technology Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-2 border-gray-900 dark:border-white pl-6"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {t('about.techTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Frontend
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      React + TypeScript
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      Vite Build Tool
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      Tailwind CSS
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      Leaflet Maps
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      DuckDB-WASM
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Data Pipeline
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      Python Processing
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      GeoPandas + GeoJSON
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      WRI Aqueduct 4.0
                    </li>
                    <li className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                      Open-Meteo API
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Open Source */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-2 border-gray-900 dark:border-white pl-6"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {t('about.openSourceTitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                {t('about.openSourceText')}
              </p>
              <a
                href="https://github.com/yourusername/turkeywatermap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 text-sm uppercase tracking-wider font-medium"
              >
                View on GitHub
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-600 dark:border-amber-500 p-6"
            >
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                    {t('about.disclaimerTitle')}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.disclaimerText')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
