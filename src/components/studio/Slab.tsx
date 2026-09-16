import MediaFrame, { type SlabMedia } from './MediaFrame'
import Reveal from './Reveal'

export interface SlabProps {
  media: SlabMedia
  caption?: string
  /** Width ÷ height. The reference sits at 16:10 throughout. */
  ratio?: number
  /** Seconds to wait after entering view — used to stagger a group. */
  delay?: number
}

/**
 * A full-width media unit in the vertical rhythm, used on the detail pages
 * where each piece of media sits directly beneath the paragraph it belongs to.
 *
 * The intro page groups media by project instead and uses Carousel.
 */
export default function Slab({ media, caption, ratio = 16 / 10, delay = 0 }: SlabProps) {
  return (
    <Reveal delay={delay} style={{ width: '100%', maxWidth: 'var(--studio-slab)', margin: '0 auto' }}>
      <figure style={{ margin: 0 }}>
        <div style={{ aspectRatio: String(ratio) }}>
          <MediaFrame media={media} />
        </div>

        {caption && (
          <figcaption
            style={{
              marginTop: 12,
              fontSize: '0.8125rem',
              lineHeight: 1.5,
              color: media.kind === 'pending' ? 'var(--studio-faint)' : 'var(--studio-muted)',
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  )
}
