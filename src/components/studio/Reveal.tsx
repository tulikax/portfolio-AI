import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

/** Soft ease-out — things settle in rather than snapping. */
const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * Stagger step for sibling elements. Pass `delay={i * REVEAL_STEP}` when
 * revealing a list; there is no orchestrating parent on purpose, because the
 * slabs and the text blocks never share one.
 */
export const REVEAL_STEP = 0.06

interface RevealProps {
  children: ReactNode
  /** Seconds to wait after entering view. */
  delay?: number
  className?: string
  style?: CSSProperties
}

/**
 * Fade-and-rise on entering the viewport, once. The entire motion vocabulary of
 * the studio pages — anything that wants more than this needs a reason.
 *
 * Under `prefers-reduced-motion` the element renders at its final state with no
 * transform and no fade, rather than a faster version of the same animation.
 */
export default function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Fires before the element is centred, so it is already settling on arrival
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
