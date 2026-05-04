import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCaseStudy } from '../../data/caseStudies'
import CaseStudyHero from './CaseStudyHero'
import ProblemSection from './ProblemSection'
import VisualShowcase from './VisualShowcase'
import PlatformBlock from './PlatformBlock'
import DesignDecisions from './DesignDecisions'
import PrototypeEmbed from './PrototypeEmbed'
import NextProject from './NextProject'
import ProjectTabs from './ProjectTabs'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = getCaseStudy(slug ?? '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [slug])

  if (!data) {
    return <Navigate to="/" replace />
  }

  const hasProjectTabs = data.projectTabs && data.projectTabs.length > 0
  const hasBodyParagraphs = data.bodyParagraphs && data.bodyParagraphs.length > 0

  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      {/* 1 — Full-viewport hero */}
      <CaseStudyHero data={data} />

      {/* 2a — Body paragraphs layout (replaces problem section, reorders prototype before decisions) */}
      {!hasProjectTabs && hasBodyParagraphs && (
        <section style={{ padding: '5rem 2rem 0', maxWidth: '72rem', margin: '0 auto' }}>
          {data.bodyParagraphs!.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_OUT }}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75,
                margin: '0 0 1.75rem 0',
                maxWidth: '64ch',
              }}
            >
              {para}
            </motion.p>
          ))}
        </section>
      )}

      {/* 2b — Standard problem section (when no bodyParagraphs) */}
      {!hasProjectTabs && !hasBodyParagraphs && <ProblemSection data={data} />}

      {/* 3a — Project tabs */}
      {hasProjectTabs && <ProjectTabs data={data} />}

      {/* 3b — Prototype early (when bodyParagraphs present — sits between text and decisions) */}
      {!hasProjectTabs && hasBodyParagraphs && data.prototypeEmbed && (
        <PrototypeEmbed embed={data.prototypeEmbed} />
      )}

      {/* 3c — Visual blocks (only when no projectTabs and no bodyParagraphs) */}
      {!hasProjectTabs && !hasBodyParagraphs && data.visualBlocks && data.visualBlocks.length > 0 && (
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

      {/* 4 — Platform sections */}
      {!hasProjectTabs && data.platformSections && data.platformSections.length > 0 && (
        <section>
          {data.platformSections.map((section, i) => (
            <PlatformBlock key={section.platform} section={section} index={i} />
          ))}
        </section>
      )}

      {/* 5 — Design decisions */}
      {!hasProjectTabs && data.designDecisions && data.designDecisions.length > 0 && (
        <DesignDecisions decisions={data.designDecisions} />
      )}

      {/* 6a — Post-decision body + image (when bodyParagraphs layout) */}
      {!hasProjectTabs && hasBodyParagraphs && (data.postDecisionBody || data.postDecisionImage) && (
        <section style={{ padding: '0 2rem 4rem', maxWidth: '72rem', margin: '0 auto' }}>
          {data.postDecisionBody && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75,
                margin: '0 0 2.5rem 0',
                maxWidth: '64ch',
              }}
            >
              {data.postDecisionBody}
            </motion.p>
          )}
          {data.postDecisionImage && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              style={{ borderRadius: '1.25rem', overflow: 'hidden' }}
            >
              <img
                src={data.postDecisionImage.src}
                alt={data.postDecisionImage.alt}
                style={{ width: '100%', display: 'block' }}
              />
            </motion.div>
          )}
        </section>
      )}

      {/* 6b — Prototype standard position (when no bodyParagraphs) */}
      {!hasProjectTabs && !hasBodyParagraphs && data.prototypeEmbed && (
        <PrototypeEmbed embed={data.prototypeEmbed} />
      )}

      {/* 7 — Next project — always */}
      <NextProject nextProject={data.nextProject} />
    </div>
  )
}
