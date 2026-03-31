const SOCIAL_LINKS = [
  { label: 'Dribbble', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Read.cv', href: '#' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: 'black',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingBottom: '2.5rem',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Divider */}
        <div
          style={{
            height: '1px',
            width: '100%',
            background: 'rgba(255,255,255,0.12)',
            marginBottom: '2rem',
          }}
        />

        {/* Two-column row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Left — Copyright */}
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.38)',
              fontSize: '0.75rem',
              margin: 0,
            }}
          >
            © 2026 Tulika. All rights reserved.
          </p>

          {/* Right — Social links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.70)'
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.38)'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
