import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RAIL_SECTIONS } from './content'
import { EASE_OUT } from './styles'

/**
 * Fixed section rail down the left edge.
 *
 * Deliberately identical to CaseSideNav on the live case studies — same
 * offsets, same 3px bars, same always-visible labels — so moving between
 * /work/:slug and this page doesn't feel like moving between two sites.
 *
 * Hidden below 1100px, where it would collide with the content column.
 */
export default function SectionRail() {
  const [activeId, setActiveId] = useState(RAIL_SECTIONS[0].id)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    function check() {
      setVisible(window.innerWidth >= 1100)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!visible) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (inView.length > 0) setActiveId(inView[0].target.id)
      },
      { threshold: [0.1, 0.3, 0.5] },
    )

    RAIL_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [visible])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <nav
      aria-label="Case study sections"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {RAIL_SECTIONS.map(({ id, label }) => {
        const isActive = id === activeId
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '20px',
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
            }}
          >
            {/* Bar */}
            <motion.span
              animate={{
                background: isActive
                  ? 'rgb(var(--ink) / 0.80)'
                  : hovered
                    ? 'rgb(var(--ink) / 0.30)'
                    : 'rgb(var(--ink) / 0.18)',
                height: isActive ? '24px' : '20px',
              }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              style={{ width: '3px', borderRadius: '2px', flexShrink: 0, display: 'block' }}
            />

            {/* Label — always visible */}
            <motion.span
              animate={{
                color: isActive
                  ? 'rgb(var(--ink) / 0.92)'
                  : hovered
                    ? 'rgb(var(--ink) / 0.65)'
                    : 'rgb(var(--ink) / 0.38)',
              }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {label}
            </motion.span>
          </button>
        )
      })}
    </nav>
  )
}
