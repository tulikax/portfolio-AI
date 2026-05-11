import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronRight, ChevronsDown } from 'lucide-react'
import ParticleTitle from './ParticleTitle'
import GradientBlobs from './GradientBlobs'
import HeroWireframe from './HeroWireframe'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const SUBTITLE = "Designer, tinkerer, always with a side project.      I find the joy in complex flows, and make sure the person using them does too."
const SUBTITLE_WORDS = SUBTITLE.split(' ')
const STREAM_START_MS = 1000
const WORD_INTERVAL_MS = 150
const SENTENCE_PAUSE_MS = 550
const SENTENCE_BREAK_IDX = SUBTITLE_WORDS.findIndex(w => w.endsWith('.'))

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef({ x: -9999, y: -9999 })
  const isMobile = useIsMobile()

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
    cursorRef.current = { x: e.clientX, y: e.clientY }
  }

  function onMouseLeave() {
    cursorRef.current = { x: -9999, y: -9999 }
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const t = e.touches[0]
    cursorRef.current = { x: t.clientX, y: t.clientY }
  }

  function onTouchEnd() {
    cursorRef.current = { x: -9999, y: -9999 }
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        height: '100vh',
        minHeight: '700px',
        background: 'black',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'crosshair',
      }}
    >
      <GradientBlobs />
      <HeroWireframe cursorRef={cursorRef} />

      {/* Top glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
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
          bottom: 0, left: 0, right: 0,
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
          position: isMobile ? 'absolute' : 'relative',
          inset: isMobile ? 0 : undefined,
          zIndex: 10,
          paddingTop: isMobile ? '72px' : '80px',
          paddingBottom: isMobile ? '2rem' : '0',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '2rem' : '0',
        }}
      >
        {/* Group 1: Particle title + hint */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1100px' }}>
            <ParticleTitle cursorRef={cursorRef} />
          </div>

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
              marginBottom: isMobile ? '0' : '2.5rem',
            }}
          >
            {IS_TOUCH ? 'tap & drag the title to play :)' : 'move cursor ✦ over the title to play :)'}
          </motion.span>
        </div>

        {/* Group 2: Subtitle + CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '560px',
              lineHeight: 1.65,
              fontStyle: 'italic',
              margin: isMobile ? '0 0 1.25rem' : '0 0 2.25rem',
              minHeight: isMobile ? '0' : '4rem',
            }}
          >
            {streamedText}
            {!streamDone && streamedText.length > 0 && (
              <span className="stream-cursor" />
            )}
          </p>

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
        </div>
      </motion.div>

      {/* Scroll indicator */}
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
