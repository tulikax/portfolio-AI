import { useEffect, useRef, type MutableRefObject } from 'react'

const REPEL_RADIUS = 110
const REPEL_STRENGTH = 8
const SPRING = 0.025
const FRICTION = 0.88

// Desktop vs mobile line breaks
const LINES_DESKTOP = ['Hi, welcome to my corner', 'of the internet :)']
const LINES_MOBILE  = ['Hi, welcome to', 'my corner of', 'the internet :)']

interface TitleParticle {
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
  r: number
  opacity: number
  phase: number
  delay: number
}

interface Props {
  cursorRef?: MutableRefObject<{ x: number; y: number }>
}

export default function ParticleTitle({ cursorRef: externalCursorRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const internalCursorRef = useRef({ x: -9999, y: -9999 })
  const activeCursorRef = externalCursorRef ?? internalCursorRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: TitleParticle[] = []
    let animId: number

    // Hoisted so draw() can access them for solid-text rendering
    let drawFont = ''
    let drawLines: string[] = []
    let drawStartY = 0
    let drawLineH = 0
    let drawW = 0
    let drawH = 0
    let solidOpacity = 0
    let settledFrames = 0

    async function init() {
      if (!canvas || !ctx) return

      await document.fonts.load("italic 80px 'Instrument Serif'")

      const W = canvas.offsetWidth
      drawW = W
      // Pick line set based on viewport width
      const lines = W < 500 ? LINES_MOBILE : LINES_DESKTOP
      drawLines = lines

      // Choose font size so the widest line fits with padding
      const testCtx = document.createElement('canvas').getContext('2d')!
      let fontSize = Math.min(W * 0.12, 110)
      testCtx.font = `italic ${fontSize}px 'Instrument Serif'`
      const maxLineWidth = Math.max(...lines.map(l => testCtx.measureText(l).width))
      if (maxLineWidth > W * 0.9) {
        fontSize *= (W * 0.9) / maxLineWidth
      }

      const lineH = fontSize * 1.15
      drawLineH = lineH
      const H = Math.ceil(lines.length * lineH + fontSize * 0.8)
      drawH = H

      // Match canvas CSS size exactly to eliminate stretch distortion,
      // and apply devicePixelRatio for crisp rendering on retina displays
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.scale(dpr, dpr)

      drawFont = `italic ${fontSize}px 'Instrument Serif'`

      // Render all lines to offscreen canvas
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const offCtx = off.getContext('2d')!
      offCtx.fillStyle = 'white'
      offCtx.font = drawFont
      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'alphabetic'

      const startY = fontSize * 0.5
      drawStartY = startY
      lines.forEach((line, i) => {
        offCtx.fillText(line, W / 2, startY + i * lineH + fontSize)
      })

      const imgData = offCtx.getImageData(0, 0, W, H).data
      const targets: { x: number; y: number }[] = []

      const step = W < 500 ? 2 : 3
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * W + x) * 4
          if (imgData[idx + 3] > 100) {
            targets.push({ x, y })
          }
        }
      }

      particles = targets.map((t) => ({
        x: t.x + (Math.random() - 0.5) * 60,
        y: -(Math.random() * 40 + 5),
        tx: t.x,
        ty: t.y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0,
        r: W < 500 ? Math.random() * 0.6 + 0.5 : Math.random() * 0.9 + 0.4,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        delay: Math.floor(Math.random() * 120),
      }))

      draw()
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, drawW, drawH)

      const canvasRect = canvas.getBoundingClientRect()
      const vx = activeCursorRef.current.x
      const vy = activeCursorRef.current.y
      const cx = vx === -9999 ? -9999 : vx - canvasRect.left
      const cy = vy === -9999 ? -9999 : vy - canvasRect.top

      // Cursor within canvas bounds triggers break-apart
      const cursorOnCanvas = cx >= 0 && cx <= canvas.width && cy >= 0 && cy <= canvas.height

      // Sample 30 particles to check settlement (cheaper than checking all)
      let settledCount = 0
      const sample = Math.min(30, particles.length)
      for (let i = 0; i < sample; i++) {
        const p = particles[Math.floor(i * particles.length / sample)]
        if (p.delay === 0) {
          const dx = p.x - p.tx, dy = p.y - p.ty
          if (Math.sqrt(dx*dx + dy*dy) < 3) settledCount++
        }
      }
      const isSettled = settledCount >= sample * 0.9

      if (isSettled && !cursorOnCanvas) {
        settledFrames = Math.min(settledFrames + 1, 80)
      } else {
        settledFrames = Math.max(settledFrames - 3, 0)
      }

      // solidOpacity: 0 = all particles, 1 = solid text
      if (settledFrames > 50 && !cursorOnCanvas) {
        solidOpacity = Math.min(1, solidOpacity + 0.025)
      } else {
        solidOpacity = Math.max(0, solidOpacity - 0.05)
      }

      const particleAlpha = 1 - solidOpacity

      for (const p of particles) {
        if (p.delay > 0) { p.delay--; continue }

        const dx = p.x - p.tx
        const dy = p.y - p.ty

        // Cursor repulsion
        const cdx = p.x - cx
        const cdy = p.y - cy
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist < REPEL_RADIUS && cdist > 0) {
          const force = (REPEL_RADIUS - cdist) / REPEL_RADIUS
          p.vx += (cdx / cdist) * force * REPEL_STRENGTH
          p.vy += (cdy / cdist) * force * REPEL_STRENGTH
        }

        // Breathing when settled
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 2) {
          p.phase += 0.018
          p.vx += Math.cos(p.phase) * 0.04
          p.vy += Math.sin(p.phase * 0.7) * 0.04
        }

        p.vx += -dx * SPRING
        p.vy += -dy * SPRING
        p.vx *= FRICTION
        p.vy *= FRICTION
        p.x += p.vx
        p.y += p.vy

        if (p.opacity < 1) p.opacity = Math.min(1, p.opacity + 0.012)

        // Skip rendering particles when fully solid and cursor away
        if (particleAlpha <= 0) continue

        const drawOpacity = p.opacity * particleAlpha

        // Near-cursor glow
        const nearFactor = cdist < REPEL_RADIUS ? Math.max(0, 1 - cdist / REPEL_RADIUS) : 0
        if (nearFactor > 0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          glow.addColorStop(0, `rgba(255,255,255,${nearFactor * 0.7 * drawOpacity})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${drawOpacity})`
        ctx.fill()
      }

      // Solid text layer — fades in over particles once settled
      if (solidOpacity > 0 && drawFont) {
        ctx.save()
        ctx.font = drawFont
        ctx.fillStyle = `rgba(255,255,255,${solidOpacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        drawLines.forEach((line, i) => {
          ctx.fillText(line, drawW / 2, drawStartY + i * drawLineH + drawLineH / 1.15)
        })
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    return () => { cancelAnimationFrame(animId) }
  }, [activeCursorRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        background: 'transparent',
        display: 'block',
        pointerEvents: 'auto',
        cursor: 'default',
      }}
    />
  )
}
