import Reveal from './Reveal'
import { OPENING_PULL } from './content'
import { DISPLAY, MONO, ink } from './styles'

/**
 * The two questions the project started from.
 *
 * Placed at the close of the Context chapter rather than before it: the
 * questions only land once the reader knows what the platform could and
 * couldn't do, and they hand off into Exploration.
 */
export default function OpeningQuote() {
  return (
    <div style={{ padding: '4.5rem 0 1rem', textAlign: 'center' }}>
      <Reveal>
        <blockquote
          style={{
            ...DISPLAY,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.125rem, 2.3vw, 1.5rem)',
            lineHeight: 1.4,
            color: ink(0.95),
            maxWidth: '38rem',
            margin: '0 auto',
          }}
        >
          {OPENING_PULL.lines.map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </blockquote>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ ...MONO, color: ink(0.4), marginTop: '1.25rem' }}>{OPENING_PULL.attrib}</div>
      </Reveal>
    </div>
  )
}
