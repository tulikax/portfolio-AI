import CroppedImage from './CroppedImage'
import Reveal from './Reveal'
import type { CollageSpec } from './content'
import { HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * Two screenshots overlapped on a diagonal rather than sat side by side.
 *
 * The pair are captures of the same flow at different aspect ratios, so equal
 * widths would render them at wildly different heights. Widths are set per item
 * in `content.ts` to be inversely proportional to each image's aspect, which
 * lands them at a matching height; the frame's own aspect then controls how far
 * they overlap.
 *
 * Collapses to a plain stack on narrow viewports via `.df-collage`.
 */
export default function MediaCollage({ spec }: { spec: CollageSpec }) {
  return (
    <div className={spec.wide ? 'df-media-wide' : undefined} style={{ margin: '2.75rem 0' }}>
      <Reveal>
        <div
          className="df-collage"
          style={{ position: 'relative', aspectRatio: `${spec.aspect}` }}
        >
          {spec.items.map((item, i) => (
              <div
                key={item.label}
                style={{
                  position: 'absolute',
                  width: `${item.width}%`,
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  // Later items sit on top, so the cascade reads front-to-back
                  zIndex: i + 1,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: `1px solid ${HAIRLINE_STRONG}`,
                  background: 'rgb(var(--surface))',
                  boxShadow: `0 ${8 + i * 6}px ${30 + i * 14}px rgba(0, 0, 0, ${0.35 + i * 0.1})`,
                }}
              >
                <CroppedImage src={item.src} alt={item.alt} crop={item.crop} />
                <span
                  style={{
                    ...MONO,
                    position: 'absolute',
                    top: '0.625rem',
                    left: '0.625rem',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.54rem',
                    borderRadius: '9999px',
                    background: 'rgb(var(--surface) / 0.78)',
                    color: ink(0.8),
                    pointerEvents: 'none',
                  }}
                >
                  {item.label}
                </span>
              </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.06}>
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
      </Reveal>
    </div>
  )
}
