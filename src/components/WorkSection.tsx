import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// DoorFeed
import df1 from '../assets/DoorFeed/DF:comparables map.png'
import df2 from '../assets/DoorFeed/DF:comps summary.png'
import df3 from '../assets/DoorFeed/DF:generation.png'
// SigTech
import st1 from '../assets/SigTech/MAGIC Hero.png'
import st2 from '../assets/SigTech/Screenshot 2025-11-11 at 14.24.19.png'
import st3 from '../assets/SigTech/Screenshot 2026-04-03 at 01.55.12.png'
// Deloitte
import dl1 from '../assets/Deloitte SS/Deloitte:phone screens.png'
import dl2 from '../assets/Deloitte SS/Deloitte:sketches.png'
import dl3 from '../assets/Deloitte SS/Frame 302.png'

void df3; void st3; void dl3

const EASE_OUT = [0.23, 1, 0.32, 1] as const

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

function MediaCard({ src }: { src: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src)
  return (
    <div style={{
      borderRadius: '1.25rem',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset',
      lineHeight: 0,
      flexShrink: 0,
    }}>
      {isVideo
        ? <video src={src} autoPlay loop muted playsInline style={{ width: '320px', height: 'auto', display: 'block', maxWidth: 'none' }} />
        : <img src={src} alt="" style={{ width: '320px', height: 'auto', display: 'block', maxWidth: 'none' }} />}
    </div>
  )
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const subsections = [
    role.drewMeIn ? { label: 'What drew me in', content: role.drewMeIn } : null,
    { label: 'Where I thrived', content: role.thrived },
    { label: role.carriedLabel ?? 'What I carried forward', content: role.carried },
  ].filter(Boolean) as { label: string; content: string }[]

  return (
    <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_OUT }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {/* Centre role card — fixed width, positioning parent for images */}
        <div
          className="role-card"
          style={{
          position: 'relative',
          width: '600px',
          flexShrink: 0,
          borderRadius: '1.5rem',
          padding: '1.75rem',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
            pointerEvents: 'none',
          }} />

          <span style={{
            position: 'absolute', top: '1.5rem', right: '1.75rem',
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            color: 'rgba(255,255,255,0.20)', fontSize: '0.75rem', letterSpacing: '0.05em',
          }}>{role.number}</span>

          <div style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: 'white', fontSize: '1.125rem' }}>
              {role.title}
            </span>
            {' '}
            <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontSize: '1.125rem' }}>
              @ {role.company}
            </span>
          </div>

          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>{role.duration}</p>

          {subsections.map((sub, i) => (
            <div key={sub.label} style={{
              paddingBottom: i < subsections.length - 1 ? '1rem' : 0,
              marginBottom: i < subsections.length - 1 ? '1rem' : 0,
              borderBottom: i < subsections.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                color: 'rgba(255,255,255,0.40)', fontSize: '0.7rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem',
              }}>{sub.label}</p>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65,
              }}>{sub.content}</p>
            </div>
          ))}

          <div style={{
            marginTop: '1.25rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              color: 'rgba(255,255,255,0.30)', fontSize: '0.75rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>{role.skills.join(' · ')}</p>

            {role.caseStudySlug && (
              <Link
                to={`/work/${role.caseStudySlug}`}
                className="btn-press role-cta"
                style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 500,
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
          <div
            className="role-image role-image-left"
            style={{
              position: 'absolute',
              right: 'calc(100% + 24px)',
              top: '50%',
              width: '320px',
              zIndex: 10,
            }}
          >
            <MediaCard src={role.images[0]} />
          </div>

          {/* Right image */}
          <div
            className="role-image role-image-right"
            style={{
              position: 'absolute',
              left: 'calc(100% + 24px)',
              top: '50%',
              width: '320px',
              zIndex: 10,
            }}
          >
            <MediaCard src={role.images[1]} />
          </div>
        </div>
    </motion.div>
  )
}

export default function WorkSection() {
  return (
    <section id="work" style={{ background: 'black', paddingTop: '5rem', paddingBottom: '10rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0 1.5rem' }}>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em',
            lineHeight: 0.92, color: 'white', margin: '0', fontWeight: 400,
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
          <RoleCard key={role.number} role={role} index={i} />
        ))}
      </div>
    </section>
  )
}
