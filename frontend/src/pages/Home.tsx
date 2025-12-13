import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/map"
                className="bg-accent hover:bg-accent-dark px-6 md:px-8 py-3 rounded-xl font-semibold 
                  transition-all hover:scale-105 inline-flex items-center justify-center shadow-lg text-white"
              >
                {t('home.viewMap')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/methodology"
                className="bg-white/10 hover:bg-white/20 px-6 md:px-8 py-3 rounded-xl font-semibold 
                  transition-all hover:scale-105 backdrop-blur-sm border border-white/20 inline-flex items-center justify-center"
              >
                {t('home.methodologyBtn')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Key Statistics */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl md:text-6xl font-bold text-accent mb-3">81</div>
              <div className="text-gray-600 text-sm md:text-base font-medium">{t('home.stats.provinces')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl md:text-6xl font-bold text-accent mb-3">7</div>
              <div className="text-gray-600 text-sm md:text-base font-medium">{t('home.stats.categories')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl md:text-6xl font-bold text-accent mb-3">100%</div>
              <div className="text-gray-600 text-sm md:text-base font-medium">{t('home.stats.openSource')}</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-navy-900">
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
                className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow touch-auto"
              >
                <h3 className="text-xl md:text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-12 md:py-16 bg-navy-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{t('home.cta.title')}</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/map"
            className="bg-accent hover:bg-accent-dark px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold 
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

