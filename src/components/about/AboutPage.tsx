import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Footer from '../Footer'
import ProcessSection from '../ProcessSection'
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
  color: 'var(--text-2)',
  lineHeight: 1.7,
  maxWidth: '40rem',
  margin: '0 auto',
}

// ─── Toggle the journey timeline ──────────────────────────────
// Content and component are kept; flip to true to show the section again.
const SHOW_JOURNEY: boolean = false
// ──────────────────────────────────────────────────────────────

const PARAGRAPHS = [
  "My day to day gets spent on B2B finance and complex tools — regulated spaces where trust and speed both have to hold. Lately that means working out what it takes to build AI into them: what to optimise for, and where to draw the line.",
  "Outside of that, I've never liked sticking to one lane. Brand design, illustration, product design for solo founders finding their first users. I've conceptualised and built platforms for galleries, art collectors, patients, social workers — people who'd never touched software built for them before.",
  "Consulting taught me to work at scale, startups taught me to ship. But the real education has been obsessing over each new world until I can think like the person standing inside it. As long as there's something to learn and something complex to figure out, I'm here for it.",
]

export default function AboutPage() {
  // No scroll restoration on the router, so each page arrival resets it here
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div style={{ background: 'rgb(var(--surface))', minHeight: '100vh' }}>
      <main>
        {/* Intro */}
        <section
          style={{
            background: 'rgb(var(--surface))',
            paddingTop: '10rem',
            /* Tight into "How I work" — the process section carries its own
               generous top spacing, so this needs none of its own. */
            paddingBottom: 0,
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* No eyebrow, no title — the copy opens the page on its own. The
                navbar already says where you are, and "How I work" below carries
                the only heading this page needs. */}
            {PARAGRAPHS.map((para, i) => (
              <motion.p
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
                className="about-body-text"
                style={BODY}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </section>

        {/* How I work — moved here from the homepage. It is the long answer to
            "how", and it belongs next to the long answer to "who". */}
        <ProcessSection />

        {/* Journey */}
        {SHOW_JOURNEY && (
          <section
            style={{
              background: 'rgb(var(--surface))',
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
                  color: 'var(--text-3)', fontSize: '0.875rem',
                  lineHeight: 1.6, maxWidth: '28rem', margin: '0 auto',
                }}
              >
                Less a career ladder than a series of problems that changed how I design.
              </p>
            </motion.div>

            <JourneyTimeline />
          </section>
        )}

        {/* Closing */}
        <section
          style={{
            background: 'rgb(var(--surface))',
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
                color: 'var(--text-2)',
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
