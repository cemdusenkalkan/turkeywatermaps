import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold mb-6">
              Understanding Turkey's Water Risks
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              An open-source, data-driven platform assessing water-related risks across 
              Turkey's 81 provinces. Transparent methodology. Reproducible results. 
              Community-driven insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/map"
                className="bg-accent hover:bg-accent-dark px-8 py-3 rounded-lg font-semibold 
                  transition-colors inline-flex items-center"
              >
                Explore the Map
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/methodology"
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-lg font-semibold 
                  transition-colors backdrop-blur-sm"
              >
                Read Methodology
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Key Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent mb-2">81</div>
              <div className="text-gray-600">Provinces Covered</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent mb-2">7</div>
              <div className="text-gray-600">Risk Categories</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-gray-600">Open Source</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why This Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '💧',
                title: 'Baseline Water Stress',
                description: 'Understand where water demand exceeds sustainable supply across Turkey.',
              },
              {
                icon: '☀️',
                title: 'Drought Vulnerability',
                description: 'Track meteorological drought patterns and their frequency over time.',
              },
              {
                icon: '🌊',
                title: 'Flood Risk',
                description: 'Identify provinces exposed to riverine flooding and extreme precipitation.',
              },
              {
                icon: '📊',
                title: 'Transparent Data',
                description: 'All methodology documented. Every calculation reproducible. No black boxes.',
              },
              {
                icon: '🗺️',
                title: 'Interactive Maps',
                description: 'Explore data visually. Compare provinces. Download raw datasets.',
              },
              {
                icon: '🤝',
                title: 'Community-Driven',
                description: 'Built by contributors. Improved through collaboration. Open for all.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-soft"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dive into the interactive map and discover water risk patterns across Turkey.
          </p>
          <Link
            to="/map"
            className="bg-accent hover:bg-accent-dark px-8 py-3 rounded-lg font-semibold 
              transition-colors inline-flex items-center text-lg"
          >
            Launch Map
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

