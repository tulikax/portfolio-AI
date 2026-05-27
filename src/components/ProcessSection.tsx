import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Compass, Layers, CheckSquare } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Research',
    description:
      'Interviews, desk research, and competitive mapping — accelerated with AI synthesis. I extract signal fast and get into the problem space, not the process.',
  },
  {
    number: '02',
    icon: Compass,
    title: 'Strategy',
    description:
      "Product and design strategy shaped in close collaboration with PMs and stakeholders. I work in the open, share half-baked thinking, and align early so refinement isn't a negotiation.",
  },
  {
    number: '03',
    icon: Layers,
    title: 'Exploration & Refinement',
    description:
      'Wide explorations with AI-assisted generation, narrowed with judgment. I set realistic fidelity expectations with engineers early — no surprises at handoff.',
  },
  {
    number: '04',
    icon: CheckSquare,
    title: 'Handoff & Testing',
    description:
      'Obsessive Figma specs, annotated components, and live QA sessions. I stay in the build until it feels right, not just looks right.',
  },
]

const EASE_OUT = [0.23, 1, 0.32, 1] as const

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

// ─── Scroll thresholds ────────────────────────────────────────────────────────
const E = 0.06

function DesktopProcess() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const x0 = useTransform(scrollYProgress,
    [0.25 - E, 0.25],
    ['0%', '-110%'])

  const x1 = useTransform(scrollYProgress,
    [0.25 - E, 0.25, 0.50 - E, 0.50],
    ['110%',   '0%', '0%',     '-110%'])

  const x2 = useTransform(scrollYProgress,
    [0.50 - E, 0.50, 0.75 - E, 0.75],
    ['110%',   '0%', '0%',     '-110%'])

  const x3 = useTransform(scrollYProgress,
    [0.75 - E, 0.75],
    ['110%',   '0%'])

  const cardXs = [x0, x1, x2, x3]

  const lineW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const n0 = useTransform(scrollYProgress, [0,    0.25 - E, 0.25], [1,   1,   0.3])
  const n1 = useTransform(scrollYProgress, [0.25 - E, 0.25, 0.50 - E, 0.50], [0.3, 1, 1, 0.3])
  const n2 = useTransform(scrollYProgress, [0.50 - E, 0.50, 0.75 - E, 0.75], [0.3, 1, 1, 0.3])
  const n3 = useTransform(scrollYProgress, [0.75 - E, 0.75, 1.0],             [0.3, 1, 1])
  const nodeOpacities = [n0, n1, n2, n3]

  const b1x = useTransform(scrollYProgress, [0, 1], ['-10%', '35%'])
  const b1y = useTransform(scrollYProgress, [0, 1], ['5%',   '55%'])
  const b2x = useTransform(scrollYProgress, [0, 1], ['5%',   '-30%'])
  const b2y = useTransform(scrollYProgress, [0, 1], ['0%',   '40%'])
  const b3x = useTransform(scrollYProgress, [0, 1], ['30%',  '-5%'])
  const b3y = useTransform(scrollYProgress, [0, 1], ['25%',  '-15%'])
  const b4x = useTransform(scrollYProgress, [0, 1], ['5%',   '-25%'])
  const b4y = useTransform(scrollYProgress, [0, 1], ['10%',  '50%'])
  const b5x = useTransform(scrollYProgress, [0, 1], ['10%',  '40%'])
  const b5y = useTransform(scrollYProgress, [0, 1], ['0%',   '-30%'])
  const b6x = useTransform(scrollYProgress, [0, 1], ['-5%',  '20%'])
  const b6y = useTransform(scrollYProgress, [0, 1], ['50%',  '10%'])

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '350vh' }}>
      <div style={{
        position: 'sticky',
        top: 72,
        height: 'calc(100vh - 72px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '32px',
        padding: '2rem 0',
      }}>
        {/* Scroll-driven blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <motion.div style={{ position: 'absolute', top: '-5%', left: '-10%', width: '55vw', height: '55vw', maxWidth: 700, maxHeight: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,160,230,0.42) 0%, transparent 70%)', filter: 'blur(72px)', x: b1x, y: b1y }} />
          <motion.div style={{ position: 'absolute', top: '0%', right: '-8%', width: '45vw', height: '45vw', maxWidth: 580, maxHeight: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,180,190,0.36) 0%, transparent 70%)', filter: 'blur(80px)', x: b2x, y: b2y }} />
          <motion.div style={{ position: 'absolute', top: '30%', left: '30%', width: '40vw', height: '40vw', maxWidth: 520, maxHeight: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,210,185,0.32) 0%, transparent 68%)', filter: 'blur(90px)', x: b3x, y: b3y }} />
          <motion.div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '38vw', height: '38vw', maxWidth: 500, maxHeight: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,200,240,0.38) 0%, transparent 70%)', filter: 'blur(76px)', x: b4x, y: b4y }} />
          <motion.div style={{ position: 'absolute', bottom: '0%', left: '10%', width: '35vw', height: '35vw', maxWidth: 460, maxHeight: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,170,0.30) 0%, transparent 70%)', filter: 'blur(84px)', x: b5x, y: b5y }} />
          <motion.div style={{ position: 'absolute', top: '50%', left: '-5%', width: '30vw', height: '30vw', maxWidth: 400, maxHeight: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,185,245,0.28) 0%, transparent 70%)', filter: 'blur(88px)', x: b6x, y: b6y }} />
        </div>

        {/* Edge fades */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)' }} />

        {/* Heading */}
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 3, padding: '0 1.5rem', flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 0.92, color: 'white', margin: '0 0 0.75rem', fontWeight: 400 }}>
            How I work.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.40)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '32rem', margin: '0 auto' }}>
            My process is simple: stay close to the problem, move fast without losing rigour, and use AI to clear the path for the thinking that actually matters.
          </p>
        </div>

        {/* Step cards — pure horizontal slide */}
        <div style={{ position: 'relative', height: '180px', flexShrink: 0, zIndex: 2 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '0 1.5rem',
                  x: cardXs[i],
                }}
              >
                <div style={{
                  maxWidth: '30rem', width: '100%',
                  borderRadius: '1.25rem', padding: '1.5rem', position: 'relative',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                  backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.10) inset, 0 20px 50px rgba(0,0,0,0.60)',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: '1.25rem', right: '1.25rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)' }} />
                  <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.20)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                    {step.number}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: '0.9rem', height: '0.9rem', color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: 'white', fontSize: '1rem', margin: 0 }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Process flow line */}
        <div style={{ position: 'relative', zIndex: 4, padding: '0 3rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {STEPS.map((step, i) => (
              <motion.span key={i} style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'white', opacity: nodeOpacities[i],
                width: '25%', textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
              }}>
                {step.title}
              </motion.span>
            ))}
          </div>

          <div style={{ position: 'relative', height: '2px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
            <motion.div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              background: 'white', borderRadius: 1, width: lineW,
            }} />
            {STEPS.map((_, i) => (
              <motion.div key={i} style={{
                position: 'absolute', top: '50%',
                left: `${(i / 3) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 10, height: 10, borderRadius: '50%',
                background: 'white', opacity: nodeOpacities[i],
                boxShadow: '0 0 8px rgba(255,255,255,0.6)',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {STEPS.map((step, i) => (
              <motion.span key={i} style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: '0.65rem', letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.4)', opacity: nodeOpacities[i],
                width: '25%', textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
              }}>
                {step.number}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileProcess() {
  return (
    <div style={{ padding: '4rem 1.5rem 5rem' }}>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: 'clamp(2rem, 8vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 0.92, color: 'white', margin: '0 0 0.75rem', fontWeight: 400 }}>
          How I work.
        </h2>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.40)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '28rem', margin: '0 auto' }}>
          My process is simple: stay close to the problem, move fast without losing rigour, and use AI to clear the path for the thinking that actually matters.
        </p>
      </motion.div>

      {/* Vertical timeline */}
      <div style={{ position: 'relative', maxWidth: '28rem', margin: '0 auto' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '1rem',
          bottom: '1rem',
          width: '2px',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: 1,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT }}
                style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
              >
                {/* Node */}
                <div style={{
                  flexShrink: 0,
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 0 10px rgba(255,255,255,0.08)',
                }}>
                  <Icon style={{ width: '0.85rem', height: '0.85rem', color: 'rgba(255,255,255,0.75)' }} />
                </div>

                {/* Card */}
                <div style={{
                  flex: 1,
                  borderRadius: '1.125rem',
                  padding: '1.25rem',
                  position: 'relative',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 32px rgba(0,0,0,0.50)',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: '1rem', right: '1rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: 'white', fontSize: '0.95rem', margin: 0 }}>
                      {step.title}
                    </h3>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.22)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                      {step.number}
                    </span>
                  </div>

                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.60)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ProcessSection() {
  const isMobile = useIsMobile()

  return (
    <section id="process" style={{ background: 'black', position: 'relative' }}>
      {isMobile ? <MobileProcess /> : <DesktopProcess />}
    </section>
  )
}
