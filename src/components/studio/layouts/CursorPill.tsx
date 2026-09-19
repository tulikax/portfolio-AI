import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import useFinePointer from './useFinePointer'

const OFFSET = 14

/**
 * Apple-style spring: a duration and a little bounce is far easier to reason
 * about than stiffness/damping, and keeps the trail tight rather than floaty.
 */
const FOLLOW = { duration: 0.32, bounce: 0.18 } as const
const TILT = { duration: 0.5, bounce: 0.25 } as const

/** Pointer speed, in px/s, at which the tilt reaches its limit. */
const TILT_AT = 2200
const TILT_MAX = 12

/**
 * "View case study" following the pointer while it is over a pocket stage.
 *
 * The pill trails the pointer on a spring rather than pinning to it exactly.
 * Matching the pointer position frame for frame reads as artificial — the thing
 * has no weight. A spring gives it momentum, and because it keeps velocity when
 * interrupted, whipping the pointer across the stage and back never produces
 * the restart you get from a transition.
 *
 * The tilt comes from horizontal velocity, so the pill leans into the direction
 * of travel and settles upright when the pointer stops. It is decoration and
 * nothing else — which is the only reason it earns its place here.
 *
 * Position is a motion value, not React state: `x.set()` never triggers a
 * render, so a pointermove firing dozens of times a second costs nothing above
 * the animation frame Motion is already running. Visibility stays a DOM
 * attribute for the same reason, with the fade handled in CSS.
 */
export default function CursorPill() {
  const ref = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const { pathname } = useLocation()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springX = useSpring(rawX, FOLLOW)
  const springY = useSpring(rawY, FOLLOW)

  // Lean into the travel, then settle upright
  const velocityX = useVelocity(springX)
  const tilt = useSpring(
    useTransform(velocityX, [-TILT_AT, TILT_AT], [-TILT_MAX, TILT_MAX], { clamp: true }),
    TILT,
  )

  // Reduced motion gets the pointer position exactly, with no lag and no tilt
  const x = reduceMotion ? rawX : springX
  const y = reduceMotion ? rawY : springY

  useEffect(() => {
    if (!finePointer) return

    const move = (event: PointerEvent) => {
      rawX.set(event.clientX + OFFSET)
      rawY.set(event.clientY + OFFSET)

      const el = ref.current
      if (!el) return

      const overPocket = (event.target as Element | null)?.closest?.('.pocket')
      // A modal sits above everything; the pill would float over its backdrop
      const sheetOpen = !!document.querySelector('dialog[open]')
      const show = !!overPocket && !sheetOpen

      // Arriving from off-screen, start where the pointer is instead of
      // springing in from wherever it was last seen
      if (show && el.dataset.visible !== 'true') {
        springX.jump(event.clientX + OFFSET)
        springY.jump(event.clientY + OFFSET)
      }

      el.dataset.visible = String(show)
    }

    const hide = () => {
      if (ref.current) ref.current.dataset.visible = 'false'
    }

    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
    }
  }, [finePointer, rawX, rawY, springX, springY])

  // Route change: the pointer has not moved, so nothing else would clear it
  useEffect(() => {
    if (ref.current) ref.current.dataset.visible = 'false'
  }, [pathname])

  if (!finePointer) return null

  return (
    <motion.div
      ref={ref}
      className="cursor-pill"
      data-visible="false"
      aria-hidden="true"
      style={{ x, y, rotate: reduceMotion ? 0 : tilt }}
    >
      View case study
    </motion.div>
  )
}
