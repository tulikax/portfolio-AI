import { useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { NAV_EASE_OUT, NAV_LINKS } from './constants'
import { GlassPanel } from './GlassPanel'
import { useCloseMenuOnDesktop, useNavbarScroll } from './hooks'
import { NavbarCvLink } from './NavbarCvLink'
import { NavbarMobileMenu } from './NavbarMobileMenu'
import { NavbarLogo } from './NavbarLogo'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useNavbarScroll()
  const location = useLocation()
  const isCaseStudy = location.pathname.startsWith('/work/')
  // Section anchors only resolve on the homepage; anywhere else they have to route there first
  const isHome = location.pathname === '/'

  useCloseMenuOnDesktop(setMenuOpen)

  const sectionLinks = isHome
    ? NAV_LINKS
    : NAV_LINKS.map((link) => ({ ...link, href: `/${link.href}` }))

  const mobileLinks = isCaseStudy
    ? [{ label: '← Back to Work', href: '/#work' }]
    : sectionLinks

  const pillShadow = scrolled
    ? 'inset 0 1px 1px rgb(var(--ink) / 0.10), 0 8px 32px rgba(0,0,0,0.6)'
    : 'inset 0 1px 1px rgb(var(--ink) / 0.10)'

  const nav = (
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
        pointerEvents: 'none',
      }}
    >
      <div className="nav-pill-enter" style={{ pointerEvents: 'auto' }}>
        <GlassPanel
          variant="nav"
          style={{
            borderRadius: '9999px',
            padding: '0 1.25rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'box-shadow 300ms cubic-bezier(0.23,1,0.32,1), background-color 300ms ease',
            boxShadow: pillShadow,
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <NavbarLogo />
          </div>

          <nav style={{ alignItems: 'center', gap: '1.5rem' }} className="hidden md:flex">
            {isCaseStudy ? (
              <Link
                to="/#work"
                style={{
                  fontSize: '0.875rem',
                  color: 'rgb(var(--ink) / 0.65)',
                  textDecoration: 'none',
                  fontWeight: 400,
                  fontFamily: 'var(--font-body)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgb(var(--ink) / 0.65)'
                }}
              >
                ← Back to Work
              </Link>
            ) : (
              sectionLinks.map((link) => {
                const linkStyle = {
                  fontSize: '0.875rem',
                  color: 'rgb(var(--ink) / 0.75)',
                  textDecoration: 'none',
                  fontWeight: 400,
                  transition: 'color 200ms ease',
                } as const
                const hover = {
                  onMouseEnter: (e: MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = 'white'
                  },
                  onMouseLeave: (e: MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = 'rgb(var(--ink) / 0.75)'
                  },
                }
                return isHome ? (
                  <a key={link.label} href={link.href} style={linkStyle} {...hover}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href} style={linkStyle} {...hover}>
                    {link.label}
                  </Link>
                )
              })
            )}
          </nav>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
            <NavbarCvLink variant="pill" />

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex md:hidden items-center justify-center"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.375rem',
                color: 'rgb(var(--ink) / 0.85)',
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
                    transition={{ duration: 0.18, ease: NAV_EASE_OUT }}
                    className="flex"
                    style={{ willChange: 'auto' }}
                  >
                    <X style={{ width: '1.25rem', height: '1.25rem' }} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.18, ease: NAV_EASE_OUT }}
                    className="flex"
                    style={{ willChange: 'auto' }}
                  >
                    <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </GlassPanel>
      </div>

      <div style={{ pointerEvents: 'auto' }}>
        <NavbarMobileMenu
          open={menuOpen}
          links={mobileLinks}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </div>
  )

  if (typeof document === 'undefined') return nav

  return createPortal(nav, document.body)
}
