import { motion } from 'framer-motion'
import type { VisualBlock, CaseStudyImage } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const GRID_COLS: Record<string, string> = {
  full: '1fr',
  'two-up': 'repeat(2, 1fr)',
  'three-up': 'repeat(3, 1fr)',
}

function ImageCard({ img, delay }: { img: CaseStudyImage; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      <div
        style={{
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset',
          background: 'rgba(255,255,255,0.03)',
          lineHeight: 0,
        }}
      >
        <img
          src={img.src}
          alt={img.alt}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      {img.caption && (
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.38)',
            fontFamily: "'Barlow', sans-serif",
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
  const cols = GRID_COLS[block.layout] ?? '1fr'

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
            color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Barlow', sans-serif",
            marginBottom: '1.25rem',
          }}
        >
          {block.label}
        </motion.span>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: cols,
          gap: '1rem',
        }}
      >
        {block.images.map((img, i) => (
          <ImageCard key={img.src + i} img={img} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}
