import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from 'framer-motion'
import { NAV_EASE_OUT } from './constants'
import tulikaAvatar from '../../assets/tulika-avatar.png'

const SIZE = 48 // overall logo diameter (px)
const FLIP_DELAY_S = 0.9 // beat where the plain image sits before flipping
const FLIP_DURATION_S = 1.0
const SPIN_DURATION_S = 1.8 // one full revolution while hovered
const SETTLE_DURATION_S = 0.6
const RING_LETTERS = ['T', 'U', 'L', 'I', 'K', 'A']
const RING_RADIUS = 39 // in the 100-unit viewBox

// Resting orientation: back face (the lettering) toward the viewer
const REST_ANGLE = 180

/**
 * Animated wordmark: the illustration lands first, then flips like a coin to
 * the finished logo — TULIKA on a circular path. Hovering keeps it spinning
 * between the two faces, settling back on the lettering when the cursor leaves.
 */
export function NavbarLogo() {
  const rotateY = useMotionValue(0)
  const spinRef = useRef<AnimationPlaybackControls | null>(null)

  // Intro flip on mount
  useEffect(() => {
    const intro = animate(rotateY, REST_ANGLE, {
      duration: FLIP_DURATION_S,
      delay: FLIP_DELAY_S,
      ease: NAV_EASE_OUT,
    })
    return () => intro.stop()
  }, [rotateY])

  useEffect(() => () => spinRef.current?.stop(), [])

  function startSpin() {
    spinRef.current?.stop()
    const from = rotateY.get()
    // from → from+360 is visually seamless, so looping reads as one continuous spin
    spinRef.current = animate(rotateY, from + 360, {
      duration: SPIN_DURATION_S,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
  }

  function stopSpin() {
    spinRef.current?.stop()
    spinRef.current = null
    const current = rotateY.get()
    // Keep turning forward to the next orientation that shows the lettering
    const next = REST_ANGLE + 360 * Math.ceil((current - REST_ANGLE) / 360)
    animate(rotateY, next, { duration: SETTLE_DURATION_S, ease: NAV_EASE_OUT })
  }

  return (
    <Link
      to="/"
      aria-label="Tulika — home"
      onMouseEnter={startSpin}
      onMouseLeave={stopSpin}
      onFocus={startSpin}
      onBlur={stopSpin}
      style={{
        display: 'inline-block',
        width: SIZE,
        height: SIZE,
        perspective: '600px',
        textDecoration: 'none',
        color: 'var(--ink-solid)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: NAV_EASE_OUT }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateY,
        }}
      >
        {/* Front of the coin — the illustration */}
        <img
          src={tulikaAvatar}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '9999px',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />

        {/* Back of the coin — the name on a circular path, nothing in the middle */}
        <svg
          viewBox="0 0 100 100"
          width={SIZE}
          height={SIZE}
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Each letter placed at an exact angle so the ring stays evenly spaced */}
          {RING_LETTERS.map((ch, i) => (
            <g key={i} transform={`rotate(${i * (360 / RING_LETTERS.length)} 50 50)`}>
              <text
                x="50"
                y={50 - RING_RADIUS}
                fill="currentColor"
                fontFamily="var(--font-display)"
                fontSize="19"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {ch}
              </text>
            </g>
          ))}
        </svg>
      </motion.div>
    </Link>
  )
}
