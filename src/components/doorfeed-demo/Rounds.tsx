import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import RichText from './RichText'
import RoundMediaView from './RoundMediaView'
import { EXPLORATION, type Round } from './content'
import { EASE_OUT, H3, HAIRLINE, MONO, ink, warm } from './styles'

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

/**
 * One round. The write-ups run long, so the body collapses behind a toggle
 * beside the title — the number, title and verdict alone give the shape of the
 * sequence, and the reasoning is a click away for anyone who wants it.
 */
function RoundItem({ round, mediaLeads, first }: { round: Round; mediaLeads: boolean; first: boolean }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const bodyId = `round-body-${round.num.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div
      className="df-round-alt"
      style={{
        display: 'grid',
        gridTemplateColumns: mediaLeads
          ? 'minmax(0, 1.4fr) minmax(0, 1fr)'
          : 'minmax(0, 1fr) minmax(0, 1.4fr)',
        gap: '3.5rem',
        alignItems: 'center',
        padding: '4rem 0',
        borderTop: first ? 'none' : `1px solid ${HAIRLINE}`,
      }}
    >
      {/* Copy — kept first in the DOM so reading order follows the narrative */}
      <Reveal style={{ gridColumn: mediaLeads ? 2 : 1, gridRow: 1 }}>
        <div style={{ ...MONO, fontSize: '0.6rem', color: ink(0.7) }}>{round.num}</div>
        <div style={{ ...MONO, fontSize: '0.56rem', color: ink(0.4), marginBottom: '0.75rem' }}>
          {round.stage}
        </div>

        {/* Title + toggle */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
          <h4 style={{ ...H3, margin: 0, flex: 1 }}>{round.title}</h4>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              aria-expanded={open}
              aria-controls={bodyId}
              aria-label={open ? 'Show less' : 'Read more'}
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '50%',
                border: `1px solid ${ink(open || hovered ? 0.5 : 0.22)}`,
                background: 'none',
                position: 'relative',
                display: 'block',
                transition: 'border-color 0.25s var(--ease-out)',
              }}
            >
              {/* Plus that rotates into a minus */}
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '0.625rem',
                  height: '1px',
                  background: ink(0.8),
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '1px',
                  height: '0.625rem',
                  background: ink(0.8),
                  transform: `translate(-50%, -50%) rotate(${open ? 90 : 0}deg)`,
                  transition: 'transform 0.4s var(--ease-out)',
                }}
              />
            </button>

            {/* Tooltip */}
            <span
              role="tooltip"
              style={{
                ...MONO,
                position: 'absolute',
                bottom: 'calc(100% + 0.5rem)',
                left: '50%',
                transform: `translateX(-50%) translateY(${hovered ? 0 : '4px'})`,
                padding: '0.3rem 0.6rem',
                fontSize: '0.54rem',
                whiteSpace: 'nowrap',
                borderRadius: '9999px',
                background: 'rgb(var(--surface))',
                border: `1px solid ${ink(0.18)}`,
                color: ink(0.75),
                opacity: hovered ? 1 : 0,
                pointerEvents: 'none',
                transition: 'opacity 0.2s var(--ease-out), transform 0.2s var(--ease-out)',
              }}
            >
              {open ? 'Show less' : 'Read more'}
            </span>
          </div>
        </div>

        {/* Verdict — the one-line summary, so it stays visible when collapsed */}
        <span
          style={{
            ...MONO,
            fontSize: '0.56rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginTop: '0.875rem',
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

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={bodyId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: '1.25rem' }}>
                {round.paragraphs.map((para, j) =>
                  para.startsWith('> ') ? (
                    // What a user actually said — set apart from the analysis around it
                    <blockquote
                      key={j}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontSize: '1.0625rem',
                        fontWeight: 300,
                        lineHeight: 1.5,
                        color: ink(0.9),
                        borderLeft: `2px solid ${ink(0.25)}`,
                        padding: '0 0 0 1.125rem',
                        margin: '1.25rem 0',
                      }}
                    >
                      {para.slice(2)}
                    </blockquote>
                  ) : (
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
                  ),
                )}

                {round.afterVerdict && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: ink(0.5),
                      borderTop: `1px solid ${HAIRLINE}`,
                      margin: '1.25rem 0 0',
                      paddingTop: '1.25rem',
                    }}
                  >
                    <RichText text={round.afterVerdict} />
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      <Reveal delay={0.08} style={{ gridColumn: mediaLeads ? 1 : 2, gridRow: 1 }}>
        <RoundMediaView media={round.media} />
      </Reveal>
    </div>
  )
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
      {EXPLORATION.rounds.map((round, i) => (
        <RoundItem
          key={round.num}
          round={round}
          // Rounds 1 and 3 lead with the image; round 2 leads with the copy
          mediaLeads={i % 2 === 0}
          first={i === 0}
        />
      ))}
    </div>
  )
}
