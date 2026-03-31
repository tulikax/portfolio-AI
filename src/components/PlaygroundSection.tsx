import { useState } from 'react'
import { motion } from 'framer-motion'
import { Drawer } from 'vaul'
import { Sparkles } from 'lucide-react'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Project {
  title: string
  description: string
  tags: string[]
  expandedContent: string
}

const PROJECTS: Project[] = [
  {
    title: '[Project Name]',
    description: '[A short, punchy description of this experiment — what it does, what makes it interesting.]',
    tags: ['Interactive', 'Motion', 'Experiment'],
    expandedContent:
      '[Full description of this project — what inspired it, how it works, what you learned building it. Include any link to try it live, or describe what the interaction is.]',
  },
  {
    title: '[Project Name]',
    description: '[A short, punchy description of this experiment — what it does, what makes it interesting.]',
    tags: ['Tool', 'AI', 'Side Project'],
    expandedContent:
      '[Full description of this project — what inspired it, how it works, what you learned building it. Include any link to try it live, or describe what the interaction is.]',
  },
  {
    title: '[Project Name]',
    description: '[A short, punchy description of this experiment — what it does, what makes it interesting.]',
    tags: ['Generative', 'Visual', 'Canvas'],
    expandedContent:
      '[Full description of this project — what inspired it, how it works, what you learned building it. Include any link to try it live, or describe what the interaction is.]',
  },
  {
    title: '[Project Name]',
    description: '[A short, punchy description of this experiment — what it does, what makes it interesting.]',
    tags: ['Prototype', 'Concept', 'UX'],
    expandedContent:
      '[Full description of this project — what inspired it, how it works, what you learned building it. Include any link to try it live, or describe what the interaction is.]',
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: EASE_OUT }}
        whileHover={{ y: -4, scale: 1.005 }}
        style={{
          borderRadius: '1.5rem',
          padding: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
          cursor: 'default',
          transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Shimmer line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '1.5rem',
            right: '1.5rem',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
          }}
        />

        {/* Interactive preview area (placeholder) */}
        <div
          style={{
            width: '100%',
            height: '140px',
            borderRadius: '0.875rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Sparkles
              style={{
                width: '1.5rem',
                height: '1.5rem',
                color: 'rgba(255,255,255,0.20)',
                margin: '0 auto 0.5rem',
                display: 'block',
              }}
            />
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: 'rgba(255,255,255,0.20)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Interactive embed
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            color: 'white',
            fontSize: '1rem',
            margin: '0 0 0.5rem',
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.60)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            margin: '0 0 1rem',
          }}
        >
          {project.description}
        </p>

        {/* Tags + Try it */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.30)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.75rem',
              padding: 0,
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'
            }}
          >
            Try it ↗
          </button>
        </div>
      </motion.div>

      {/* Vaul Drawer */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} shouldScaleBackground>
        <Drawer.Portal>
          <Drawer.Overlay
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 200,
            }}
          />
          <Drawer.Content
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 201,
              outline: 'none',
            }}
          >
            <div
              className="liquid-glass-strong"
              style={{
                maxWidth: '42rem',
                margin: '0 auto',
                padding: '2rem',
                borderRadius: '1.5rem 1.5rem 0 0',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              {/* Handle */}
              <div
                style={{
                  width: '3rem',
                  height: '0.375rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.20)',
                  margin: '0 auto 1.5rem',
                }}
              />

              {/* Full-size sandbox embed area */}
              <div
                style={{
                  width: '100%',
                  height: '320px',
                  borderRadius: '0.875rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(255,255,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Sparkles
                    style={{
                      width: '2rem',
                      height: '2rem',
                      color: 'rgba(255,255,255,0.20)',
                      margin: '0 auto 0.75rem',
                      display: 'block',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.25)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Sandbox goes here
                  </p>
                </div>
              </div>

              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  color: 'white',
                  margin: '0 0 0.75rem',
                  fontWeight: 400,
                }}
              >
                {project.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.70)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                }}
              >
                {project.expandedContent}
              </p>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}

export default function PlaygroundSection() {
  return (
    <section
      id="playground"
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '10rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            color: 'white',
            margin: '0 0 1.25rem',
            fontWeight: 400,
          }}
        >
          Side experiments.
          <br />
          Things I made for fun.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.60)',
            fontSize: '1rem',
            maxWidth: '36rem',
            margin: '0 auto',
            lineHeight: 1.65,
          }}
        >
          A sandbox of creative micro-projects — interactive, exploratory, unfinished-on-purpose.
        </motion.p>
      </div>

      {/* Project grid */}
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title + i} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
