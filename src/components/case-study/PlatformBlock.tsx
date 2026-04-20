import { motion } from 'framer-motion'
import VisualShowcase from './VisualShowcase'
import type { PlatformSection } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  section: PlatformSection
  index: number
}

export default function PlatformBlock({ section, index }: Props) {
  const isEven = index % 2 === 0

  return (
    <div
      style={{
        padding: '0 2rem',
        maxWidth: '72rem',
        margin: '0 auto 1rem',
      }}
    >
      {/* Top divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.07)',
          marginBottom: '3.5rem',
        }}
      />

      {/* Platform label + heading + description */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2.5rem',
          alignItems: 'start',
          marginBottom: '2.5rem',
        }}
      >
        {/* Platform badge */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: isEven ? 0 : 0.06, ease: EASE_OUT }}
          style={{ paddingTop: '0.2rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.3rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.60)',
              fontFamily: "'Barlow', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            {section.platform}
          </span>
        </motion.div>

        {/* Heading + description */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: isEven ? 0.08 : 0.02, ease: EASE_OUT }}
        >
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: 'white',
              margin: '0 0 1rem 0',
              lineHeight: 1.15,
            }}
          >
            {section.heading}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.65)',
              fontFamily: "'Barlow', sans-serif",
              margin: 0,
              maxWidth: '44rem',
            }}
          >
            {section.description}
          </p>
        </motion.div>
      </div>

      {/* Images */}
      <VisualShowcase
        block={{
          images: section.images,
          layout: section.layout ?? 'full',
        }}
      />
    </div>
  )
}
