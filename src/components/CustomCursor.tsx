import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function CustomCursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const [label, setLabel] = useState<string | null>(null)

  // Emil Kowalski spring — feels natural, has momentum
  const springX = useSpring(mx, { stiffness: 400, damping: 28, mass: 0.3 })
  const springY = useSpring(my, { stiffness: 400, damping: 28, mass: 0.3 })

  useEffect(() => {
    if (isTouch) return
    const move = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  // Lets any element swap the glyph for a short label while hovered — see
  // DecisionRounds' "Look closely" on the case-study screenshots.
  useEffect(() => {
    if (isTouch) return
    const onLabel = (e: Event) => setLabel((e as CustomEvent<string | null>).detail)
    window.addEventListener('cursor-label', onLabel)
    return () => window.removeEventListener('cursor-label', onLabel)
  }, [])

  if (isTouch) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: springX,
        top: springY,
        x: '-50%',
        y: '-50%',
        zIndex: 9999,
        pointerEvents: 'none',
        lineHeight: 1,
        userSelect: 'none',
      }}
      aria-hidden
    >
      <motion.div
        animate={{
          scale: label ? 1 : 0.001,
          opacity: label ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
          background: 'var(--ink-solid)',
          color: 'rgb(var(--surface))',
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
        }}
      >
        {label}
      </motion.div>
      <motion.span
        animate={{ scale: label ? 0 : 1, opacity: label ? 0 : 1 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        style={{
          display: 'block',
          fontSize: '1rem',
          color: 'var(--ink-solid)',
        }}
      >
        ✦
      </motion.span>
    </motion.div>
  )
}
