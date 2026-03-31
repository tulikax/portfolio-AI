import { useEffect, useRef, type MutableRefObject } from 'react'

const REPEL_RADIUS = 110
const REPEL_STRENGTH = 8
const SPRING = 0.055
const FRICTION = 0.82

// Desktop vs mobile line breaks
const LINES_DESKTOP = ['HI, welcome to my corner', 'of the internet :)']
const LINES_MOBILE  = ['HI, welcome to', 'my corner of', 'the internet :)']

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

    async function init() {
      if (!canvas || !ctx) return

      await document.fonts.load("italic 80px 'Instrument Serif'")

      const W = canvas.offsetWidth
      // Pick line set based on viewport width
      const lines = W < 500 ? LINES_MOBILE : LINES_DESKTOP

      // Choose font size so the widest line fits with padding
      const testCtx = document.createElement('canvas').getContext('2d')!
      let fontSize = Math.min(W * 0.12, 110)
      testCtx.font = `italic ${fontSize}px 'Instrument Serif'`
      const maxLineWidth = Math.max(...lines.map(l => testCtx.measureText(l).width))
      if (maxLineWidth > W * 0.9) {
        fontSize *= (W * 0.9) / maxLineWidth
      }

      const lineH = fontSize * 1.15
      const H = Math.ceil(lines.length * lineH + fontSize * 0.8)
      canvas.width = W
      canvas.height = H

      // Render all lines to offscreen canvas
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const offCtx = off.getContext('2d')!
      offCtx.fillStyle = 'white'
      offCtx.font = `italic ${fontSize}px 'Instrument Serif'`
      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'alphabetic'

      const startY = fontSize * 0.5
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
        x: Math.random() * W,
        y: Math.random() < 0.5 ? -Math.random() * H : H + Math.random() * H,
        tx: t.x,
        ty: t.y,
        vx: 0,
        vy: 0,
        r: W < 500 ? Math.random() * 0.6 + 0.5 : Math.random() * 0.9 + 0.4,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
      }))

      draw()
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const canvasRect = canvas.getBoundingClientRect()
      const vx = activeCursorRef.current.x
      const vy = activeCursorRef.current.y
      const cx = vx === -9999 ? -9999 : vx - canvasRect.left
      const cy = vy === -9999 ? -9999 : vy - canvasRect.top

      for (const p of particles) {
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

        if (p.opacity < 1) p.opacity = Math.min(1, p.opacity + 0.02)

        // Near-cursor glow
        const nearFactor = cdist < REPEL_RADIUS ? Math.max(0, 1 - cdist / REPEL_RADIUS) : 0
        if (nearFactor > 0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          glow.addColorStop(0, `rgba(255,255,255,${nearFactor * 0.7 * p.opacity})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
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
        height: '380px',
        background: 'transparent',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}
