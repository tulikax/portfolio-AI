import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import BentoTile from './BentoTile'
import { EMAIL_ADDRESS, PROJECTS } from './data'

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

function IntroTile() {
  return (
    <div className="bento-tile">
      <span style={big}>Hi, I&rsquo;m Tulika.</span>
      <p style={{ margin: '6px 0 0', color: 'var(--color-muted)', maxWidth: '44ch', lineHeight: 1.5 }}>
        I work on data-heavy products, from property maps to finance analytics, and I like making
        complicated systems feel simple to use.
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

function PhotoTile() {
  return (
    <div className="bento-tile">
      <span style={meta}>Photos of ordinary places</span>
      {/* ⚠️ Tulika: drop a real image in here — /about/photo-1.webp does not exist yet */}
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          minHeight: 180,
          marginBlock: 6,
          borderRadius: 'var(--radius-inner)',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-line)',
        }}
      />
      <span style={meta}>Stairwells, laundromats, car parks</span>
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
  /** Grid spans at the 4-column breakpoint. */
  span: CSSProperties
  node: ReactNode
}

const SPAN_2 = { gridColumn: 'span 2' } as CSSProperties
const SPAN_2x2 = { gridColumn: 'span 2', gridRow: 'span 2' } as CSSProperties
const SPAN_1x2 = { gridRow: 'span 2' } as CSSProperties

function useCells(): Cell[] {
  const [doorfeed, sigtech, deloitte, brushh] = PROJECTS

  return [
    { id: 'intro', category: 'about', span: SPAN_2, node: <IntroTile /> },
    { id: 'clock', category: 'about', span: {}, node: <ClockTile /> },
    { id: 'email', category: 'about', span: {}, node: <EmailTile /> },
    { id: 'doorfeed', category: 'work', span: SPAN_2x2, node: <BentoTile project={doorfeed} eager /> },
    { id: 'sigtech', category: 'work', span: SPAN_2x2, node: <BentoTile project={sigtech} /> },
    { id: 'playlist', category: 'about', span: {}, node: <PlaylistTile /> },
    { id: 'photo', category: 'about', span: SPAN_1x2, node: <PhotoTile /> },
    { id: 'deloitte', category: 'work', span: SPAN_2, node: <BentoTile project={deloitte} /> },
    { id: 'brushh', category: 'work', span: {}, node: <BentoTile project={brushh} /> },
    { id: 'offscreen', category: 'about', span: SPAN_2, node: <OffScreenTile /> },
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

export default function BentoBoard({ filter }: { filter: Filter }) {
  const cells = useCells()
  const reduceMotion = useReducedMotion()
  const visible = cells.filter((cell) => filter === 'all' || cell.category === filter)

  return (
    <div className="studio-alt-container">
      <LayoutGroup>
        <div className="bento-grid">
          <AnimatePresence initial={false}>
            {visible.map((cell) => (
              <motion.div
                key={cell.id}
                layout={reduceMotion ? false : true}
                // Exit is instant: a tile leaving should get out of the way at once
                initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { ...LAYOUT_TRANSITION, duration: 0.22 }}
                style={{ ...cell.span, display: 'flex', minWidth: 0 }}
              >
                {cell.node}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  )
}

export type { Filter }
