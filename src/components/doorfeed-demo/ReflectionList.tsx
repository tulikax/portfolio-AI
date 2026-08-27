import Reveal from './Reveal'
import RichText from './RichText'
import { REFLECTIONS } from './content'
import { DISPLAY, HAIRLINE, MONO, ink } from './styles'

/** The closing takeaways — one stacked cell each, same hairline grid as the rest. */
export default function ReflectionList() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1px',
        background: HAIRLINE,
        border: `1px solid ${HAIRLINE}`,
        margin: '2.625rem 0',
      }}
    >
      {REFLECTIONS.items.map((item, i) => (
        <Reveal
          key={item.num}
          delay={i * 0.05}
          className="df-cell"
          style={{ background: 'rgb(var(--surface))', padding: '1.875rem 2rem' }}
        >
          <div style={{ ...MONO, fontSize: '0.6rem', color: ink(0.45), marginBottom: '0.625rem' }}>
            {item.num}
          </div>
          <h4 style={{ ...DISPLAY, fontSize: '1.3125rem', color: ink(0.95), margin: '0 0 0.7rem' }}>
            {item.title}
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.96rem',
              fontWeight: 300,
              lineHeight: 1.78,
              color: ink(0.68),
              maxWidth: '40rem',
              margin: 0,
            }}
          >
            <RichText text={item.body} />
          </p>
        </Reveal>
      ))}
    </div>
  )
}
