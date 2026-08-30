import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import WorkSection from './WorkSection'
import ProcessSection from './ProcessSection'
// import PlaygroundSection from './PlaygroundSection'
import CTASection from './CTASection'
import StackSection from './StackSection'
import Footer from './Footer'

export default function HomePage({ hero, aboutExtra }: {
  hero?: ReactNode
  /** Extra paragraphs appended to the About section (used by the hero demo) */
  aboutExtra?: string[]
}) {
  const { hash } = useLocation()

  // Arriving from another route (e.g. /about → /#work) only sets the hash; react-router
  // does not scroll for it, so the section has to be brought into view here
  useEffect(() => {
    if (!hash) return
    const target = document.querySelector(hash)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <main>
        {hero ?? <HeroSection />}
        <WorkSection />
        <AboutSection extraParagraphs={aboutExtra} />
        {/* <PlaygroundSection /> */}
        <ProcessSection />
        <StackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
