import { motion } from 'framer-motion'
import { useTheme } from '../theme/useTheme'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Tool {
  name: string
  slug: string
  ext?: 'svg' | 'png' | 'jpg' | 'avif' | 'webp'  // defaults to 'svg'
  /** Single-colour black SVG — inverted on the dark theme so it stays visible */
  monoSvg?: boolean
  /**
   * Multiplier on the rendered glyph. Some logos ship with generous padding baked
   * into the file, so at a shared box size they read smaller than the rest —
   * this scales the mark rather than the box, keeping the grid even.
   */
  scale?: number
  category: 'ai' | 'design' | 'productivity' | 'dev'
}

/**
 * Rendered in array order — the grid is a flat map, so this list IS the layout.
 * `category` is metadata for grouping later, not something the grid reads.
 */
const TOOLS: Tool[] = [
  { name: 'Claude',       slug: 'claude',       category: 'ai' },
  // The SVG is a solid-black glyph, which is right on paper and invisible on the
  // dark page — so it gets inverted there rather than swapping in the PNG.
  { name: 'Framer',       slug: 'framer',       monoSvg: true, category: 'design' },
  { name: 'Figma',        slug: 'figma',        category: 'design' },
  { name: 'Cursor',       slug: 'cursor',       ext: 'png', category: 'dev' },
  { name: 'Notion',       slug: 'notion',       ext: 'png', category: 'productivity' },
  { name: 'Linear',       slug: 'linear',       ext: 'png', category: 'productivity' },
  { name: 'Loom',         slug: 'loom',         ext: 'png', category: 'productivity' },
  { name: 'Perplexity',   slug: 'perplexity',   ext: 'png', category: 'ai' },
  { name: 'GitHub',       slug: 'github',       category: 'dev' },
  { name: 'React',        slug: 'react',        ext: 'png', scale: 1.25, category: 'dev' },
  { name: 'PostHog',      slug: 'posthog',      ext: 'png', category: 'dev' },
  // Tail end — the craft tools close the grid
  { name: 'Rive',         slug: 'rive',         ext: 'avif', category: 'design' },
  { name: 'Adobe Creative Suite', slug: 'adobe', ext: 'webp', scale: 1.25, category: 'design' },
]

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const { resolved } = useTheme()
  const isLight = resolved === 'light'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      whileHover={{ y: -3, scale: 1.04 }}
      style={{
        width: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'default',
      }}
    >
      {/* Square card with logo slot */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          background: 'var(--fill-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgb(var(--ink) / 0.10)',
          boxShadow: '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 8px 24px rgb(var(--shadow-ink) / calc(0.4 * var(--shadow-strength)))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Top shimmer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8px',
            right: '8px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgb(var(--ink) / 0.14), transparent)',
          }}
        />
        <img
          src={`/logos/${tool.slug}.${tool.ext ?? 'svg'}`}
          alt={tool.name}
          width={36}
          height={36}
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
            // If the logo file doesn't exist yet, this becomes invisible — placeholder is the card bg
            imageRendering: 'auto',
            // Black glyphs read on paper and vanish on the dark page
            filter: tool.monoSvg && !isLight ? 'invert(1)' : undefined,
            // Evens out marks that ship with padding baked in
            transform: tool.scale ? `scale(${tool.scale})` : undefined,
          }}
          onError={(e) => {
            // Hide broken img icon if file not yet added
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      {/* Tool name */}
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '0.7rem',
          color: 'var(--text-2)',
          letterSpacing: '0.01em',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {tool.name}
      </span>
    </motion.div>
  )
}

export default function StackSection() {
  return (
    <section
      id="stack"
      style={{
        background: 'rgb(var(--surface))',
        paddingTop: '7rem',
        paddingBottom: '9rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              color: 'var(--ink-solid)',
              margin: '0 0 1rem',
              fontWeight: 400,
            }}
          >
            My stack.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              color: 'var(--text-2)',
              fontSize: '1rem',
              maxWidth: '34rem',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Tools I think with and use to power my everyday.
          </p>
        </motion.div>

        {/* 4-column grid (was 5-4-4 rows; flex-wrap collapsed to 1 row on wide viewports) */}
        <div className="stack-grid">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} delay={i * 0.03} />
          ))}
        </div>

      </div>
    </section>
  )
}
