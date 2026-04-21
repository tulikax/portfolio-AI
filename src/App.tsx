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

function HomePage() {
  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ProcessSection />
        <StackSection />
        <PlaygroundSection />
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
      </Routes>
    </div>
  )
}
