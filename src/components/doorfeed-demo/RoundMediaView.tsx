import CroppedImage from './CroppedImage'
import MediaCollage from './MediaCollage'
import MediaGrid from './MediaGrid'
import type { RoundMedia } from './content'
import { HAIRLINE_STRONG, MONO, ink } from './styles'

/** Renders whatever a round's media happens to be — one screen, a stack, a collage, or a gap. */
export default function RoundMediaView({ media }: { media: RoundMedia }) {
  if (media.kind === 'collage') {
    return <MediaCollage spec={media.spec} />
  }

  if (media.kind === 'grid') {
    return <MediaGrid spec={media.spec} />
  }

  if (media.kind === 'image' || media.kind === 'video') {
    return (
      <div
        style={{
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: `1px solid ${HAIRLINE_STRONG}`,
          background: 'rgb(var(--surface))',
          boxShadow: '0 18px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {media.kind === 'video' ? (
          <video
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            aria-label={media.label}
            style={{ width: '100%', display: 'block' }}
          />
        ) : (
          <CroppedImage src={media.src} alt={media.alt} crop={media.crop} />
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '16rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2.5rem',
        textAlign: 'center',
        borderRadius: '0.5rem',
        border: `1px solid ${HAIRLINE_STRONG}`,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${ink(
          0.025,
        )} 12px, ${ink(0.025)} 24px)`,
      }}
    >
      <div style={{ ...MONO, color: ink(0.42) }}>{media.label}</div>
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
        {media.hint}
      </div>
    </div>
  )
}
