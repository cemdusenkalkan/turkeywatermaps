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
              Turkey Water Risk Map
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Visualize water-related risks across Turkey's 81 provinces. 
              Open-source data from WRI Aqueduct 4.0. Free to use and explore.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/map"
                className="bg-accent hover:bg-accent-dark px-8 py-3 rounded-xl font-semibold 
                  transition-all hover:scale-105 inline-flex items-center shadow-lg"
              >
                View Map
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/methodology"
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-semibold 
                  transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                Methodology
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
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Water Stress',
                description: 'See where water demand exceeds supply.',
              },
              {
                title: 'Drought Risk',
                description: 'View drought patterns by province.',
              },
              {
                title: 'Flood Risk',
                description: 'Identify flood exposure levels.',
              },
              {
                title: 'Open Source',
                description: 'All code and data publicly available.',
              },
              {
                title: 'Interactive',
                description: 'Explore and compare provinces visually.',
              },
              {
                title: 'Free to Use',
                description: 'No registration. No fees. Just information.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ delay: i * 0.08, duration: 0.2 }}
                className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">View the Map</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Interactive visualization of water risk data for all Turkish provinces.
          </p>
          <Link
            to="/map"
            className="bg-accent hover:bg-accent-dark px-8 py-3 rounded-xl font-semibold 
              transition-all hover:scale-105 inline-flex items-center text-lg shadow-lg"
          >
            Open Map
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

