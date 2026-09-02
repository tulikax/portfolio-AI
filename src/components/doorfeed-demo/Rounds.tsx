import Reveal from './Reveal'
import RichText from './RichText'
import RoundMediaView from './RoundMediaView'
import { ARTIFACTS, type Round } from './content'
import { DISPLAY, HAIRLINE, MONO, ink, warm } from './styles'

/**
 * The three attempts at the interaction model. Each round's verdict is what
 * makes the sequence readable — a dead end, a partial win, and the resolution —
 * so the tone is carried by the same monochrome-plus-terracotta scheme used
 * elsewhere: terracotta for the failure, muted ink for the compromise, full
 * ink for where it landed.
 *
 * Rounds alternate sides so the eye resets between them: media leads on the
 * odd-numbered rounds, copy leads on the even one.
 */
const VERDICT_TONE: Record<Round['tone'], { background: string; color: string }> = {
  no: { background: warm(0.12), color: warm(0.95) },
  partial: { background: ink(0.07), color: ink(0.55) },
  yes: { background: ink(0.14), color: ink(0.95) },
}

export default function Rounds() {
  return (
    /*
     * Wider than the 72rem text column, and the media column takes 1.4fr to the
     * copy's 1fr — together that lands the screens ~38% larger than an even
     * split inside 72rem, which was too small to read a dense product UI in.
     * maxWidth alone caps it, so narrow viewports just shrink rather than clip.
     */
    <div style={{ maxWidth: '84rem', margin: '0 auto', padding: '0 2rem' }}>
      {ARTIFACTS.rounds.map((round, i) => {
        // Rounds 1 and 3 lead with the image; round 2 leads with the copy
        const mediaLeads = i % 2 === 0

        return (
          <div
            key={round.num}
            className="df-round-alt"
            style={{
              display: 'grid',
              gridTemplateColumns: mediaLeads
                ? 'minmax(0, 1.4fr) minmax(0, 1fr)'
                : 'minmax(0, 1fr) minmax(0, 1.4fr)',
              gap: '3.5rem',
              alignItems: 'center',
              padding: '4rem 0',
              borderTop: i === 0 ? 'none' : `1px solid ${HAIRLINE}`,
            }}
          >
            {/* Copy — kept first in the DOM so reading order follows the narrative */}
            <Reveal style={{ gridColumn: mediaLeads ? 2 : 1, gridRow: 1 }}>
              <div style={{ ...MONO, fontSize: '0.6rem', color: ink(0.7) }}>{round.num}</div>
              <div
                style={{ ...MONO, fontSize: '0.56rem', color: ink(0.4), marginBottom: '0.75rem' }}
              >
                {round.stage}
              </div>

              <h4
                style={{
                  ...DISPLAY,
                  fontSize: 'clamp(1.375rem, 2.4vw, 1.75rem)',
                  color: ink(0.95),
                  margin: '0 0 0.875rem',
                }}
              >
                {round.title}
              </h4>

              {round.paragraphs.map((para, j) => (
                <p
                  key={j}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: ink(0.68),
                    margin: '0 0 0.75rem',
                  }}
                >
                  <RichText text={para} />
                </p>
              ))}

              <span
                style={{
                  ...MONO,
                  fontSize: '0.56rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginTop: '0.375rem',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '0.125rem',
                  ...VERDICT_TONE[round.tone],
                }}
              >
                <span
                  style={{
                    width: '0.3125rem',
                    height: '0.3125rem',
                    borderRadius: '50%',
                    background: 'currentColor',
                  }}
                />
                {round.verdict}
              </span>
            </Reveal>

            <Reveal delay={0.08} style={{ gridColumn: mediaLeads ? 1 : 2, gridRow: 1 }}>
              <RoundMediaView media={round.media} />
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}
