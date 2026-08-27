import type { ReactNode } from 'react'
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
