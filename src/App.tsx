import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/navbar'
import HomePage from './components/HomePage'
import CaseStudyPage from './components/case-study/CaseStudyPage'
import AboutPage from './components/about/AboutPage'

// Demo pages are dev-only: the routes are never registered in production builds,
// so the URLs don't resolve on the deployed site
const ProjectLoadingScreenDemo = lazy(() => import('./components/ProjectLoadingScreenDemo'))
const HeroCopyDemo = lazy(() => import('./components/HeroCopyDemo'))
// Lazy so three.js only enters the bundle for this route
const DoorFeedDemoPage = lazy(() => import('./components/doorfeed-demo/DoorFeedDemoPage'))

export default function App() {
  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <div className="grain-overlay" />
      <CustomCursor />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          {import.meta.env.DEV && (
            <>
              <Route path="/demo/loading" element={<ProjectLoadingScreenDemo />} />
              <Route path="/demo/hero" element={<HeroCopyDemo />} />
              {/* Three segments, so this outranks the /work/:slug case study route */}
              <Route path="/work/doorfeed/demo" element={<DoorFeedDemoPage />} />
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  )
}
