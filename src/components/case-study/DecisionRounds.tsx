import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLightbox } from './LightboxContext'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const ink = (alpha: number) => `rgb(var(--ink) / ${alpha})`
// Same lifted terracotta DoorFeed's Rounds use for a dead-end verdict.
const warm = (alpha: number) => `rgb(224 122 79 / ${alpha})`

// A couple of these are screen recordings, not stills.
function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)/i.test(src)
}

function setCursorLabel(label: string | null) {
  window.dispatchEvent(new CustomEvent('cursor-label', { detail: label }))
}

export interface DecisionRoundTag {
  label: string
  tone: 'no' | 'partial' | 'yes'
}

export interface DecisionRoundItem {
  title: string
  rationale: string
  image?: { src: string; alt: string; cropTop?: number; cropBottom?: number }
  tag?: DecisionRoundTag
}

const TAG_TONE: Record<DecisionRoundTag['tone'], { background: string; color: string }> = {
  no: { background: warm(0.12), color: warm(0.95) },
  partial: { background: ink(0.07), color: ink(0.6) },
  yes: { background: ink(0.14), color: ink(0.95) },
}

/**
 * A row per item, laid out the way DoorFeed's Rounds are: alternating sides,
 * a verdict tag riding beside the title, and the screenshot always visible.
 * The reasoning paragraph is the one thing that stays an accordion — title,
 * tag and screenshot already give the shape of the decision.
 *
 * Shared by MAGIC's "Key decisions" and "Finding direction" sections — same
 * pattern, one with tags and one without.
 */
export default function DecisionRounds({ items }: { items: DecisionRoundItem[] }) {
  const { openLightbox } = useLightbox()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div style={{ borderTop: '1px solid rgb(var(--ink) / 0.09)' }}>
      {items.map((d, i) => {
        const mediaLeads = i % 2 === 0
        const open = openIdx === i
        const ct = d.image?.cropTop ?? 0
        const cb = d.image?.cropBottom ?? 0
        const cropStyle =
          ct || cb
            ? { clipPath: `inset(${ct}px 0 ${cb}px 0)`, marginTop: `-${ct}px`, marginBottom: `-${cb}px` }
            : {}
        const bodyId = `decision-body-${i}-${d.title.slice(0, 8).replace(/\W+/g, '')}`

        return (
          <div
            key={i}
            className="decision-round-grid"
            data-media-leads={d.image ? mediaLeads : undefined}
            style={{
              padding: '3rem 0',
              borderBottom: '1px solid rgb(var(--ink) / 0.09)',
            }}
          >
            <div className="decision-round-copy">
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--cs-eyebrow)',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  color: 'var(--text-3)',
                  marginBottom: '0.75rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <h3
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--cs-h3)',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.25,
                    color: 'var(--text-1)',
                    margin: 0,
                  }}
                >
                  {d.title}
                </h3>

                {/* Plus that rotates into a minus */}
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={bodyId}
                  aria-label={open ? 'Show less' : 'Read more'}
                  className="btn-press"
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    border: `1px solid rgb(var(--ink) / ${open ? 0.4 : 0.2})`,
                    background: 'none',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'border-color 0.25s var(--ease-out)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '0.625rem',
                      height: '1px',
                      background: 'rgb(var(--ink) / 0.7)',
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
                      background: 'rgb(var(--ink) / 0.7)',
                      transform: `translate(-50%, -50%) rotate(${open ? 90 : 0}deg)`,
                      transition: 'transform 0.4s var(--ease-out)',
                    }}
                  />
                </button>
              </div>

              {d.tag && (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginTop: '0.875rem',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '0.125rem',
                    ...TAG_TONE[d.tag.tone],
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
                  {d.tag.label}
                </span>
              )}

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={bodyId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--cs-body-sm)',
                        fontWeight: 300,
                        lineHeight: 1.75,
                        color: 'var(--text-2)',
                        maxWidth: '32rem',
                        margin: '0.875rem 0 0',
                      }}
                    >
                      {d.rationale}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {d.image && (
              <div
                className="decision-round-media"
                onMouseEnter={() => setCursorLabel('Look closely')}
                onMouseLeave={() => setCursorLabel(null)}
                style={{
                  // Fixed, not a % of the column — media-leads and copy-leads
                  // columns are different widths, and a % would make the
                  // image size hop between rows. 26.5rem is the old 60%
                  // figure (~21.25rem) scaled up another 25%.
                  width: '26.5rem',
                  maxWidth: '100%',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  lineHeight: 0,
                  border: '1px solid rgb(var(--ink) / 0.12)',
                  background: 'rgb(var(--surface))',
                  boxShadow: '0 18px 46px rgb(var(--shadow-ink) / calc(0.42 * var(--shadow-strength)))',
                }}
              >
                {isVideoSrc(d.image.src) ? (
                  <video
                    src={d.image.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onClick={() => openLightbox(d.image!.src, d.image!.alt)}
                    style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in', ...cropStyle }}
                  />
                ) : (
                  <img
                    src={d.image.src}
                    alt={d.image.alt}
                    onClick={() => openLightbox(d.image!.src, d.image!.alt)}
                    style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in', ...cropStyle }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
