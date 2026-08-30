import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Footer from '../Footer'
import JourneyTimeline from './JourneyTimeline'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE_OUT },
} as const

const BODY: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  fontSize: '1.05rem',
  color: 'rgb(var(--ink) / 0.70)',
  lineHeight: 1.7,
  maxWidth: '40rem',
  margin: '0 auto',
}

const PARAGRAPHS = [
  "My day to day gets spent on B2B finance and complex tools. Regulated spaces where trust and speed both have to hold.",
  "Outside of that, however, I've never liked sticking to one lane. Brand design, illustration. Product design for solo founders finding their first users. I've conceptualised and built platforms for galleries, art collectors, patients, social workers, people who'd never touched software like it.",
  "Never one lane, never one client, never one industry. New challenges are the thing I love most. My curiosity and adaptability are at the core of what I do — as long as there's something to learn and something complex to figure out, I'm here for it.",
]

export default function AboutPage() {
  // No scroll restoration on the router, so each page arrival resets it here
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div style={{ background: 'black', minHeight: '100vh' }}>
      <main>
        {/* Intro */}
        <section
          style={{
            background: 'black',
            paddingTop: '10rem',
            paddingBottom: '5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.65rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgb(var(--ink) / 0.35)', margin: 0,
              }}
            >
              About
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: 'var(--ink-solid)',
                margin: 0,
                fontWeight: 400,
              }}
            >
              The longer
              <br />
              version.
            </motion.h1>

            {PARAGRAPHS.map((para, i) => (
              <motion.p
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.16 + i * 0.08, ease: EASE_OUT }}
                className="about-body-text"
                style={BODY}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section
          style={{
            background: 'black',
            paddingTop: '4rem',
            paddingBottom: '7rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
        >
          <motion.div
            {...fadeUp}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.92,
                color: 'var(--ink-solid)',
                margin: '0 0 0.75rem',
                fontWeight: 400,
              }}
            >
              How I got here.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 300,
                color: 'rgb(var(--ink) / 0.40)', fontSize: '0.875rem',
                lineHeight: 1.6, maxWidth: '28rem', margin: '0 auto',
              }}
            >
              Less a career ladder than a series of problems that changed how I design.
            </p>
          </motion.div>

          <JourneyTimeline />
        </section>

        {/* Closing */}
        <section
          style={{
            background: 'black',
            paddingTop: '2rem',
            paddingBottom: '6rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            textAlign: 'center',
          }}
        >
          <motion.div
            {...fadeUp}
            style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/#work"
              className="btn-glass btn-press cta-glow"
              style={{
                borderRadius: '9999px',
                padding: '0.75rem 1.75rem',
                color: 'var(--ink-solid)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ArrowLeft style={{ width: '0.95rem', height: '0.95rem', strokeWidth: 1.75, flexShrink: 0 }} />
              See my work
            </Link>
            <Link
              to="/#contact"
              className="btn-press"
              style={{
                borderRadius: '9999px',
                padding: '0.75rem 1.25rem',
                color: 'rgb(var(--ink) / 0.6)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              Get in touch
              <ArrowUpRight style={{ width: '0.95rem', height: '0.95rem', strokeWidth: 1.75, flexShrink: 0 }} />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
