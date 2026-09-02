import Reveal from './Reveal'
import { IMPACT } from './content'
import { DISPLAY, HAIRLINE, MONO, ink } from './styles'

/**
 * Where each workstream actually stands. Deliberately words rather than
 * numbers — the honest state of this project is "shipped / in build /
 * prototype", and dressing that up as metrics would overclaim.
 */
export default function StatusGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(12.5rem, 1fr))',
        gap: '1px',
        background: HAIRLINE,
        border: `1px solid ${HAIRLINE}`,
        margin: '2.75rem 0',
      }}
    >
      {IMPACT.statuses.map((status, i) => (
        <Reveal
          key={status.label}
          delay={i * 0.08}
          className="df-cell"
          style={{ background: 'rgb(var(--surface))', padding: '1.75rem 1.625rem' }}
        >
          <div style={{ ...MONO, fontSize: '0.6rem', color: ink(0.4), marginBottom: '0.75rem' }}>
            {status.label}
          </div>
          <div
            style={{
              ...DISPLAY,
              fontWeight: 300,
              fontSize: '2.375rem',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: ink(0.95),
              marginBottom: '0.5625rem',
            }}
          >
            {status.value}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 300,
              lineHeight: 1.6,
              color: ink(0.45),
            }}
          >
            {status.sub}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
