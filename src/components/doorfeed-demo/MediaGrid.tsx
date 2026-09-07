import BeforeAfterSlider from './BeforeAfterSlider'
import CroppedImage from './CroppedImage'
import Reveal from './Reveal'
import type { MediaGridSpec } from './content'
import { DISPLAY, HAIRLINE, HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * A row of empty media frames shown as one unit — used where several screens
 * only make their point side by side (the three ingestion steps, UK vs France).
 * Collapses to a single column on narrow viewports via `.df-media-grid`.
 */
export default function MediaGrid({
  spec,
  flush = false,
}: {
  spec: MediaGridSpec
  /** Drops the leading margin so the first label lines up with copy beside it. */
  flush?: boolean
}) {
  return (
    <div
      className={spec.wide ? 'df-media-wide' : undefined}
      style={{ margin: flush ? '0 0 2.75rem' : '2.75rem 0' }}
    >
      <Reveal>
        <div
          className="df-media-grid"
          data-columns={spec.columns}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${spec.columns}, 1fr)`,
            ...(spec.bare
              ? { gap: '3rem' }
              : {
                  gap: '1px',
                  background: HAIRLINE,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                }),
          }}
        >
          {spec.cells.map((cell) => (
            <div
              key={cell.label}
              style={
                spec.bare
                  ? // Cell hugs its media rather than framing it in a full-column card
                    { width: cell.width ? `${cell.width}%` : '100%', margin: '0 auto' }
                  : { background: ink(0.03) }
              }
            >
              <div
                style={{
                  ...MONO,
                  fontSize: '0.56rem',
                  color: ink(0.42),
                  padding: spec.bare ? '0 0 0.625rem' : '0.625rem 0.875rem',
                  borderBottom: spec.bare ? 'none' : `1px solid ${HAIRLINE}`,
                }}
              >
                {cell.label}
              </div>
              {cell.compare ? (
                <BeforeAfterSlider {...cell.compare} />
              ) : cell.videoSrc || cell.src ? (
                /*
                 * `width` scales stills and clips alike, centred in the cell —
                 * except in bare mode, where the cell itself already carries it.
                 */
                <div
                  style={{
                    width: !spec.bare && cell.width ? `${cell.width}%` : '100%',
                    margin: '0 auto',
                    borderRadius: spec.bare ? '0.5rem' : 0,
                    overflow: spec.bare ? 'hidden' : undefined,
                  }}
                >
                  {cell.videoSrc ? (
                    <video
                      src={cell.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label={cell.alt ?? cell.label}
                      style={{ width: '100%', display: 'block' }}
                    />
                  ) : (
                    <CroppedImage src={cell.src ?? ''} alt={cell.alt ?? ''} crop={cell.crop} />
                  )}
                </div>
              ) : (
                <div
                  style={{
                    minHeight: '11rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem',
                    padding: '1.875rem 1.25rem',
                    textAlign: 'center',
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${ink(
                      0.025,
                    )} 12px, ${ink(0.025)} 24px)`,
                  }}
                >
                  <div
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      border: `1px solid ${HAIRLINE_STRONG}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ink(0.42),
                    }}
                  >
                    {cell.icon}
                  </div>
                  <div style={{ ...MONO, fontSize: '0.56rem', color: ink(0.42) }}>{cell.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <p
          style={{
            ...DISPLAY,
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.6,
            color: ink(0.42),
            letterSpacing: 'normal',
            margin: '0.875rem 0 0',
          }}
        >
          {spec.caption}
        </p>
      </Reveal>
    </div>
  )
}
