import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Playground', href: '#playground' },
  { label: 'About', href: '#about' },
  { label: 'Say Hello', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '56rem',
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.1,
          ease: [0.23, 1, 0.32, 1],
        }}
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
              fontFamily: "'Instrument Serif', serif",
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

        {/* Center — Nav links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
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
          ))}
        </nav>

        {/* Right — CTA */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="mailto:hello@tulika.design"
            className="btn-press"
            style={{
              background: 'white',
              color: 'black',
              borderRadius: '9999px',
              padding: '0.375rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: "'Barlow', sans-serif",
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Let's Talk
            <ArrowUpRight style={{ width: '0.875rem', height: '0.875rem' }} />
          </a>
        </div>
      </motion.div>
    </div>
  )
}
