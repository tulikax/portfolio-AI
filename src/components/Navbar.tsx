import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  // { label: 'Playground', href: '#playground' },
  { label: 'Process', href: '#process' },
  { label: 'Stack', href: '#stack' },
]

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isCaseStudy = location.pathname.startsWith('/work/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeMenu() { setMenuOpen(false) }

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: 50,
      }}
    >
      {/* Main pill */}
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
        className="liquid-glass"
        style={{
          borderRadius: '9999px',
          padding: '0 1.25rem',
          height: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          transition: 'box-shadow 300ms cubic-bezier(0.23,1,0.32,1)',
          boxShadow: scrolled
            ? 'inset 0 1px 1px rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.6)'
            : 'inset 0 1px 1px rgba(255,255,255,0.10)',
        }}
      >
        {/* Left — Name */}
        <div style={{ flex: 1 }}>
          <a
            href="#"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontStyle: 'italic',
              color: 'white',
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            Tulika
          </a>
        </div>

        {/* Center — Nav links (desktop only) */}
        <nav
          style={{ alignItems: 'center', gap: '1.5rem' }}
          className="hidden md:flex"
        >
          {isCaseStudy ? (
            <Link
              to="/#work"
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                fontWeight: 400,
                fontFamily: "'Barlow', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'white'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'
              }}
            >
              ← Back to Work
            </Link>
          ) : (
            NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  fontWeight: 400,
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.target as HTMLAnchorElement).style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'
                }}
              >
                {link.label}
              </a>
            ))
          )}
        </nav>

        {/* Right — Let's Talk (desktop) + Hamburger (mobile) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
          {/* Let's Talk — desktop only */}
          <a
            href={`mailto:${'hello'}@${'tulika.design'}`}
            className="btn-press hidden md:inline-flex"
            style={{
              background: 'white',
              color: 'black',
              borderRadius: '9999px',
              padding: '0.375rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: "'Barlow', sans-serif",
              textDecoration: 'none',
              alignItems: 'center',
              gap: '0.25rem',
              whiteSpace: 'nowrap',
            }}
          >
            Let's Talk
            <ArrowUpRight style={{ width: '0.875rem', height: '0.875rem' }} />
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.85)',
              borderRadius: '0.5rem',
              transition: 'color 150ms ease',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  style={{ display: 'flex' }}
                >
                  <X style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  style={{ display: 'flex' }}
                >
                  <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="liquid-glass md:hidden"
            style={{
              marginTop: '0.5rem',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {(isCaseStudy
              ? [{ label: '← Back to Work', href: '/#work' }]
              : NAV_LINKS
            ).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.80)',
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
                onTouchStart={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'
                }}
                onTouchEnd={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0.5rem' }} />

            {/* Let's Talk CTA */}
            <a
              href={`mailto:${'hello'}@${'tulika.design'}`}
              onClick={closeMenu}
              className="btn-press"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                fontSize: '0.95rem',
                color: 'black',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                justifyContent: 'center',
              }}
            >
              Let's Talk
              <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
