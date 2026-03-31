import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Compass, Layers, CheckSquare } from 'lucide-react'
import GradientBlobs from './GradientBlobs'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

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

// Scroll thresholds for each step node activation and connector reveal
// Mapped to scrollYProgress [0..1] where 0 = section top at 85% viewport, 1 = section bottom at 50% viewport
const NODE_IN  = [0.04, 0.30, 0.56, 0.82]
const CONN_IN  = [[0.10, 0.26], [0.36, 0.52], [0.62, 0.78]] as const

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.88', 'end 0.45'],
  })

  // Node glow activations (opacity 0 → 1)
  const node0 = useTransform(scrollYProgress, [NODE_IN[0], NODE_IN[0] + 0.10], [0, 1])
  const node1 = useTransform(scrollYProgress, [NODE_IN[1], NODE_IN[1] + 0.10], [0, 1])
  const node2 = useTransform(scrollYProgress, [NODE_IN[2], NODE_IN[2] + 0.10], [0, 1])
  const node3 = useTransform(scrollYProgress, [NODE_IN[3], NODE_IN[3] + 0.10], [0, 1])
  const nodes = [node0, node1, node2, node3]

  // Connector reveals (scaleY 0 → 1)
  const conn0 = useTransform(scrollYProgress, [CONN_IN[0][0], CONN_IN[0][1]], [0, 1])
  const conn1 = useTransform(scrollYProgress, [CONN_IN[1][0], CONN_IN[1][1]], [0, 1])
  const conn2 = useTransform(scrollYProgress, [CONN_IN[2][0], CONN_IN[2][1]], [0, 1])
  const connectors = [conn0, conn1, conn2]

  // Card fade-in based on node activation (reuse same thresholds + slight offset)
  const card0Opacity = useTransform(scrollYProgress, [NODE_IN[0], NODE_IN[0] + 0.14], [0, 1])
  const card0Y       = useTransform(scrollYProgress, [NODE_IN[0], NODE_IN[0] + 0.14], [20, 0])
  const card1Opacity = useTransform(scrollYProgress, [NODE_IN[1], NODE_IN[1] + 0.14], [0, 1])
  const card1Y       = useTransform(scrollYProgress, [NODE_IN[1], NODE_IN[1] + 0.14], [20, 0])
  const card2Opacity = useTransform(scrollYProgress, [NODE_IN[2], NODE_IN[2] + 0.14], [0, 1])
  const card2Y       = useTransform(scrollYProgress, [NODE_IN[2], NODE_IN[2] + 0.14], [20, 0])
  const card3Opacity = useTransform(scrollYProgress, [NODE_IN[3], NODE_IN[3] + 0.14], [0, 1])
  const card3Y       = useTransform(scrollYProgress, [NODE_IN[3], NODE_IN[3] + 0.14], [20, 0])
  const cardOpacities = [card0Opacity, card1Opacity, card2Opacity, card3Opacity]
  const cardYs        = [card0Y, card1Y, card2Y, card3Y]

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{ background: 'black' }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '10rem',
          paddingBottom: '12rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        {/* Pastel gradient blobs */}
        <GradientBlobs variant="process" />

        {/* Top + bottom fade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            maxWidth: '44rem',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: 'white',
                margin: '0 0 1.25rem',
                fontWeight: 400,
              }}
            >
              Research to Production, adding a
              <br />
              human-centred touch while building with AI.
            </h2>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: 'rgba(255,255,255,0.65)',
                maxWidth: '36rem',
                margin: '0 auto',
                fontSize: '1rem',
                lineHeight: 1.65,
              }}
            >
              I use AI to compress timelines and expand possibilities — not to replace craft, but to
              protect time for what thinking actually requires.
            </p>
          </motion.div>

          {/* Vertical step rail */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number}>
                  {/* Step row: [wire col] + [card] */}
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

                    {/* Wire column: node dot */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0,
                        paddingTop: '1.4rem',
                        width: '20px',
                      }}
                    >
                      {/* Node dot */}
                      <motion.div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'white',
                          opacity: nodes[i],
                          flexShrink: 0,
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        {/* Outer glow ring */}
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: '-4px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
                            opacity: nodes[i],
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <motion.div
                      style={{
                        flex: 1,
                        opacity: cardOpacities[i],
                        y: cardYs[i],
                        borderRadius: '1.25rem',
                        padding: '1.5rem 1.75rem',
                        background:
                          'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.4)',
                        marginBottom: '0',
                      }}
                    >
                      {/* Top shimmer */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '1.25rem',
                          right: '1.25rem',
                          height: '1px',
                          background:
                            'linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)',
                        }}
                      />

                      {/* Card header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          marginBottom: '0.875rem',
                        }}
                      >
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.625rem',
                            background: 'rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            style={{
                              width: '1rem',
                              height: '1rem',
                              color: 'rgba(255,255,255,0.7)',
                            }}
                          />
                        </div>
                        <h3
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 500,
                            color: 'white',
                            fontSize: '1rem',
                            margin: 0,
                          }}
                        >
                          {step.title}
                        </h3>
                        <span
                          style={{
                            marginLeft: 'auto',
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.18)',
                            fontSize: '0.7rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {step.number}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 300,
                          color: 'rgba(255,255,255,0.60)',
                          fontSize: '0.875rem',
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Connector between cards */}
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'stretch',
                      }}
                    >
                      {/* Wire segment */}
                      <div
                        style={{
                          width: '20px',
                          display: 'flex',
                          justifyContent: 'center',
                          flexShrink: 0,
                          paddingTop: '0',
                          paddingBottom: '0',
                          height: '2.5rem',
                        }}
                      >
                        {/* Dim track */}
                        <div
                          style={{
                            width: '1px',
                            height: '100%',
                            background: 'rgba(255,255,255,0.07)',
                            position: 'relative',
                            overflow: 'visible',
                          }}
                        >
                          {/* Lit wire fill */}
                          <motion.div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background:
                                'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(255,255,255,0.35))',
                              transformOrigin: 'top',
                              scaleY: connectors[i],
                              borderRadius: '1px',
                            }}
                          />
                          {/* Traveling glow pulse */}
                          <motion.div
                            style={{
                              position: 'absolute',
                              left: '-3px',
                              width: '7px',
                              height: '12px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.6)',
                              filter: 'blur(3px)',
                              top: useTransform(connectors[i], [0, 1], ['-6px', 'calc(100% - 6px)']),
                              opacity: useTransform(connectors[i], [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
                            }}
                          />
                        </div>
                      </div>
                      {/* Gap fill beside connector (matches card column) */}
                      <div style={{ flex: 1 }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
