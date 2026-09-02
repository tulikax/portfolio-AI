import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { EASE_OUT } from './styles'

interface Props {
  children: ReactNode
  delay?: number
  style?: CSSProperties
  className?: string
}

/**
 * Scroll-triggered fade-and-rise. Replaces the source page's GSAP `.reveal`
 * class with the site's existing Framer Motion idiom, so this page animates in
 * the same register as the rest of the case studies.
 */
export default function Reveal({ children, delay = 0, style, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
