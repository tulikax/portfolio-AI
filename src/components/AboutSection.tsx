import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import confetti from 'canvas-confetti'
import photo1 from '../assets/section 2/maybe/PHOTO-2024-10-07-20-19-47.jpg'
import photo2 from '../assets/section 2/maybe/PHOTO-2024-10-16-22-50-46.jpg'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const OBSESSIONS = [
  { label: 'Motion design', emoji: '🎬' },
  { label: 'Cursor', emoji: '⌨️' },
  { label: 'VisionOS', emoji: '🥽' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Street Photography', emoji: '📷' },
  { label: 'Music & Playlists', emoji: '🎵' },
  { label: 'Architecture', emoji: '🏛️' },
  { label: 'Museums', emoji: '🖼️' },
  { label: 'Soft light photography', emoji: '🌤️' },
  { label: 'Good coffee', emoji: '☕' },
  { label: 'Building things', emoji: '🔧' },
]

const TILE: React.CSSProperties = {
  borderRadius: '1.25rem',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(0,0,0,0.3)',
  padding: '1.25rem',
  position: 'relative',
  overflow: 'hidden',
}

const SHIMMER: React.CSSProperties = {
  position: 'absolute', top: 0, left: '1rem', right: '1rem', height: '1px',
  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)',
}

const STATS = [
  { value: '4+',  label: 'Years designing' },
  { value: '7+',  label: 'Products live' },
  { value: '3',   label: 'Countries lived in' },
]

// ─── Toggle bento visibility ──────────────────────────────────
const SHOW_BENTO = false  // set to false to hide the bento grid
// ─────────────────────────────────────────────────────────────

// Update these to change what's shown
const SONG_TAGS = ['melancholic', 'nostalgic', 'cinematic']
const BOOK = {
  title: 'The Remains of the Day',
  author: 'Kazuo Ishiguro',
  thoughts: 'A quiet devastation. Stevens\'s unreliable introspection is one of the most precise portrayals of self-deception I\'ve read.',
}

function BentoDashboard() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false,
    }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const overlayBase: React.CSSProperties = {
    position: 'absolute', inset: 0, borderRadius: '1.25rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(145deg, rgba(10,10,12,0.92), rgba(10,10,12,0.88))',
    backdropFilter: 'blur(8px)',
    opacity: 0, transition: 'opacity 0.25s ease',
    pointerEvents: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '620px' }}>

      {/* Row 1: Now Playing + Currently Reading + Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr', gap: '0.75rem' }}>

        {/* Now Playing */}
        <div className="bento-music-card" style={{ ...TILE, display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={SHIMMER} />
          <div style={{
            width: 44, height: 44, borderRadius: '0.5rem', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(29,185,84,0.25), rgba(29,185,84,0.08))',
            border: '1px solid rgba(29,185,84,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🎵</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(29,185,84,0.8)', margin: '0 0 0.2rem' }}>
              Now playing
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.8rem', color: 'white', margin: '0 0 0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Comptine d'un autre été
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Yann Tiersen
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px', flexShrink: 0 }}>
            {['eq-bar-1', 'eq-bar-2', 'eq-bar-3'].map(cls => (
              <div key={cls} className={cls} style={{ width: 3, borderRadius: 2, background: 'rgba(29,185,84,0.8)' }} />
            ))}
          </div>
          {/* Hover overlay — thought bubble */}
          <div className="bento-overlay" style={overlayBase}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.5rem' }}>
              💭 sounds like
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {SONG_TAGS.map(tag => (
                <span key={tag} style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)',
                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Currently Reading */}
        <div className="bento-book-card" style={{ ...TILE, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={SHIMMER} />
          {/* Book cover placeholder */}
          <div style={{
            width: 36, height: 52, borderRadius: '0.25rem', flexShrink: 0,
            background: 'linear-gradient(160deg, rgba(180,140,100,0.3), rgba(120,80,60,0.2))',
            border: '1px solid rgba(255,255,255,0.1)',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.3rem' }}>
              Reading
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.78rem', color: 'white', margin: '0 0 0.15rem', lineHeight: 1.3 }}>
              {BOOK.title}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.68rem', color: 'rgba(255,255,255,0.40)', margin: 0 }}>
              {BOOK.author}
            </p>
          </div>
          {/* Hover overlay — book thoughts */}
          <div className="bento-overlay" style={overlayBase}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.5rem' }}>
              💭 my take
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.55 }}>
              {BOOK.thoughts}
            </p>
          </div>
        </div>

        {/* Location & time */}
        <div style={{ ...TILE, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={SHIMMER} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.7rem', color: 'rgba(255,255,255,0.40)', margin: 0, letterSpacing: '0.04em' }}>
              London, UK
            </p>
          </div>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '1.4rem', color: 'white', margin: '0.5rem 0 0', letterSpacing: '-0.02em' }}>
            {time}
          </p>
        </div>
      </div>

      {/* Row 2: 3 stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ ...TILE }}>
            <div style={SHIMMER} />
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '1.5rem', color: 'white', margin: '0 0 0.25rem', letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.7rem', color: 'rgba(255,255,255,0.40)', margin: 0, letterSpacing: '0.04em' }}>{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

type LaunchVec = { x: number; y: number; rot: number }

function randLaunches(): LaunchVec[] {
  return OBSESSIONS.map(() => ({
    x: (Math.random() - 0.5) * 260,
    y: -(80 + Math.random() * 140),
    rot: (Math.random() - 0.5) * 40,
  }))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ObsessionsReveal() {
  const [open, setOpen] = useState(false)
  const [launches, setLaunches] = useState<LaunchVec[]>(() => randLaunches())
  const [items, setItems] = useState(OBSESSIONS)
  const btnRef = useRef<HTMLButtonElement>(null)

  function fire() {
    if (open) { setOpen(false); return }
    setLaunches(randLaunches())
    setItems(shuffle(OBSESSIONS))   // fresh random order every open
    setOpen(true)
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    confetti({ particleCount: 80, spread: 70, origin: { x, y }, colors: ['#fff', '#a78bfa', '#818cf8', '#f9a8d4', '#fcd34d'], startVelocity: 32, gravity: 0.9, scalar: 0.9, ticks: 200 })
    confetti({ particleCount: 30, spread: 120, origin: { x, y }, colors: ['#fff', '#c4b5fd', '#f0abfc'], startVelocity: 18, gravity: 1.1, scalar: 0.7, ticks: 180 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}
    >
      <button
        ref={btnRef}
        onClick={fire}
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          fontSize: '0.875rem',
          color: open ? 'rgba(255,255,255,0.5)' : 'white',
          background: open ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '9999px',
          padding: '0.5rem 1.25rem',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = open ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}
      >
        <span style={{ fontSize: '1rem' }}>{open ? '✕' : '✦'}</span>
        {open ? 'Close' : 'My current obsessions'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', maxWidth: '560px' }}
          >
            {items.map((item, i) => {
              const { x: lx, y: ly, rot } = launches[i]
              return (
                <motion.span
                  key={item.label}
                  initial={{ opacity: 0, x: lx, y: ly, rotate: rot, scale: 0.6 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.7, transition: { duration: 0.15, delay: 0 } }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.04, mass: 0.9 }}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.82)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem' }}>{item.emoji}</span>
                  {item.label}
                </motion.span>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE_OUT },
}

// Floating cards — 6 unique images, no repeats
const FLOATING_CARDS = [
  { top: '6%',  left: '2%',  w: 180, rotate: -6,  dur: 7,   delay: 0,   img: photo1 },
  { top: '12%', left: '83%', w: 168, rotate: 8,   dur: 9,   delay: 0.5, img: photo2, opacity: 1 },
  { top: '42%', left: '0%',  w: 174, rotate: 4,   dur: 8,   delay: 1.2, img: deloittePhone, zoom: 1.1 },
  { top: '42%', left: '86%', w: 186, rotate: -5,  dur: 10,  delay: 0.8, img: screenshot },
  { top: '79%', left: '80%', w: 178, rotate: -8,  dur: 8.5, delay: 0.3, img: clst },
]

// On mobile, only show a subset and smaller
const MOBILE_CARDS = [
  { top: '5%',  left: '2%',  w: 108, rotate: -5,  dur: 7,   delay: 0,   img: photo1 },
  { top: '18%', left: '78%', w: 102, rotate: 7,   dur: 9,   delay: 0.5, img: screenshot },
  { top: '70%', left: '80%', w: 108, rotate: -6,  dur: 8.5, delay: 0.3, img: photo2 },
]

function FloatingCard({ card }: {
  card: typeof FLOATING_CARDS[number] & { zoom?: number }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
        rotate: [card.rotate, card.rotate + 1.5, card.rotate],
      }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{
        opacity: { duration: 1.2, delay: card.delay + 0.3, ease: EASE_OUT },
        scale: { duration: 1.2, delay: card.delay + 0.3, ease: EASE_OUT },
        y: { duration: card.dur, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
        rotate: { duration: card.dur * 1.3, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
      }}
      style={{
        position: 'absolute',
        top: `calc(${card.top} - 40px)`,
        left: card.left,
        width: card.w,
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.08) inset',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <img
        src={card.img}
        alt=""
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: card.opacity ?? 0.82,
          transform: card.zoom ? `scale(${card.zoom})` : undefined,
          transformOrigin: 'center center',
        }}
      />
      {/* Subtle overlay to blend with dark bg */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(145deg, rgba(0,0,0,0.08), rgba(0,0,0,0.22))',
      }} />
    </motion.div>
  )
}

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '9rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated 3D gradient blob */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '70%',
          height: '70%',
          zIndex: 0,
          transform: 'translate(-50%, -50%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background:
              'conic-gradient(from 0deg, rgba(80,40,160,0.18), rgba(40,80,200,0.12), rgba(120,60,220,0.16), rgba(60,120,180,0.12), rgba(80,40,160,0.18))',
            animation: 'gradientRotate 18s linear infinite',
            borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80%',
            height: '80%',
            background:
              'conic-gradient(from 180deg, rgba(200,100,80,0.08), rgba(160,60,200,0.10), rgba(80,160,220,0.08), rgba(200,100,80,0.08))',
            animation: 'gradientRotate 26s linear infinite reverse',
            borderRadius: '55% 45% 40% 60% / 45% 55% 50% 50%',
          }}
        />
      </div>

      {/* Floating placeholder cards — desktop */}
      <div className="floating-cards-desktop">
        {FLOATING_CARDS.map((card, i) => (
          <FloatingCard key={i} card={card} />
        ))}
      </div>
      {/* Floating placeholder cards — mobile */}
      <div className="floating-cards-mobile">
        {MOBILE_CARDS.map((card, i) => (
          <FloatingCard key={i} card={card} />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            color: 'white',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Complex by choice,
          <br />
          simple by design.
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.7,
            maxWidth: '640px',
          }}
        >
          My experience spans enterprise platforms and AI-driven tools — the kind of products where structure and speed matter as much as craft. From consulting to startups, I've been close to where people working with data and heavy workflows get stuck: the repetitive friction, the small decisions, the moments where a system either earns trust or quietly loses it.
        </motion.p>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.7,
            maxWidth: '640px',
          }}
        >
          I'm drawn to those problems. The flows that overwhelm, the interfaces nobody thought could feel good — that's where I do my best work.
        </motion.p>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.7,
            maxWidth: '640px',
          }}
        >
          Figma was a constant, but I'm moving towards building prototypes directly with AI. Less static, more real: something stakeholders can click through, developers can react to, and teams can test before anyone's committed. To me, good experience doesn't stop at the user; it extends to everyone in the room who has to build, approve, and ship the thing.
        </motion.p>

        {/* Bento dashboard — toggle with SHOW_BENTO in AboutSection.tsx */}
        {SHOW_BENTO && (
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.36, ease: EASE_OUT }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <BentoDashboard />
          </motion.div>
        )}

        {/* Obsessions button + reveal */}
        <ObsessionsReveal />
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          height: '300px',
          background: 'linear-gradient(to bottom, transparent, black)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
