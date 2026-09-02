import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export interface SideNavSection {
  id: string
  label: string
}

interface Props {
  sections: SideNavSection[]
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function CaseSideNav({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Hide on narrow viewports
  useEffect(() => {
    function check() {
      setVisible(window.innerWidth >= 1100)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // IntersectionObserver — track which section is in view
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most in view (highest intersectionRatio)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { threshold: [0.1, 0.3, 0.5] },
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [sections])

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <div
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
        cursor: 'pointer',
      }}
    >
      {sections.map((section) => {
        const isActive = section.id === activeId
        return (
          <div
            key={section.id}
            onClick={() => handleClick(section.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '20px',
            }}
          >
            {/* Bar */}
            <motion.div
              animate={{
                background: isActive
                  ? 'rgb(var(--ink) / 0.80)'
                  : hovered
                    ? 'rgb(var(--ink) / 0.30)'
                    : 'rgb(var(--ink) / 0.18)',
                height: isActive ? '24px' : '20px',
              }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              style={{
                width: '3px',
                borderRadius: '2px',
                flexShrink: 0,
              }}
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
              {section.label}
            </motion.span>
          </div>
        )
      })}
    </div>
  )
}
