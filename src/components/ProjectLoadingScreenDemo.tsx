import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProjectLoadingScreen from './ProjectLoadingScreen'

const PROJECTS = [
  { label: 'DoorFeed · Product Design · 2026' },
  { label: 'SigTech · AI Interaction Design · 2025' },
  { label: 'Deloitte · UX Design · 2021' },
]

const LOAD_DURATION_MS = 3500

export default function ProjectLoadingScreenDemo() {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [projectIdx, setProjectIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [autoMode, setAutoMode] = useState(true)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  // Animate progress 0→100 over LOAD_DURATION_MS, then trigger exit
  useEffect(() => {
    if (!visible || isExiting || !autoMode) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startTimeRef.current = null

    function tick(now: number) {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const pct = Math.min(100, (elapsed / LOAD_DURATION_MS) * 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsExiting(true)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [visible, isExiting, autoMode, projectIdx])

  function triggerExit() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setProgress(100)
    setIsExiting(true)
  }

  function handleDone() {
    setVisible(false)
    setIsExiting(false)
    setProgress(0)
  }

  function replay(idx?: number) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setVisible(false)
    setIsExiting(false)
    setProgress(0)
    setTimeout(() => {
      if (idx !== undefined) setProjectIdx(idx)
      setVisible(true)
    }, 80)
  }

  const project = PROJECTS[projectIdx]

  return (
    <div style={{ background: '#080808', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Shown after loader exits */}
      {!visible && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          }}
        >
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
            Case study would load here
          </span>
          <div style={{ width: '60vw', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
        </div>
      )}

      {/* ── Demo controls ── */}
      <div
        style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem',
        }}
      >
        {/* Project switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {PROJECTS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => replay(i)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '9999px',
                border: `1px solid ${projectIdx === i ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'}`,
                background: projectIdx === i ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                color: projectIdx === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {p.label.split(' · ')[0]}
            </button>
          ))}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setAutoMode(a => !a)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '9999px',
              border: `1px solid ${autoMode ? 'rgba(160,200,240,0.4)' : 'rgba(255,255,255,0.12)'}`,
              background: autoMode ? 'rgba(160,200,240,0.08)' : 'rgba(255,255,255,0.03)',
              color: autoMode ? 'rgba(160,200,240,0.9)' : 'rgba(255,255,255,0.4)',
              fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {autoMode ? 'Auto' : 'Auto: off'}
          </button>

          <button
            onClick={visible && !isExiting ? triggerExit : () => replay()}
            style={{
              padding: '0.4rem 1.1rem', borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            {visible && !isExiting ? 'Trigger exit →' : '↺ Replay'}
          </button>
        </div>
      </div>

      {/* Top label */}
      <div
        style={{
          position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, fontFamily: "'Barlow', sans-serif", fontSize: '0.62rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        Loading Screen Demo — /demo/loading
      </div>

      {/* The loading screen */}
      <AnimatePresence>
        {visible && (
          <ProjectLoadingScreen
            key={`${projectIdx}-${visible}`}
            label={project.label}
            progress={progress}
            isExiting={isExiting}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
