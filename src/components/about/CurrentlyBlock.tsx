import React, { useEffect, useState } from 'react'
import { MapPin, PenLine, ArrowUpRight, Play, X } from 'lucide-react'
import {
  HOME_CITY,
  LATEST_POST,
  NOW_PLAYING,
  RECENT_READ,
} from '../../constants/currently'

/**
 * The personal half of the About section: what's playing, what she's read, what she's
 * written. Content lives in src/constants/currently.ts so refreshing it is a one-file edit.
 */

const PLAYER_SIZE = 168 // square; the 16:9 player is cropped to its centre
const ART_SIZE = 56

const TILE: React.CSSProperties = {
  borderRadius: '1.25rem',
  background: 'linear-gradient(145deg, rgb(var(--ink) / 0.06), rgb(var(--ink) / 0.02))',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgb(var(--ink) / 0.09)',
  boxShadow: '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 8px 32px rgba(0,0,0,0.3)',
  padding: '1.25rem',
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'left',
}

const SHIMMER: React.CSSProperties = {
  position: 'absolute', top: 0, left: '1rem', right: '1rem', height: '1px',
  background: 'linear-gradient(to right, rgb(var(--ink) / 0), rgb(var(--ink) / 0.12), rgb(var(--ink) / 0))',
}

const OVERLAY: React.CSSProperties = {
  position: 'absolute', inset: 0, borderRadius: '1.25rem',
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  padding: '1.25rem',
  background: 'linear-gradient(145deg, rgba(10,10,12,0.94), rgba(10,10,12,0.90))',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  opacity: 0,
  transition: 'opacity 0.25s ease',
  pointerEvents: 'none',
}

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.6rem',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgb(var(--ink) / 0.35)', margin: '0 0 0.35rem',
}

const TITLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8rem',
  color: 'var(--ink-solid)', margin: '0 0 0.15rem', lineHeight: 1.35,
}

const META: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.7rem',
  color: 'rgb(var(--ink) / 0.45)', margin: 0,
}

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone, hour: '2-digit', minute: '2-digit', hour12: false,
    }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

function ThoughtOverlay({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="currently-overlay" style={OVERLAY}>
      <p style={{ ...EYEBROW, margin: '0 0 0.5rem' }}>{label}</p>
      {children}
    </div>
  )
}

/**
 * Square artwork for a tile: the real image from the source when there is one, and a
 * tinted glyph tile when there isn't (or when the remote image fails to load).
 */
function Thumb({ src, alt, size = 44, tint, children }: {
  src?: string
  alt: string
  size?: number
  /** [from, to, border] rgba strings for the fallback */
  tint: [string, string, string]
  /** Glyph shown when there is no usable image */
  children: React.ReactNode
}) {
  const [failed, setFailed] = useState(false)
  const base: React.CSSProperties = {
    width: size, height: size, flexShrink: 0,
    borderRadius: '0.5rem', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  if (src && !failed) {
    return (
      <div style={{ ...base, border: `1px solid ${tint[2]}`, background: 'rgb(var(--ink) / 0.04)' }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  return (
    <div style={{
      ...base,
      background: `linear-gradient(135deg, ${tint[0]}, ${tint[1]})`,
      border: `1px solid ${tint[2]}`,
    }}>
      {children}
    </div>
  )
}

/** Formats 45 → "0:45" */
function timecode(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function ListeningTile() {
  const [playing, setPlaying] = useState(false)
  const { youtubeId, startAtSeconds = 0 } = NOW_PLAYING

  // Built only when asked for, so YouTube is not contacted on page load
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}`
    + `?start=${startAtSeconds}&autoplay=1&rel=0&controls=0&playsinline=1`
  const artwork = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

  return (
    <div style={{ ...TILE, display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={SHIMMER} />

      {playing ? (
        /* 16:9 player cropped to a square — this is a cover-art video, so the centre is the art */
        <div style={{
          position: 'relative',
          width: PLAYER_SIZE, height: PLAYER_SIZE, flexShrink: 0,
          borderRadius: '0.75rem', overflow: 'hidden',
          border: '1px solid rgb(var(--ink) / 0.12)',
          background: 'rgb(var(--ink) / 0.04)',
        }}>
          <iframe
            src={src}
            title={`${NOW_PLAYING.title} — ${NOW_PLAYING.artist}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute', top: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: (PLAYER_SIZE * 16) / 9, height: PLAYER_SIZE,
              border: 'none', display: 'block',
            }}
          />
          <button
            type="button"
            onClick={() => setPlaying(false)}
            aria-label={`Stop ${NOW_PLAYING.title}`}
            style={{
              position: 'absolute', top: 6, right: 6, zIndex: 2,
              width: 24, height: 24, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '9999px', cursor: 'pointer',
              background: 'rgba(10,10,12,0.72)',
              border: '1px solid rgb(var(--ink) / 0.18)',
              color: 'rgb(var(--ink) / 0.85)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <X style={{ width: 13, height: 13, strokeWidth: 2 }} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${NOW_PLAYING.title} from ${timecode(startAtSeconds)}`}
          className="btn-press"
          style={{
            position: 'relative', width: ART_SIZE, height: ART_SIZE, flexShrink: 0,
            padding: 0, borderRadius: '0.5rem', overflow: 'hidden', cursor: 'pointer',
            border: '1px solid rgb(var(--ink) / 0.14)',
            background: 'rgb(var(--ink) / 0.04)',
          }}
        >
          <img
            src={artwork}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(6,8,10,0.42)', color: 'rgba(255,255,255,0.95)',
          }}>
            <Play style={{ width: 16, height: 16, strokeWidth: 2, fill: 'currentColor', marginLeft: 2 }} />
          </span>
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...EYEBROW, color: 'rgba(29,185,84,0.8)' }}>
          {playing ? 'Playing' : `On repeat · from ${timecode(startAtSeconds)}`}
        </p>
        <p style={{ ...TITLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {NOW_PLAYING.title}
        </p>
        <p style={{ ...META, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {NOW_PLAYING.artist}
        </p>
      </div>

      {/* Bars only move while something is actually playing */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px', flexShrink: 0 }}>
        {['eq-bar-1', 'eq-bar-2', 'eq-bar-3'].map(cls => (
          <div
            key={cls}
            className={playing ? cls : undefined}
            style={{
              width: 3, height: playing ? undefined : 5, borderRadius: 2,
              background: `rgba(29,185,84,${playing ? 0.8 : 0.35})`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ReadingTile() {
  const inner = (
    <>
      <div style={SHIMMER} />
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
        <Thumb
          src={RECENT_READ.iconUrl}
          alt=""
          tint={['rgba(180,140,100,0.3)', 'rgba(120,80,60,0.2)', 'rgb(var(--ink) / 0.12)']}
        >
          <span style={{ fontSize: '1rem' }}>📖</span>
        </Thumb>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={EYEBROW}>Reading</p>
          <p style={TITLE}>{RECENT_READ.title}</p>
          <p style={{ ...META, lineHeight: 1.4 }}>{RECENT_READ.source}</p>
        </div>
        {RECENT_READ.href && (
          <ArrowUpRight style={{ width: 14, height: 14, color: 'rgb(var(--ink) / 0.35)', flexShrink: 0 }} />
        )}
      </div>
      <ThoughtOverlay label="💭 my take">
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.75rem',
          color: 'rgb(var(--ink) / 0.75)', margin: 0, lineHeight: 1.55,
        }}>
          {RECENT_READ.take}
        </p>
      </ThoughtOverlay>
    </>
  )

  return RECENT_READ.href ? (
    <a
      className="currently-card"
      href={RECENT_READ.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...TILE, display: 'block', textDecoration: 'none' }}
    >
      {inner}
    </a>
  ) : (
    <div className="currently-card" style={TILE}>{inner}</div>
  )
}

export default function CurrentlyBlock() {
  const time = useLocalTime(HOME_CITY.timeZone)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '640px' }}>

      {/* Listening — click to play the track inline, from the timestamp that matters */}
      <ListeningTile />

      <div className="currently-grid-top" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '0.75rem' }}>
        <ReadingTile />

        {/* Location & time */}
        <div style={{ ...TILE, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={SHIMMER} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin style={{ width: 12, height: 12, color: 'rgb(var(--ink) / 0.35)', flexShrink: 0 }} />
            <p style={{ ...META, letterSpacing: '0.04em' }}>{HOME_CITY.label}</p>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.4rem',
            color: 'var(--ink-solid)', margin: '0.5rem 0 0', letterSpacing: '-0.02em',
          }}>
            {time}
          </p>
        </div>
      </div>

      {/* Writing — latest Substack post */}
      <a
        href={LATEST_POST.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-press"
        style={{ ...TILE, display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}
      >
        <div style={SHIMMER} />
        <Thumb
          src={LATEST_POST.iconUrl}
          alt=""
          tint={['rgba(255,138,60,0.22)', 'rgba(255,138,60,0.06)', 'rgba(255,138,60,0.22)']}
        >
          <PenLine style={{ width: 16, height: 16, color: 'rgba(255,180,130,0.9)' }} />
        </Thumb>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...EYEBROW, color: 'rgba(255,180,130,0.7)' }}>Last thing I wrote</p>
          <p style={TITLE}>{LATEST_POST.title}</p>
          <p style={META}>{LATEST_POST.date} · Substack</p>
        </div>
        <ArrowUpRight style={{ width: 16, height: 16, color: 'rgb(var(--ink) / 0.4)', flexShrink: 0 }} />
      </a>
    </div>
  )
}
