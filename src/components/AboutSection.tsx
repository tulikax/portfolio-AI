import { motion } from 'framer-motion'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const INTERESTS = ['Travel', 'Street Photography', 'Music & Playlists', 'Architecture', 'Museums', 'Digital Tinkering']

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE_OUT },
}

// Floating cards — portrait-oriented, scattered around section edges
// Positions are percentages. Cards at z-index 1 sit between blob bg (0) and text (2).
const FLOATING_CARDS = [
  { top: '6%',  left: '3%',  w: 90,  h: 130, rotate: -6,  dur: 7,  delay: 0 },
  { top: '15%', left: '85%', w: 80,  h: 115, rotate: 8,   dur: 9,  delay: 0.5 },
  { top: '45%', left: '1%',  w: 85,  h: 120, rotate: 4,   dur: 8,  delay: 1.2 },
  { top: '55%', left: '88%', w: 95,  h: 135, rotate: -5,  dur: 10, delay: 0.8 },
  { top: '78%', left: '6%',  w: 75,  h: 110, rotate: 7,   dur: 7.5, delay: 1.5 },
  { top: '72%', left: '82%', w: 88,  h: 125, rotate: -8,  dur: 8.5, delay: 0.3 },
  { top: '32%', left: '90%', w: 70,  h: 100, rotate: 3,   dur: 11, delay: 2.0 },
]

// On mobile, only show a subset and smaller
const MOBILE_CARDS = [
  { top: '5%',  left: '2%',  w: 60,  h: 85,  rotate: -5,  dur: 7,   delay: 0 },
  { top: '18%', left: '80%', w: 55,  h: 80,  rotate: 7,   dur: 9,   delay: 0.5 },
  { top: '60%', left: '0%',  w: 58,  h: 82,  rotate: 4,   dur: 8,   delay: 1.0 },
  { top: '70%', left: '82%', w: 62,  h: 88,  rotate: -6,  dur: 8.5, delay: 0.3 },
]

function FloatingCard({ card }: {
  card: typeof FLOATING_CARDS[number]
}) {
  const w = card.w
  const h = card.h

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
        rotate: [card.rotate, card.rotate + 1.5, card.rotate],
      }}
      transition={{
        opacity: { duration: 1.2, delay: card.delay + 0.3, ease: EASE_OUT },
        scale: { duration: 1.2, delay: card.delay + 0.3, ease: EASE_OUT },
        y: { duration: card.dur, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
        rotate: { duration: card.dur * 1.3, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
      }}
      style={{
        position: 'absolute',
        top: card.top,
        left: card.left,
        width: w,
        height: h,
        borderRadius: '10px',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '8px',
          right: '8px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)',
        }}
      />
      {/* Placeholder content — faint lines mimicking a photo */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', height: '100%' }}>
        <div style={{ flex: 1, borderRadius: '6px', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', width: '60%' }} />
        <div style={{ height: '4px', borderRadius: '3px', background: 'rgba(255,255,255,0.04)', width: '40%' }} />
      </div>
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
          Designing the everyday.
          <br />
          Curious about everything.
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
          I'm a product designer who finds joy in simplifying complex systems — turning tangled flows into interactions that feel obvious in hindsight. I'm drawn to the texture of daily life: the small decisions, the friction points, the moments where design either earns trust or quietly loses it.
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
          When I'm not in Figma, I'm usually travelling somewhere unhurried, photographing the unremarkable — parking lots, laundromats, stairwells. Or deep in a playlist rabbit hole, building sonic worlds for moods that don't have names yet.
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
          Museums and buildings are my fieldwork. I study how space, rhythm, and materiality guide people without a single instruction. That sensibility lives in everything I design.
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
