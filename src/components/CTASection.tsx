import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight } from 'lucide-react'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function CTASection() {
  return (
    <section
      id="contact"
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '10rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: 'white',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Got something
          <br />
          worth designing?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.70)',
            fontSize: '1.05rem',
            maxWidth: '28rem',
            lineHeight: 1.65,
          }}
        >
          I'm open to full-time roles, collaborations, and conversations about design, AI, and
          building things that matter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href="mailto:hello@tulika.design"
            className="liquid-glass-strong btn-press"
            style={{
              borderRadius: '9999px',
              padding: '0.875rem 2rem',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Send Me a Note
            <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
          </a>
          <a
            href="#"
            className="liquid-glass btn-press"
            style={{
              borderRadius: '9999px',
              padding: '0.875rem 2rem',
              color: 'rgba(255,255,255,0.80)',
              fontSize: '0.9rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            See My CV
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
