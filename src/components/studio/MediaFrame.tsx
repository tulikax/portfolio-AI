import { useEffect, useRef } from 'react'

/**
 * One piece of media, filling whatever box it is given.
 *
 * `kind: 'pending'` reserves space for media that is not on Cloudinary yet
 * (SigTech and Deloitte). It draws an empty tile at the right size so filling it
 * later is a content change with no layout shift.
 */
export type SlabMedia =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'pending'; alt: string }

/**
 * Plays only while on screen.
 *
 * A dozen videos decoding at once is what kills a page built like this, so
 * playback is tied to intersection rather than left to `autoPlay`.
 */
function InViewVideo({ src, poster, alt }: { src: string; poster?: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() rejects if the browser declines autoplay; nothing to recover
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="none"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
}

export default function MediaFrame({ media }: { media: SlabMedia }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        background: media.kind === 'pending' ? 'var(--studio-slot)' : 'transparent',
        // A hairline keeps light screenshots from bleeding into the ground
        boxShadow: media.kind === 'pending' ? 'none' : '0 0 0 1px var(--studio-hairline)',
      }}
    >
      {media.kind === 'image' && (
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {media.kind === 'video' && <InViewVideo src={media.src} poster={media.poster} alt={media.alt} />}
    </div>
  )
}
