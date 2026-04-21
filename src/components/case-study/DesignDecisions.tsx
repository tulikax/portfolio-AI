import { motion } from 'framer-motion'
import type { DesignDecision } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

function DecisionCard({ decision, index }: { decision: DesignDecision; index: number }) {
  const hasBeforeAfter = decision.before && decision.after

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT }}
      className="liquid-glass"
      style={{
        borderRadius: '1.25rem',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Decision number */}
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)',
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: '1rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.90)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {decision.title}
      </h3>

      {/* Rationale */}
      <p
        style={{
          fontSize: '0.92rem',
          fontWeight: 300,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.60)',
          fontFamily: "'Barlow', sans-serif",
          margin: 0,
        }}
      >
        {decision.rationale}
      </p>

      {/* Before / After images */}
      {hasBeforeAfter && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.10)',
              lineHeight: 0,
            }}
          >
            <img
              src={decision.before!.src}
              alt={decision.before!.alt}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <span
            style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.28)',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            →
          </span>

          <div
            style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.10)',
              lineHeight: 0,
            }}
          >
            <img
              src={decision.after!.src}
              alt={decision.after!.alt}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface Props {
  decisions: DesignDecision[]
}

export default function DesignDecisions({ decisions }: Props) {
  return (
    <section
      style={{
        padding: '4rem 2rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '3.5rem',
        }}
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        style={{ marginBottom: '2.5rem' }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.68rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
            fontFamily: "'Barlow', sans-serif",
            marginBottom: '0.875rem',
          }}
        >
          Key Design Decisions
        </span>
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            color: 'white',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          The choices that shaped it.
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {decisions.map((decision, i) => (
          <DecisionCard key={i} decision={decision} index={i} />
        ))}
      </div>
    </section>
  )
}
