import { motion } from 'framer-motion'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Tool {
  name: string
  slug: string
  ext?: 'svg' | 'png' | 'jpg' | 'avif' | 'webp'  // defaults to 'svg'
  category: 'ai' | 'design' | 'productivity' | 'dev'
}

const TOOLS: Tool[] = [
  // AI
  { name: 'Claude',       slug: 'claude',       category: 'ai' },
  { name: 'Perplexity',   slug: 'perplexity',   ext: 'png', category: 'ai' },
  // Design
  { name: 'Figma',        slug: 'figma',        category: 'design' },
  { name: 'Framer',       slug: 'framer',       ext: 'png', category: 'design' },
  { name: 'Rive',         slug: 'rive',         ext: 'avif', category: 'design' },
  { name: 'Adobe',        slug: 'adobe',        ext: 'webp', category: 'design' },
  // Productivity
  { name: 'Notion',       slug: 'notion',       ext: 'png', category: 'productivity' },
  { name: 'Linear',       slug: 'linear',       ext: 'png', category: 'productivity' },
  { name: 'Loom',         slug: 'loom',         ext: 'png', category: 'productivity' },
  // Dev
  { name: 'Cursor',       slug: 'cursor',       ext: 'png', category: 'dev' },
  { name: 'GitHub',       slug: 'github',       category: 'dev' },
  { name: 'React',        slug: 'react',        ext: 'png', category: 'dev' },
  { name: 'PostHog',      slug: 'posthog',      ext: 'png', category: 'dev' },
]

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
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
          background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(0,0,0,0.4)',
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
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)',
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
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.60)',
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
        background: 'black',
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
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              color: 'white',
              margin: '0 0 1rem',
              fontWeight: 400,
            }}
          >
            My stack.
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1rem',
              maxWidth: '34rem',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Tools I think with and use to power my everyday.
          </p>
        </motion.div>

        {/* 5-4-4 grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 80px)', gap: '0.875rem', justifyContent: 'center' }}>
            {TOOLS.slice(0, 5).map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} delay={i * 0.03} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '0.875rem', justifyContent: 'center' }}>
            {TOOLS.slice(5).map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} delay={(i + 5) * 0.03} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
