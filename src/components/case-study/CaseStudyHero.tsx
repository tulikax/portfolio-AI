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
        {/* Company label */}
        {data.company && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '0.75rem',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            {data.company}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: 'white',
            margin: '0 0 1rem 0',
          }}
        >
          {data.title}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE_OUT }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.70)',
            fontFamily: "'Barlow', sans-serif",
            margin: '0 0 1.75rem 0',
            maxWidth: '40rem',
          }}
        >
          {data.tagline}
        </motion.p>

        {/* Meta pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease: EASE_OUT }}
          style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}
        >
          {[data.year, data.role, data.duration].map((meta) => (
            <span
              key={meta}
              style={{
                display: 'inline-block',
                padding: '0.3rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 400,
                fontFamily: "'Barlow', sans-serif",
                letterSpacing: '0.04em',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {meta}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
