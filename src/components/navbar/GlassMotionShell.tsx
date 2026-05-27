import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'

const ENTRANCE_TRANSITION = { duration: 1.1, ease: [0.23, 1, 0.32, 1] as const }

type GlassMotionShellProps = {
  children: ReactNode
  /** CSS border-radius for shell and glass layer */
  borderRadius?: string
  /** Extra styles on the glass inner (not the motion wrapper) */
  glassStyle?: CSSProperties
  /** `slide` = y on wrapper + fade on glass; `fade` = fade only; `none` = static glass */
  entrance?: 'slide' | 'fade' | 'none'
  className?: string
}

/**
 * Frosted glass panel safe for Framer Motion.
 * backdrop-filter must live on a child that never receives transform;
 * transforms stay on the outer motion wrapper only.
 */
export function GlassMotionShell({
  children,
  borderRadius = '9999px',
  glassStyle,
  entrance = 'slide',
  className = 'liquid-glass',
}: GlassMotionShellProps) {
  const glass = (
    <motion.div
      className={className}
      initial={entrance === 'none' ? false : { opacity: 0 }}
      animate={entrance === 'none' ? undefined : { opacity: 1 }}
      transition={entrance === 'none' ? undefined : ENTRANCE_TRANSITION}
      style={{ borderRadius, ...glassStyle }}
    >
      {children}
    </motion.div>
  )

  if (entrance === 'none') {
    return (
      <div className={className} style={{ borderRadius, ...glassStyle }}>
        {children}
      </div>
    )
  }

  if (entrance === 'fade') {
    return glass
  }

  return (
    <motion.div
      initial={{ y: -18 }}
      animate={{ y: 0 }}
      transition={ENTRANCE_TRANSITION}
      style={{ borderRadius }}
    >
      {glass}
    </motion.div>
  )
}
