import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { CaseStudy, ProjectTab } from '../../types/caseStudy'
import VisualShowcase from './VisualShowcase'
import HighlightPhrase from './HighlightPhrase'

// ─── Highlight helper ──────────────────────────────────────────

function applyHighlights(
  text: string,
  highlights: CaseStudy['overviewHighlights'],
): React.ReactNode {
  if (!highlights || highlights.length === 0) return text
  const escaped = highlights.map((h) =>
    h.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  )
  const regex = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(regex)
  return parts.map((part, i) => {
    const hl = highlights.find((h) => h.phrase === part)
    if (hl) {
      return (
        <HighlightPhrase key={i} color={hl.color} textColor={hl.textColor}>
          {part}
        </HighlightPhrase>
      )
    }
    return part
  })
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// Robust video detection — handles Vite asset URLs that may include query params
function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)/i.test(src)
}

// ─── Button-driven carousel pan image ─────────────────────────
// Prev/next buttons pan through image at 300px steps

function ScrollPanImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  function pan(dir: 1 | -1) {
    const containerWidth = containerRef.current?.offsetWidth ?? 800
    // image div is 280% wide → max offset = 180% of container
    const maxOffset = containerWidth * 1.8
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + dir * 1000)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      style={{ marginTop: '2rem', position: 'relative' }}
    >
      <div
        ref={containerRef}
        style={{
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
          lineHeight: 0,
          height: 'clamp(300px, 42vw, 640px)',
        }}
      >
        <motion.div
          animate={{ x: -offset }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          style={{ width: '280%', height: '100%' }}
        >
          <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>
      </div>

      {/* Prev button */}
      <button
        onClick={() => pan(-1)}
        aria-label="Previous"
        style={{
          position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
          width: '2.25rem', height: '2.25rem', borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.80)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          backdropFilter: 'blur(6px)', transition: 'background 0.15s',
          opacity: offset === 0 ? 0.3 : 1,
        }}
      >‹</button>

      {/* Next button */}
      <button
        onClick={() => pan(1)}
        aria-label="Next"
        style={{
          position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
          width: '2.25rem', height: '2.25rem', borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.80)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          backdropFilter: 'blur(6px)', transition: 'background 0.15s',
        }}
      >›</button>
    </motion.div>
  )
}

// ─── Section block (label + heading + body) ───────────────────

function SectionBlock({
  heading: _heading, // eslint-disable-line @typescript-eslint/no-unused-vars
  body,
  delay = 0,
}: {
  heading: string
  body: string
  delay?: number
}) {
  const paragraphs = body.split('\n\n').filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.68)',
            fontFamily: "'Barlow', sans-serif",
            margin: i < paragraphs.length - 1 ? '0 0 1rem 0' : '0',
          }}
        >
          {p}
        </p>
      ))}
    </motion.div>
  )
}

// ─── Decision cards ────────────────────────────────────────────

function DecisionsBlock({
  heading: _heading, // eslint-disable-line @typescript-eslint/no-unused-vars
  decisions,
  decisionsLayout = 'grid',
  delay = 0,
}: {
  heading: string
  decisions: ProjectTab['decisions']
  decisionsLayout?: 'grid' | 'side-by-side' | 'caption'
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      {decisionsLayout === 'caption' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {decisions.map((d, i) => {
            const sideAll    = d.images && d.images.length > 0 && d.imagesLayout === 'side-all'
            const sideColumn = d.images && d.images.length > 0 && d.imagesLayout === 'side-column'
            const multiFirst = d.images && d.images.length > 0 && !sideAll && !sideColumn
            return (
              <div key={i}>
                {/* Primary row: text 4.5fr | image(s) 5.5fr — tops aligned */}
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 6fr', gap: '2rem', alignItems: 'start' }}>
                  {/* Left: title + rationale */}
                  <div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.82)', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>{d.title}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.46)', margin: 0, lineHeight: 1.7 }}>{d.rationale}</p>
                  </div>
                  {/* Right: images */}
                  <div>
                    {sideAll ? (
                      /* Pivot 3 mode: all images equal-width in right column */
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${d.images!.length}, 1fr)`, gap: '0.5rem' }}>
                        {d.images!.map((img, j) => (
                          <motion.div key={j}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: j * 0.06, ease: EASE_OUT }}
                            style={{ borderRadius: '0.75rem', overflow: 'hidden', lineHeight: 0 }}
                          >
                            <img src={img.src} alt={img.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </motion.div>
                        ))}
                      </div>
                    ) : sideColumn ? (
                      /* side-column mode: all images stacked vertically in right column */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {d.images!.map((img, j) => (
                          <motion.div key={j}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: j * 0.06, ease: EASE_OUT }}
                            style={{ borderRadius: '0.75rem', overflow: 'hidden', lineHeight: 0 }}
                          >
                            <img src={img.src} alt={img.alt} style={{
                              width: '100%', height: 'auto', display: 'block',
                              ...(j === 0 ? { clipPath: 'inset(150px 0 130px 0)', marginTop: '-150px', marginBottom: '-130px' } : {}),
                            }} />
                          </motion.div>
                        ))}
                      </div>
                    ) : multiFirst ? (
                      /* Pivot 2 mode: images[0] in right column, cropped top/bottom */
                      <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                        style={{ borderRadius: '0.75rem', overflow: 'hidden', lineHeight: 0 }}
                      >
                        <img src={d.images![0].src} alt={d.images![0].alt} style={{ width: '100%', height: 'auto', display: 'block', marginTop: '-70px', marginBottom: '-70px' }} />
                      </motion.div>
                    ) : d.image ? (
                      /* Pivot 1 mode: single image or video */
                      (() => {
                        const vid = isVideoSrc(d.image!.src)
                        const rawScale = d.image!.scale ?? (vid ? 0.65 : 1)
                        const cappedScale = Math.min(rawScale, vid ? 0.65 : 1)
                        const width = `${Math.round(cappedScale * 100)}%`
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, ease: EASE_OUT }}
                            style={{ width, borderRadius: '0.75rem', overflow: 'hidden', lineHeight: 0 }}
                          >
                            {vid ? (
                              <video src={d.image!.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                            ) : (
                              <img src={d.image!.src} alt={d.image!.alt} style={{ width: '100%', height: 'auto', display: 'block', clipPath: 'inset(40px 0 60px 0)', marginTop: '-40px', marginBottom: '-60px' }} />
                            )}
                          </motion.div>
                        )
                      })()
                    ) : null}
                  </div>
                </div>

                {/* Secondary row: Pivot 2 overflow images — full-width grid */}
                {multiFirst && d.images!.length > 1 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${d.images!.length - 1}, 1fr)`,
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}>
                    {d.images!.slice(1).map((img, j) => (
                      <motion.div key={j}
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.45, delay: j * 0.06, ease: EASE_OUT }}
                        style={{ borderRadius: '0.75rem', overflow: 'hidden', lineHeight: 0 }}
                      >
                        <img src={img.src} alt={img.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : decisionsLayout === 'side-by-side' ? (
        /* Narrower text card (260px) so image area dominates */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {decisions.map((d, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: d.image ? '260px 1fr' : '1fr', gap: '1rem', alignItems: 'start' }}>
              <div style={{ borderRadius: '1rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{d.title}</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.82rem', fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>{d.rationale}</p>
              </div>
              {d.image && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT }}
                  style={{ borderRadius: '1rem', overflow: 'hidden', lineHeight: 0, minHeight: '200px' }}
                >
                  {/\.(mp4|webm|mov)$/i.test(d.image.src) ? (
                    <video src={d.image.src} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <img src={d.image.src} alt={d.image.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {decisions.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ borderRadius: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{d.title}</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>{d.rationale}</p>
              </div>
              {d.image && (
                <div style={{ borderRadius: '1rem', overflow: 'hidden', border: 'none', lineHeight: 0 }}>
                  {/\.(mp4|webm|mov)$/i.test(d.image.src) ? (
                    <video src={d.image.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                  ) : (
                    <img src={d.image.src} alt={d.image.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Outcome stats ─────────────────────────────────────────────

function OutcomeBlock({
  outcome,
  delay = 0,
}: {
  outcome: NonNullable<ProjectTab['outcome']>
  delay?: number
}) {
  const { heading, stats, footnote, variant, outcomeMedia, footnoteVariant } = outcome
  const isTealLabels = variant === 'teal-labels'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      <h3
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h3>
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '1.75rem',
        }}
      />
      {stats && stats.length > 0 && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: outcomeMedia || footnote ? '1.5rem' : 0,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isTealLabels ? 'rgba(45, 212, 191, 0.4)' : 'rgba(255,255,255,0.38)',
                marginBottom: isTealLabels ? '0.75rem' : '0.5rem',
              }}
            >
              {s.label}
            </span>
            {!isTealLabels && (
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  color: 'white',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {s.value}
              </span>
            )}
            <span
              style={{
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.50)',
                lineHeight: 1.5,
              }}
            >
              {s.description}
            </span>
          </div>
        ))}
      </div>
      )}
      {outcomeMedia && (
        <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: footnote ? '1.5rem' : 0, boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>
          {/\.(mp4|webm|mov)$/i.test(outcomeMedia.src) ? (
            <video src={outcomeMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
          ) : (
            <img src={outcomeMedia.src} alt={outcomeMedia.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
          )}
        </div>
      )}
      {footnote && (
        footnoteVariant === 'problem-callout' ? (
          <div style={{
            background: 'rgba(180, 140, 60, 0.10)',
            border: '1px solid rgba(200, 160, 60, 0.25)',
            borderLeft: '3px solid rgba(245, 200, 66, 0.5)',
            borderRadius: '0.5rem',
            padding: '1rem 1.25rem',
          }}>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 300,
              color: 'rgba(245, 200, 66, 0.80)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {footnote}
            </p>
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.7,
              margin: 0,
              borderLeft: '2px solid rgba(255,255,255,0.12)',
              paddingLeft: '1rem',
            }}
          >
            {footnote}
          </p>
        )
      )}
    </motion.div>
  )
}

// ─── Overview tab content ──────────────────────────────────────

function OverviewContent({ data }: { data: CaseStudy }) {
  const paragraphs = (data.overviewBody ?? '').split('\n\n').filter(Boolean)
  const hasSideMedia = !!(data.overviewSideMedia && data.overviewSideMedia.length > 0)

  function inlineMediaAfter(i: number) {
    const items = (data.overviewInlineMedia ?? []).filter((m) => m.afterParagraph === i)
    if (items.length === 0) return null
    return items.map((m, j) => {
      const isVid = /\.(mp4|webm|mov)$/i.test(m.src)
      const w = m.scale ? `${m.scale}%` : '100%'
      return (
        <div key={j} style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: w, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>
            {isVid ? (
              <video src={m.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <img src={m.src} alt={m.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
            )}
          </div>
          {m.caption && (
            <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'rgba(255,255,255,0.38)', fontFamily: "'Barlow', sans-serif", marginTop: '0.75rem' }}>{m.caption}</p>
          )}
        </div>
      )
    })
  }

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {(paragraphs.length > 0 || data.overviewSubtitle) && (
        <div style={{ marginBottom: '3rem' }}>
          {/* Optional subtitle */}
          {data.overviewSubtitle && (
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                margin: '0 0 1.25rem 0',
              }}
            >
              {data.overviewSubtitle}
            </p>
          )}
          {/* Paragraphs — inline media injected after each paragraph index */}
          {paragraphs.map((p, i) => (
            <div key={i}>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.72)',
                  margin: '0 0 1rem 0',
                }}
              >
                {applyHighlights(p, data.overviewHighlights)}
              </p>
              {/* overviewInlineMedia: injected after each paragraph */}
              {inlineMediaAfter(i)}
              {/* Legacy overviewSideMedia: injected as a 2-col grid after paragraph 0 */}
              {i === 0 && hasSideMedia && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  margin: '1.25rem 0',
                  height: '336px',
                }}>
                  {data.overviewSideMedia!.map((img, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: j * 0.06, ease: EASE_OUT }}
                      style={{
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        border: 'none',
                        lineHeight: 0,
                        height: '100%',
                      }}
                    >
                      {/\.(mp4|webm|mov)$/i.test(img.src) ? (
                        <video src={img.src} autoPlay loop muted playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center center' }} />
                      ) : (
                        <img src={img.src} alt={img.alt}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center center' }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Problem statement + optional media — side-by-side 60/40 when problemMedia present */}
      {data.problemStatement && !data.overviewHideProblem && (
        <div style={{ marginTop: '2rem' }}>
          {/* Carousel above the problem text */}
          {data.overviewScrollMedia && (
            <ScrollPanImage
              src={data.overviewScrollMedia.src}
              alt={data.overviewScrollMedia.alt}
            />
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: data.problemMedia ? '6fr 4fr' : '1fr',
            gap: '2.5rem',
            alignItems: 'start',
            marginTop: data.overviewScrollMedia ? '4rem' : '0',
          }}>
            {/* Left: paragraph (no label) */}
            <div>
              {data.problemStatement.split('\n\n').map((chunk, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.65)',
                    margin: i === 0 ? '0 0 1rem 0' : '0',
                  }}
                >
                  {chunk}
                </p>
              ))}
            </div>

            {/* Right: media (video or image) */}
            {data.problemMedia && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                style={{ borderRadius: '1.25rem', overflow: 'hidden', lineHeight: 0,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.55)', maxWidth: '60%', marginLeft: 'auto' }}
              >
                {isVideoSrc(data.problemMedia.src) ? (
                  <video src={data.problemMedia.src} autoPlay loop muted playsInline
                    style={{ width: '100%', height: 'auto', display: 'block' }} />
                ) : (
                  <img src={data.problemMedia.src} alt={data.problemMedia.alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }} />
                )}
              </motion.div>
            )}
          </div>

        </div>
      )}

      {/* All images live here — negative margin cancels section's 2rem horizontal padding */}
      {data.visualBlocks && data.visualBlocks.length > 0 && (
        <div style={{ margin: '0 -2rem' }}>
          {data.visualBlocks.map((block, i) => (
            <VisualShowcase key={i} block={block} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── WIP info box ──────────────────────────────────────────────

function WIPBox({ message }: { message: string }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.75rem 1.25rem',
      background: 'rgba(255, 200, 60, 0.07)',
      border: '1px solid rgba(255, 200, 60, 0.22)',
      borderRadius: '0.75rem',
      marginBottom: '2rem',
    }}>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255, 200, 60, 0.7)',
        fontFamily: "'Barlow', sans-serif",
      }}>
        {message}
      </span>
    </div>
  )
}

// ─── Project tab content ───────────────────────────────────────

function ProjectContent({ tab, problemStatement }: { tab: ProjectTab; problemStatement?: string }) {
  const isVid = (src: string) => /\.(mp4|webm|mov)$/i.test(src)

  return (
    <motion.div
      key={tab.label}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {/* ── problemFirst: problem section + image, then goal + process as stacked blocks ── */}
      {tab.problemFirst ? (
        <>
          {problemStatement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              style={{ marginBottom: '2rem' }}
            >
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: "'Barlow', sans-serif", marginBottom: '0.75rem' }}>The Problem</span>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{problemStatement}</p>
            </motion.div>
          )}
          {tab.problemImage && (
            <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>
              {isVid(tab.problemImage.src) ? (
                <video src={tab.problemImage.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.problemImage.src} alt={tab.problemImage.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
              )}
            </div>
          )}
          <SectionBlock heading={tab.goal.heading} body={tab.goal.body} delay={0} />
          {tab.process && <SectionBlock heading={tab.process.heading} body={tab.process.body} delay={0.06} />}
        </>
      ) : tab.showProblemStatement ? (
        /* ── 3-card grid: problem + goal + process ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {problemStatement && (
            <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: "'Barlow', sans-serif", marginBottom: '0.75rem' }}>The Problem</span>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{problemStatement}</p>
            </div>
          )}
          <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: "'Barlow', sans-serif", marginBottom: '0.75rem' }}>Project Goal</span>
            <h3 style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>{tab.goal.heading}</h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, margin: 0 }}>{tab.goal.body}</p>
          </div>
          {tab.process && (
            <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: "'Barlow', sans-serif", marginBottom: '0.75rem' }}>Process</span>
              <h3 style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>{tab.process.heading}</h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, margin: 0 }}>{tab.process.body}</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Default: stacked goal + process sections with optional inline media ── */
        <>
          {/* Intro media — slightly smaller than full width, centered */}
          {tab.introMedia && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              style={{ maxWidth: '82%', margin: '0 auto 2.5rem', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.45)', lineHeight: 0 }}
            >
              {isVid(tab.introMedia.src) ? (
                <video src={tab.introMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.introMedia.src} alt={tab.introMedia.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
              )}
            </motion.div>
          )}
          <SectionBlock heading={tab.goal.heading} body={tab.goal.body} delay={0} />
          {tab.goalMedia && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0, ease: EASE_OUT }}
              style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}
            >
              {isVid(tab.goalMedia.src) ? (
                <video src={tab.goalMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.goalMedia.src} alt={tab.goalMedia.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
              )}
              {tab.goalMedia.caption && (
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.78rem', fontWeight: 300, color: 'rgba(255,255,255,0.38)', marginTop: '0.75rem', lineHeight: 1.5 }}>{tab.goalMedia.caption}</p>
              )}
            </motion.div>
          )}
          {tab.postGoalVisuals && tab.postGoalVisuals.length > 0 && (
            <div style={{ margin: '0 -2rem', marginBottom: '1rem' }}>
              {tab.postGoalVisuals.map((block, i) => (
                <VisualShowcase key={i} block={block} />
              ))}
            </div>
          )}
          {tab.process && <SectionBlock heading={tab.process.heading} body={tab.process.body} delay={0.06} />}
          {tab.processMedia && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.06, ease: EASE_OUT }}
              style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}
            >
              {isVid(tab.processMedia.src) ? (
                <video src={tab.processMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.processMedia.src} alt={tab.processMedia.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
              )}
              {tab.processMedia.caption && (
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.78rem', fontWeight: 300, color: 'rgba(255,255,255,0.38)', marginTop: '0.75rem', lineHeight: 1.5 }}>{tab.processMedia.caption}</p>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* WIP box — skips process/decisions/outcome when set */}
      {tab.wip ? (
        <WIPBox message={tab.wip.message} />
      ) : (
        <>
          {/* Visuals between Process and Decisions */}
          {tab.preDecisionVisuals && tab.preDecisionVisuals.length > 0 && (
            <div style={{ margin: '0 -2rem', marginBottom: '1rem' }}>
              {tab.preDecisionVisuals.map((block, i) => (
                <VisualShowcase key={i} block={block} />
              ))}
            </div>
          )}
          {tab.decisions.length > 0 && (
            <DecisionsBlock
              heading={tab.decisionsHeading ?? 'What shaped the outcome'}
              decisions={tab.decisions}
              decisionsLayout={tab.decisionsLayout}
              delay={0.12}
            />
          )}
          {/* Secondary key decisions — own section with nav-tracked heading */}
          {tab.keyDecisions && tab.keyDecisions.length > 0 && (
            <section
              id="section-key-decisions"
              style={{ paddingTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '2rem' }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 'clamp(2.45rem, 4.9vw, 3.85rem)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.90)',
                  margin: '0 0 3rem 0',
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                }}
              >
                {tab.keyDecisionsHeading ?? 'Key decisions'}
              </motion.h2>
              <DecisionsBlock
                heading={tab.keyDecisionsHeading ?? 'Key decisions'}
                decisions={tab.keyDecisions}
                decisionsLayout="caption"
                delay={0.18}
              />
            </section>
          )}
          {/* Visuals between Decisions and Outcome */}
          {tab.postDecisionVisuals && tab.postDecisionVisuals.length > 0 && (
            <div style={{ margin: '0 -2rem', marginBottom: '1rem' }}>
              {tab.postDecisionVisuals.map((block, i) => (
                <VisualShowcase key={i} block={block} />
              ))}
            </div>
          )}
          {/* Learnings: plain text section replacing outcome stat cards */}
          {tab.outcome && (
            <OutcomeBlock outcome={tab.outcome} delay={0.18} />
          )}
          {tab.learnings && (
            <SectionBlock heading={tab.learnings.heading} body={tab.learnings.body} delay={0.22} />
          )}
          {tab.visualBlocks && tab.visualBlocks.length > 0 && (
            <div style={{ margin: '0 -2rem' }}>
              {tab.visualBlocks.map((block, i) => (
                <VisualShowcase key={i} block={block} />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────

interface Props {
  data: CaseStudy
}

function sectionId(label: string) {
  return 'section-' + label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function ProjectTabs({ data }: Props) {
  if (!data.projectTabs || data.projectTabs.length === 0) return null

  return (
    <div
      style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}
    >
      {/* Overview section */}
      <section id="section-overview">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: 'clamp(2.45rem, 4.9vw, 3.85rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.90)',
            margin: '0 0 3rem 0',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
          }}
        >
          Overview
        </motion.h2>
        <OverviewContent data={data} />
      </section>

      {/* One section per project tab */}
      {data.projectTabs.map((tab) => (
        <section
          key={tab.label}
          id={sectionId(tab.label)}
          style={{
            paddingTop: '5rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            marginTop: '2rem',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: 'clamp(2.45rem, 4.9vw, 3.85rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.90)',
              margin: '0 0 3rem 0',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
            }}
          >
            {tab.label}
          </motion.h2>
          <ProjectContent tab={tab} problemStatement={data.problemStatement} />
        </section>
      ))}
    </div>
  )
}
