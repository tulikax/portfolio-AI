import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GradientBlobs from '../GradientBlobs'
import type { CaseStudy } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  data: CaseStudy
}

export default function CaseStudyHero({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  const isVideo = /\.(mp4|webm|mov)$/i.test(data.heroMedia.src)
  const eyebrow = data.heroEyebrow ?? data.company
  const headline = data.heroHeadline ?? data.title
  const subheadline = data.heroSubheadline ?? data.tagline

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: 'black',
      }}
    >
      {/* Blobs behind image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.35 }}>
        <GradientBlobs />
      </div>

      {/* Parallax media */}
      <motion.div
        style={{ y: mediaY, position: 'absolute', inset: '-10% 0', zIndex: 1 }}
      >
        {isVideo ? (
          <video
            src={data.heroMedia.src}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={data.heroMedia.src}
            alt={data.heroMedia.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </motion.div>

      {/* Gradient fade to black at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, black 100%)',
          zIndex: 2,
        }}
      />

      {/* Top fade for navbar blending */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
          zIndex: 3,
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: 0,
          right: 0,
          padding: '0 2rem',
          maxWidth: '72rem',
          margin: '0 auto',
          zIndex: 10,
        }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '0.75rem',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            {eyebrow}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.12,
            color: 'white',
            margin: '0 0 1rem 0',
            maxWidth: '32ch',
          }}
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE_OUT }}
          style={{
            fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.65)',
            fontFamily: "'Barlow', sans-serif",
            margin: '0 0 1.4rem 0',
            maxWidth: '34rem',
            lineHeight: 1.5,
          }}
        >
          {subheadline}
        </motion.p>

        {/* Meta + tools row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease: EASE_OUT }}
          style={{ display: 'flex', gap: '1.6rem', alignItems: 'flex-start', flexWrap: 'wrap' }}
        >
          {/* Meta labels */}
          {(data.heroMeta ?? [
            { label: 'Year', value: data.year },
            { label: 'Role', value: data.role },
            { label: 'Duration', value: data.duration },
          ]).map((meta) => (
            <div key={`${meta.label}-${meta.value}`} style={{ display: 'flex', gap: '0.35rem', alignItems: 'baseline' }}>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {meta.label}
              </span>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                {meta.value}
              </span>
            </div>
          ))}

          {/* Divider */}
          {data.heroTools && data.heroTools.length > 0 && (
            <div style={{ width: 1, height: '1.4rem', background: 'rgba(255,255,255,0.14)', alignSelf: 'center', flexShrink: 0 }} />
          )}

          {/* Tool icons with labels */}
          {data.heroTools && data.heroTools.map((tool) => (
            <div
              key={tool.slug}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img
                  src={`/logos/${tool.slug}.${tool.ext ?? 'svg'}`}
                  alt={tool.name}
                  style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.75 }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.38)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
