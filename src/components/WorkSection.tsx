import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Drawer } from 'vaul'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Role {
  number: string
  title: string
  company: string
  duration: string
  drewMeIn: string
  thrived: string
  carried: string
  skills: string[]
  expandedContent: string
}

const ROLES: Role[] = [
  {
    number: '01',
    title: '[Role Title]',
    company: '[Company Name]',
    duration: '[Month Year] – [Month Year] · [Full-time / Contract / Freelance]',
    drewMeIn:
      '[What attracted you to this role — the problem space, the challenge, the team, the mission. What made you say yes?]',
    thrived:
      '[What you enjoyed solving, where your strengths showed up, the problems you loved working on, what gave you energy.]',
    carried:
      '[Key learnings, skills sharpened, perspectives shifted, habits formed, things you\'d do differently next time.]',
    skills: ['Research', 'Strategy', 'Prototyping', 'Systems Design'],
    expandedContent:
      '[Extended narrative about this role — the full story. What was the context when you joined? What changed? What did you ship? What are you most proud of? Tell the real, textured version here. This is your space to go deep.]',
  },
  {
    number: '02',
    title: '[Role Title]',
    company: '[Company Name]',
    duration: '[Month Year] – [Month Year] · [Full-time / Contract / Freelance]',
    drewMeIn:
      '[What attracted you to this role — the problem space, the challenge, the team, the mission. What made you say yes?]',
    thrived:
      '[What you enjoyed solving, where your strengths showed up, the problems you loved working on, what gave you energy.]',
    carried:
      '[Key learnings, skills sharpened, perspectives shifted, habits formed, things you\'d do differently next time.]',
    skills: ['UX Research', 'Interaction Design', 'AI Workflows', 'Figma'],
    expandedContent:
      '[Extended narrative about this role — the full story. What was the context when you joined? What changed? What did you ship? What are you most proud of? Tell the real, textured version here. This is your space to go deep.]',
  },
  {
    number: '03',
    title: '[Role Title]',
    company: '[Company Name]',
    duration: '[Month Year] – [Month Year] · [Full-time / Contract / Freelance]',
    drewMeIn:
      '[What attracted you to this role — the problem space, the challenge, the team, the mission. What made you say yes?]',
    thrived:
      '[What you enjoyed solving, where your strengths showed up, the problems you loved working on, what gave you energy.]',
    carried:
      '[Key learnings, skills sharpened, perspectives shifted, habits formed, things you\'d do differently next time.]',
    skills: ['Product Thinking', 'Design Systems', 'Stakeholder Alignment', 'User Testing'],
    expandedContent:
      '[Extended narrative about this role — the full story. What was the context when you joined? What changed? What did you ship? What are you most proud of? Tell the real, textured version here. This is your space to go deep.]',
  },
]

// 3 placeholder screenshot cards per role — positioned for right or left side
const POPUP_CARDS_RIGHT = [
  { w: 200, h: 130, rotate: -3, x: 10,  y: 20,  delay: 0 },
  { w: 180, h: 120, rotate: 2,  x: 30,  y: 160, delay: 0.06 },
  { w: 170, h: 110, rotate: 5,  x: 15,  y: 295, delay: 0.12 },
]
const POPUP_CARDS_LEFT = [
  { w: 200, h: 130, rotate: 3,  x: 10,  y: 20,  delay: 0 },
  { w: 180, h: 120, rotate: -2, x: 30,  y: 160, delay: 0.06 },
  { w: 170, h: 110, rotate: -4, x: 20,  y: 295, delay: 0.12 },
]

function HoverPopup({ visible, side }: { visible: boolean; side: 'left' | 'right' }) {
  const cards = side === 'right' ? POPUP_CARDS_RIGHT : POPUP_CARDS_LEFT

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="hover-popup-container"
          style={{
            position: 'absolute',
            top: '0',
            ...(side === 'right'
              ? { left: 'calc(100% + 16px)' }
              : { right: 'calc(100% + 16px)' }),
            zIndex: 50,
            pointerEvents: 'none',
            width: '230px',
            height: '420px',
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: side === 'right' ? -16 : 16, scale: 0.88, rotate: card.rotate }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: card.rotate }}
              exit={{ opacity: 0, x: side === 'right' ? -10 : 10, scale: 0.92 }}
              transition={{ duration: 0.28, delay: card.delay, ease: EASE_OUT }}
              style={{
                position: 'absolute',
                left: card.x,
                top: card.y,
                width: card.w,
                height: card.h,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(80,80,80,0.95), rgba(50,50,50,0.95))',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.08) inset',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden',
              }}
            >
              {/* Placeholder shimmer bar at top */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '12px',
                  right: '12px',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
                }}
              />
              {/* Placeholder content lines */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.10)', width: '60%' }} />
                <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', width: '80%' }} />
                <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', width: '45%' }} />
                <div style={{ height: '40px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginTop: '4px' }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_OUT }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
        style={{
          borderRadius: '1.5rem',
          padding: '1.75rem',
          position: 'relative',
          overflow: 'visible',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
          cursor: 'default',
          transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Hover popup — floats to the side of card (right for 1st/3rd, left for 2nd) */}
        <HoverPopup visible={hovered} side={index % 2 === 0 ? 'right' : 'left'} />

        {/* Inner clip for card chrome (shimmer etc.) */}
        <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden' }}>
          {/* Shimmer line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '1.5rem',
              right: '1.5rem',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Number */}
        <span
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.75rem',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.20)',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          {role.number}
        </span>

        {/* Role title + company */}
        <div style={{ marginBottom: '0.25rem' }}>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              color: 'white',
              fontSize: '1.125rem',
            }}
          >
            {role.title}
          </span>
          {' '}
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1.125rem',
            }}
          >
            @ {role.company}
          </span>
        </div>

        {/* Duration */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          {role.duration}
        </p>

        {/* Subsections */}
        {[
          { label: 'What drew me in', content: role.drewMeIn },
          { label: 'Where I thrived', content: role.thrived },
          { label: 'What I carried forward', content: role.carried },
        ].map((sub, i) => (
          <div
            key={sub.label}
            style={{
              paddingBottom: i < 2 ? '1rem' : 0,
              marginBottom: i < 2 ? '1rem' : 0,
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                color: 'rgba(255,255,255,0.40)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              {sub.label}
            </p>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
              }}
            >
              {sub.content}
            </p>
          </div>
        ))}

        {/* Skills + Read more */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.30)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {role.skills.join(' · ')}
          </p>

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
            Read more ↗
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
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '0.375rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.20)',
                  margin: '0 auto 1.5rem',
                }}
              />

              <div style={{ marginBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: '1.75rem',
                    color: 'white',
                    margin: '0 0 0.25rem',
                    fontWeight: 400,
                  }}
                >
                  {role.title} @ {role.company}
                </h3>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {role.duration}
                </p>
              </div>

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.70)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                }}
              >
                {role.expandedContent}
              </p>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}

export default function WorkSection() {
  return (
    <section
      id="work"
      style={{
        background: 'black',
        paddingTop: '5rem',
        paddingBottom: '10rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            margin: '0',
            fontWeight: 400,
          }}
        >
          Things I've done.
        </motion.h2>
      </div>

      {/* Role cards */}
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {ROLES.map((role, i) => (
          <RoleCard key={role.number} role={role} index={i} />
        ))}
      </div>
    </section>
  )
}
