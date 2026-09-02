import { useRef, useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronRight, ChevronsDown } from 'lucide-react'
import ParticleTitle from './ParticleTitle'
import GradientBlobs from './GradientBlobs'
import HeroWireframe from './HeroWireframe'
import { HeroNameReveal } from './HeroNameReveal'
import { HeroNameStrip } from './HeroNameStrip'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const INTRO = "Hi, I'm Tulika, a Product Designer that builds for and with AI :)"
const SUBTITLE = "I enjoy pulling systems apart to see how they work and what's really worth building.      Enterprise platforms, AI tools, dense workflows — the kind of problems that don't have an obvious edge."
const INTRO_START_MS = 300
const CHAR_INTERVAL_MS = 20
const SENTENCE_PAUSE_MS = 456

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

/**
 * Renders the whole string up front and fades characters in one by one, so the
 * line never reflows — letters appear in place instead of pushing each other along.
 */
function TypedChars({ text, visible, offset = 0, cursor = false }: {
  text: string
  visible: number
  offset?: number
  cursor?: boolean
}) {
  return (
    <>
      {Array.from(text).map((ch, i) => {
        const shown = offset + i < visible
        return (
          <Fragment key={i}>
            <span
              className="hero-char"
              style={{ opacity: shown ? 1 : 0, filter: shown ? 'none' : 'blur(2px)' }}
            >
              {ch}
            </span>
            {cursor && offset + i === visible - 1 && <span className="stream-cursor" />}
          </Fragment>
        )
      })}
    </>
  )
}

const NAME = 'Tulika'
const HOVER_DEBOUNCE_MS = 160
const TOUCH_AUTO_DISMISS_MS = 5000
const TEASER_HOLD_MS = 2000 // how long the one-time auto reveal stays up
const STRIP_ENTER_MS = 1500 // portrait + bubbles finish landing before the next beat starts

interface NameHandlers {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: (e: React.MouseEvent) => void
}

/** Renders the streamed intro line, making the name a reveal target once it has typed in */
function IntroLine({ text, visible, revealed, revealId, handlers, placement, interactive = true }: {
  text: string
  /** How many characters have been revealed so far */
  visible: number
  revealed: boolean
  revealId: number
  handlers: NameHandlers
  placement?: 'above' | 'below'
  /** When false the name is plain text — the portrait is shown statically instead */
  interactive?: boolean
}) {
  const idx = text.indexOf(NAME)
  if (idx === -1 || !interactive) {
    return <TypedChars text={text} visible={visible} cursor={visible < text.length} />
  }
  return (
    <>
      <TypedChars text={text.slice(0, idx)} visible={visible} cursor={visible < text.length} />
      <span
        data-name-reveal
        {...handlers}
        style={{
          position: 'relative',
          cursor: 'pointer',
          color: 'rgb(var(--ink) / 0.92)',
          // Underlined so the name reads as hoverable
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '5px',
          textDecorationColor: 'rgb(var(--ink) / 0.35)',
        }}
      >
        {NAME}
        <HeroNameReveal key={revealId} visible={revealed} placement={placement} />
      </span>
      
    </>
  )
}

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

export interface HeroBodyBlock {
  text: string
  /** Display serif (default) or the body sans */
  font?: 'serif' | 'sans'
}

interface HeroSectionProps {
  titleLinesDesktop?: string[]
  titleLinesMobile?: string[]
  titleBlueprintLens?: boolean
  subtitle?: string
  /** Overrides the typed opening line */
  intro?: string
  /** Split layout: paragraphs above the particle block */
  bodyBefore?: HeroBodyBlock[]
  /** Split layout: paragraphs below the particle block */
  bodyAfter?: HeroBodyBlock[]
  /** Splits the hero: intro + body + CV fill the first screen, particle title follows on scroll */
  splitLayout?: boolean
}

export default function HeroSection({
  titleLinesDesktop,
  titleLinesMobile,
  titleBlueprintLens = true,
  subtitle = SUBTITLE,
  intro = INTRO,
  bodyBefore,
  bodyAfter,
  splitLayout = false,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const particleRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef({ x: -9999, y: -9999 })
  const isMobile = useIsMobile()

  const [introChars, setIntroChars] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const [nameRevealed, setNameRevealed] = useState(false)
  const [revealId, setRevealId] = useState(0) // bumping this re-rolls the phrase set
  const revealTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearRevealTimers = useCallback(() => {
    revealTimers.current.forEach(clearTimeout)
    revealTimers.current = []
  }, [])

  // Debounced hover so a passing cursor doesn't trigger a re-shuffle; taps toggle instantly
  const nameHandlers: NameHandlers = useMemo(() => ({
    onMouseEnter: () => {
      if (IS_TOUCH) return
      clearRevealTimers()
      revealTimers.current.push(setTimeout(() => {
        setRevealId((n) => n + 1)
        setNameRevealed(true)
      }, HOVER_DEBOUNCE_MS))
    },
    onMouseLeave: () => {
      if (IS_TOUCH) return
      clearRevealTimers()
      setNameRevealed(false)
    },
    onClick: (e) => {
      if (!IS_TOUCH) return
      e.preventDefault()
      e.stopPropagation()
      clearRevealTimers()
      setNameRevealed((open) => {
        if (open) return false
        setRevealId((n) => n + 1)
        revealTimers.current.push(setTimeout(() => setNameRevealed(false), TOUCH_AUTO_DISMISS_MS))
        return true
      })
    },
  }), [clearRevealTimers])

  // Touch: tapping anywhere else dismisses the reveal
  useEffect(() => {
    if (!IS_TOUCH || !nameRevealed) return
    const dismiss = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest('[data-name-reveal]')) return
      clearRevealTimers()
      setNameRevealed(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [nameRevealed, clearRevealTimers])

  useEffect(() => clearRevealTimers, [clearRevealTimers])
  const [streamChars, setStreamChars] = useState(0)
  const [streamDone, setStreamDone] = useState(false)
  // Default layout runs strictly in order: line 1 → portrait strip → particles + line 3
  const [stripDone, setStripDone] = useState(false)

  // Intro line reveals character by character, in place
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    function revealNext(charIdx: number) {
      if (cancelled) return
      const next = charIdx + 1
      setIntroChars(next)
      if (next >= intro.length) {
        setIntroDone(true)
        if (!splitLayout) {
          // Let the strip land completely before the particles and line 3 begin
          revealTimers.current.push(
            setTimeout(() => setStripDone(true), STRIP_ENTER_MS)
          )
        }
        // Show the reveal once, unprompted, so the name reads as interactive
        if (splitLayout) {
          setRevealId((n) => n + 1)
          setNameRevealed(true)
          revealTimers.current.push(
            setTimeout(() => setNameRevealed(false), TEASER_HOLD_MS)
          )
        }
        return
      }
      timeoutId = setTimeout(() => revealNext(next), CHAR_INTERVAL_MS)
    }

    timeoutId = setTimeout(() => revealNext(0), INTRO_START_MS)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [intro, splitLayout])

  // Second line starts once the intro line (and its one-time reveal) have played
  useEffect(() => {
    if (splitLayout ? !introDone : !stripDone) return
    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    function revealNext(charIdx: number) {
      if (cancelled) return
      const next = charIdx + 1
      setStreamChars(next)
      if (next >= subtitle.length) {
        setStreamDone(true)
        return
      }
      // Breathe at the end of a sentence
      const justFinishedSentence = subtitle[next - 1] === '.' && subtitle[next] === ' '
      timeoutId = setTimeout(() => revealNext(next), justFinishedSentence ? SENTENCE_PAUSE_MS : CHAR_INTERVAL_MS)
    }

    const startDelay = splitLayout ? TEASER_HOLD_MS + 500 : 0
    timeoutId = setTimeout(() => revealNext(0), startDelay)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [subtitle, introDone, stripDone, splitLayout])

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

  const introBlock = (
    <p
      style={{
        // Split layout sets the whole block in the display serif, intro ~20% up on the body
        fontFamily: splitLayout ? 'var(--font-display)' : 'var(--font-body)',
        fontWeight: 300,
        fontSize: splitLayout
          ? (isMobile ? '1.35rem' : '1.5rem')
          : (isMobile ? '1.2rem' : '1.45rem'),
        color: 'rgb(var(--ink) / 0.72)',
        width: '100%',
        maxWidth: 'none',
        whiteSpace: isMobile ? 'normal' : 'nowrap',
        lineHeight: 1.65,
        fontStyle: 'italic',
        margin: '24px 0 0',
        minHeight: isMobile ? '1.75rem' : '2rem',
        position: 'relative',
      }}
    >
      <IntroLine
        text={intro}
        visible={introChars}
        revealed={nameRevealed}
        revealId={revealId}
        handlers={nameHandlers}
        placement={splitLayout ? 'above' : 'below'}
      />

    </p>
  )

  // Split layout carries a multi-paragraph body — too long to type out, so it fades in per paragraph
  const fallbackBody: HeroBodyBlock[] = subtitle.split('\n\n').filter(Boolean).map(text => ({ text }))
  const blocksBefore = bodyBefore ?? fallbackBody
  const blocksAfter = bodyAfter ?? []

  const renderBody = (blocks: HeroBodyBlock[], animateIn: boolean, baseDelay = 0.15) =>
    blocks.map((block, i) => {
      const sans = block.font === 'sans'
      return (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 10 }}
          transition={{ duration: 0.6, delay: animateIn ? baseDelay + i * 0.16 : 0, ease: EASE_OUT }}
          style={{
            fontFamily: sans ? 'var(--font-body)' : 'var(--font-display)',
            fontWeight: 300,
            fontSize: sans
              ? (isMobile ? '0.98rem' : '1.05rem')
              : (isMobile ? '1.05rem' : '1.25rem'),
            fontStyle: sans ? 'normal' : 'italic',
            color: sans ? 'rgb(var(--ink) / 0.55)' : 'rgb(var(--ink) / 0.66)',
            lineHeight: 1.65,
            margin: '0 0 0.9rem',
            whiteSpace: 'pre-line',
          }}
        >
          {block.text}
        </motion.p>
      )
    })

  // Demo layout: typed intro, serif copy as one particle block, sans explanation, CTA — all one screen
  if (splitLayout) {
    return (
      <section
        ref={sectionRef}
        id="hero"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          minHeight: '100vh',
          background: 'black',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'crosshair',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GradientBlobs />
        <HeroWireframe cursorRef={cursorRef} />

        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent 0%, rgb(var(--ink) / 0.12) 30%, rgb(var(--ink) / 0.25) 50%, rgb(var(--ink) / 0.12) 70%, transparent 100%)',
            zIndex: 8,
            pointerEvents: 'none',
          }}
        />

        {/* Everything sits in one screen: copy, particle title, copy, CTA */}
        <motion.div
          style={{
            y: contentY,
            opacity: contentOpacity,
            position: 'relative',
            width: '100%',
            zIndex: 10,
            paddingTop: isMobile ? '104px' : '112px',
            paddingBottom: isMobile ? '1.5rem' : '2rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 0,
          }}
        >
          {introBlock}

          {/* Second serif line — same typewriter, same size as the first */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: isMobile ? '1.35rem' : '1.5rem',
              color: 'rgb(var(--ink) / 0.62)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              margin: '20px 0 0',
              maxWidth: '900px',
              minHeight: isMobile ? '2rem' : '2.4rem',
            }}
          >
            <TypedChars text={subtitle} visible={streamChars} cursor={streamChars > 0 && !streamDone} />
          </p>

          {blocksBefore.length > 0 && (
            <div style={{ maxWidth: '1100px', width: '100%' }}>
              {renderBody(blocksBefore, introDone)}
            </div>
          )}

          {/* Particle title — assembles once the second line has finished typing */}
          <div
            ref={particleRef}
            style={{
              width: '100%',
              maxWidth: '1100px',
              minHeight: isMobile ? '120px' : '150px',
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {streamDone && (
              <div style={{ width: '100%' }}>
                <ParticleTitle
                  cursorRef={cursorRef}
                  linesDesktop={titleLinesDesktop}
                  linesMobile={titleLinesMobile}
                  blueprintLens={titleBlueprintLens}
                  fontScale={isMobile ? 0.8 : 0.62}
                />
              </div>
            )}
          </div>

          {blocksAfter.length > 0 && (
            <div style={{ maxWidth: '1100px', width: '100%' }}>
              {renderBody(blocksAfter, introDone, 0.5)}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: streamDone ? 1 : 0, y: streamDone ? 0 : 12 }}
            transition={{
              duration: 0.6,
              delay: streamDone ? 0.3 + (blocksBefore.length + blocksAfter.length) * 0.16 : 0,
              ease: EASE_OUT,
            }}
            style={{ marginTop: '32px' }}
          >
            <a
              href="#work"
              className="liquid-glass-strong btn-press"
              style={{
                borderRadius: '9999px',
                padding: '0.7rem 1.6rem',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                textDecoration: 'none',
                display: 'inline-flex',
                cursor: 'pointer',
              }}
            >
              {/* Above the .liquid-glass-strong ::after overlay, which otherwise paints over the label */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: 'var(--ink-solid)',
                }}
              >
                See My Work
                <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </section>
    )
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
          background: 'linear-gradient(to right, transparent 0%, rgb(var(--ink) / 0.12) 30%, rgb(var(--ink) / 0.25) 50%, rgb(var(--ink) / 0.12) 70%, transparent 100%)',
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

      {/* Hero content — two columns on desktop: copy left, portrait right */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          paddingTop: isMobile ? '104px' : '112px',
          paddingBottom: isMobile ? '2rem' : '7rem',
          paddingLeft: isMobile ? '1.5rem' : '4.5rem',
          paddingRight: isMobile ? '1.5rem' : '3rem',
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? undefined : 'minmax(0, 60%) minmax(0, 40%)',
          columnGap: isMobile ? undefined : '2.5rem',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'center',
          textAlign: isMobile ? 'center' : 'left',
          justifyContent: isMobile ? 'center' : undefined,
          gap: isMobile ? '1.25rem' : undefined,
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '1.25rem' : '1.5rem',
            width: '100%',
            maxWidth: isMobile ? undefined : '640px',
            minWidth: 0,
          }}
        >
        {/* Group 1: Intro line + the portrait strip directly beneath it */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: isMobile ? '0.95rem' : '1.2rem',
            color: 'rgb(var(--ink) / 0.65)',
            width: '100%',
            maxWidth: 'none',
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            lineHeight: 1.65,
            fontStyle: 'italic',
            margin: '24px 0 0',
            minHeight: isMobile ? '1.75rem' : '2rem',
            position: 'relative',
          }}
        >
          <IntroLine
            text={intro}
            visible={introChars}
            revealed={nameRevealed}
            revealId={revealId}
            handlers={nameHandlers}
            interactive={false}
          />

        </p>

        {isMobile && <HeroNameStrip compact start={introDone} />}
        </div>

        {/* Group 2: Particle title + hint — starts together with line 3 */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: isMobile ? '150px' : '235px', // matches the rendered canvas so nothing jumps
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {stripDone && (
              <div style={{ width: '100%' }}>
                <ParticleTitle cursorRef={cursorRef} linesDesktop={titleLinesDesktop} linesMobile={titleLinesMobile} blueprintLens={titleBlueprintLens} align={isMobile ? 'center' : 'left'} fontBoostPx={5} keepParticles />
              </div>
            )}

            {/* Nudge toward the lens, tucked at the foot of the title */}
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: stripDone ? 0.9 : 0, y: stripDone ? 0 : 6 }}
              transition={{ duration: 0.6, delay: stripDone ? 1.1 : 0, ease: EASE_OUT }}
              style={{
                position: 'absolute',
                left: isMobile ? '50%' : 0,
                bottom: isMobile ? -6 : 4,
                marginLeft: isMobile ? -58 : 0,
                display: 'inline-block',
                transform: 'rotate(-5deg)',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '0.68rem',
                letterSpacing: '0.04em',
                padding: '5px 12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgb(var(--ink) / 0.10)',
                color: 'rgb(var(--ink) / 0.52)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              hover to peek
            </motion.span>
          </div>
        </div>

        {/* Group 3: Subtitle + CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: isMobile ? '0.95rem' : '1.2rem',
              color: 'rgb(var(--ink) / 0.65)',
              maxWidth: '100%',
              lineHeight: 1.65,
              fontStyle: 'italic',
              margin: isMobile ? '0 0 2rem' : '0 0 3.5rem',
              minHeight: isMobile ? '0' : '4rem',
            }}
          >
            <TypedChars text={subtitle} visible={streamChars} cursor={streamChars > 0 && !streamDone} />
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: streamDone ? 1 : 0, y: streamDone ? 0 : 12 }}
            transition={{ duration: 0.6, delay: streamDone ? 0.15 : 0, ease: EASE_OUT }}
            style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <a
              href="#work"
              className="liquid-glass-strong btn-press cta-glow"
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
                color: 'rgb(var(--ink) / 0.6)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
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
        </div>

        {/* Right column — portrait and tags */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
            <HeroNameStrip start={introDone} />
          </div>
        )}
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
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '0.65rem',
            color: 'rgb(var(--ink) / 0.28)',
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
          <ChevronsDown style={{ width: '1rem', height: '1rem', color: 'rgb(var(--ink) / 0.22)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
