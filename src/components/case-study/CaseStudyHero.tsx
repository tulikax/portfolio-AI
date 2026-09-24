import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GradientBlobs from '../GradientBlobs'
import type { CaseStudy } from '../../types/caseStudy'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Props {
  data: CaseStudy
  onVideoReady?: () => void
  onVideoProgress?: (pct: number) => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function TextContent({ data, animate = true }: { data: CaseStudy; animate?: boolean }) {
  const eyebrow = data.heroEyebrow ?? data.company
  const headline = data.heroHeadline ?? data.title
  const subheadline = data.heroSubheadline ?? data.tagline
  // Studies whose headline is a sentence rather than a name scale it down
  const headlineScale = data.heroHeadlineScale ?? 1

  const Wrap = animate ? motion.div : 'div'

  return (
    <>
      {eyebrow && (
        <Wrap
          {...(animate ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1, ease: EASE_OUT } } : {})}
          style={{
            fontSize: 'var(--cs-eyebrow)',
            fontWeight: 500,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            color: 'var(--text-2)',
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          {eyebrow}
        </Wrap>
      )}

      <Wrap
        {...(animate ? { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.18, ease: EASE_OUT } } : {})}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: `clamp(${2.75 * headlineScale}rem, ${7 * headlineScale}vw, ${5.5 * headlineScale}rem)`,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
          color: 'var(--ink-solid)',
          margin: '0 0 1rem 0',
          maxWidth: '32ch',
        }}
      >
        {headline}
      </Wrap>

      <Wrap
        {...(animate ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.28, ease: EASE_OUT } } : {})}
        style={{
          fontSize: 'var(--cs-lead)',
          fontWeight: 300,
          color: 'var(--text-2)',
          fontFamily: 'var(--font-body)',
          margin: '0 0 1.4rem 0',
          maxWidth: '34rem',
          lineHeight: 1.5,
        }}
      >
        {subheadline}
      </Wrap>

      {/* Meta + tools row */}
      <Wrap
        {...(animate ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.38, ease: EASE_OUT } } : {})}
        style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}
      >
        {(data.heroMeta ?? [
          { label: 'Year', value: data.year },
          { label: 'Role', value: data.role },
          { label: 'Duration', value: data.duration },
        ]).map((meta) => (
          <div key={`${meta.label}-${meta.value}`} style={{ display: 'flex', gap: '0.35rem', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 400, color: 'var(--text-3)' }}>
              {meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--cs-body-sm)', fontWeight: 500, color: 'var(--text-1)' }}>
              {meta.value}
            </span>
          </div>
        ))}

        {data.heroTools && data.heroTools.length > 0 && (
          <div style={{ width: 1, height: '1.4rem', background: 'rgb(var(--ink) / 0.14)', alignSelf: 'center', flexShrink: 0 }} />
        )}

        {data.heroTools && data.heroTools.map((tool) => (
          <div key={tool.slug} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgb(var(--ink) / 0.07)', border: '1px solid rgb(var(--ink) / 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={`/logos/${tool.slug}.${tool.ext ?? 'svg'}`} alt={tool.name} style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.75 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
              {tool.name}
            </span>
          </div>
        ))}
      </Wrap>
    </>
  )
}

export default function CaseStudyHero({ data, onVideoReady, onVideoProgress }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // `contain` keeps the whole frame visible, so the media box can't overhang the
  // section and the parallax travel has to stay small or it drifts out of view.
  const mediaFit = data.heroMediaFit ?? 'cover'
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', mediaFit === 'contain' ? '8%' : '20%'])

  // Cloudinary delivery URLs carry no file extension, so the path decides
  const isVideo =
    /\.(mp4|webm|mov)$/i.test(data.heroMedia.src) || data.heroMedia.src.includes('/video/upload/')

  function handleProgress(e: React.SyntheticEvent<HTMLVideoElement>) {
    if (!onVideoProgress) return
    const v = e.currentTarget
    if (v.buffered.length > 0 && v.duration > 0) {
      const pct = (v.buffered.end(v.buffered.length - 1) / v.duration) * 100
      onVideoProgress(Math.min(90, pct))
    }
  }

  // ── Contained layout ─────────────────────────────────────────────────────────
  // A framed, padded clip in normal flow with the copy below it — no vignette,
  // no overlay, because nothing needs to read on top of the clip.
  if (data.heroLayout === 'contained') {
    return (
      <section style={{ background: 'rgb(var(--surface))', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 2rem 3.5rem' }}>
          <div
            style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              lineHeight: 0,
              aspectRatio: '16 / 9',
              border: '1px solid rgb(var(--ink) / 0.12)',
              background: 'rgb(var(--surface))',
              boxShadow: '0 24px 60px rgb(var(--shadow-ink) / calc(0.42 * var(--shadow-strength)))',
            }}
          >
            {isVideo ? (
              <video
                src={data.heroMedia.src}
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onCanPlay={onVideoReady}
                onProgress={handleProgress}
              />
            ) : (
              <img
                src={data.heroMedia.src}
                alt={data.heroMedia.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onLoad={onVideoReady}
              />
            )}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <TextContent data={data} animate={!isMobile} />
          </div>
        </div>
      </section>
    )
  }

  // ── Mobile layout ────────────────────────────────────────────────────────────
  // Video fills viewport width at natural aspect ratio; text stacks below.
  if (isMobile) {
    return (
      <section ref={ref} style={{ background: 'rgb(var(--surface))', paddingTop: '3.5rem' }}>
        {/* Full-width media at natural proportions */}
        <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, position: 'relative' }}>
          {isVideo ? (
            <video
              src={data.heroMedia.src}
              autoPlay loop muted playsInline
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onCanPlay={onVideoReady}
              onProgress={handleProgress}
            />
          ) : (
            <img
              src={data.heroMedia.src}
              alt={data.heroMedia.alt}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onLoad={onVideoReady}
            />
          )}
          {/* subtle bottom fade into the text section */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to bottom, transparent, rgb(var(--surface)))', pointerEvents: 'none' }} />
        </div>

        {/* Text content — in document flow below the video */}
        <div style={{ padding: '1.5rem 1.25rem 2.5rem', background: 'rgb(var(--surface))' }}>
          <TextContent data={data} animate={false} />
        </div>
      </section>
    )
  }

  // ── Desktop layout ───────────────────────────────────────────────────────────
  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: 'rgb(var(--surface))',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.35 }}>
        <GradientBlobs />
      </div>

      <motion.div
        style={{ y: mediaY, position: 'absolute', inset: mediaFit === 'contain' ? 0 : '-10% 0', zIndex: 1 }}
      >
        {isVideo ? (
          <video
            src={data.heroMedia.src}
            autoPlay loop muted playsInline
            style={{ width: '100%', height: '100%', objectFit: mediaFit }}
            onCanPlay={onVideoReady}
            onProgress={handleProgress}
          />
        ) : (
          <img
            src={data.heroMedia.src}
            alt={data.heroMedia.alt}
            style={{ width: '100%', height: '100%', objectFit: mediaFit }}
            onLoad={onVideoReady}
          />
        )}
      </motion.div>

      {/*
       * The three scrims are tinted with --surface, not black.
       *
       * Their job is to hold the hero copy over a busy clip, and the copy is
       * already theme-aware (--ink-solid). A black scrim under dark ink on paper
       * is what made these heroes read as a slab with invisible text. Tinting
       * with the page ground means the same alphas work both ways: they sink the
       * clip toward near-black on dark and toward paper on light, and the copy
       * lands on its own ground either way.
       */}

      {/*
       * Each scrim starts late and lands hard. The copy sits at bottom: 3.5rem,
       * so only the lower third needs covering — veiling the whole clip to
       * protect one corner of it hides the thing the hero is there to show.
       */}

      {/* Vignette — settles the outer edges only */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 35%, transparent 58%, rgb(var(--surface) / 0.28) 82%, rgb(var(--surface) / 0.68) 100%)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Fade into the page at the bottom, where the headline sits */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, transparent 44%, rgb(var(--surface) / 0.34) 66%, rgb(var(--surface) / 0.86) 86%, rgb(var(--surface)) 100%)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Top fade for navbar blending */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, rgb(var(--surface) / 0.22), transparent)', zIndex: 3 }} />

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
        <TextContent data={data} animate />
      </div>
    </section>
  )
}
