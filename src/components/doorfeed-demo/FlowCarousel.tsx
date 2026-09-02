import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import type { MediaGridSpec } from './content'
import { HAIRLINE_STRONG, MONO, ink } from './styles'

/** Slide width as a percentage of the track — leaves the next clip peeking. */
const SLIDE_BASIS = 74

/**
 * The end-to-end flows as a carousel.
 *
 * Scrolling is the native horizontal kind — scroll-snap on a real overflow
 * container — so a trackpad swipe, a touch drag and the arrow buttons all drive
 * the same thing, and the page's own vertical scroll is never intercepted.
 * Arrow keys work once the track has focus.
 *
 * Only the clip in view plays. Four autoplaying videos would otherwise decode
 * in parallel for the whole time the section is on screen.
 */
export default function FlowCarousel({ spec }: { spec: MediaGridSpec }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [index, setIndex] = useState(0)

  const count = spec.cells.length

  // Derive the active slide from scroll position rather than tracking it
  // separately, so native swipes and button presses stay in agreement.
  const syncIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const slide = track.scrollWidth / count
    setIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / slide))))
  }, [count])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', syncIndex, { passive: true })
    return () => track.removeEventListener('scroll', syncIndex)
  }, [syncIndex])

  // Play only what's on screen
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === index) {
        void v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [index])

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track) return
      const target = Math.min(count - 1, Math.max(0, next))
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollTo({
        left: (track.scrollWidth / count) * target,
        behavior: reduced ? 'auto' : 'smooth',
      })
    },
    [count],
  )

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') goTo(index - 1)
    else if (e.key === 'ArrowRight') goTo(index + 1)
    else return
    e.preventDefault()
  }

  const arrow = (dir: -1 | 1, label: string, glyph: string) => {
    const disabled = dir === -1 ? index === 0 : index === count - 1
    return (
      <button
        onClick={() => goTo(index + dir)}
        disabled={disabled}
        aria-label={label}
        style={{
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '50%',
          border: `1px solid ${disabled ? ink(0.12) : ink(0.4)}`,
          background: 'none',
          color: disabled ? ink(0.2) : ink(0.85),
          fontSize: '0.8rem',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.25s var(--ease-out), color 0.25s var(--ease-out)',
        }}
      >
        <span aria-hidden="true">{glyph}</span>
      </button>
    )
  }

  return (
    <div className={spec.wide ? 'df-media-wide' : undefined} style={{ margin: '2.75rem 0' }}>
      <Reveal>
        <div
          ref={trackRef}
          className="df-carousel-track"
          role="group"
          aria-roledescription="carousel"
          aria-label="The journey, end to end"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ display: 'flex', gap: '1.5rem' }}
        >
          {spec.cells.map((cell, i) => (
            <div
              key={cell.label}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${cell.label}`}
              style={{
                flex: `0 0 ${SLIDE_BASIS}%`,
                scrollSnapAlign: 'center',
                opacity: i === index ? 1 : 0.45,
                transition: 'opacity 0.4s var(--ease-out)',
              }}
            >
              <div style={{ ...MONO, fontSize: '0.56rem', color: ink(0.42), padding: '0 0 0.625rem' }}>
                {cell.label}
              </div>
              <div
                style={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: `1px solid ${HAIRLINE_STRONG}`,
                }}
              >
                {cell.videoSrc && (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el
                    }}
                    src={cell.videoSrc}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={cell.alt ?? cell.label}
                    style={{ width: '100%', display: 'block' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={0.06}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.25rem 0 0',
          }}
        >
          {arrow(-1, 'Previous flow', '‹')}
          {arrow(1, 'Next flow', '›')}

          <div style={{ display: 'flex', gap: '0.375rem', marginLeft: '0.25rem' }}>
            {spec.cells.map((cell, i) => (
              <button
                key={cell.label}
                onClick={() => goTo(i)}
                aria-label={`Go to ${cell.label}`}
                aria-current={i === index}
                style={{
                  width: i === index ? '1.5rem' : '0.375rem',
                  height: '0.375rem',
                  borderRadius: '9999px',
                  border: 'none',
                  padding: 0,
                  background: i === index ? ink(0.8) : ink(0.22),
                  transition: 'width 0.35s var(--ease-out), background 0.35s var(--ease-out)',
                }}
              />
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.6,
              color: ink(0.42),
              margin: 0,
              marginLeft: 'auto',
              maxWidth: '34rem',
              textAlign: 'right',
            }}
          >
            {spec.caption}
          </p>
        </div>
      </Reveal>
    </div>
  )
}
