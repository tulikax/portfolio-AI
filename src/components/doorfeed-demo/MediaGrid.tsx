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
export default function MediaGrid({ spec }: { spec: MediaGridSpec }) {
  return (
    <div className={spec.wide ? 'df-media-wide' : undefined} style={{ margin: '2.75rem 0' }}>
      <Reveal>
        <div
          className="df-media-grid"
          data-columns={spec.columns}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${spec.columns}, 1fr)`,
            gap: '1px',
            background: HAIRLINE,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: '0.75rem',
            overflow: 'hidden',
          }}
        >
          {spec.cells.map((cell) => (
            <div key={cell.label} style={{ background: ink(0.03) }}>
              <div
                style={{
                  ...MONO,
                  fontSize: '0.56rem',
                  color: ink(0.42),
                  padding: '0.625rem 0.875rem',
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                {cell.label}
              </div>
              {cell.compare ? (
                <BeforeAfterSlider {...cell.compare} />
              ) : cell.src ? (
                <div
                  style={{
                    width: cell.width ? `${cell.width}%` : '100%',
                    margin: '0 auto',
                  }}
                >
                  <CroppedImage src={cell.src} alt={cell.alt ?? ''} crop={cell.crop} />
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
