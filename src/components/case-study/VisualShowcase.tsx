import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { VisualBlock, CaseStudyImage } from '../../types/caseStudy'
import { useLightbox } from './LightboxContext'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// min column widths ensure grids collapse to 1-col on small screens automatically
const GRID_COLS: Record<string, string> = {
  full: '1fr',
  'two-up': 'repeat(auto-fit, minmax(260px, 1fr))',
  'three-up': 'repeat(auto-fit, minmax(200px, 1fr))',
}

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src)
}

function MediaInner({ img, fixedHeight, style, onImageClick }: { img: CaseStudyImage; fixedHeight?: boolean; style?: React.CSSProperties; onImageClick?: () => void }) {
  return isVideo(img.src) ? (
    <video
      src={img.src}
      autoPlay
      loop
      muted
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  ) : (
    <img
      src={img.src}
      alt={img.alt}
      onClick={onImageClick}
      style={{ width: '100%', height: fixedHeight ? '100%' : 'auto', objectFit: fixedHeight ? 'cover' : undefined, display: 'block', cursor: onImageClick ? 'zoom-in' : undefined, ...style }}
    />
  )
}

function ImageCard({ img, delay, cardHeight }: { img: CaseStudyImage; delay: number; cardHeight?: string }) {
  const { openLightbox } = useLightbox()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
    >
      <div
        style={{
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgb(var(--ink) / 0.06) inset',
          background: 'rgb(var(--ink) / 0.03)',
          lineHeight: 0,
          height: cardHeight,
        }}
      >
        <MediaInner img={img} fixedHeight={!!cardHeight} onImageClick={isVideo(img.src) ? undefined : () => openLightbox(img.src, img.alt)} />
      </div>
      {img.caption && (
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 300,
            color: 'rgb(var(--ink) / 0.38)',
            fontFamily: 'var(--font-body)',
            marginTop: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {img.caption}
        </p>
      )}
    </motion.div>
  )
}

/** Snap-scrollable carousel card — uniform height, shows peek of next */
function CarouselCard({ img, i }: { img: CaseStudyImage; i: number }) {
  const { openLightbox } = useLightbox()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: EASE_OUT }}
      style={{
        flexShrink: 0,
        width: 'calc(78% - 0.5rem)',
        scrollSnapAlign: 'start',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        height: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgb(var(--ink) / 0.06) inset',
      }}
    >
      <MediaInner img={img} fixedHeight style={{ height: '100%', objectFit: 'contain', transform: 'scale(0.95)', transformOrigin: 'center center' }} onImageClick={isVideo(img.src) ? undefined : () => openLightbox(img.src, img.alt)} />
      {img.caption && (
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 300,
          color: 'rgb(var(--ink) / 0.38)',
          fontFamily: 'var(--font-body)',
          marginTop: '0.75rem',
          lineHeight: 1.5,
          padding: '0 0.25rem',
        }}>
          {img.caption}
        </p>
      )}
    </motion.div>
  )
}

/** Image pans right→left as you scroll past it */
function HorizontalScrollCard({ img }: { img: CaseStudyImage }) {
  const { openLightbox } = useLightbox()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start when image is 20% in view, end when 80% has passed through
    offset: ['start 80%', 'end 20%'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <div
        ref={ref}
        style={{
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgb(var(--ink) / 0.06) inset',
          background: 'rgb(var(--ink) / 0.03)',
          lineHeight: 0,
          // Fixed viewport height so overflow crops cleanly
          height: 'clamp(320px, 48vw, 680px)',
        }}
      >
        <motion.div style={{ x, height: '100%', width: '140%' }}>
          <MediaInner img={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onImageClick={isVideo(img.src) ? undefined : () => openLightbox(img.src, img.alt)} />
        </motion.div>
      </div>
      {img.caption && (
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 300,
            color: 'rgb(var(--ink) / 0.38)',
            fontFamily: 'var(--font-body)',
            marginTop: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {img.caption}
        </p>
      )}
    </motion.div>
  )
}

interface Props {
  block: VisualBlock
}

export default function VisualShowcase({ block }: Props) {
  const isHorizontalScroll = block.layout === 'scroll-horizontal'
  // block.columns overrides the default grid columns for asymmetric splits
  const cols = block.columns ?? GRID_COLS[block.layout] ?? '1fr'

  return (
    <div style={{ padding: '0 2rem 3.5rem', maxWidth: '72rem', margin: '0 auto' }}>
      {block.label && (
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          style={{
            display: 'block',
            fontSize: '0.68rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgb(var(--ink) / 0.35)',
            fontFamily: 'var(--font-body)',
            marginBottom: '1.25rem',
          }}
        >
          {block.label}
        </motion.span>
      )}

      {block.layout === 'carousel' ? (
        <div style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          height: block.height ?? '420px',
          cursor: 'grab',
          paddingRight: '2rem', // allow last card to snap cleanly
        }}>
          {block.images.map((img, i) => (
            <CarouselCard key={img.src + i} img={img} i={i} />
          ))}
        </div>
      ) : isHorizontalScroll ? (
        // Each image gets the parallax pan treatment
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {block.images.map((img, i) => (
            <HorizontalScrollCard key={img.src + i} img={img} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: '1rem',
          }}
        >
          {block.images.map((img, i) => (
            <ImageCard key={img.src + i} img={img} delay={i * 0.08} cardHeight={block.height} />
          ))}
        </div>
      )}
    </div>
  )
}
