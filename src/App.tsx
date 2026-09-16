import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/navbar'
import HomePage from './components/HomePage'
import CaseStudyPage from './components/case-study/CaseStudyPage'
import AboutPage from './components/about/AboutPage'
import StudioShell from './components/studio/StudioShell'
import StudioHome from './components/studio/StudioHome'
import StudioCase from './components/studio/StudioCase'

// Demo pages are dev-only: the routes are never registered in production builds,
// so the URLs don't resolve on the deployed site
const ProjectLoadingScreenDemo = lazy(() => import('./components/ProjectLoadingScreenDemo'))
const HeroCopyDemo = lazy(() => import('./components/HeroCopyDemo'))
// Lazy so three.js only enters the bundle for this route
const DoorFeedDemoPage = lazy(() => import('./components/doorfeed-demo/DoorFeedDemoPage'))

/**
 * Chrome for the main site: black ground, grain, custom cursor, navbar.
 *
 * This used to wrap every route. It now wraps only its own, because /studio is
 * a light page and inherits none of it.
 */
function DarkShell() {
  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <div className="grain-overlay" />
      <CustomCursor />
      <Navbar />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<DarkShell />}>
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
        </Route>

        <Route element={<StudioShell />}>
          <Route path="/studio" element={<StudioHome />} />
          <Route path="/studio/:slug" element={<StudioCase />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
