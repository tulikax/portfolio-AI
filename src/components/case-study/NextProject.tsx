import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '../../types/caseStudy'
import { ArrowUpRight } from 'lucide-react'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  nextProject: CaseStudy['nextProject']
}

export default function NextProject({ nextProject }: Props) {
  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        marginTop: '2rem',
      }}
    >
      {nextProject ? (
        <Link
          to={`/work/${nextProject.slug}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <motion.div
            whileHover={{ opacity: 0.82 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '2rem',
              padding: '4rem 2rem',
              maxWidth: '72rem',
              margin: '0 auto',
            }}
          >
            {/* Left — labels + title */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: "'Barlow', sans-serif",
                  marginBottom: '1rem',
                }}
              >
                Next Project
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.04em',
                    color: 'white',
                    margin: 0,
                    lineHeight: 1.05,
                  }}
                >
                  {nextProject.title}
                </h2>
                <ArrowUpRight
                  style={{
                    width: 'clamp(1.25rem, 2.5vw, 2rem)',
                    height: 'clamp(1.25rem, 2.5vw, 2rem)',
                    color: 'rgba(255,255,255,0.45)',
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            {/* Right — thumbnail */}
            <div
              style={{
                width: 'clamp(120px, 18vw, 220px)',
                aspectRatio: '4/3',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                flexShrink: 0,
              }}
            >
              <img
                src={nextProject.coverImage.src}
                alt={nextProject.coverImage.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </motion.div>
        </Link>
      ) : (
        // Fallback — back to main work section
        <div
          style={{
            padding: '4rem 2rem',
            maxWidth: '72rem',
            margin: '0 auto',
          }}
        >
          <Link
            to="/#work"
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              whileHover={{ opacity: 0.75 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.04em',
              }}
            >
              ← Back to Work
            </motion.div>
          </Link>
        </div>
      )}
    </section>
  )
}
