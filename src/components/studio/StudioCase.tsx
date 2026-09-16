import { Link, Navigate, useParams } from 'react-router-dom'
import { getStudioProject } from './content'
import Reveal, { REVEAL_STEP } from './Reveal'
import Slab from './Slab'

const column: React.CSSProperties = {
  maxWidth: 'var(--studio-column)',
  margin: '0 auto',
  padding: '0 24px',
}

export default function StudioCase() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getStudioProject(slug) : undefined

  if (!project) return <Navigate to="/studio" replace />

  const next = getStudioProject(project.next)

  return (
    <main style={{ paddingBottom: 140 }}>
      <div style={{ ...column, paddingTop: 40 }}>
        <Link
          to="/studio"
          className="studio-link"
          style={{ fontSize: '0.8125rem', color: 'var(--studio-muted)' }}
        >
          ← Studio
        </Link>
      </div>

      {/* ── Header — name, year, company. Nothing else. ───────────── */}
      <header style={{ ...column, paddingTop: 72, paddingBottom: 96 }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {project.name}
        </h1>
        <p
          style={{
            margin: '14px 0 0',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--studio-muted)',
          }}
        >
          {project.year} · {project.company}
        </p>
      </header>

      {/* ── The five beats ────────────────────────────────────────── */}
      {project.beats.map((beat) => (
        <section key={beat.label} style={{ marginBottom: 140 }}>
          <div style={column}>
            <Reveal>
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--studio-muted)',
                }}
              >
                {beat.label}
              </h2>
            </Reveal>

            <Reveal delay={REVEAL_STEP}>
              <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.62 }}>{beat.body}</p>
            </Reveal>
          </div>

          <div
            style={{
              marginTop: 56,
              padding: '0 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 140,
            }}
          >
            {beat.slabs.map((slab, i) => (
              <Slab
                key={i}
                media={slab.media}
                caption={slab.caption}
                ratio={slab.ratio}
                delay={i === 0 ? 0 : REVEAL_STEP}
              />
            ))}
          </div>
        </section>
      ))}

      {/* ── Next ──────────────────────────────────────────────────── */}
      {next && (
        <Reveal>
          <div style={{ ...column, paddingTop: 24 }}>
            <Link
              to={`/studio/${next.slug}`}
              className="studio-group"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <span className="studio-eyebrow">
                Next · {next.name}
                <span className="studio-eyebrow-more" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </div>
        </Reveal>
      )}
    </main>
  )
}
