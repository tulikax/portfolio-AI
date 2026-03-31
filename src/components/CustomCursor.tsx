import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Emil Kowalski spring — feels natural, has momentum
  const springX = useSpring(mx, { stiffness: 140, damping: 16, mass: 0.6 })
  const springY = useSpring(my, { stiffness: 140, damping: 16, mass: 0.6 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

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
        fontSize: '1rem',
        color: 'white',
        lineHeight: 1,
        userSelect: 'none',
        mixBlendMode: 'difference',
      }}
      aria-hidden
    >
      ✦
    </motion.div>
  )
}
