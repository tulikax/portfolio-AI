import { motion } from 'framer-motion'
import photo1 from '../assets/section 2/maybe/PHOTO-2024-10-07-20-19-47.jpg'
import photo2 from '../assets/section 2/maybe/PHOTO-2024-10-16-22-50-46.jpg'
import clst from '../assets/section 2/maybe/CLST.png'
import deloittePhone from '../assets/section 2/maybe/Deloitte phone.png'
import screenshot from '../assets/section 2/maybe/Screenshot 2026-04-21 at 02.31.27.png'


const EASE_OUT = [0.23, 1, 0.32, 1] as const

const INTERESTS = ['Travel', 'Street Photography', 'Music & Playlists', 'Architecture', 'Museums', 'Digital Tinkering']

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
          Curious about automation.
          <br />
          Ended up inside it.
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
          From consulting to start-ups, I've been on the front lines of understanding where people working with data and heavy workflows get stuck — the repetitive, cumbersome tasks that slow everything down, and that are prime candidates for automation. I'm drawn to the texture of that daily friction: the small decisions, the moments where a system either earns trust or quietly loses it.
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
          In the age of AI, that curiosity has found its shape — not just in what I design, but in what I build and ship. I use AI daily, and have long before it became the industry's favourite talking point. Keeping up with every new tool was never the goal. Understanding what these things are actually for — and designing products around that — is.
        </motion.p>

        {/* Interest tags */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE_OUT }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '0.5rem',
          }}
        >
          {INTERESTS.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: 'rgba(255,255,255,0.42)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </span>
          ))}
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
