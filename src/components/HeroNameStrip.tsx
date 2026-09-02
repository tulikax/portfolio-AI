import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { HERO_PHRASES, shufflePhrases, type HeroPhrase } from '../constants/heroPhrases'
import tulikaAvatar from '../assets/tulika-avatar.png'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const PHOTO = 165 // 25% up on the inline size
const PHOTO_MOBILE = 120
const BAND = 342 // room for the tag above the photo and the button below it
const BAND_MOBILE = 210
const TAG_GAP = 14 // clearance between the photo edge and the nearest tag
const CLUSTER_SHIFT = 34 // pulls the cluster left so right-hand tags clear the page edge

/** Petal tints lifted from the illustration — rose, lavender, sage, blush */
const PETALS = [
  { border: 'rgba(244,158,180,0.42)', from: 'rgba(244,158,180,0.16)', to: 'rgba(244,158,180,0.04)', text: 'rgba(255,226,234,0.94)', glow: 'rgba(240,120,155,0.20)' },
  { border: 'rgba(186,170,232,0.42)', from: 'rgba(186,170,232,0.16)', to: 'rgba(186,170,232,0.04)', text: 'rgba(233,226,255,0.94)', glow: 'rgba(150,125,220,0.20)' },
  { border: 'rgba(158,198,164,0.40)', from: 'rgba(158,198,164,0.15)', to: 'rgba(158,198,164,0.04)', text: 'rgba(226,244,230,0.94)', glow: 'rgba(120,180,130,0.18)' },
  { border: 'rgba(242,190,158,0.42)', from: 'rgba(242,190,158,0.16)', to: 'rgba(242,190,158,0.04)', text: 'rgba(255,236,222,0.94)', glow: 'rgba(232,155,110,0.20)' },
]

/**
 * Tags hang off the left and right of the photo. Anchoring them by their inner edge
 * (rather than centring them on a point) means a long phrase grows outward and can
 * never creep over the portrait.
 */
const TAG_COUNT = 5
const AUTO_CYCLE_MS = 5000 // tags refresh on their own, not just via the button
const SWAP_OUT_MS = 340 // time for the old set to scale away before the new one lands
const GRID_LINE = 'rgba(150,205,255,0.22)'
const GRID_MASK = 'radial-gradient(circle at 50% 50%, black 62%, transparent 100%)'

/**
 * Five resting places: two off each side, one under the photo. Phrases are shuffled
 * into them, so the arrangement changes but never collides with the portrait.
 */
const PLACES = [
  { side: 'left', y: -104 },
  { side: 'left', y: -18 },
  { side: 'right', y: -98 },
  { side: 'right', y: -4 },
  { side: 'top', y: -150 },
] as const

const jitter = (range: number) => (Math.random() * 2 - 1) * range

// Room available to a tag differs by slot: the bottom spans the column, the left can
// spill into the gutter, the right only has the page padding. Longest phrases go where
// there is most space, so a wide tag can never run off the edge.
const PLACES_BY_ROOM = [
  PLACES[4], // above the photo — widest run of space
  PLACES[0], // left
  PLACES[1], // left
  PLACES[2], // right
  PLACES[3], // right
] as const

// Remembered across rolls (and remounts) so a phrase never appears twice in a row
let lastShown: string[] = []

function roll(count: number) {
  const unseen = HERO_PHRASES.filter(p => !lastShown.includes(p.text))
  const source = unseen.length >= count ? unseen : HERO_PHRASES
  const picked = shufflePhrases(source).slice(0, count)
  lastShown = picked.map(p => p.text)
  // Longest first, then drop them into the roomiest slots in turn
  const byLength = [...picked].sort((a, b) => b.text.length - a.text.length)
  return byLength.map((phrase: HeroPhrase, i) => ({
    phrase,
    place: PLACES_BY_ROOM[i],
    dy: jitter(9),
    // Mostly counter-clockwise, like notes dropped on the page
    rot: -3 + jitter(4),
  }))
}

/**
 * Always-on cluster between the intro line and the particle title: a pinned
 * portrait with personality tags hung around it.
 */
export function HeroNameStrip({ compact = false, start = true }: {
  compact?: boolean
  /** Hold the entrance until the line above has finished typing */
  start?: boolean
}) {
  const [picked, setPicked] = useState(() => roll(TAG_COUNT))
  // Tags scale away, get swapped, then scale back in — same spring both directions
  const [tagsIn, setTagsIn] = useState(true)
  // Bumped on a manual reroll so the timer restarts rather than firing straight after
  const [cycle, setCycle] = useState(0)
  const reduceMotion = useReducedMotion()
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const swapTags = useCallback(() => {
    if (swapTimer.current) clearTimeout(swapTimer.current)
    setTagsIn(false)
    swapTimer.current = setTimeout(() => {
      setPicked(roll(TAG_COUNT))
      setTagsIn(true)
    }, SWAP_OUT_MS)
  }, [])

  function reroll() {
    swapTags()
    setCycle((n) => n + 1)
  }

  useEffect(() => {
    if (!start || reduceMotion) return
    const id = setInterval(swapTags, AUTO_CYCLE_MS)
    return () => clearInterval(id)
  }, [start, reduceMotion, cycle, swapTags])

  useEffect(() => () => { if (swapTimer.current) clearTimeout(swapTimer.current) }, [])

  const photo = compact ? PHOTO_MOBILE : PHOTO
  const inset = photo / 2 + TAG_GAP

  // Everything enters top-to-bottom: the photo sits at y = 0, tags above or below it
  const order = [
    { key: 'photo', y: 0 },
    ...picked.map((b) => ({ key: b.phrase.text, y: b.place.y + b.dy })),
  ]
    .sort((a, b) => a.y - b.y)
    .map(item => item.key)
  const delayFor = (key: string) => 0.12 + Math.max(0, order.indexOf(key)) * 0.11

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: compact ? BAND_MOBILE : BAND,
        margin: '8px 0',
        pointerEvents: 'none',
      }}
    >
      {/* Blueprint grid sitting behind the portrait */}
      <motion.span
        initial={{ opacity: 0, scale: 0.94 }}
        animate={start ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.5, delay: start ? 0.08 : 0, ease: EASE_OUT }}
        style={{
          position: 'absolute',
          top: '50%',
          left: `calc(50% - ${CLUSTER_SHIFT}px)`,
          width: photo * 1.5,
          height: photo * 1.6,
          marginTop: -(photo * 1.6) / 2,
          marginLeft: -(photo * 1.5) / 2,
          display: 'block',
          backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      />

      {/* Portrait, tilted so it reads as pinned to the page */}
      <motion.img
        src={tulikaAvatar}
        alt="Illustrated portrait of Tulika"
        initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
        animate={start ? { opacity: 1, scale: 1, rotate: -4 } : { opacity: 0, scale: 0.6, rotate: -4 }}
        transition={{
          delay: start ? delayFor('photo') : 0,
          opacity: { duration: 0.25, ease: EASE_OUT, delay: start ? delayFor('photo') : 0 },
          scale: { type: 'spring', stiffness: 420, damping: 11, mass: 0.7 },
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: `calc(50% - ${CLUSTER_SHIFT}px)`,
          width: photo,
          height: photo,
          maxWidth: 'none',
          marginTop: -photo / 2,
          marginLeft: -photo / 2,
          objectFit: 'cover',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.55)',
        }}
      />

      {/* Tags — swap out with the same spring they arrive on */}
      {picked.map((b, i) => {
        const petal = PETALS[i % PETALS.length]
        const place = b.place
        const shown = start && tagsIn
        const anchor =
          place.side === 'left' ? { right: `calc(50% + ${inset + CLUSTER_SHIFT}px)` }
          : place.side === 'right' ? { left: `calc(50% + ${inset - CLUSTER_SHIFT}px)` }
          : { left: `calc(50% - ${CLUSTER_SHIFT}px)` }

        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={false}
            animate={{
              opacity: shown ? 1 : 0,
              scale: shown ? 1 : 0.7,
              rotate: b.rot,
              x: place.side === 'top' ? '-50%' : 0,
              y: '-50%',
            }}
            transition={{
              delay: shown ? delayFor(b.phrase.text) : 0,
              opacity: { duration: 0.2, ease: EASE_OUT, delay: shown ? delayFor(b.phrase.text) : 0 },
              scale: { type: 'spring', stiffness: 460, damping: 12, mass: 0.6 },
              rotate: { duration: 0 },
            }}
            style={{
              position: 'absolute',
              top: `calc(50% + ${place.y + b.dy}px)`,
              ...anchor,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '0.8rem',
              letterSpacing: '0.01em',
              lineHeight: 1.25,
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${petal.border}`,
              background: `linear-gradient(145deg, ${petal.from}, ${petal.to})`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `0 6px 22px ${petal.glow}, inset 0 1px 0 rgba(255,255,255,0.10)`,
              color: petal.text,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0, fontStyle: 'normal' }}>{b.phrase.emoji}</span>
            {b.phrase.text}
          </motion.span>
        )
      })}

      {/* Shuffle for a fresh set */}
      <motion.button
        type="button"
        onClick={reroll}
        aria-label="Show different tags"
        initial={{ opacity: 0 }}
        animate={{ opacity: start ? 1 : 0 }}
        transition={{ duration: 0.4, delay: start ? 0.8 : 0, ease: EASE_OUT }}
        whileHover={{ rotate: -90 }}
        style={{
          position: 'absolute',
          top: `calc(50% + ${photo / 2 + 12}px)`,
          left: `calc(50% - ${CLUSTER_SHIFT}px)`,
          marginLeft: -15,
          width: 30,
          height: 30,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          border: '1px solid rgba(244,158,180,0.40)',
          background: 'rgba(20,14,18,0.72)',
          color: 'rgba(255,226,234,0.85)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          padding: 0,
        }}
      >
        <RotateCcw style={{ width: 15, height: 15 }} />
      </motion.button>
    </div>
  )
}
