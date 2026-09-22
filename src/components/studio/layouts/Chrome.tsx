import { Link } from 'react-router-dom'
import { EMAIL_ADDRESS, HERO_BODY, HERO_HEADLINE, HERO_LINKS } from './data'

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

/**
 * `nav` is off for the Bento board, where the filter switch sits directly
 * beneath it offering the same Work and About — two controls, one row apart,
 * with the same words and different behaviour.
 */
export function SiteHeader({ nav = true }: { nav?: boolean }) {
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

      {nav && (
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
      )}
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
          // Half the previous clamp, so it wraps the same way at half the size
          fontSize: 'clamp(20px, 3.2vw, 42px)',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          maxWidth: '15ch',
        }}
      >
        {HERO_HEADLINE}
      </h1>

      {/*
        The mid-tier. The scale used to jump straight from the display size to
        14px grey, which is a cliff rather than a hierarchy: 84 → 22 → 15, with
        the subline in ink and only the link row muted.
      */}
      <p
        style={{
          margin: '24px 0 0',
          fontSize: 'clamp(19px, 1.8vw, 22px)',
          color: 'var(--color-ink)',
          maxWidth: '46ch',
          lineHeight: 1.45,
        }}
      >
        {HERO_BODY}
      </p>

      <p
        style={{
          margin: '18px 0 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 18px',
          fontSize: 15,
          color: 'var(--color-muted)',
        }}
      >
        {HERO_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="studio-alt-link">
            {link.label}
          </a>
        ))}
      </p>
    </section>
  )
}

/**
 * `heading` is off for the Bento board.
 *
 * The board is not only work — it holds a clock, an email tile and
 * photographs — and since the board carries the page's h1 inside its intro
 * tile, a heading above it would also put an h2 ahead of the h1 in reading
 * order. The filter keeps its place on the right either way.
 */
export function WorkHeader({ filter, heading = true }: { filter?: React.ReactNode; heading?: boolean }) {
  return (
    <div
      id="work"
      className="studio-alt-container"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: heading ? 'space-between' : 'flex-end',
        gap: 16,
        paddingBottom: 18,
      }}
    >
      {heading && (
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
      )}
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
