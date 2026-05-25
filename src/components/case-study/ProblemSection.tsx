import { motion } from 'framer-motion'
import type { CaseStudy } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  data: CaseStudy
}

export default function ProblemSection({ data }: Props) {
  const hasSideImage = Boolean(data.problemImage)

  return (
    <section
      style={{
        padding: '2rem 2rem 5rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '4rem',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasSideImage ? '1fr 1fr' : '1fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Text column */}
        <div style={{ maxWidth: hasSideImage ? 'none' : '44rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: 'clamp(1.5rem, 3.75vw, 2.625rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.92)',
                margin: '0 0 1.5rem 0',
                lineHeight: 1.1,
              }}
            >
              The Problem
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.65)',
              fontFamily: "'Barlow', sans-serif",
              margin: 0,
            }}
          >
            {data.problemStatement}
          </motion.p>
        </div>

        {/* Optional side image */}
        {data.problemImage && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE_OUT }}
          >
            <div
              style={{
                borderRadius: '1.25rem',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                lineHeight: 0,
              }}
            >
              <img
                src={data.problemImage.src}
                alt={data.problemImage.alt}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            {data.problemImage.caption && (
              <p
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.40)',
                  fontFamily: "'Barlow', sans-serif",
                  marginTop: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                {data.problemImage.caption}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
