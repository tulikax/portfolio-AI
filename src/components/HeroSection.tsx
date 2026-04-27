import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronRight, ChevronsDown } from 'lucide-react'
import ParticleTitle from './ParticleTitle'
import GradientBlobs from './GradientBlobs'
import HeroWireframe from './HeroWireframe'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const SUBTITLE = "Designer, tinkerer, always with a side project.      I find the joy in complex flows, and make sure the person using them does too."
const SUBTITLE_WORDS = SUBTITLE.split(' ')
const STREAM_START_MS = 1000   // brief pause, then stream alongside particles
const WORD_INTERVAL_MS = 150  // ms between each word
const SENTENCE_PAUSE_MS = 550 // extra pause after the first sentence ends
// Index of the last word in the first sentence (ends with '.')
const SENTENCE_BREAK_IDX = SUBTITLE_WORDS.findIndex(w => w.endsWith('.'))

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  // Shared cursor position — passed to both particle layers
  const cursorRef = useRef({ x: -9999, y: -9999 })

  const [streamedText, setStreamedText] = useState('')
  const [streamDone, setStreamDone] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    function revealNext(wordIdx: number) {
      if (cancelled) return
      const next = wordIdx + 1
      setStreamedText(SUBTITLE_WORDS.slice(0, next).join(' '))
      if (next >= SUBTITLE_WORDS.length) {
        setStreamDone(true)
        return
      }
      // Use a longer pause after the sentence break word
      const delay = next === SENTENCE_BREAK_IDX + 1 ? SENTENCE_PAUSE_MS : WORD_INTERVAL_MS
      timeoutId = setTimeout(() => revealNext(next), delay)
    }

    timeoutId = setTimeout(() => revealNext(0), STREAM_START_MS)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 45])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // Store raw viewport coords — each canvas translates to its own local space
    cursorRef.current = { x: e.clientX, y: e.clientY }
  }

  function onMouseLeave() {
    cursorRef.current = { x: -9999, y: -9999 }
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        height: '100vh',
        minHeight: '700px',
        background: 'black',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'crosshair',
      }}
    >
      {/* Pastel gradient blobs */}
      <GradientBlobs />

      {/* 3D wireframe shapes — cursor-aware */}
      <HeroWireframe cursorRef={cursorRef} />

      {/* Background floating particles — cursor-aware */}

      {/* Subtle interactive zone border — top glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          zIndex: 5,
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          position: 'relative',
          zIndex: 10,
          paddingTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        {/* Particle Title — full width, larger */}
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          <ParticleTitle cursorRef={cursorRef} />
        </div>

        {/* Cursor hint — fades in just after particles settle */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
            marginBottom: '2.5rem',
          }}
        >
          move cursor ✦ over the title to play :)
        </motion.span>

        {/* Subtext — streams in alongside particles */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '560px',
            lineHeight: 1.65,
            fontStyle: 'italic',
            margin: '0 0 2.25rem',
            minHeight: '4rem',
          }}
        >
          {streamedText}
          {!streamDone && streamedText.length > 0 && (
            <span className="stream-cursor" />
          )}
        </p>

        {/* CTAs — appear after streaming finishes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: streamDone ? 1 : 0, y: streamDone ? 0 : 12 }}
          transition={{ duration: 0.6, delay: streamDone ? 0.15 : 0, ease: EASE_OUT }}
          style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href="#work"
            className="liquid-glass-strong btn-press"
            style={{
              borderRadius: '9999px',
              padding: '0.75rem 1.75rem',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              cursor: 'pointer',
            }}
          >
            See My Work
            <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
          </a>
          <a
            href="#about"
            className="btn-press"
            style={{
              borderRadius: '9999px',
              padding: '0.75rem 1.25rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.9rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
            }}
          >
            About Me
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </a>
        </motion.div>

      </motion.div>

      {/* Scroll indicator — bottom center, signals this is a scrollable page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2, ease: EASE_OUT }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        > 
        Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronsDown style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.22)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
