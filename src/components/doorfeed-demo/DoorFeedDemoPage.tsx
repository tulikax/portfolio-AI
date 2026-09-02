import { useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import ArtifactsChapter from './ArtifactsChapter'
import ChapterHead, { TitleTokens } from './ChapterHead'
import DeepDiveAccordion from './DeepDiveAccordion'
import FlagList from './FlagList'
import HeroVideoDissolve from './HeroVideoDissolve'
import MediaGrid from './MediaGrid'
import MediaSlot from './MediaSlot'
import ProseBlocks from './ProseBlocks'
import ReflectionList from './ReflectionList'
import Reveal from './Reveal'
import RichText from './RichText'
import SectionRail from './SectionRail'
import StatusGrid from './StatusGrid'
import {
  CLOSING,
  CONTEXT,
  DECISIONS,
  HERO,
  IMPACT,
  OPENING_PULL,
  REFLECTIONS,
} from './content'
import {
  BODY,
  CHAPTER_TITLE,
  DISPLAY,
  EMPHASIS,
  HAIRLINE,
  MONO,
  WRAP,
  ink,
  warm,
} from './styles'
import './doorfeed-demo.css'

/**
 * Alternative treatment of the DoorFeed case study — an editorial, chaptered
 * narrative, as opposed to the tabbed layout at /work/doorfeed.
 *
 * Media slots are intentionally empty frames: this page exists to review the
 * structure and the argument before art direction is committed.
 */
export default function DoorFeedDemoPage() {
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div style={{ background: 'rgb(var(--surface))', minHeight: '100vh' }}>
      {/* Reading progress */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: ink(0.85),
          transformOrigin: '0% 50%',
          scaleX: scrollYProgress,
          zIndex: 60,
        }}
      />

      <SectionRail />

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          // Copy sits at the foot of the frame so the product stays visible above it
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <HeroVideoDissolve />

        {/* Scrim — the copy sits over live video, so it needs its own ground */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'linear-gradient(to top right, rgb(var(--surface) / 0.95) 0%, rgb(var(--surface) / 0.82) 22%, rgb(var(--surface) / 0.42) 48%, rgb(var(--surface) / 0.08) 72%, rgb(var(--surface) / 0) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgb(var(--surface) / 0.5) 0%, transparent 20%, transparent 55%, rgb(var(--surface) / 0.72) 88%, rgb(var(--surface)) 100%)',
          }}
        />

        {/* Same centred 72rem column as the chapters below and as the live case
            study hero — anything narrower runs under the section rail */}
        <div
          style={{
            ...WRAP,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '0 2rem 3.5rem',
          }}
        >
          <Reveal>
            <div
              style={{
                ...MONO,
                fontSize: '0.62rem',
                color: ink(0.55),
                marginBottom: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ width: '2.5rem', height: '1px', background: ink(0.55) }} />
              {HERO.kicker}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              style={{
                ...DISPLAY,
                fontWeight: 300,
                fontSize: 'clamp(1.875rem, 4.4vw, 3.25rem)',
                lineHeight: 1.02,
                color: ink(0.97),
                margin: '0 0 1.125rem',
              }}
            >
              <TitleTokens tokens={HERO.title} />
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: ink(0.62),
                maxWidth: '28rem',
                margin: '0 0 2rem',
              }}
            >
              {HERO.lede}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div
              style={{
                ...MONO,
                fontSize: '0.56rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: ink(0.4),
              }}
            >
              <span className="df-scroll-bar" />
              {HERO.scrollCue}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Opening pull quote ───────────────────────────────── */}
      <div style={{ ...WRAP, padding: '7.5rem 2rem', textAlign: 'center' }}>
        <Reveal>
          <blockquote
            style={{
              ...DISPLAY,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.375rem)',
              lineHeight: 1.32,
              color: ink(0.95),
              maxWidth: '46rem',
              margin: '0 auto',
            }}
          >
            {OPENING_PULL.lines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </blockquote>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ ...MONO, color: ink(0.4), marginTop: '1.625rem' }}>
            {OPENING_PULL.attrib}
          </div>
        </Reveal>
      </div>

      {/* ─── 01 · Context ─────────────────────────────────────── */}
      <section id="context" style={{ padding: '6rem 0', borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={WRAP}>
          <ChapterHead num={CONTEXT.num} eyebrow={CONTEXT.eyebrow} title={CONTEXT.title} />
          <ProseBlocks blocks={CONTEXT.blocks} />
        </div>
      </section>

      {/* ─── 02 · Final artifacts ─────────────────────────────── */}
      <section id="artifacts" style={{ padding: '6rem 0', borderTop: `1px solid ${HAIRLINE}` }}>
        <ArtifactsChapter />
      </section>

      {/* ─── 03 · Key decisions ───────────────────────────────── */}
      <section id="decisions" style={{ padding: '6rem 0', borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={WRAP}>
          <ChapterHead num={DECISIONS.num} eyebrow={DECISIONS.eyebrow} title={DECISIONS.title} />

          <Reveal>
            <p style={BODY}>{DECISIONS.intro}</p>
          </Reveal>

          <DeepDiveAccordion />

          <div style={{ marginTop: '3rem' }}>
            <MediaGrid spec={DECISIONS.mediaGrid} />
          </div>
        </div>
      </section>

      {/* ─── 04 · Impact ──────────────────────────────────────── */}
      <section id="impact" style={{ padding: '6rem 0', borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={WRAP}>
          <ChapterHead num={IMPACT.num} eyebrow={IMPACT.eyebrow} title={IMPACT.title} />

          <Reveal>
            <p style={BODY}>{IMPACT.intro}</p>
          </Reveal>

          <StatusGrid />

          <Reveal>
            <p style={BODY}>
              <RichText text={IMPACT.body} />
            </p>
          </Reveal>

          <Reveal>
            <h3
              style={{
                ...DISPLAY,
                fontSize: 'clamp(1.3125rem, 2.7vw, 1.75rem)',
                color: ink(0.95),
                margin: '3.5rem 0 1.125rem',
              }}
            >
              {IMPACT.openHeading}
            </h3>
          </Reveal>

          <FlagList />

          <MediaSlot spec={IMPACT.media} />
        </div>
      </section>

      {/* ─── 05 · Reflections ─────────────────────────────────── */}
      <section id="reflections" style={{ padding: '6rem 0', borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={WRAP}>
          <ChapterHead
            num={REFLECTIONS.num}
            eyebrow={REFLECTIONS.eyebrow}
            title={REFLECTIONS.title}
          />

          <ReflectionList />

          <MediaSlot spec={REFLECTIONS.media} />
        </div>
      </section>

      {/* ─── Closing ──────────────────────────────────────────── */}
      <section
        style={{
          padding: '8.125rem 0 6rem',
          textAlign: 'center',
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <div style={WRAP}>
          <Reveal>
            <blockquote
              style={{
                ...CHAPTER_TITLE,
                ...EMPHASIS,
                fontSize: 'clamp(1.5625rem, 3.9vw, 2.625rem)',
                lineHeight: 1.26,
                maxWidth: '46.875rem',
                margin: '0 auto 2.25rem',
              }}
            >
              {CLOSING.quote}
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                ...MONO,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                color: ink(0.45),
              }}
            >
              <span
                className="df-pulse"
                style={{
                  width: '0.4375rem',
                  height: '0.4375rem',
                  borderRadius: '50%',
                  background: warm(0.9),
                }}
              />
              {CLOSING.status}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer
        className="df-footer"
        style={{
          ...WRAP,
          ...MONO,
          padding: '2.375rem 2rem 3.625rem',
          borderTop: `1px solid ${HAIRLINE}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: ink(0.35),
        }}
      >
        <span>DoorFeed — Product Design Case Study</span>
        <span>Designed &amp; built by Tulika</span>
      </footer>
    </div>
  )
}
