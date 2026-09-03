import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getCaseStudy } from '../../data/caseStudies'
import CaseStudyHero from './CaseStudyHero'
import ProjectLoadingScreen from '../ProjectLoadingScreen'
import ProblemSection from './ProblemSection'
import VisualShowcase from './VisualShowcase'
import PlatformBlock from './PlatformBlock'
import DesignDecisions from './DesignDecisions'
import PrototypeEmbed from './PrototypeEmbed'
import NextProject from './NextProject'
import ProjectTabs from './ProjectTabs'
import DoorFeedArtifacts from './DoorFeedArtifacts'
import CaseSideNav from './CaseSideNav'
import { LightboxProvider } from './LightboxContext'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const MIN_LOADER_MS = 1500   // always show loader for at least this long

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = getCaseStudy(slug ?? '')

  const [loaderVisible, setLoaderVisible] = useState(true)
  const [loaderExiting, setLoaderExiting] = useState(false)
  const [loaderProgress, setLoaderProgress] = useState(0)
  // Track which slug the current loader state belongs to (state, not ref — avoids ref-during-render)
  const [activeSlug, setActiveSlug] = useState(slug)
  const mountTimeRef = useRef(0)
  const readyCalledRef = useRef(false)

  // Render-time synchronization: reset loader when slug changes.
  // This is the React-idiomatic pattern for syncing state with changing props/params
  // (see react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (activeSlug !== slug) {
    setActiveSlug(slug)
    setLoaderVisible(true)
    setLoaderExiting(false)
    setLoaderProgress(0)
  }

  useEffect(() => {
    // Ref mutations and impure calls (Date.now) must live in effects, not render
    mountTimeRef.current = Date.now()
    readyCalledRef.current = false
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [slug])

  function handleVideoProgress(pct: number) {
    setLoaderProgress(pct)
  }

  function handleVideoReady() {
    if (readyCalledRef.current) return
    readyCalledRef.current = true

    const elapsed = Date.now() - mountTimeRef.current
    const remaining = Math.max(0, MIN_LOADER_MS - elapsed)

    setTimeout(() => {
      setLoaderProgress(100)
      setTimeout(() => setLoaderExiting(true), 300)
    }, remaining)
  }

  if (!data) {
    return <Navigate to="/" replace />
  }

  const loaderLabel = [data.company ?? data.title, data.role, data.year]
    .filter(Boolean).join(' · ')

  // The Context chapter renders inside ProjectTabs' container, so a study using
  // it takes the tabbed layout even with no tabs of its own — otherwise the
  // legacy Problem/visual/platform sections would switch back on beneath it.
  const hasProjectTabs =
    (data.projectTabs && data.projectTabs.length > 0) || data.contextChapter === true
  const hasBodyParagraphs = data.bodyParagraphs && data.bodyParagraphs.length > 0

  const sideNavSections = hasProjectTabs
    ? [
        { id: 'section-overview', label: data.contextChapter ? 'Context' : 'Overview' },
        ...(data.projectTabs ?? []).flatMap((t) => {
          const tabEntry = {
            id: 'section-' + t.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            label: t.label,
          }
          const keyDecisionsEntry =
            t.keyDecisions && t.keyDecisions.length > 0
              ? [{ id: 'section-key-decisions', label: t.keyDecisionsHeading ?? 'Key decisions' }]
              : []
          return [tabEntry, ...keyDecisionsEntry]
        }),
        ...(data.contextChapter ? [{ id: 'section-artifacts', label: 'Final artifacts' }] : []),
      ]
    : []

  return (
    <LightboxProvider>
    <div style={{ background: 'black', minHeight: '100vh' }}>
      {/* Sticky left side nav — only for case studies with project tabs */}
      {hasProjectTabs && !loaderVisible && <CaseSideNav sections={sideNavSections} />}

      {/* Loading screen overlay — instantly opaque, sits on top while hero buffers */}
      <AnimatePresence>
        {loaderVisible && (
          <ProjectLoadingScreen
            key={slug}
            label={loaderLabel}
            progress={loaderProgress}
            isExiting={loaderExiting}
            onDone={() => setLoaderVisible(false)}
          />
        )}
      </AnimatePresence>

      {/* Page content — hidden until loader exits to prevent flash-of-content */}
      <motion.div
        animate={{ opacity: loaderVisible ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >

      {/* 1 — Full-viewport hero */}
      <CaseStudyHero
        data={data}
        onVideoReady={handleVideoReady}
        onVideoProgress={handleVideoProgress}
      />

      {/* 2a — Body paragraphs layout (replaces problem section, reorders prototype before decisions) */}
      {!hasProjectTabs && hasBodyParagraphs && (
        <section style={{ padding: '0.5rem 2rem 4rem', maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ height: '1px', background: 'rgb(var(--ink) / 0.08)', margin: '1.5rem 0 3rem' }} />
          {data.bodyParagraphs!.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 300,
                color: 'rgb(var(--ink) / 0.72)',
                lineHeight: 1.8,
                margin: '0 0 1rem 0',
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

      {/* Final artifacts — full width, so the rounds get their own column */}
      {data.contextChapter && <DoorFeedArtifacts />}

      {/* 3b — Video + decisions side-by-side (when bodyParagraphs present) */}
      {!hasProjectTabs && hasBodyParagraphs && (data.prototypeEmbed || (data.designDecisions && data.designDecisions.length > 0)) && (
        <section style={{ padding: '0 2rem 4rem', maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            {/* Left — video */}
            {data.prototypeEmbed && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                className="liquid-glass"
                style={{ borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', minHeight: 0 }}
              >
                <video
                  src={data.prototypeEmbed.url}
                  autoPlay loop muted playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>
            )}
            {/* Right — stacked decision cards */}
            {data.designDecisions && data.designDecisions.length > 0 && (
              <DesignDecisions decisions={data.designDecisions} inline />
            )}
          </div>
        </section>
      )}

      {/* 3c — Visual blocks (only when no projectTabs and no bodyParagraphs) */}
      {!hasProjectTabs && !hasBodyParagraphs && data.visualBlocks && data.visualBlocks.length > 0 && (
        <section style={{ padding: '0 0 2rem' }}>
          <div
            style={{
              height: '1px',
              background: 'rgb(var(--ink) / 0.08)',
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

      {/* 5 — Design decisions (standard layout only — bodyParagraphs layout renders these inline above) */}
      {!hasProjectTabs && !hasBodyParagraphs && data.designDecisions && data.designDecisions.length > 0 && (
        <DesignDecisions decisions={data.designDecisions} />
      )}

      {/* 6a — Post-decision body + image + body below (when bodyParagraphs layout) */}
      {!hasProjectTabs && hasBodyParagraphs && (data.postDecisionBody || data.postDecisionImage || data.postDecisionBodyBelow) && (
        <section style={{ padding: '0 2rem 4rem', maxWidth: '72rem', margin: '0 auto' }}>
          {data.postDecisionBody && (
            <div style={{ marginBottom: '2.5rem' }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'rgb(var(--ink) / 0.72)',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {data.postDecisionBody}
              </motion.p>
            </div>
          )}
          {data.postDecisionImage && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: data.postDecisionBodyBelow ? '2.5rem' : 0 }}
            >
              <img
                src={data.postDecisionImage.src}
                alt={data.postDecisionImage.alt}
                style={{ width: '100%', display: 'block' }}
              />
            </motion.div>
          )}
          {data.postDecisionBodyBelow && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 300,
                color: 'rgb(var(--ink) / 0.72)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {data.postDecisionBodyBelow}
            </motion.p>
          )}
        </section>
      )}

      {/* 6b — Prototype standard position (when no bodyParagraphs) */}
      {!hasProjectTabs && !hasBodyParagraphs && data.prototypeEmbed && (
        <PrototypeEmbed embed={data.prototypeEmbed} />
      )}

      {/* 7 — Next project — always */}
      <NextProject nextProject={data.nextProject} />

      </motion.div>
    </div>
    </LightboxProvider>
  )
}
