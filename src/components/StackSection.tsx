import { motion } from 'framer-motion'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Tool {
  name: string
  // logo file: place your 16×16 asset at /public/logos/<slug>.svg (or .png)
  slug: string
  category: 'ai' | 'design' | 'productivity' | 'dev'
}

const TOOLS: Tool[] = [
  // AI
  { name: 'Claude',       slug: 'claude',       category: 'ai' },
  { name: 'ChatGPT',      slug: 'chatgpt',      category: 'ai' },
  { name: 'Midjourney',   slug: 'midjourney',   category: 'ai' },
  { name: 'Runway',       slug: 'runway',       category: 'ai' },
  { name: 'Perplexity',   slug: 'perplexity',   category: 'ai' },
  { name: 'ElevenLabs',   slug: 'elevenlabs',   category: 'ai' },
  // Design
  { name: 'Figma',        slug: 'figma',        category: 'design' },
  { name: 'Framer',       slug: 'framer',       category: 'design' },
  { name: 'Principle',    slug: 'principle',    category: 'design' },
  { name: 'Spline',       slug: 'spline',       category: 'design' },
  { name: 'Maze',         slug: 'maze',         category: 'design' },
  // Productivity
  { name: 'Notion',       slug: 'notion',       category: 'productivity' },
  { name: 'Linear',       slug: 'linear',       category: 'productivity' },
  { name: 'Loom',         slug: 'loom',         category: 'productivity' },
  { name: 'Miro',         slug: 'miro',         category: 'productivity' },
  // Dev / other
  { name: 'Cursor',       slug: 'cursor',       category: 'dev' },
  { name: 'GitHub',       slug: 'github',       category: 'dev' },
  { name: 'Vercel',       slug: 'vercel',       category: 'dev' },
  { name: 'VS Code',      slug: 'vscode',       category: 'dev' },
]

const CATEGORY_LABEL: Record<Tool['category'], string> = {
  ai: 'AI & Generation',
  design: 'Design',
  productivity: 'Productivity',
  dev: 'Dev & Deploy',
}

const CATEGORY_ORDER: Tool['category'][] = ['ai', 'design', 'productivity', 'dev']

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
        {/* 16×16 logo — add your asset to /public/logos/<slug>.svg */}
        <img
          src={`/logos/${tool.slug}.svg`}
          alt={tool.name}
          width={16}
          height={16}
          style={{
            width: '16px',
            height: '16px',
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
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    label: CATEGORY_LABEL[cat],
    tools: TOOLS.filter(t => t.category === cat),
  }))

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
            Tools I think with.
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
            The stack that powers my day — design, AI, and the spaces in between.
          </p>
        </motion.div>

        {/* Category groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {grouped.map(({ cat, label, tools }, gi) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: gi * 0.08, ease: EASE_OUT }}
            >
              {/* Category label */}
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.28)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                {label}
              </p>

              {/* Tool cards grid */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '0.875rem',
                }}
              >
                {tools.map((tool, ti) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    delay={gi * 0.06 + ti * 0.03}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logo hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.18)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginTop: '3rem',
          }}
        >
          Add 16×16 logo assets to /public/logos/&lt;name&gt;.svg
        </motion.p>
      </div>
    </section>
  )
}
