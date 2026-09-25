import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { CaseStudy, ProjectTab } from '../../types/caseStudy'
import VisualShowcase from './VisualShowcase'
import HighlightPhrase from './HighlightPhrase'
import DoorFeedContext from './DoorFeedContext'
import DecisionsAccordion from './DecisionsAccordion'
import DecisionRounds from './DecisionRounds'
import { useLightbox } from './LightboxContext'

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
  const { openLightbox } = useLightbox()
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
          boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.55 * var(--shadow-strength)))',
          lineHeight: 0,
          height: 'clamp(300px, 42vw, 640px)',
        }}
      >
        <motion.div
          animate={{ x: -offset }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          style={{ width: '280%', height: '100%' }}
        >
          <img src={src} alt={alt} onClick={() => openLightbox(src, alt)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }} />
        </motion.div>
      </div>

      {/* Prev button */}
      <button
        onClick={() => pan(-1)}
        aria-label="Previous"
        style={{
          position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
          width: '2.25rem', height: '2.25rem', borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgb(var(--ink) / 0.18)',
          color: 'var(--text-1)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 'var(--cs-body)',
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
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgb(var(--ink) / 0.18)',
          color: 'var(--text-1)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 'var(--cs-body)',
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
  variant = 'body',
}: {
  heading: string
  body: string
  delay?: number
  variant?: 'body' | 'caption'
}) {
  const paragraphs = body.split('\n\n').filter(Boolean)
  const isCaption = variant === 'caption'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: isCaption ? '1.5rem' : '3rem' }}
    >
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: isCaption ? 'var(--cs-body-sm)' : 'var(--cs-body)',
            fontWeight: 300,
            lineHeight: isCaption ? 1.65 : 1.8,
            color: isCaption ? 'rgb(var(--ink) / 0.46)' : 'rgb(var(--ink) / 0.68)',
            fontFamily: 'var(--font-body)',
            margin: i < paragraphs.length - 1 ? '0 0 0.6rem 0' : '0',
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
  const { openLightbox } = useLightbox()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      style={{ marginBottom: '3rem' }}
    >
      {decisionsLayout === 'caption' ? (
        <DecisionRounds items={decisions} />
      ) : decisionsLayout === 'side-by-side' ? (
        /* Narrower text card (260px) so image area dominates */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {decisions.map((d, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: d.image ? '260px 1fr' : '1fr', gap: '1rem', alignItems: 'start' }}>
              <div style={{ borderRadius: '1rem', padding: '1rem 1.25rem', background: 'rgb(var(--ink) / 0.03)', border: '1px solid rgb(var(--ink) / 0.07)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body)', fontWeight: 500, color: 'var(--text-1)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{d.title}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 300, color: 'var(--text-2)', margin: 0, lineHeight: 1.7 }}>{d.rationale}</p>
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
                    <img src={d.image.src} alt={d.image.alt} onClick={() => openLightbox(d.image!.src, d.image!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
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
              <div style={{ borderRadius: '1rem', padding: '1.25rem 1.5rem', background: 'rgb(var(--ink) / 0.03)', border: '1px solid rgb(var(--ink) / 0.07)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body)', fontWeight: 500, color: 'var(--text-1)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{d.title}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 300, color: 'var(--text-2)', margin: 0, lineHeight: 1.7 }}>{d.rationale}</p>
              </div>
              {d.image && (
                <div style={{ borderRadius: '1rem', overflow: 'hidden', border: 'none', lineHeight: 0 }}>
                  {/\.(mp4|webm|mov)$/i.test(d.image.src) ? (
                    <video src={d.image.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                  ) : (
                    <img src={d.image.src} alt={d.image.alt} onClick={() => openLightbox(d.image!.src, d.image!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
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
  const { openLightbox } = useLightbox()
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
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--cs-h3)',
          fontWeight: 600,
          color: 'var(--text-1)',
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
          background: 'rgb(var(--ink) / 0.08)',
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
              background: 'rgb(var(--ink) / 0.03)',
              border: '1px solid rgb(var(--ink) / 0.06)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--cs-eyebrow)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isTealLabels ? 'rgba(45, 212, 191, 0.4)' : 'rgb(var(--ink) / 0.38)',
                marginBottom: isTealLabels ? '0.75rem' : '0.5rem',
              }}
            >
              {s.label}
            </span>
            {!isTealLabels && (
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--cs-h2)',
                  fontWeight: 400,
                  color: 'var(--ink-solid)',
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
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--cs-body-sm)',
                fontWeight: 300,
                color: 'var(--text-2)',
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
        <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: footnote ? '1.5rem' : 0, boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))' }}>
          {/\.(mp4|webm|mov)$/i.test(outcomeMedia.src) ? (
            <video src={outcomeMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
          ) : (
            <img src={outcomeMedia.src} alt={outcomeMedia.alt} onClick={() => openLightbox(outcomeMedia.src, outcomeMedia.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
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
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--cs-body)',
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
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--cs-body)',
              fontWeight: 300,
              color: 'var(--text-3)',
              lineHeight: 1.7,
              margin: 0,
              borderLeft: '2px solid rgb(var(--ink) / 0.12)',
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
  const { openLightbox } = useLightbox()
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
          <div style={{ width: w, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))' }}>
            {isVid ? (
              <video src={m.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <img src={m.src} alt={m.alt} onClick={() => openLightbox(m.src, m.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
            )}
          </div>
          {m.caption && (
            <p style={{ fontSize: 'var(--cs-body-sm)', fontWeight: 300, color: 'var(--text-3)', fontFamily: 'var(--font-body)', marginTop: '0.75rem' }}>{m.caption}</p>
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
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--cs-eyebrow)',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
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
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--cs-body)',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--text-2)',
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
                          onClick={() => openLightbox(img.src, img.alt)}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center center', cursor: 'zoom-in' }} />
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
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--cs-body)',
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'var(--text-2)',
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
                  boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.55 * var(--shadow-strength)))', maxWidth: '60%', marginLeft: 'auto' }}
              >
                {isVideoSrc(data.problemMedia.src) ? (
                  <video src={data.problemMedia.src} autoPlay loop muted playsInline
                    style={{ width: '100%', height: 'auto', display: 'block' }} />
                ) : (
                  <img src={data.problemMedia.src} alt={data.problemMedia.alt}
                    onClick={() => openLightbox(data.problemMedia!.src, data.problemMedia!.alt)}
                    style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
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
        fontSize: 'var(--cs-eyebrow)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255, 200, 60, 0.7)',
        fontFamily: 'var(--font-body)',
      }}>
        {message}
      </span>
    </div>
  )
}

// ─── Project tab content ───────────────────────────────────────

function ProjectContent({ tab, problemStatement }: { tab: ProjectTab; problemStatement?: string }) {
  const { openLightbox } = useLightbox()
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
              <span style={{ display: 'block', fontSize: 'var(--cs-eyebrow)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>The Problem</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 300, lineHeight: 1.8, color: 'var(--text-2)', margin: 0 }}>{problemStatement}</p>
            </motion.div>
          )}
          {tab.problemImage && (
            <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))' }}>
              {isVid(tab.problemImage.src) ? (
                <video src={tab.problemImage.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.problemImage.src} alt={tab.problemImage.alt} onClick={() => openLightbox(tab.problemImage!.src, tab.problemImage!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
              )}
            </div>
          )}
          <SectionBlock heading={tab.goal.heading} body={tab.goal.body} delay={0} variant={tab.captionText ? 'caption' : 'body'} />
          {tab.process && <SectionBlock heading={tab.process.heading} body={tab.process.body} delay={0.06} variant={tab.captionText ? 'caption' : 'body'} />}
        </>
      ) : tab.showProblemStatement ? (
        /* ── 3-card grid: problem + goal + process ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {problemStatement && (
            <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgb(var(--ink) / 0.03)', border: '1px solid rgb(var(--ink) / 0.07)' }}>
              <span style={{ display: 'block', fontSize: 'var(--cs-eyebrow)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>The Problem</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{problemStatement}</p>
            </div>
          )}
          <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgb(var(--ink) / 0.03)', border: '1px solid rgb(var(--ink) / 0.07)' }}>
            <span style={{ display: 'block', fontSize: 'var(--cs-eyebrow)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>Project Goal</span>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 600, color: 'var(--text-1)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>{tab.goal.heading}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{tab.goal.body}</p>
          </div>
          {tab.process && (
            <div style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgb(var(--ink) / 0.03)', border: '1px solid rgb(var(--ink) / 0.07)' }}>
              <span style={{ display: 'block', fontSize: 'var(--cs-eyebrow)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>Process</span>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 600, color: 'var(--text-1)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>{tab.process.heading}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-eyebrow)', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{tab.process.body}</p>
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
              style={{
                // Half width: this is a process diagram, not a screenshot — at
                // full bleed it dominated the section it was meant to introduce
                maxWidth: tab.captionText ? '50%' : '82%',
                margin: '0 auto 2.5rem',
                borderRadius: '1rem',
                overflow: 'hidden',
                // Assets with light type baked in carry their own dark ground —
                // anything else just needs an edge to sit against on paper
                background: tab.introMedia.darkGround
                  ? 'rgb(18 17 16)'
                  : 'rgb(var(--ink) / 0.05)',
                padding: tab.introMedia.darkGround ? '1.5rem' : '0.75rem',
                boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))',
                lineHeight: 0,
              }}
            >
              {isVid(tab.introMedia.src) ? (
                <video src={tab.introMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.introMedia.src} alt={tab.introMedia.alt} onClick={() => openLightbox(tab.introMedia!.src, tab.introMedia!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
              )}
            </motion.div>
          )}
          <SectionBlock heading={tab.goal.heading} body={tab.goal.body} delay={0} variant={tab.captionText ? 'caption' : 'body'} />
          {tab.goalMedia && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0, ease: EASE_OUT }}
              style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))' }}
            >
              {isVid(tab.goalMedia.src) ? (
                <video src={tab.goalMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.goalMedia.src} alt={tab.goalMedia.alt} onClick={() => openLightbox(tab.goalMedia!.src, tab.goalMedia!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
              )}
              {tab.goalMedia.caption && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 300, color: 'var(--text-3)', marginTop: '0.75rem', lineHeight: 1.5 }}>{tab.goalMedia.caption}</p>
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
          {tab.process && <SectionBlock heading={tab.process.heading} body={tab.process.body} delay={0.06} variant={tab.captionText ? 'caption' : 'body'} />}
          {tab.processMedia && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.06, ease: EASE_OUT }}
              style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 8px 40px rgb(var(--shadow-ink) / calc(0.45 * var(--shadow-strength)))' }}
            >
              {isVid(tab.processMedia.src) ? (
                <video src={tab.processMedia.src} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <img src={tab.processMedia.src} alt={tab.processMedia.alt} onClick={() => openLightbox(tab.processMedia!.src, tab.processMedia!.alt)} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
              )}
              {tab.processMedia.caption && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 300, color: 'var(--text-3)', marginTop: '0.75rem', lineHeight: 1.5 }}>{tab.processMedia.caption}</p>
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
              style={{ paddingTop: '5rem', borderTop: '1px solid rgb(var(--ink) / 0.07)', marginTop: '2rem' }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--cs-display)',
                  fontWeight: 300,
                  color: 'var(--text-1)',
                  margin: '0 0 3rem 0',
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                }}
              >
                {tab.keyDecisionsHeading ?? 'Key decisions'}
              </motion.h2>
              {/* Alternating rows, same shape as DoorFeed's Rounds — the
                  screenshot sits beside the reasoning, sides swap each
                  decision, and nothing here is hidden behind a click. */}
              <DecisionsAccordion decisions={tab.keyDecisions} />
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
  const tabs = data.projectTabs ?? []
  if (tabs.length === 0 && !data.contextChapter) return null

  return (
    <div
      style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}
    >
      {/* Overview section — or the Context chapter, where a study opts into it */}
      <section id="section-overview">
        {data.contextChapter ? (
          <DoorFeedContext />
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--cs-display)',
                fontWeight: 300,
                color: 'var(--text-1)',
                margin: '0 0 3rem 0',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
              }}
            >
              Overview
            </motion.h2>
            <OverviewContent data={data} />
          </>
        )}
      </section>

      {/* One section per project tab */}
      {tabs.map((tab) => (
        <section
          key={tab.label}
          id={sectionId(tab.label)}
          style={{
            paddingTop: '5rem',
            borderTop: '1px solid rgb(var(--ink) / 0.07)',
            marginTop: '2rem',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--cs-display)',
              fontWeight: 300,
              color: 'var(--text-1)',
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
