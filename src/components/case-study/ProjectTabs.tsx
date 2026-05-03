import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CaseStudy, ProjectTab } from '../../types/caseStudy'
import VisualShowcase from './VisualShowcase'
import HighlightPhrase from './HighlightPhrase'

// ─── Highlight helper ──────────────────────────────────────────

function applyHighlights(
  text: string,
  highlights: CaseStudy['overviewHighlights'],
): React.ReactNode {
  if (!highlights || highlights.length === 0) return text
  const escaped = highlights.map((h) =>
    h.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  )
  const regex = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(regex)
  return parts.map((part, i) => {
    const hl = highlights.find((h) => h.phrase === part)
    if (hl) {
      return (
        <HighlightPhrase key={i} color={hl.color} textColor={hl.textColor}>
          {part}
        </HighlightPhrase>
      )
    }
    return part
  })
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// ─── Tab bar ──────────────────────────────────────────────────

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: string[]
  active: number
  onChange: (i: number) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          gap: '2px',
          padding: '4px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {tabs.map((label, i) => (
          <button
            key={label}
            onClick={() => onChange(i)}
            style={{
              position: 'relative',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: active === i ? 'rgba(255,255,255,0.14)' : 'transparent',
              color: active === i ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.42)',
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.85rem',
              fontWeight: active === i ? 500 : 400,
              letterSpacing: '0.02em',
              transition: 'background 0.18s ease, color 0.18s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Section block (label + heading + body) ───────────────────

function SectionBlock({
  label,
  heading,
  body,
  delay = 0,
}: {
  label: string
  heading: string
  body: string
  delay?: number
}) {
  const paragraphs = body.split('\n\n').filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Barlow', sans-serif",
          marginBottom: '0.6rem',
        }}
      >
        {label}
      </span>
      <h3
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h3>
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '1.5rem',
        }}
      />
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.68)',
            fontFamily: "'Barlow', sans-serif",
            margin: i < paragraphs.length - 1 ? '0 0 1rem 0' : '0',
          }}
        >
          {p}
        </p>
      ))}
    </motion.div>
  )
}

// ─── Decision cards ────────────────────────────────────────────

function DecisionsBlock({
  heading,
  decisions,
  delay = 0,
}: {
  heading: string
  decisions: ProjectTab['decisions']
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Barlow', sans-serif",
          marginBottom: '0.6rem',
        }}
      >
        Key Decisions
      </span>
      <h3
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h3>
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '1.5rem',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {decisions.map((d, i) => (
          <div
            key={i}
            style={{
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.88)',
                margin: '0 0 0.5rem 0',
                lineHeight: 1.4,
              }}
            >
              {d.title}
            </p>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              {d.rationale}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Outcome stats ─────────────────────────────────────────────

function OutcomeBlock({
  heading,
  stats,
  footnote,
  delay = 0,
}: {
  heading: string
  stats: ProjectTab['outcome']['stats']
  footnote?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Barlow', sans-serif",
          marginBottom: '0.6rem',
        }}
      >
        Outcome
      </span>
      <h3
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h3>
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '1.75rem',
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: footnote ? '1.5rem' : 0,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                marginBottom: '0.5rem',
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: "'Instrument Serif', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                color: 'white',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.50)',
                lineHeight: 1.5,
              }}
            >
              {s.description}
            </span>
          </div>
        ))}
      </div>
      {footnote && (
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '0.88rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.42)',
            lineHeight: 1.7,
            margin: 0,
            borderLeft: '2px solid rgba(255,255,255,0.12)',
            paddingLeft: '1rem',
          }}
        >
          {footnote}
        </p>
      )}
    </motion.div>
  )
}

// ─── Overview tab content ──────────────────────────────────────

function OverviewContent({ data }: { data: CaseStudy }) {
  const paragraphs = (data.overviewBody ?? '').split('\n\n').filter(Boolean)

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {paragraphs.length > 0 && (
        <div style={{ maxWidth: '48rem', marginBottom: '3rem' }}>
          {/* First paragraph rendered as subtitle */}
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              margin: '0 0 1.25rem 0',
            }}
          >
            {paragraphs[0]}
          </p>
          {/* Remaining paragraphs as body text */}
          {paragraphs.slice(1).map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '1rem',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.72)',
                margin: i < paragraphs.length - 2 ? '0 0 1rem 0' : '0',
              }}
            >
              {applyHighlights(p, data.overviewHighlights)}
            </p>
          ))}
        </div>
      )}

      {/* Problem statement — above images */}
      {data.problemStatement && (
        <div style={{ maxWidth: '48rem', marginTop: '2rem' }}>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              margin: '0 0 0.75rem 0',
            }}
          >
            The Problem
          </p>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
            }}
          >
            {data.problemStatement}
          </p>
        </div>
      )}

      {/* All images live here — negative margin cancels section's 2rem horizontal padding */}
      {data.visualBlocks && data.visualBlocks.length > 0 && (
        <div style={{ margin: '0 -2rem' }}>
          {data.visualBlocks.map((block, i) => (
            <VisualShowcase key={i} block={block} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Project tab content ───────────────────────────────────────

function ProjectContent({ tab }: { tab: ProjectTab }) {
  return (
    <motion.div
      key={tab.label}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <SectionBlock label="Project Goal" heading={tab.goal.heading} body={tab.goal.body} delay={0} />
      <SectionBlock label="Process" heading={tab.process.heading} body={tab.process.body} delay={0.06} />
      <DecisionsBlock
        heading={tab.decisionsHeading ?? 'What shaped the outcome'}
        decisions={tab.decisions}
        delay={0.12}
      />
      <OutcomeBlock
        heading={tab.outcome.heading}
        stats={tab.outcome.stats}
        footnote={tab.outcome.footnote}
        delay={0.18}
      />
      {tab.visualBlocks && tab.visualBlocks.length > 0 && (
        <div style={{ margin: '0 -2rem' }}>
          {tab.visualBlocks.map((block, i) => (
            <VisualShowcase key={i} block={block} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────

interface Props {
  data: CaseStudy
}

export default function ProjectTabs({ data }: Props) {
  const [active, setActive] = useState(0)
  const tabs = ['Overview', ...(data.projectTabs ?? []).map((t) => t.label)]

  if (!data.projectTabs || data.projectTabs.length === 0) return null

  return (
    <section
      style={{
        padding: '0.5rem 2rem 4rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      <TabBar tabs={tabs} active={active} onChange={setActive} />

      <AnimatePresence mode="wait">
        {active === 0 ? (
          <OverviewContent key="overview" data={data} />
        ) : (
          <ProjectContent key={data.projectTabs[active - 1].label} tab={data.projectTabs[active - 1]} />
        )}
      </AnimatePresence>
    </section>
  )
}
