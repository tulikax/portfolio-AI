import { Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import WorkSection from './components/WorkSection'
import ProcessSection from './components/ProcessSection'
import PlaygroundSection from './components/PlaygroundSection'
import CTASection from './components/CTASection'
import StackSection from './components/StackSection'
import Footer from './components/Footer'
import CaseStudyPage from './components/case-study/CaseStudyPage'
import ProjectLoadingScreenDemo from './components/ProjectLoadingScreenDemo'

function HomePage() {
  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <main>
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <PlaygroundSection />
        <ProcessSection />
        <StackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <div className="grain-overlay" />
      <CustomCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/demo/loading" element={<ProjectLoadingScreenDemo />} />
      </Routes>
    </div>
  )
}
