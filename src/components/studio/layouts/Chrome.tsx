import { Link } from 'react-router-dom'
import { EMAIL_ADDRESS, HERO_BODY, HERO_HEADLINE } from './data'

/*
 * SiteHeader, Hero and SiteFooter live together: each is a dozen lines, they
 * are only ever used as a set, and splitting them into three files would cost
 * more to navigate than it saves.
 */

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Email', href: `mailto:${EMAIL_ADDRESS}` },
]

export function SiteHeader() {
  return (
    <header
      className="studio-alt-container"
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 24,
        paddingBlock: 22,
      }}
    >
      <Link
        to="/studio"
        style={{ fontFamily: 'var(--font-display)', fontSize: 24, textDecoration: 'none', color: 'inherit' }}
      >
        Tulika Singh
      </Link>

      <nav style={{ display: 'flex', gap: 22, fontSize: 15 }}>
        {NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="studio-alt-nav"
            style={{ color: 'var(--color-muted)', textDecoration: 'none' }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export function Hero() {
  return (
    <section
      className="studio-alt-container"
      style={{ paddingTop: 'var(--space-hero-top)', paddingBottom: 'var(--space-hero-bottom)' }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(40px, 6.4vw, 84px)',
          lineHeight: 1.02,
          letterSpacing: '-0.01em',
          maxWidth: '15ch',
        }}
      >
        {HERO_HEADLINE}
      </h1>

      <p
        style={{
          margin: '22px 0 0',
          fontSize: 'clamp(16px, 1.6vw, 19px)',
          color: 'var(--color-muted)',
          maxWidth: '52ch',
          lineHeight: 1.5,
        }}
      >
        {HERO_BODY}
      </p>
    </section>
  )
}

export function WorkHeader({ filter }: { filter?: React.ReactNode }) {
  return (
    <div
      id="work"
      className="studio-alt-container"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        paddingBottom: 18,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(28px, 3.2vw, 40px)',
        }}
      >
        Selected work
      </h2>
      {filter}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="studio-alt-container"
      style={{
        marginTop: 'var(--space-footer-top)',
        borderTop: '1px solid var(--color-line)',
        paddingBlock: 80,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        fontSize: 15,
        color: 'var(--color-muted)',
      }}
    >
      <span>Tulika Singh, senior product designer, London</span>
      <a href={`mailto:${EMAIL_ADDRESS}`} style={{ color: 'inherit' }}>
        {EMAIL_ADDRESS}
      </a>
    </footer>
  )
}
