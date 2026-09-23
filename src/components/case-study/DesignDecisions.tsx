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
      style={{
        // Matches the homepage role cards: token fill, hairline border and the
        // composite shadows — rather than liquid-glass, whose blur and edge ring
        // are a different surface language from the rest of the site.
        borderRadius: '1.25rem',
        background: 'var(--fill-card)',
        border: '1px solid rgb(var(--ink) / 0.09)',
        boxShadow: 'var(--shadow-hairline), var(--shadow-float)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        // Tighter than the homepage card — these carry one idea each, not a role
        padding: '1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Decision number */}
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: 'var(--text-1)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {decision.title}
      </h3>

      {/* Rationale */}
      <p
        style={{
          fontSize: '0.85rem',
          fontWeight: 300,
          lineHeight: 1.65,
          color: 'var(--text-2)',
          fontFamily: 'var(--font-body)',
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
              border: 'none',
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
              color: 'var(--text-3)',
              fontFamily: 'var(--font-body)',
            }}
          >
            →
          </span>

          <div
            style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: 'none',
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
  inline?: boolean
}

export default function DesignDecisions({ decisions, inline }: Props) {
  const Wrapper = inline ? 'div' : 'section'
  return (
    <Wrapper
      style={inline ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {
        padding: '2rem 2rem 4rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: inline ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {decisions.map((decision, i) => (
          <DecisionCard key={i} decision={decision} index={i} />
        ))}
      </div>
    </Wrapper>
  )
}
