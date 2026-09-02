import { useEffect, useRef, useState } from 'react'
import { RAIL_SECTIONS } from './content'
import { MONO, ink, warm } from './styles'

/**
 * Fixed dot-rail down the left edge. Labels stay hidden until hover, so the
 * rail reads as punctuation rather than navigation until it's wanted.
 *
 * Uses the same IntersectionObserver approach as CaseSideNav; hidden below
 * 1100px where it would collide with the content column.
 */
export default function SectionRail() {
  const [activeId, setActiveId] = useState(RAIL_SECTIONS[0].id)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
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
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <nav
      aria-label="Case study sections"
      style={{
        position: 'fixed',
        left: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {RAIL_SECTIONS.map(({ id, label }) => {
        const active = id === activeId
        const lit = active || hovered === id
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
            }}
          >
            <span
              style={{
                width: '0.375rem',
                height: '0.375rem',
                borderRadius: '50%',
                background: active ? warm(0.85) : ink(0.35),
                transform: active ? 'scale(1.6)' : 'scale(1)',
                transition: 'transform 0.3s var(--ease-out), background 0.3s var(--ease-out)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                ...MONO,
                fontSize: '0.62rem',
                color: lit ? ink(0.85) : ink(0.4),
                opacity: lit ? 1 : 0,
                transform: lit ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
