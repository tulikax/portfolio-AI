import { motion, AnimatePresence } from 'framer-motion'
import { NAV_EASE_OUT } from './constants'
import { NavbarCvLink } from './NavbarCvLink'

type NavItem = { label: string; href: string }

type NavbarMobileMenuProps = {
  open: boolean
  links: readonly NavItem[]
  onClose: () => void
}

export function NavbarMobileMenu({ open, links, onClose }: NavbarMobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: NAV_EASE_OUT }}
          className="md:hidden"
          style={{ marginTop: '0.5rem', borderRadius: '1.5rem' }}
        >
          <div
            className="liquid-glass"
            style={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
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

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0.5rem' }} />

            <NavbarCvLink variant="menu" onNavigate={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
