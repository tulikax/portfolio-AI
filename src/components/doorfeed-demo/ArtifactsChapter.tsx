import ChapterHead from './ChapterHead'
import { ComponentTabsBlock } from './ComponentTabs'
import Pill from './Pill'
import FlowCarousel from './FlowCarousel'
import Reveal from './Reveal'
import { ARTIFACTS } from './content'
import RichText from './RichText'
import { BODY, H2, HAIRLINE, MONO, WRAP, ink } from './styles'

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
        <ChapterHead num={ARTIFACTS.num} eyebrow={ARTIFACTS.eyebrow} />

        <Reveal>
          <h3 style={{ ...H2, margin: '3.5rem 0 1.75rem' }}>
            {ARTIFACTS.componentsHeading}
          </h3>
        </Reveal>

        {ARTIFACTS.shipped.map((item, i) =>
          item.kind === 'heading' ? (
            <Reveal key={i}>
              <h3 style={{ ...H2, margin: '3.5rem 0 1.75rem' }}>
                {item.text}
              </h3>
            </Reveal>
          ) : (
          <div
            key={i}
            className="df-shipped-item"
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5rem 1fr',
              gap: '1.25rem',
              margin: '0 0 2.5rem',
            }}
          >
            <Reveal>
              <span style={{ ...MONO, fontSize: '0.6rem', color: ink(0.45), paddingTop: '0.3rem' }}>
                {'num' in item ? item.num : ''}
              </span>
            </Reveal>

            <div>
              {item.kind === 'point' && (
                <>
                  {item.label && (
                    <Reveal>
                      <div
                        style={{
                          ...MONO,
                          fontSize: '0.6rem',
                          color: ink(0.7),
                          marginBottom: '0.625rem',
                        }}
                      >
                        {item.label}
                      </div>
                    </Reveal>
                  )}
                  <Reveal>
                    <p style={{ ...BODY, margin: 0 }}>
                      <RichText text={item.text} />
                    </p>
                  </Reveal>

                  {item.pill && (
                    <Reveal>
                      <div style={{ marginTop: '1rem' }}>
                        <Pill text={item.pill} />
                      </div>
                    </Reveal>
                  )}

                  {item.withComponents && (
                    <ComponentTabsBlock components={ARTIFACTS.components} />
                  )}
                </>
              )}

              {/* The clips follow the Outcome point, which carries the label */}
              {item.kind === 'flows' && <FlowCarousel spec={ARTIFACTS.flows} />}

              {item.kind === 'placeholder' && (
                <Reveal>
                  <div
                    style={{
                      minHeight: '9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.625rem',
                      padding: '2rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      border: `1px solid ${HAIRLINE}`,
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${ink(
                        0.025,
                      )} 12px, ${ink(0.025)} 24px)`,
                    }}
                  >
                    <div style={{ ...MONO, color: ink(0.42) }}>{item.label}</div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        color: ink(0.3),
                        lineHeight: 1.6,
                      }}
                    >
                      {item.hint}
                    </div>
                  </div>
                  {item.pill && (
                    <div style={{ marginTop: '1rem' }}>
                      <Pill text={item.pill} />
                    </div>
                  )}
                </Reveal>
              )}
            </div>
          </div>
          ),
        )}
      </div>
    </>
  )
}
