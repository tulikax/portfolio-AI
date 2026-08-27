import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import tulikaAvatar from '../assets/tulika-avatar.png'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const PHOTO = 79
const GRID = 114 // just larger than the photo so it peeks out around the edges
const CENTER_Y = 70 // photo centre, below the word: measured down from the word's bottom edge
const CENTER_Y_ABOVE = -104 // photo centre, above the word: measured up from the word's top edge
const ACCENT = 'rgba(165,215,255,0.45)'
const GRID_LINE = 'rgba(160,205,255,0.18)'
const BUBBLE_BG = 'rgba(10,20,34,0.82)'
const BUBBLE_TEXT = 'rgba(205,230,255,0.92)'
const GRID_MASK = 'radial-gradient(circle at 50% 50%, black 55%, transparent 100%)'

const PHRASES = [
  'oat latte',
  'painting',
  'cityscape appreciation',
  'still mad about that one dropdown',
  'good defaults beat clever ones',
  'keeps every version, just in case',
  'thinks better with a pen',
  "automation isn't a personality",
  'might argue over 2px if it matters',
  'no is a design deliverable',
  'handwritten notes > typed',
  'scope is a design decision too',
  'do we really need to add that AI feature?',
]

/** Anchor points around the photo; y is relative to the photo centre */
const SLOTS = [
  { x: -156, y: -44, tail: 'bottom' },
  { x: 163, y: -40, tail: 'bottom' },
  { x: -185, y: 33, tail: 'right' },
  { x: 178, y: 37, tail: 'left' },
  { x: -13, y: 97, tail: 'top' },
] as const

const TAIL_ROTATION: Record<string, number> = { bottom: 45, top: 225, left: 135, right: 315 }

interface Bubble {
  phrase: string
  slot: (typeof SLOTS)[number]
  dx: number
  dy: number
  rot: number
}

function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const jitter = (range: number) => (Math.random() * 2 - 1) * range

/** Fisher-Yates pick of 5 phrases, dropped into shuffled slots with loose offsets */
function buildBubbles(): Bubble[] {
  const picked = shuffle(PHRASES).slice(0, SLOTS.length)
  const slots = shuffle(SLOTS)
  return picked.map((phrase, i) => ({
    phrase,
    slot: slots[i],
    dx: jitter(13),
    dy: jitter(13),
    rot: jitter(4),
  }))
}

const setKey = (bubbles: Bubble[]) =>
  bubbles.map(b => b.phrase).sort().join('|')

// Remembered across reveals so the same five phrases never land twice running
let lastSetKey = ''

function buildFreshBubbles(): Bubble[] {
  let next = buildBubbles()
  for (let attempt = 0; attempt < 6 && setKey(next) === lastSetKey; attempt++) {
    next = buildBubbles()
  }
  lastSetKey = setKey(next)
  return next
}

function Tail({ side }: { side: string }) {
  const pos: React.CSSProperties =
    side === 'bottom' ? { bottom: -4, left: '50%', marginLeft: -3 }
    : side === 'top' ? { top: -4, left: '50%', marginLeft: -3 }
    : side === 'left' ? { left: -4, top: '50%', marginTop: -3 }
    : { right: -4, top: '50%', marginTop: -3 }

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 7,
        height: 7,
        background: BUBBLE_BG,
        borderRight: `1px solid ${ACCENT}`,
        borderBottom: `1px solid ${ACCENT}`,
        transform: `rotate(${TAIL_ROTATION[side]}deg)`,
        ...pos,
      }}
    />
  )
}

/**
 * Hover/tap reveal for the name in the intro line: portrait over a faint
 * blueprint grid, with five randomly chosen phrases pinned around it.
 */
export function HeroNameReveal({ visible, placement = 'below' }: {
  visible: boolean
  /** Which side of the word the cluster sits on */
  placement?: 'above' | 'below'
}) {
  const reduceMotion = useReducedMotion()
  // Rolled once per mount; the parent remounts this via `key` for each new reveal
  const [bubbles] = useState(buildFreshBubbles)
  const above = placement === 'above'
  const centreY = above ? CENTER_Y_ABOVE : CENTER_Y

  const enter = reduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: EASE_OUT }
  const exit = reduceMotion
    ? { duration: 0 }
    : { duration: 0.17, ease: EASE_OUT }

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key="reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={exit}
          style={{
            position: 'absolute',
            left: '50%',
            top: above ? 0 : '100%',
            width: 0,
            height: 0,
            display: 'block',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          {/* Blueprint grid — leads the reveal slightly */}
          <motion.span
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            transition={enter}
            style={{
              position: 'absolute',
              left: 0,
              top: centreY,
              width: GRID,
              height: GRID,
              marginLeft: -GRID / 2,
              marginTop: -GRID / 2,
              display: 'block',
              backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
              backgroundSize: '12px 12px',
              maskImage: GRID_MASK,
              WebkitMaskImage: GRID_MASK,
            }}
          />

          {/* Portrait */}
          <motion.img
            src={tulikaAvatar}
            alt="Illustrated portrait of Tulika"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
            transition={reduceMotion ? enter : { ...enter, delay: 0.05 }}
            style={{
              position: 'absolute',
              left: 0,
              top: centreY,
              width: PHOTO,
              height: PHOTO,
              maxWidth: 'none', // the zero-width anchor would otherwise collapse it via img{max-width:100%}
              marginLeft: -PHOTO / 2,
              marginTop: -PHOTO / 2,
              objectFit: 'cover',
              borderRadius: '9999px',
              border: `1px solid ${ACCENT}`,
              boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
            }}
          />

          {/* Phrase bubbles, placed one at a time */}
          {bubbles.map((b, i) => (
            <motion.span
              key={b.phrase}
              aria-hidden="true"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
              transition={reduceMotion ? enter : { ...enter, delay: 0.12 + i * 0.07 }}
              style={{
                position: 'absolute',
                left: b.slot.x + b.dx,
                // Opening upward, pull the lowest slot in so no bubble lands on the word
                top: centreY + (above ? Math.min(b.slot.y, 57) : b.slot.y) + b.dy,
                transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '0.64rem',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                padding: '4px 9px',
                borderRadius: '11px',
                border: `1px solid ${ACCENT}`,
                background: BUBBLE_BG,
                color: BUBBLE_TEXT,
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {b.phrase}
              <Tail side={b.slot.tail} />
            </motion.span>
          ))}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
