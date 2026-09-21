import { useEffect, useReducer, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BentoTile from './BentoTile'
import useFinePointer from './useFinePointer'
import { PHOTOGRAPHY_LANDSCAPE, PHOTOGRAPHY_PORTRAIT } from '../../../constants/media'
import { EMAIL_ADDRESS, HERO_BODY, HERO_HEADLINE, PROJECTS } from './data'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Kept in sync with --duration-layout and --duration-base. */
const LAYOUT_TRANSITION = { duration: 0.26, ease: EASE_OUT }

const meta: CSSProperties = { fontSize: 14, color: 'var(--color-muted)' }
const big: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(26px, 2.6vw, 36px)',
  lineHeight: 1.05,
}

/* ── Personal tiles ───────────────────────────────────────────────────────── */

/**
 * The bento board's opening statement.
 *
 * This tile carries the claim and the subline that the Pocket stack puts in a
 * hero, so the bento has no separate hero above it — the board starts the page.
 * The tile's old paragraph is gone rather than kept alongside: it said the same
 * thing more weakly, and in the words ("data-heavy") the headline just dropped.
 */
function IntroTile() {
  return (
    <div className="bento-tile">
      <span style={meta}>Hi, I&rsquo;m Tulika</span>

      {/* The page's h1. With no hero above the board, the claim has to be a
          real heading or the bento view has none at all */}
      <h1
        style={{
          margin: '4px 0 0',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(22px, 2.2vw, 30px)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {HERO_HEADLINE}
      </h1>

      <p
        style={{
          margin: 'auto 0 0',
          paddingTop: 14,
          color: 'var(--color-muted)',
          maxWidth: '52ch',
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        {HERO_BODY}
      </p>
    </div>
  )
}

function ClockTile() {
  const [time, setTime] = useState(() => londonTime())

  useEffect(() => {
    const id = setInterval(() => setTime(londonTime()), 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bento-tile">
      <span style={meta}>Time in London</span>
      <span
        style={{
          marginTop: 'auto',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 4.6vw, 64px)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {time}
      </span>
    </div>
  )
}

function londonTime() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(new Date())
}

function EmailTile() {
  return (
    <a href={`mailto:${EMAIL_ADDRESS}`} className="bento-tile bento-email">
      <span style={meta}>Say hello</span>
      <span style={{ ...big, marginTop: 'auto' }} className="bento-email-big">
        Email me
      </span>
      <span style={meta}>{EMAIL_ADDRESS}</span>
    </a>
  )
}

const EQ = [0.55, 0.9, 0.4, 0.75, 0.6, 0.95, 0.35]

function PlaylistTile() {
  return (
    <div className="bento-tile">
      <span style={meta}>On repeat</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2vw, 28px)', lineHeight: 1.1 }}>
        Songs for waiting on platforms
      </span>
      <span style={meta}>24 tracks, 1 hr 31 min</span>

      <div
        className="eq"
        aria-hidden="true"
        style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: 5, height: 56 }}
      >
        {EQ.map((height, i) => (
          <span
            key={i}
            className="eq-bar"
            style={{
              height: '100%',
              transform: `scaleY(${height})`,
              ['--eq-alt' as string]: `${(1.05 - height * 0.6).toFixed(2)}`,
              animationDelay: `${i * -130}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/** How long each page holds before the next turns over. */
const PHOTO_INTERVAL = 3500

/**
 * Pages alternate: one portrait on its own, then two landscapes together.
 *
 * A portrait alone gets the whole tall frame, which is close to its own shape,
 * so it is shown nearly whole. Two landscapes halve that frame into two wide
 * bands, which is close to theirs. Mixing all three in one page gave every
 * picture a slot shaped for something else.
 *
 * Even steps are portrait, odd are a landscape pair, and the pair advances two
 * at a time — so the count covers every portrait once before repeating.
 */
const PHOTO_STEPS =
  2 * Math.max(PHOTOGRAPHY_PORTRAIT.length, Math.ceil(PHOTOGRAPHY_LANDSCAPE.length / 2))

function pageSources(step: number): string[] {
  const pair = Math.floor(step / 2)

  if (step % 2 === 0) {
    return [PHOTOGRAPHY_PORTRAIT[pair % PHOTOGRAPHY_PORTRAIT.length]]
  }

  const first = (pair * 2) % PHOTOGRAPHY_LANDSCAPE.length
  return [
    PHOTOGRAPHY_LANDSCAPE[first],
    PHOTOGRAPHY_LANDSCAPE[(first + 1) % PHOTOGRAPHY_LANDSCAPE.length],
  ]
}

/**
 * One page of the tile.
 *
 * The page that is leaving is rendered on top of the one arriving and lifts off
 * its spine, so the new page is already lying underneath as the old one swings
 * away — which is what makes it read as a page rather than a crossfade.
 */
function PhotoPage({
  step,
  turning,
  onTurned,
}: {
  step: number
  turning?: 'next' | 'prev'
  onTurned?: () => void
}) {
  const sources = pageSources(step)

  return (
    <span
      className="photo-page"
      data-mode={step % 2 === 0 ? 'portrait' : 'landscape'}
      data-turning={turning}
      onAnimationEnd={onTurned}
    >
      {sources.map((src) => (
        <span className="photo-slot" key={src}>
          {/* Decorative; the tile's label carries the meaning */}
          <img src={src} alt="" className="photo-frame" loading="eager" decoding="async" />
        </span>
      ))}
    </span>
  )
}

/**
 * Turning is a reducer, not three pieces of state.
 *
 * Which page is leaving is always the one that was showing, so it has to be
 * derived from the previous state rather than read from a render closure —
 * clicking the arrow twice quickly was otherwise two clicks that both saw the
 * same step and between them moved one page.
 */
type PageState = { step: number; leaving: number | null; direction: 'next' | 'prev' }
type PageAction = { type: 'step'; delta: 1 | -1 } | { type: 'settled' }

function turnPage(state: PageState, action: PageAction): PageState {
  if (action.type === 'settled') return { ...state, leaving: null }

  return {
    step: (state.step + action.delta + PHOTO_STEPS) % PHOTO_STEPS,
    leaving: state.step,
    direction: action.delta === 1 ? 'next' : 'prev',
  }
}

function PhotoTile() {
  const reduceMotion = useReducedMotion()
  const [{ step, leaving, direction }, dispatch] = useReducer(turnPage, {
    step: 0,
    leaving: null,
    direction: 'next',
  })
  /**
   * Only focus holds the sequence, not hover.
   *
   * Pausing on hover meant that resting the pointer on the tile to look at the
   * photographs stopped them changing, which reads as broken rather than
   * considerate. Keyboard users still need it to hold while they tab through
   * the arrows.
   */
  const [held, setHeld] = useState(false)

  const go = (delta: 1 | -1) => dispatch({ type: 'step', delta })

  // `step` is a dependency on purpose: stepping by hand restarts the wait,
  // rather than the next tick arriving immediately after a click
  useEffect(() => {
    if (reduceMotion || held) return

    const id = setInterval(() => {
      // A background tab would otherwise keep pulling photographs nobody sees
      if (document.hidden) return
      dispatch({ type: 'step', delta: 1 })
    }, PHOTO_INTERVAL)

    return () => clearInterval(id)
  }, [reduceMotion, held, step])

  /**
   * Fetch the next page before it is needed, or the turn would uncover an
   * image that has not arrived.
   */
  useEffect(() => {
    pageSources((step + 1) % PHOTO_STEPS).forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [step])

  return (
    <div className="bento-tile">
      <span style={meta}>Ordinary places</span>

      <span
        className="photo-stack"
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        <PhotoPage key={step} step={step} />

        {/*
          Kept mounted only until it has finished turning away. Not rendered at
          all under reduced motion, where there is no animation to end and so
          nothing would ever tell it to go.
        */}
        {!reduceMotion && leaving !== null && leaving !== step && (
          <PhotoPage
            key={`leaving-${leaving}`}
            step={leaving}
            turning={direction}
            onTurned={() => dispatch({ type: 'settled' })}
          />
        )}

        <button
          type="button"
          className="photo-arrow photo-arrow--prev"
          aria-label="Previous photographs"
          onClick={() => go(-1)}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="photo-arrow photo-arrow--next"
          aria-label="Next photographs"
          onClick={() => go(1)}
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </span>
    </div>
  )
}

function OffScreenTile() {
  return (
    <div className="bento-tile">
      <span style={meta}>Off-screen</span>
      <span style={{ ...big, marginTop: 'auto', maxWidth: '28ch' }}>
        Museums and buildings are my fieldwork: how space guides people without a single instruction.
      </span>
    </div>
  )
}

/* ── The board ────────────────────────────────────────────────────────────── */

type Category = 'work' | 'about'
type Filter = 'all' | Category

interface Cell {
  id: string
  category: Category
  /**
   * Span class rather than an inline style, so the spans can shrink at the
   * 2-column breakpoint and disappear at 1 column. Inline styles could not be
   * overridden by a media query, which is how a `span 2` used to survive down
   * to a single-column grid and push the page sideways.
   */
  span: string
  /**
   * Shape in this tile's own filtered view.
   *
   * The spans that tile cleanly with all ten present leave holes once a filter
   * removes half of them — one empty cell under Work, three under About — so
   * the tiles that would border a gap grow to close it.
   */
  spanFiltered: string
  node: ReactNode
}

const W1 = ''
const W2 = 'bento-w2'
const W4 = 'bento-w4'
const W2H2 = 'bento-w2h2'

/**
 * Tile order and spans at the 4-column breakpoint.
 *
 * All:                        Work:              About:
 *   Intro(2×2)   Clock(2)       DoorFeed(2×2)      Intro(2×2)  Clock(2)
 *   ↑            Email(2)       SigTech(2×2)       ↑           Email(2)
 *   DoorFeed(2×2) SigTech(2×2)  Deloitte(2×2)      Photo(2×2)  Playlist(2)
 *   Photo(2×2)    Deloitte(2)   Brushh(2×2)        ↑           Off-screen(2)
 *   ↑         Playlist Brushh
 *   Off-screen(4)
 *
 * Intro holds the headline and subline, so it needs two rows; Clock and Email
 * widen to two columns alongside it, which is what keeps every view packing
 * without holes (checked against a dense-packing simulation).
 *
 * Photo takes two columns because the photographs are landscape and were being
 * squeezed into a portrait slot. Playlist drops to a single cell and sits in
 * the same row as Brushh, so the two match — a row is only as tall as the
 * tallest tile in it, which is why the playlist looked oversized while it
 * shared a row with a 2×2 project tile.
 */
function useCells(): Cell[] {
  const [doorfeed, sigtech, deloitte, brushh] = PROJECTS

  return [
    { id: 'intro', category: 'about', span: W2H2, spanFiltered: W2H2, node: <IntroTile /> },
    { id: 'clock', category: 'about', span: W2, spanFiltered: W2, node: <ClockTile /> },
    { id: 'email', category: 'about', span: W2, spanFiltered: W2, node: <EmailTile /> },
    { id: 'doorfeed', category: 'work', span: W2H2, spanFiltered: W2H2, node: <BentoTile project={doorfeed} eager /> },
    { id: 'sigtech', category: 'work', span: W2H2, spanFiltered: W2H2, node: <BentoTile project={sigtech} /> },
    { id: 'photo', category: 'about', span: W2H2, spanFiltered: W2H2, node: <PhotoTile /> },
    { id: 'deloitte', category: 'work', span: W2, spanFiltered: W2H2, node: <BentoTile project={deloitte} /> },
    { id: 'playlist', category: 'about', span: W1, spanFiltered: W2, node: <PlaylistTile /> },
    { id: 'brushh', category: 'work', span: W1, spanFiltered: W2H2, node: <BentoTile project={brushh} /> },
    { id: 'offscreen', category: 'about', span: W4, spanFiltered: W2, node: <OffScreenTile /> },
  ]
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'about', label: 'About' },
]

export function BentoFilter({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  return (
    <div className="bento-filter" role="group" aria-label="Filter tiles">
      {FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** Minimum gap between swaps, so a tile straddling a border cannot oscillate. */
const SWAP_COOLDOWN = 140

export default function BentoBoard({ filter }: { filter: Filter }) {
  const cells = useCells()
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const visible = cells.filter((cell) => filter === 'all' || cell.category === filter)

  /**
   * Which tile sits in which slot.
   *
   * The spans belong to the slot, not the tile, so dragging swaps only the
   * contents of two positions and the grid itself never changes shape. Swapping
   * the tiles' own spans instead would let a 2×2 trade places with a 1×1 and
   * tear a hole in the layout.
   *
   * Stored with the filter it was arranged under rather than reset in an
   * effect, so switching views falls back to the default order on its own.
   */
  const [arrangement, setArrangement] = useState<{ filter: Filter; ids: string[] } | null>(null)
  const order = arrangement?.filter === filter ? arrangement.ids : visible.map((c) => c.id)

  const lastSwap = useRef(0)
  const dragged = useRef(0)

  /** `now` comes from the event, not the clock — a render-scope Date.now() is impure. */
  const swap = (a: string, b: string, now: number) => {
    if (now - lastSwap.current < SWAP_COOLDOWN) return
    lastSwap.current = now

    const next = [...order]
    const i = next.indexOf(a)
    const j = next.indexOf(b)
    if (i < 0 || j < 0) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setArrangement({ filter, ids: next })
  }

  return (
    <div className="studio-alt-container">
      <LayoutGroup>
        <div className="bento-grid">
          <AnimatePresence initial={false}>
            {order.map((id, slot) => {
              const cell = visible.find((c) => c.id === id)
              if (!cell) return null
              // The span comes from the slot, so the grid holds its shape
              const slotCell = visible[slot]
              const span = filter === 'all' ? slotCell.span : slotCell.spanFiltered

              return (
              <motion.div
                key={cell.id}
                data-tile={cell.id}
                layout={reduceMotion ? false : true}
                drag={finePointer}
                dragSnapToOrigin
                dragElastic={0.16}
                dragMomentum={false}
                whileDrag={{ scale: 1.03, zIndex: 20, cursor: 'grabbing' }}
                onDragStart={() => {
                  dragged.current = 0
                }}
                onDrag={(event, info) => {
                  dragged.current = Math.hypot(info.offset.x, info.offset.y)
                  const native = event as PointerEvent
                  const under = document
                    .elementFromPoint(native.clientX, native.clientY)
                    ?.closest('[data-tile]')
                  const overId = under?.getAttribute('data-tile')
                  if (overId && overId !== cell.id) swap(cell.id, overId, native.timeStamp)
                }}
                // A tile that was dragged must not also follow its link
                onClickCapture={(event) => {
                  if (dragged.current > 5) {
                    event.preventDefault()
                    event.stopPropagation()
                  }
                }}
                // Exit is instant: a tile leaving should get out of the way at once
                initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { ...LAYOUT_TRANSITION, duration: 0.22 }}
                className={span}
                style={{ display: 'flex', minWidth: 0, cursor: finePointer ? 'grab' : undefined }}
              >
                {cell.node}
              </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  )
}

export type { Filter }
