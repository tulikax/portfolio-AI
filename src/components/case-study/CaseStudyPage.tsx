import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getCaseStudy } from '../../data/caseStudies'
import CaseStudyHero from './CaseStudyHero'
import OverviewStrip from './OverviewStrip'
import ProblemSection from './ProblemSection'
import VisualShowcase from './VisualShowcase'
import PlatformBlock from './PlatformBlock'
import DesignDecisions from './DesignDecisions'
import PrototypeEmbed from './PrototypeEmbed'
import NextProject from './NextProject'

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = getCaseStudy(slug ?? '')

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [slug])

  if (!data) {
    return <Navigate to="/" replace />
  }

  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      {/* 1 — Full-viewport hero */}
      <CaseStudyHero data={data} />

      {/* 2 — Goal | Role | Outcome strip */}
      <OverviewStrip data={data} />

      {/* 3 — Problem / Context */}
      <ProblemSection data={data} />

      {/* 4 — Visual blocks (optional) */}
      {data.visualBlocks && data.visualBlocks.length > 0 && (
        <section style={{ padding: '0 0 2rem' }}>
          <div
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
              maxWidth: '72rem',
              margin: '0 auto 4rem',
            }}
          />
          {data.visualBlocks.map((block, i) => (
            <VisualShowcase key={i} block={block} />
          ))}
        </section>
      )}

      {/* 5 — Platform sections (optional, complex only) */}
      {data.platformSections && data.platformSections.length > 0 && (
        <section>
          {data.platformSections.map((section, i) => (
            <PlatformBlock key={section.platform} section={section} index={i} />
          ))}
        </section>
      )}

      {/* 6 — Design decisions (optional) */}
      {data.designDecisions && data.designDecisions.length > 0 && (
        <DesignDecisions decisions={data.designDecisions} />
      )}

      {/* 7 — Prototype / video embed (optional) */}
      {data.prototypeEmbed && (
        <PrototypeEmbed embed={data.prototypeEmbed} />
      )}

      {/* 8 — Next project or back link — always */}
      <NextProject nextProject={data.nextProject} />
    </div>
  )
}
