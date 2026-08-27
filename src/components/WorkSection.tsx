import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

// DoorFeed
import df1 from '../assets/DoorFeed/homepage glow.mov'
import df2 from '../assets/DoorFeed/download from dataroom.mov'
// SigTech
import st1 from '../assets/SigTech/chat-flow.mp4'
import st2 from '../assets/SigTech/agents-in-action.mp4'
// Deloitte
import dl1 from '../assets/Deloitte SS/Deloitte:phone screens.png'
import dl2 from '../assets/Deloitte SS/Deloitte:sketches.png'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// Hover "dramatic focus" tunables
const HOVER_SCALE = 1.05 // whole-card lift; 1 disables
const MEDIA_HOVER_SCALE = 1.43 // extra zoom on the side media frames (multiplies HOVER_SCALE; net ≈ 1.5)
const MEDIA_HOVER_INSET_PX = 25 // slide frames toward the card on hover so growth stays in the viewport
const CARD_REST_MAX_W = 600 // text card width at rest
const CARD_HOVER_MAX_W = 520 // narrower on hover — frames follow the edges in, covering less text
const DIM_OPACITY = 0.45
const DIM_BLUR_PX = 2.5 // 0 = opacity-only dim
const FOCUS_TRANSITION = { duration: 0.35, ease: EASE_OUT }
// Below this viewport width the side frames would clip the screen edges:
// hide them and flip the card to its media on hover instead
const FLIP_BELOW_PX = 1440
const FLIP_TRANSITION = { duration: 0.5, ease: EASE_OUT }
const canHover = typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches

interface Role {
  number: string
  title: string
  company: string
  duration: string
  drewMeIn?: string
  thrived: string
  carried: string
  carriedLabel?: string
  skills: string[]
  expandedContent: string
  images: string[]
  caseStudySlug?: string
}

const ROLES: Role[] = [
  {
    number: '01',
    title: 'Product Designer',
    company: 'DoorFeed',
    duration: '2026 – Present · Full-time',
    drewMeIn: 'The granularity of the data they were working with — and the design challenge of making it accurate, complete, and still beautiful to look at.',
    thrived: 'Being a solo designer who thinks like a PM and also makes 20+ pull requests in the first three months.',
    carried: 'How to diagnose friction from the lens of a more senior designer, and how to make a compelling case for working on smaller UI joys.',
    carriedLabel: "What I'm learning",
    skills: ['Research', 'Strategy', 'Prototyping', 'Systems Design'],
    expandedContent: 'The granularity of the data they were working with — and the design challenge of making it accurate, complete, and still beautiful to look at.',
    images: [df1, df2],
    caseStudySlug: 'doorfeed',
  },
  {
    number: '02',
    title: 'Product Designer',
    company: 'SigTech',
    duration: '2024 – 2025 · Full-time',
    drewMeIn: 'Learning to design agentic AI tools for workflows that were still being imagined — and getting deep into developer experience and quantitative finance along the way.',
    thrived: 'The ownership was rare at this stage — prioritisation, sprint cadence, stakeholder negotiation, all alongside the hands-on craft.',
    carried: 'Staying AI-first when it mattered: 200+ podcast episodes on evals and agents, learning MCPs, and closing the gap between design systems and UI libraries. Also the honest reckoning that my UI skills needed a better polish.',
    skills: ['UX Research', 'Interaction Design', 'AI Workflows', 'Figma'],
    expandedContent: 'Learning to design agentic AI tools for workflows that were still being imagined — and getting deep into developer experience and quantitative finance along the way.',
    images: [st1, st2],
    caseStudySlug: 'sigtech',
  },
  {
    number: '03',
    title: 'UX Designer, Web',
    company: 'Deloitte',
    duration: '2019 – 2021 · Full-time',
    thrived: 'Building an NLG tool with the innovations team that cut reporting manhours through ML.',
    carried: 'Systems thinking, design frameworks, and how to collaborate at scale. Running sprints that brought engineering, SMEs, and business stakeholders into the same room.',
    skills: ['Product Thinking', 'Design Systems', 'Stakeholder Alignment', 'User Testing'],
    expandedContent: 'Systems thinking, design frameworks, and how to collaborate at scale. Running sprints that brought engineering, SMEs, and business stakeholders into the same room.',
    images: [dl1, dl2],
    caseStudySlug: 'deloitte-nlg',
  },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function MediaCard({ src, fluid }: { src: string; fluid?: boolean }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src)
  const mediaStyle = { width: fluid ? '100%' : '320px', height: 'auto', display: 'block', maxWidth: 'none' } as const
  return (
    <div style={{
      borderRadius: '1rem',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, rgb(var(--ink) / 0.06), rgb(var(--ink) / 0.02))',
      border: '1px solid rgb(var(--ink) / 0.10)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgb(var(--ink) / 0.08) inset',
      lineHeight: 0,
      flexShrink: 0,
    }}>
      {isVideo
        ? <video src={src} autoPlay loop muted playsInline className="role-media-item" style={mediaStyle} />
        : <img src={src} alt="" className="role-media-item" style={mediaStyle} />}
    </div>
  )
}

function RoleCard({ role, index, isHovered, isDimmed, onHoverChange }: {
  role: Role
  index: number
  isHovered: boolean
  isDimmed: boolean
  onHoverChange: (hovered: boolean) => void
}) {
  const navigate = useNavigate()
  const subsections = [
    role.drewMeIn ? { label: 'What drew me in', content: role.drewMeIn } : null,
    { label: 'Where I thrived', content: role.thrived },
    { label: role.carriedLabel ?? 'What I carried forward', content: role.carried },
  ].filter(Boolean) as { label: string; content: string }[]

  // Narrow desktops: side frames would clip the screen edges — flip the card to its media instead
  const flipMode = useMediaQuery(`(max-width: ${FLIP_BELOW_PX - 1}px)`) && canHover
  const flipped = flipMode && isHovered

  return (
    <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_OUT }}
        style={{ display: 'flex', justifyContent: 'center', zIndex: isHovered ? 30 : 1 }}
      >
        {/* Hover focus wrapper — scales the card + side frames together, dims siblings */}
        <motion.div
          animate={{
            scale: isHovered ? HOVER_SCALE : 1,
            maxWidth: isHovered ? CARD_HOVER_MAX_W : CARD_REST_MAX_W,
            opacity: isDimmed ? DIM_OPACITY : 1,
            filter: isDimmed ? `blur(${DIM_BLUR_PX}px)` : 'blur(0px)',
          }}
          transition={FOCUS_TRANSITION}
          style={{ width: '100%', maxWidth: `${CARD_REST_MAX_W}px`, transformOrigin: 'center', perspective: '1400px' }}
          onMouseEnter={() => { if (canHover) onHoverChange(true) }}
          onMouseLeave={() => { if (canHover) onHoverChange(false) }}
        >
        {/* Flip container — hover detection lives on the (non-rotating) wrapper above,
            because the rotation moves this element out from under the pointer mid-flip */}
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={FLIP_TRANSITION}
          style={{ position: 'relative', transformStyle: 'preserve-3d' }}
        >
        {/* Centre role card — fixed width, positioning parent for images */}
          <div
          className="role-card role-card-shell"
          onClick={() => role.caseStudySlug && navigate(`/work/${role.caseStudySlug}`)}
          style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          background: 'linear-gradient(145deg, rgb(var(--ink) / 0.07), rgb(var(--ink) / 0.02))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgb(var(--ink) / 0.09)',
          boxShadow: '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
          cursor: role.caseStudySlug ? 'pointer' : 'default',
          transition: 'box-shadow 250ms ease, border-color 250ms ease',
        }}
          onMouseEnter={e => {
            if (!role.caseStudySlug) return
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = '0 1px 0 rgb(var(--ink) / 0.10) inset, 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgb(var(--ink) / 0.12)'
            el.style.borderColor = 'rgb(var(--ink) / 0.16)'
          }}
          onMouseLeave={e => {
            if (!role.caseStudySlug) return
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 20px 60px rgba(0,0,0,0.5)'
            el.style.borderColor = 'rgb(var(--ink) / 0.09)'
          }}
        >
          {/* Shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '1px',
            background: 'linear-gradient(to right, transparent, rgb(var(--ink) / 0.18), transparent)',
            pointerEvents: 'none',
          }} />

          <span style={{
            position: 'absolute', top: '1.5rem', right: '1.75rem',
            fontFamily: 'var(--font-body)', fontWeight: 300,
            color: 'rgb(var(--ink) / 0.20)', fontSize: '0.75rem', letterSpacing: '0.05em',
          }}>{role.number}</span>

          <div style={{ marginBottom: '0.25rem' }}>
            <span className="role-card-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink-solid)', fontSize: '1rem' }}>
              {role.title}
            </span>
            {' '}
            <span className="role-card-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgb(var(--ink) / 0.55)', fontSize: '1rem' }}>
              @ {role.company}
            </span>
          </div>

          <p className="role-card-duration" style={{
            fontFamily: 'var(--font-body)', fontWeight: 300,
            color: 'rgb(var(--ink) / 0.35)', fontSize: '0.7rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>{role.duration}</p>

          {subsections.map((sub, i) => (
            <div key={sub.label} className="role-card-sub" style={{
              paddingBottom: i < subsections.length - 1 ? '1rem' : 0,
              marginBottom: i < subsections.length - 1 ? '1rem' : 0,
              borderBottom: i < subsections.length - 1 ? '1px solid rgb(var(--ink) / 0.06)' : 'none',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 500,
                color: 'rgb(var(--ink) / 0.40)', fontSize: '0.65rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem',
              }}>{sub.label}</p>
              <p className="role-card-body" style={{
                fontFamily: 'var(--font-body)', fontWeight: 300,
                color: 'rgb(var(--ink) / 0.65)', fontSize: '0.8rem', lineHeight: 1.6,
              }}>{sub.content}</p>
            </div>
          ))}

          {/* Mobile media strip — visible only on small screens, hidden on desktop */}
          <div className="role-media-strip">
            {role.images.map((src, idx) => (
              <MediaCard key={idx} src={src} />
            ))}
          </div>

          <div style={{
            marginTop: '1.25rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300,
              color: 'rgb(var(--ink) / 0.30)', fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>{role.skills.join(' · ')}</p>

            {role.caseStudySlug && (
              <Link
                to={`/work/${role.caseStudySlug}`}
                className="btn-press role-cta"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500,
                  fontSize: '0.78rem', letterSpacing: '0.06em',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(180,160,230,0.45)',
                  color: 'rgba(200,185,245,0.90)',
                  background: 'rgba(160,130,220,0.08)',
                  transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(160,130,220,0.18)'
                  el.style.borderColor = 'rgba(180,160,230,0.75)'
                  el.style.color = 'rgba(220,205,255,1)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(160,130,220,0.08)'
                  el.style.borderColor = 'rgba(180,160,230,0.45)'
                  el.style.color = 'rgba(200,185,245,0.90)'
                }}
              >
                View case study ↗
              </Link>
            )}
          </div>

          {/* Left image — CSS hover via .role-card:hover .role-image */}
          {!flipMode && (
          <div
            className="role-image role-image-left"
            style={{
              position: 'absolute',
              right: 'calc(100% + 79px)',
              top: '50%',
              width: '320px',
              zIndex: 10,
            }}
          >
            {/* Growth splits both ways; the inward slide keeps the outer edge inside the viewport */}
            <motion.div
              animate={{
                scale: isHovered ? MEDIA_HOVER_SCALE : 1,
                x: isHovered ? MEDIA_HOVER_INSET_PX : 0,
              }}
              transition={FOCUS_TRANSITION}
              style={{ transformOrigin: 'center' }}
            >
              <MediaCard src={role.images[0]} />
            </motion.div>
          </div>
          )}

          {/* Right image */}
          {!flipMode && (
          <div
            className="role-image role-image-right"
            style={{
              position: 'absolute',
              left: 'calc(100% + 79px)',
              top: '50%',
              width: '320px',
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{
                scale: isHovered ? MEDIA_HOVER_SCALE : 1,
                x: isHovered ? -MEDIA_HOVER_INSET_PX : 0,
              }}
              transition={FOCUS_TRANSITION}
              style={{ transformOrigin: 'center' }}
            >
              <MediaCard src={role.images[1]} />
            </motion.div>
          </div>
          )}
        </div>

        {/* Back face — media shown in the card's footprint on narrow desktops */}
        {flipMode && (
          <div
            onClick={() => role.caseStudySlug && navigate(`/work/${role.caseStudySlug}`)}
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '1.5rem',
              padding: '1.75rem',
              background: 'linear-gradient(145deg, rgb(var(--ink) / 0.07), rgb(var(--ink) / 0.02))',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgb(var(--ink) / 0.09)',
              boxShadow: '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              overflow: 'hidden',
              cursor: role.caseStudySlug ? 'pointer' : 'default',
            }}
          >
            {role.images.map((src, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: 0 }}>
                <MediaCard src={src} fluid />
              </div>
            ))}
          </div>
        )}
        </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default function WorkSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="work" style={{ background: 'black', paddingTop: '5rem', paddingBottom: '10rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1.5rem' }}>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em',
            lineHeight: 0.92, color: 'var(--ink-solid)', margin: '0', fontWeight: 400,
          }}
        >Things I've done.</motion.h2>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '0 1.5rem',
      }}>
        {ROLES.map((role, i) => (
          <RoleCard
            key={role.number}
            role={role}
            index={i}
            isHovered={hoveredIndex === i}
            isDimmed={hoveredIndex !== null && hoveredIndex !== i}
            onHoverChange={hovered => setHoveredIndex(hovered ? i : null)}
          />
        ))}
      </div>
    </section>
  )
}
