import CroppedImage from './CroppedImage'
import Reveal from './Reveal'
import type { MediaSpec } from './content'
import { HAIRLINE, HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * A screenshot in a window chrome, or an empty frame where the asset is still
 * to come.
 *
 * The caption sits outside the frame rather than in a bar inside it — the
 * window chrome is meant to read as the product, and a caption boxed within it
 * reads as part of the UI rather than as the page talking about it.
 *
 * The Reveal wrapper is deliberately on the outside — `.liquid-glass` renders
 * its blur in an ::after layer, and animating transforms on the same node
 * makes that layer flicker (see the note in index.css).
 */
export default function MediaSlot({ spec }: { spec: MediaSpec }) {
  return (
    <Reveal style={{ margin: '3rem 0' }}>
      <div style={{ width: spec.width ? `${spec.width}%` : '100%', margin: '0 auto' }}>
        <div
          className="liquid-glass"
          style={{ borderRadius: '0.75rem', border: `1px solid ${HAIRLINE}` }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  background: HAIRLINE_STRONG,
                  display: 'block',
                }}
              />
            ))}
            <span
              style={{
                ...MONO,
                marginLeft: '0.4rem',
                fontSize: '0.52rem',
                color: ink(0.38),
                textTransform: 'none',
              }}
            >
              {spec.name}
            </span>
          </div>

          {spec.src ? (
            <CroppedImage src={spec.src} alt={spec.alt ?? ''} crop={spec.crop} />
          ) : (
            /* Drop zone */
            <div
              style={{
                minHeight: '18rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '2.5rem',
                textAlign: 'center',
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${ink(
                  0.025,
                )} 12px, ${ink(0.025)} 24px)`,
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  border: `1px solid ${HAIRLINE_STRONG}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: ink(0.42),
                }}
              >
                {spec.icon}
              </div>
              <div style={{ ...MONO, color: ink(0.42) }}>{spec.label}</div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  color: ink(0.3),
                  maxWidth: '22rem',
                  lineHeight: 1.6,
                }}
              >
                {spec.hint}
              </div>
            </div>
          )}
        </div>

        {/* Caption — open, below the frame */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.6,
            color: ink(0.42),
            margin: '0.875rem 0 0',
          }}
        >
          {spec.caption}
        </p>
      </div>
    </Reveal>
  )
}
