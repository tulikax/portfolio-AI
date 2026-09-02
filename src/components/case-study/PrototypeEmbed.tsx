import { motion } from 'framer-motion'
import type { CaseStudy } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

type EmbedConfig = NonNullable<CaseStudy['prototypeEmbed']>

function buildEmbedUrl(config: EmbedConfig): string {
  if (config.type === 'figma') {
    const url = config.url
    const separator = url.includes('?') ? '&' : '?'
    return url.includes('embed=1') ? url : `${url}${separator}embed=1`
  }
  return config.url
}

interface Props {
  embed: EmbedConfig
}

export default function PrototypeEmbed({ embed }: Props) {
  const embedUrl = buildEmbedUrl(embed)
  const aspectRatio = embed.aspectRatio ?? '16/9'

  return (
    <section
      style={{
        padding: '2rem 2rem 5rem',
        maxWidth: '72rem',
        margin: '0 auto',
      }}
    >
      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'rgb(var(--ink) / 0.08)',
          marginBottom: '3.5rem',
        }}
      />

      {/* Embed */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
        className="liquid-glass"
        style={{
          borderRadius: '1.5rem',
          overflow: 'hidden',
          aspectRatio,
          position: 'relative',
          width: '70%',
        }}
      >
        {embed.type === 'video' ? (
          <video
            src={embed.url}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <iframe
            src={embedUrl}
            title="Interactive Prototype"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allowFullScreen
          />
        )}
      </motion.div>

      {embed.caption && (
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 300,
            color: 'rgb(var(--ink) / 0.38)',
            fontFamily: 'var(--font-body)',
            marginTop: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {embed.caption}
        </p>
      )}
    </section>
  )
}
