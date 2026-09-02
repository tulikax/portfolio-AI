import Reveal from './Reveal'
import RichText from './RichText'
import { IMPACT } from './content'
import { MONO, ink, warm } from './styles'

/**
 * Open risks and pending sign-offs. This is the one block on the page arguing
 * against its own work, so it keeps the terracotta rule — the same colour the
 * failed round and the live status dot use, and nothing else.
 */
export default function FlagList() {
  return (
    <div style={{ margin: '2.5rem 0', borderLeft: `2px solid ${warm(0.7)}`, paddingLeft: '1.5rem' }}>
      {IMPACT.flags.map((flag, i) => (
        <Reveal
          key={flag.heading}
          delay={i * 0.06}
          style={{ marginBottom: i === IMPACT.flags.length - 1 ? 0 : '1.375rem' }}
        >
          <div style={{ ...MONO, fontSize: '0.6rem', color: warm(0.95), marginBottom: '0.4375rem' }}>
            {flag.heading}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.96rem',
              fontWeight: 300,
              lineHeight: 1.75,
              color: ink(0.68),
              maxWidth: '38rem',
              margin: 0,
            }}
          >
            <RichText text={flag.body} />
          </p>
        </Reveal>
      ))}
    </div>
  )
}
