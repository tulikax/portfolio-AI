import { motion } from 'framer-motion'
import type { CaseStudy } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  data: CaseStudy
}

const items = (data: CaseStudy) => [
  { label: 'Project Goal', content: data.goal },
  { label: 'Your Role', content: data.yourRole },
  { label: 'Final Outcome', content: data.outcome },
]

export default function OverviewStrip({ data }: Props) {
  return (
    <section
      style={{
        padding: '5rem 2rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {items(data).map(({ label, content }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_OUT }}
            className="liquid-glass"
            style={{
              borderRadius: '1.25rem',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {/* Label */}
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.40)',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              {label}
            </span>

            {/* Content */}
            <p
              style={{
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.80)',
                fontFamily: "'Barlow', sans-serif",
                margin: 0,
              }}
            >
              {content}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
