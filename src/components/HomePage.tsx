import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import WorkSection from './WorkSection'
// import PlaygroundSection from './PlaygroundSection'
import StackSection from './StackSection'
import Footer from './Footer'

export default function HomePage({ hero }: {
  hero?: ReactNode
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
    <div style={{ background: 'rgb(var(--surface))', minHeight: '100vh' }}>
      <main>
        {hero ?? <HeroSection />}
        <WorkSection />
        <StackSection />
        <AboutSection />
        {/* <PlaygroundSection /> */}
        {/* Process ("How I work") now lives on /about, alongside the long copy.
            CTASection is retired — the page ends on Currently, then the footer. */}
      </main>
      <Footer />
    </div>
  )
}
