import { Link } from 'react-router-dom'
import { CV_PUBLIC_PATH } from '../../constants/site'
import Carousel from './Carousel'
import { BIO, EMAIL, LINKEDIN, NAME, STUDIO_PROJECTS } from './content'
import Reveal, { REVEAL_STEP } from './Reveal'
import RichText from './RichText'

const column: React.CSSProperties = {
  maxWidth: 'var(--studio-column)',
  margin: '0 auto',
  padding: '0 24px',
}

export default function QuietHome() {
  return (
    <main style={{ paddingBottom: 120 }}>
      {/* ── Masthead ──────────────────────────────────────────────── */}
      <div style={{ ...column, paddingTop: 120 }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 56,
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.01em' }}>
            {NAME}
          </h1>

          <a
            href={`mailto:${EMAIL}`}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: 999,
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'var(--studio-raised)',
              boxShadow: '0 0 0 1px var(--studio-hairline), 0 1px 2px rgb(26 26 24 / 0.04)',
              textDecoration: 'none',
            }}
          >
            Get in touch
          </a>
        </header>

        {/* ── Bio ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15em' }}>
          {BIO.map((paragraph, i) => (
            <Reveal key={i} delay={i * REVEAL_STEP}>
              <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.62 }}>
                <RichText text={paragraph} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── The scroll ────────────────────────────────────────────────
          Each project is one horizontal bento track. The link sits on the
          eyebrow rather than wrapping the media: a scrollable region inside an
          anchor fights itself, since releasing a drag would navigate. */}
      <div style={{ padding: '0 24px', marginTop: 160 }}>
        {STUDIO_PROJECTS.map((project) => (
          <section key={project.slug} style={{ marginBottom: 140 }}>
            <Carousel
              slabs={project.gallery}
              header={
                <Link
                  to={`/studio/${project.slug}`}
                  className="studio-group"
                  style={{ textDecoration: 'none', minWidth: 0 }}
                >
                  <span className="studio-eyebrow">
                    {project.name} · {project.year}
                    <span className="studio-eyebrow-more" aria-hidden="true">
                      · Read the case study →
                    </span>
                  </span>
                </Link>
              }
            />
          </section>
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <Reveal>
        <footer
          style={{
            maxWidth: 'var(--studio-slab)',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0 20px',
            fontSize: '0.8125rem',
            color: 'var(--studio-muted)',
          }}
        >
          <a className="studio-link" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a className="studio-link" href={LINKEDIN} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="studio-link" href={CV_PUBLIC_PATH} target="_blank" rel="noreferrer">
            CV
          </a>
        </footer>
      </Reveal>
    </main>
  )
}
