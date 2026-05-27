import { useRef, useEffect, type MutableRefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GradientBlobs from './GradientBlobs'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// ─── Background floating particles ───────────────────────────────────────────

interface BgParticle {
  x: number; y: number; ox: number; oy: number
  vx: number; vy: number
  r: number; baseOpacity: number; speed: number; drift: number; phase: number
}

function BackgroundParticles({
  cursorRef,
  scattering,
}: {
  cursorRef: MutableRefObject<{ x: number; y: number }>
  scattering: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scatterRef = useRef(scattering)
  useEffect(() => { scatterRef.current = scattering }, [scattering])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: BgParticle[] = []
    let animId: number

    function initParticles() {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      particles = Array.from({ length: 110 }, () => {
        const x = Math.random() * W
        const y = Math.random() * H
        return {
          x, y, ox: x, oy: y, vx: 0, vy: 0,
          r: Math.random() * 1.8 + 0.4,
          baseOpacity: Math.random() * 0.65 + 0.15,
          speed: Math.random() * 0.18 + 0.04,
          drift: (Math.random() - 0.5) * 0.15,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = canvas!.offsetWidth * dpr
      canvas!.height = canvas!.offsetHeight * dpr
      ctx!.scale(dpr, dpr)
      initParticles()
    }

    function draw() {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      ctx!.clearRect(0, 0, W, H)

      const rect = canvas!.getBoundingClientRect()
      const cx = cursorRef.current.x === -9999 ? -9999 : cursorRef.current.x - rect.left
      const cy = cursorRef.current.y === -9999 ? -9999 : cursorRef.current.y - rect.top

      for (const p of particles) {
        if (scatterRef.current) {
          const dx = p.x - W / 2; const dy = p.y - H / 2
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          p.vx += (dx / dist) * 0.9; p.vy += (dy / dist) * 0.9
          p.vx *= 0.95; p.vy *= 0.95
        } else {
          const cdx = p.x - cx; const cdy = p.y - cy
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < 120 && cdist > 0) {
            const force = (120 - cdist) / 120
            p.vx += (cdx / cdist) * force * 3.5
            p.vy += (cdy / cdist) * force * 3.5
          }
          p.vx += (p.ox - p.x) * 0.02; p.vy += (p.oy - p.y) * 0.02
          p.vx *= 0.88; p.vy *= 0.88
          p.ox -= p.speed; p.ox += p.drift; p.phase += 0.012
          if (p.ox < -p.r * 3) { p.ox = W + p.r; p.x = p.ox }
          if (p.ox > W + p.r * 3) { p.ox = -p.r; p.x = p.ox }
        }
        p.x += p.vx; p.y += p.vy

        const opacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.phase))
        if (!scatterRef.current) {
          const cdx = p.x - cx; const cdy = p.y - cy
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < 120) {
            const nf = Math.max(0, 1 - cdist / 120)
            const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
            glow.addColorStop(0, `rgba(255,255,255,${nf * 0.5 * opacity})`)
            glow.addColorStop(1, 'rgba(255,255,255,0)')
            ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
            ctx!.fillStyle = glow; ctx!.fill()
          }
        }
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5)
        grad.addColorStop(0, `rgba(255,255,255,${opacity})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = grad; ctx!.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [cursorRef])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
    />
  )
}

// ─── "Loading..." particle text ───────────────────────────────────────────────

interface TextParticle {
  x: number; y: number; tx: number; ty: number
  vx: number; vy: number; r: number; opacity: number; phase: number; delay: number
}

function LoadingParticleText({
  cursorRef,
  scattering,
}: {
  cursorRef: MutableRefObject<{ x: number; y: number }>
  scattering: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scatterRef = useRef(scattering)
  useEffect(() => { scatterRef.current = scattering }, [scattering])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: TextParticle[] = []
    let animId: number
    let solidOpacity = 0
    let settledFrames = 0
    let drawFont = ''
    // drawW/H = full viewport; textCenterY = vertical midpoint of text mass
    let drawW = 0
    let drawH = 0
    let drawY = 0        // alphabetic baseline in viewport coords
    let textCenterY = 0  // visual center of text (for scatter origin)

    async function init() {
      await document.fonts.load(`italic 80px 'Instrument Serif'`)

      const dpr = window.devicePixelRatio || 1
      // Canvas fills the entire viewport so scattered particles have room to travel
      const W = window.innerWidth
      const H = window.innerHeight

      let fontSize = Math.min(W * 0.12, 108)
      const testCtx = document.createElement('canvas').getContext('2d')!
      testCtx.font = `italic ${fontSize}px 'Instrument Serif'`
      const measuredW = testCtx.measureText('Loading...').width
      if (measuredW > W * 0.82) fontSize *= (W * 0.82) / measuredW

      // Baseline sits slightly below viewport center so visual weight is centred
      const baseline = H / 2 + fontSize * 0.35
      drawFont = `italic ${fontSize}px 'Instrument Serif'`
      drawW = W; drawH = H; drawY = baseline
      textCenterY = H / 2

      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      canvas!.style.width = `${W}px`
      canvas!.style.height = `${H}px`
      ctx!.scale(dpr, dpr)

      // Sample pixel targets from an offscreen canvas the same size as the viewport
      const off = document.createElement('canvas')
      off.width = W; off.height = H
      const offCtx = off.getContext('2d')!
      offCtx.fillStyle = 'white'
      offCtx.font = drawFont
      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'alphabetic'
      offCtx.fillText('Loading...', W / 2, baseline)

      const imgData = offCtx.getImageData(0, 0, W, H).data
      const targets: { x: number; y: number }[] = []
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
          if (imgData[(y * W + x) * 4 + 3] > 80) targets.push({ x, y })
        }
      }

      particles = targets.map(t => ({
        x: t.x + (Math.random() - 0.5) * 100,
        // start above the text — in viewport space that's above `baseline`
        y: baseline - fontSize - Math.random() * 120 - 20,
        tx: t.x, ty: t.y,
        vx: (Math.random() - 0.5) * 0.3, vy: 0,
        r: Math.random() * 1.2 + 0.6,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        delay: Math.floor(Math.random() * 110),
      }))

      draw()
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, drawW, drawH)

      const canvasRect = canvas.getBoundingClientRect()
      const cx = cursorRef.current.x === -9999 ? -9999 : cursorRef.current.x - canvasRect.left
      const cy = cursorRef.current.y === -9999 ? -9999 : cursorRef.current.y - canvasRect.top

      if (scatterRef.current) {
        solidOpacity = Math.max(0, solidOpacity - 0.05)
        settledFrames = 0
      } else {
        let settledCount = 0
        const sample = Math.min(30, particles.length)
        for (let i = 0; i < sample; i++) {
          const p = particles[Math.floor(i * particles.length / sample)]
          if (p.delay === 0) {
            const dx = p.x - p.tx; const dy = p.y - p.ty
            if (Math.sqrt(dx * dx + dy * dy) < 3) settledCount++
          }
        }
        const isSettled = settledCount >= sample * 0.9
        // Canvas covers full viewport — check proximity to text area instead
        const cursorNearText = Math.abs(cx - drawW / 2) < drawW * 0.45
          && Math.abs(cy - textCenterY) < drawH * 0.18

        if (isSettled && !cursorNearText) {
          settledFrames = Math.min(settledFrames + 1, 80)
        } else {
          settledFrames = Math.max(settledFrames - 3, 0)
        }
        if (settledFrames > 50 && !cursorNearText) {
          solidOpacity = Math.min(1, solidOpacity + 0.018)
        } else {
          solidOpacity = Math.max(0, solidOpacity - 0.04)
        }
      }

      const particleAlpha = 1 - solidOpacity

      for (const p of particles) {
        if (p.delay > 0) { p.delay--; continue }

        if (scatterRef.current) {
          // Scatter from text center (not canvas corner — canvas is now full viewport)
          const dx = p.x - drawW / 2; const dy = p.y - textCenterY
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          p.vx += (dx / dist) * 0.85; p.vy += (dy / dist) * 0.85
          p.vx *= 0.95; p.vy *= 0.95
        } else {
          const dx = p.x - p.tx; const dy = p.y - p.ty
          const cdx = p.x - cx; const cdy = p.y - cy
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < 110 && cdist > 0) {
            const force = (110 - cdist) / 110
            p.vx += (cdx / cdist) * force * 8
            p.vy += (cdy / cdist) * force * 8
          }
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 2) {
            p.phase += 0.018
            p.vx += Math.cos(p.phase) * 0.04
            p.vy += Math.sin(p.phase * 0.7) * 0.04
          }
          p.vx += -dx * 0.019; p.vy += -dy * 0.019
          p.vx *= 0.89; p.vy *= 0.89
        }

        p.x += p.vx; p.y += p.vy
        if (p.opacity < 1) p.opacity = Math.min(1, p.opacity + 0.010)
        if (particleAlpha <= 0) continue

        const drawOpacity = p.opacity * particleAlpha
        const cdx = p.x - cx; const cdy = p.y - cy
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist < 110) {
          const nf = Math.max(0, 1 - cdist / 110)
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          glow.addColorStop(0, `rgba(255,255,255,${nf * 0.7 * drawOpacity})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = glow; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${drawOpacity})`; ctx.fill()
      }

      if (solidOpacity > 0 && drawFont && !scatterRef.current) {
        ctx.save()
        ctx.font = drawFont
        ctx.fillStyle = `rgba(255,255,255,${solidOpacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText('Loading...', drawW / 2, drawY) // drawY = alphabetic baseline
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    return () => { cancelAnimationFrame(animId) }
  }, [cursorRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        cursor: 'default',
        zIndex: 3,
      }}
    />
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ progress, exiting }: { progress: number; exiting: boolean }) {
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          {/* Track — full viewport width */}
          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.07)',
              position: 'relative',
            }}
          >
            {/* Fill */}
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                background: 'rgba(255,255,255,0.75)',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            />
          </div>

          {/* Percentage — top right */}
          <span
            style={{
              position: 'absolute',
              top: '0.6rem',
              right: '1.25rem',
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.62rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main loading screen ──────────────────────────────────────────────────────

export interface ProjectLoadingScreenProps {
  /** Shown in small eyebrow style e.g. "DoorFeed · Product Design · 2026" */
  label: string
  /** 0–100, drives the progress bar */
  progress: number
  isExiting: boolean
  onDone: () => void
}

export default function ProjectLoadingScreen({
  label,
  progress,
  isExiting,
  onDone,
}: ProjectLoadingScreenProps) {
  const cursorRef = useRef({ x: -9999, y: -9999 })

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}
      onMouseMove={(e) => { cursorRef.current = { x: e.clientX, y: e.clientY } }}
      onMouseLeave={() => { cursorRef.current = { x: -9999, y: -9999 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'black', overflow: 'hidden' }}
    >
      {/* Full-width progress bar at top */}
      <ProgressBar progress={progress} exiting={isExiting} />

      {/* Pastel blobs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GradientBlobs />
      </div>

      {/* Background particles — z2 */}
      <BackgroundParticles cursorRef={cursorRef} scattering={isExiting} />

      {/* Particle text canvas — z3, full viewport, text centred inside */}
      <LoadingParticleText cursorRef={cursorRef} scattering={isExiting} />

      {/* Project label — z10, positioned above text center */}
      <AnimatePresence>
        {!isExiting && (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            style={{
              position: 'absolute',
              bottom: '160px',
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 10,
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* onDone sentinel */}
      <AnimatePresence onExitComplete={onDone}>
        {!isExiting && <motion.span key="sentinel" style={{ display: 'none' }} />}
      </AnimatePresence>
    </motion.div>
  )
}
