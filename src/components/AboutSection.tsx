import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CurrentlyBlock from './about/CurrentlyBlock'
import photo1 from '../assets/section 2/maybe/PHOTO-2024-10-07-20-19-47.jpg'
import photo2 from '../assets/section 2/maybe/PHOTO-2024-10-16-22-50-46.jpg'
import deloittePhone from '../assets/section 2/maybe/Deloitte phone.png'
import screenshot from '../assets/section 2/maybe/Screenshot 2026-04-21 at 02.31.27.png'
import clst from '../assets/section 2/maybe/CLST.png'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE_OUT },
}

/** The overarching version — the detail lives on /about */
const INTRO = "My focus has always been finance and complex systems. Dense workflows, high-stakes platforms, legacy systems — spaces where trust and speed both have to hold. I'm currently navigating what it means to build AI into these highly regulated spaces, learning what to optimise and where to draw the line. Outside of that, I've always tried to step outside my comfort zone: graphic design, illustration, platforms for audiences and contexts that didn't use software before. Consulting taught me to work at scale, startups taught me to ship. But the real education has been obsessing over each new world until I can think like the person standing inside it."

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
        border: '1px solid rgb(var(--ink) / 0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgb(var(--ink) / 0.08) inset',
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

export default function AboutSection({ extraParagraphs = [] }: { extraParagraphs?: string[] } = {}) {
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
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.75rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            color: 'var(--ink-solid)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Complex by trade,
          <br />
          curious by nature.
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT }}
          className="about-body-text"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '1.05rem',
            color: 'rgb(var(--ink) / 0.70)',
            lineHeight: 1.7,
            maxWidth: '640px',
          }}
        >
          {INTRO}
        </motion.p>

        {/* Appended copy (e.g. the intro paragraphs moved down from the hero) */}
        {extraParagraphs.map((para, i) => (
          <motion.p
            key={i}
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.24 + i * 0.08, ease: EASE_OUT }}
            className="about-body-text"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '1.05rem',
              color: 'rgb(var(--ink) / 0.70)',
              lineHeight: 1.7,
              maxWidth: '640px',
            }}
          >
            {para}
          </motion.p>
        ))}

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
          style={{ marginTop: '0.5rem' }}
        >
          <Link
            to="/about"
            className="btn-press"
            style={{
              borderRadius: '9999px',
              padding: '0.7rem 1.35rem',
              color: 'rgb(var(--ink) / 0.65)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgb(var(--ink) / 0.14)',
            }}
          >
            More about me
            <ArrowRight style={{ width: '0.95rem', height: '0.95rem', strokeWidth: 1.75, flexShrink: 0 }} />
          </Link>
        </motion.div>

        {/* What she's into right now — content lives in src/constants/currently.ts */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.65rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgb(var(--ink) / 0.35)', margin: 0,
            }}
          >
            Currently
          </p>
          <CurrentlyBlock />
        </motion.div>
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
