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
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          style={{ maxWidth: hasSideImage ? 'none' : '44rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.40)',
              fontFamily: "'Barlow', sans-serif",
              marginBottom: '1.25rem',
            }}
          >
            The Problem
          </span>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Barlow', sans-serif",
              margin: 0,
            }}
          >
            {data.problemStatement}
          </p>
        </motion.div>

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
                border: '1px solid rgba(255,255,255,0.10)',
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
