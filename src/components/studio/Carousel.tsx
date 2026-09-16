import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import MediaFrame from './MediaFrame'
import Reveal from './Reveal'
import type { StudioSlab } from './content'

/* ── The brick ───────────────────────────────────────────────────────────────
 * A tile is either `small` (half the track height) or `large` (the full
 * height). Small tiles stack two to a column, large tiles take a column each,
 * and every tile's width comes from its own aspect ratio — so varying the
 * ratios in content.ts is what gives the run of tiles its irregular, bricked
 * rhythm. Nothing here crops differently from the full-width slabs.
 */
const ROW = 210
const GAP = 16
/** Fixed band beneath each tile so columns line up whether or not captions run long. */
const CAPTION = 36

const SMALL_MEDIA = ROW
const LARGE_MEDIA = ROW * 2 + GAP + CAPTION
const TRACK_HEIGHT = (ROW + CAPTION) * 2 + GAP

type Column = StudioSlab[]

/**
 * Packs a project's media into columns: a large tile takes a column to itself,
 * small tiles pair up. A small tile left over at the end is promoted to large
 * rather than leaving a visible hole in the brick.
 */
function pack(slabs: StudioSlab[]): Column[] {
  const columns: Column[] = []
  let pendingSmall: StudioSlab | null = null

  /** Flush an unpaired small as its own full-height column. */
  const flush = () => {
    if (!pendingSmall) return
    columns.push([{ ...pendingSmall, size: 'large' }])
    pendingSmall = null
  }

  for (const slab of slabs) {
    if (slab.size === 'large') {
      // Flush first, or a small waiting for a partner would jump behind this
      // large one and the gallery would render out of the author's order
      flush()
      columns.push([slab])
      continue
    }

    if (pendingSmall) {
      columns.push([pendingSmall, slab])
      pendingSmall = null
    } else {
      pendingSmall = slab
    }
  }

  flush()

  return columns
}

function Tile({ slab, large }: { slab: StudioSlab; large: boolean }) {
  const height = large ? LARGE_MEDIA : SMALL_MEDIA
  const ratio = slab.ratio ?? 16 / 10

  return (
    <figure style={{ margin: 0, flexShrink: 0 }}>
      <div style={{ height, width: Math.round(height * ratio) }}>
        <MediaFrame media={slab.media} />
      </div>

      <figcaption
        style={{
          height: CAPTION,
          paddingTop: 10,
          fontSize: '0.75rem',
          lineHeight: 1.35,
          overflow: 'hidden',
          color: slab.media.kind === 'pending' ? 'var(--studio-faint)' : 'var(--studio-muted)',
        }}
      >
        {slab.caption}
      </figcaption>
    </figure>
  )
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Scroll left' : 'Scroll right'}
      className="studio-arrow"
    >
      {direction === 'prev' ? '←' : '→'}
    </button>
  )
}

export default function Carousel({ slabs, header }: { slabs: StudioSlab[]; header: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const columns = pack(slabs)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    // 1px of slack: fractional layout widths never land exactly on the end
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    sync()
    el.addEventListener('scroll', sync, { passive: true })

    const resize = new ResizeObserver(sync)
    resize.observe(el)

    return () => {
      el.removeEventListener('scroll', sync)
      resize.disconnect()
    }
  }, [sync])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({
      left: dir * el.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <Reveal>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          maxWidth: 'var(--studio-slab)',
          margin: '0 auto 20px',
        }}
      >
        {header}

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Arrow direction="prev" disabled={atStart} onClick={() => scrollBy(-1)} />
          <Arrow direction="next" disabled={atEnd} onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div
        ref={trackRef}
        className="studio-track"
        style={{ height: TRACK_HEIGHT }}
        // Scrollable regions need to be reachable and labelled for keyboard users
        tabIndex={0}
        role="group"
        aria-label="Project media, scrolls horizontally"
      >
        {columns.map((column, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: GAP,
              flexShrink: 0,
              scrollSnapAlign: 'start',
            }}
          >
            {column.map((slab, j) => (
              <Tile key={j} slab={slab} large={column.length === 1} />
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  )
}
