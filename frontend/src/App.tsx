import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { MapPage } from './pages/MapPage'
import { Categories } from './pages/Categories'
import { Methodology } from './pages/Methodology'
import { About } from './pages/About'

function App() {
  return (
    <BrowserRouter basename="/turkeywatermaps">
      <ThemeProvider>
        <LanguageProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="text-accent hover:underline">
        Return home
      </a>
    </div>
  )
}

export default App
