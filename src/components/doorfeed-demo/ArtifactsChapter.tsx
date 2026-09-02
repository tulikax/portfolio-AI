import ChapterHead from './ChapterHead'
import FlowCarousel from './FlowCarousel'
import Reveal from './Reveal'
import Rounds from './Rounds'
import { ARTIFACTS } from './content'
import { BODY, DISPLAY, HAIRLINE, MONO, WRAP, ink } from './styles'

/**
 * The Final artifacts chapter — three rounds of getting the interaction model
 * wrong, then the components that came out of the third.
 *
 * Shared by the demo treatment and the live case study, so the rounds and the
 * component list are written once. `Rounds` sits outside the text column
 * deliberately: it alternates media and copy side by side and needs the width.
 */
export default function ArtifactsChapter() {
  return (
    <>
      <div style={WRAP}>
        <ChapterHead num={ARTIFACTS.num} eyebrow={ARTIFACTS.eyebrow} title={ARTIFACTS.title} />

        <Reveal>
          <p style={BODY}>{ARTIFACTS.intro}</p>
        </Reveal>
      </div>

      <Rounds />

      <div style={WRAP}>
        <Reveal>
          <h3
            style={{
              ...DISPLAY,
              fontSize: 'clamp(1.3125rem, 2.7vw, 1.75rem)',
              color: ink(0.95),
              margin: '3.5rem 0 1.125rem',
            }}
          >
            {ARTIFACTS.componentsHeading}
          </h3>
        </Reveal>
        <Reveal>
          <p style={BODY}>{ARTIFACTS.componentsIntro}</p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(13.4375rem, 1fr))',
            gap: '1px',
            background: HAIRLINE,
            border: `1px solid ${HAIRLINE}`,
            margin: '2.625rem 0',
          }}
        >
          {ARTIFACTS.components.map((component, i) => (
            <Reveal
              key={component.title}
              delay={i * 0.05}
              className="df-cell"
              style={{ background: 'rgb(var(--surface))', padding: '1.5625rem 1.4375rem' }}
            >
              <div
                style={{ ...MONO, fontSize: '0.54rem', color: ink(0.45), marginBottom: '0.5625rem' }}
              >
                Component
              </div>
              <h4
                style={{ ...DISPLAY, fontSize: '1.09375rem', color: ink(0.95), margin: '0 0 0.375rem' }}
              >
                {component.title}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84375rem',
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: ink(0.55),
                  margin: 0,
                }}
              >
                {component.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3
            style={{
              ...DISPLAY,
              fontSize: 'clamp(1.3125rem, 2.7vw, 1.75rem)',
              color: ink(0.95),
              margin: '3.5rem 0 1.125rem',
            }}
          >
            {ARTIFACTS.flowsHeading}
          </h3>
        </Reveal>

        <FlowCarousel spec={ARTIFACTS.flows} />
      </div>
    </>
  )
}
