import { motion } from 'framer-motion'
import { JOURNEY } from './content'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

/**
 * Vertical spine timeline for the designer journey — same spine + node + glass card
 * construction as the mobile process timeline, so the two read as one system.
 */
export default function JourneyTimeline() {
  return (
    <div style={{ position: 'relative', maxWidth: '40rem', margin: '0 auto', textAlign: 'left' }}>
      {/* Spine */}
      <div style={{
        position: 'absolute',
        left: '1rem',
        top: '1rem',
        bottom: '1rem',
        width: '2px',
        background: 'rgb(var(--ink) / 0.10)',
        borderRadius: 1,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {JOURNEY.map((entry, i) => (
          <motion.div
            key={entry.period}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT }}
            style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
          >
            {/* Node */}
            <div style={{
              width: '2rem',
              height: '2rem',
              flexShrink: 0,
              borderRadius: '9999px',
              background: 'rgb(var(--ink) / 0.08)',
              border: '1px solid rgb(var(--ink) / 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '0.7rem',
              color: 'rgb(var(--ink) / 0.45)',
              position: 'relative',
              zIndex: 1,
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Card */}
            <div style={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.125rem',
              padding: '1.25rem 1.375rem',
              background: 'linear-gradient(145deg, rgb(var(--ink) / 0.10), rgb(var(--ink) / 0.04))',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgb(var(--ink) / 0.13)',
              boxShadow: '0 1px 0 rgb(var(--ink) / 0.10) inset, 0 20px 50px rgba(0,0,0,0.60)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '1.25rem', right: '1.25rem', height: '1px',
                background: 'linear-gradient(to right, rgb(var(--ink) / 0), rgb(var(--ink) / 0.18), rgb(var(--ink) / 0))',
              }} />

              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.65rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgb(var(--ink) / 0.35)', margin: '0 0 0.6rem',
              }}>
                {entry.period}
              </p>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400,
                fontSize: '1.35rem', letterSpacing: '-0.02em', lineHeight: 1.15,
                color: 'var(--ink-solid)', margin: '0 0 0.75rem',
              }}>
                {entry.role} <span style={{ color: 'rgb(var(--ink) / 0.45)' }}>· {entry.place}</span>
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.95rem',
                color: 'rgb(var(--ink) / 0.66)', lineHeight: 1.65, margin: 0,
              }}>
                {entry.body}
              </p>

              {entry.takeaway && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.875rem',
                  color: 'rgb(var(--ink) / 0.45)', lineHeight: 1.6,
                  margin: '0.9rem 0 0', paddingTop: '0.9rem',
                  borderTop: '1px solid rgb(var(--ink) / 0.08)',
                }}>
                  {entry.takeaway}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
