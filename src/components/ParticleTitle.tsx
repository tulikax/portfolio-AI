import { useEffect, useRef, type MutableRefObject } from 'react'
import { displayFont, inkChannel } from '../constants/theme'

const REPEL_RADIUS = 110
const REPEL_STRENGTH = 8
const SPRING = 0.025
const FRICTION = 0.88

// Desktop vs mobile line breaks
const LINES_DESKTOP = ['I work between the', 'noise and the shape']
const LINES_MOBILE  = ['I work between', 'the noise and', 'the shape']

// Blueprint lens (hover effect): buzz radius, then technical-blueprint resolve
const LENS_RADIUS = 66
const SCATTER_FRAMES = 22 // ~0.35s of buzz before the blueprint resolves
const LENS_GRID = 26
const BUZZ_BAND = 110 // width of the buzzing noise ring around the active lens
const BUZZ_EVERY_N_FRAMES = 2 // apply turbulence kicks every Nth frame — higher = slower buzz

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
  linesDesktop?: string[]
  linesMobile?: string[]
  /** Hover shows a lens: particles buzz for ~1s, then resolve into blueprint-style letters within the radius */
  blueprintLens?: boolean
  /** Multiplies the auto-fitted type size (1 = fill the container width) */
  fontScale?: number
  /** Horizontal alignment of the lines within the canvas */
  align?: 'center' | 'left'
  /** Nudges the auto-fitted size up by this many px (clamped so lines still fit) */
  fontBoostPx?: number
  /** Never resolve to solid type — hold the particles in a low idle buzz instead */
  keepParticles?: boolean
}

export default function ParticleTitle({
  cursorRef: externalCursorRef,
  linesDesktop = LINES_DESKTOP,
  linesMobile = LINES_MOBILE,
  blueprintLens,
  fontScale = 1,
  align = 'center',
  fontBoostPx = 0,
  keepParticles = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const internalCursorRef = useRef({ x: -9999, y: -9999 })
  const activeCursorRef = externalCursorRef ?? internalCursorRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const INK = inkChannel()
    if (!ctx) return

    let particles: TitleParticle[] = []
    let animId: number
    let cancelled = false
    let retryId: ReturnType<typeof setTimeout>

    // Blueprint lens state
    let hoverFrames = 0
    let scatterT = 0
    let blueprintT = 0
    let lensX = -9999
    let lensY = -9999
    let buzzFrame = 0

    // Hoisted so draw() can access them for solid-text rendering
    let drawFont = ''
    let drawLines: string[] = []
    let drawStartY = 0
    let drawLineH = 0
    let drawW = 0
    let drawH = 0
    let drawTextX = 0
    let solidOpacity = 0
    let settledFrames = 0

    async function init() {
      if (!canvas || !ctx) return

      // Never let a font CDN failure blank the headline — fall back to the
      // generic serif and carry on rendering particles.
      await document.fonts.load(displayFont(80)).catch(() => {})
      if (cancelled) return

      const W = canvas.offsetWidth
      // Canvas not laid out yet (e.g. loaded in a hidden/zero-width viewport) — retry until measurable
      if (W === 0) {
        retryId = setTimeout(init, 150)
        return
      }
      drawW = W
      // Pick line set based on viewport width
      const lines = W < 500 ? linesMobile : linesDesktop
      drawLines = lines

      // Choose font size so the widest line fits with padding
      const testCtx = document.createElement('canvas').getContext('2d')!
      let fontSize = Math.min(W * 0.12, 110)
      testCtx.font = displayFont(fontSize)
      const maxLineWidth = Math.max(...lines.map(l => testCtx.measureText(l).width))
      if (maxLineWidth > W * 0.9) {
        fontSize *= (W * 0.9) / maxLineWidth
      }
      fontSize *= fontScale

      if (fontBoostPx) {
        // Grow by the requested amount, then pull back if the widest line would overrun
        fontSize += fontBoostPx
        testCtx.font = displayFont(fontSize)
        const boosted = Math.max(...lines.map(l => testCtx.measureText(l).width))
        if (boosted > W * 0.98) fontSize *= (W * 0.98) / boosted
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

      drawFont = displayFont(fontSize)

      // Render all lines to offscreen canvas
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const offCtx = off.getContext('2d')!
      // Alpha-sampling mask only — this colour is never displayed
      offCtx.fillStyle = 'white'
      offCtx.font = drawFont
      offCtx.textAlign = align
      offCtx.textBaseline = 'alphabetic'
      // Left-aligned canvas text still carries each glyph's side bearing; cancel it so the
      // title lines up with the HTML copy in the same column
      const bearings = lines.map(l => offCtx.measureText(l).actualBoundingBoxLeft)
      drawTextX = align === 'left' ? Math.max(...bearings) : W / 2

      const startY = fontSize * 0.5
      drawStartY = startY
      lines.forEach((line, i) => {
        offCtx.fillText(line, drawTextX, startY + i * lineH + fontSize)
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

      // Cursor within canvas bounds triggers break-apart (drawW/drawH are CSS px — canvas.width/height are device px)
      const cursorOnCanvas = cx >= 0 && cx <= drawW && cy >= 0 && cy <= drawH

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
      if (keepParticles) {
        solidOpacity = 0
      } else if (settledFrames > 12 && !cursorOnCanvas) {
        solidOpacity = Math.min(1, solidOpacity + 0.06)
      } else {
        solidOpacity = Math.max(0, solidOpacity - 0.05)
      }

      const particleAlpha = 1 - solidOpacity

      // Blueprint lens phases: buzz first, then resolve to blueprint while hovering
      buzzFrame++
      const buzzTick = buzzFrame % BUZZ_EVERY_N_FRAMES === 0
      if (blueprintLens) {
        hoverFrames = cursorOnCanvas ? hoverFrames + 1 : 0
        if (cursorOnCanvas) { lensX = cx; lensY = cy }
        const scatterTarget = cursorOnCanvas && hoverFrames < SCATTER_FRAMES ? 1 : 0
        const blueprintTarget = cursorOnCanvas && hoverFrames >= SCATTER_FRAMES ? 1 : 0
        scatterT += (scatterTarget - scatterT) * 0.12
        blueprintT += (blueprintTarget - blueprintT) * 0.2
      }

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

        // Held in particle form: a permanent low buzz so the type never reads as static
        if (keepParticles && buzzTick && dist < 4) {
          p.vx += (Math.random() - 0.5) * 0.55
          p.vy += (Math.random() - 0.5) * 0.55
        }

        // Lens buzz phase: turbulence within the radius, strongest at the center
        if (buzzTick && scatterT > 0.01 && cdist < LENS_RADIUS) {
          const fall = 1 - cdist / LENS_RADIUS
          p.vx += (Math.random() - 0.5) * 7 * scatterT * fall
          p.vy += (Math.random() - 0.5) * 7 * scatterT * fall
        }

        // Buzzing noise ring circles the lens from the moment hover starts, fading with distance from the rim
        const ringT = Math.max(scatterT, blueprintT)
        if (buzzTick && ringT > 0.01 && cdist >= LENS_RADIUS && cdist < LENS_RADIUS + BUZZ_BAND) {
          const fall = 1 - (cdist - LENS_RADIUS) / BUZZ_BAND
          p.vx += (Math.random() - 0.5) * 6 * ringT * fall
          p.vy += (Math.random() - 0.5) * 6 * ringT * fall
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

        let drawOpacity = p.opacity * particleAlpha
        // Blueprint phase: particles inside the lens yield to the blueprint rendering
        if (blueprintT > 0.01 && cdist < LENS_RADIUS) {
          drawOpacity *= 1 - blueprintT * Math.min(1, (LENS_RADIUS - cdist) / 50)
        }
        if (drawOpacity <= 0.003) continue

        // Near-cursor glow
        const nearFactor = cdist < REPEL_RADIUS ? Math.max(0, 1 - cdist / REPEL_RADIUS) : 0
        if (nearFactor > 0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          glow.addColorStop(0, `rgb(${INK} / ${nearFactor * 0.7 * drawOpacity})`)
          glow.addColorStop(1, `rgb(${INK} / 0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${INK} / ${drawOpacity})`
        ctx.fill()
      }

      // Solid text layer — fades in over particles once settled
      if (solidOpacity > 0 && drawFont) {
        ctx.save()
        ctx.font = drawFont
        ctx.fillStyle = `rgb(${INK} / ${solidOpacity})`
        ctx.textAlign = align
        ctx.textBaseline = 'alphabetic'
        drawLines.forEach((line, i) => {
          ctx.fillText(line, drawTextX, drawStartY + i * drawLineH + drawLineH / 1.15)
        })
        ctx.restore()
      }

      // Blueprint lens overlay — grid + thin outline letters, clipped to the lens circle
      if (blueprintT > 0.01 && drawFont) {
        const a = blueprintT
        ctx.save()
        ctx.beginPath()
        ctx.arc(lensX, lensY, LENS_RADIUS, 0, Math.PI * 2)
        ctx.clip()

        // Faint grid, aligned to canvas origin so it doesn't swim with the cursor
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgba(140,200,255,${0.09 * a})`
        ctx.beginPath()
        const gx0 = Math.floor((lensX - LENS_RADIUS) / LENS_GRID) * LENS_GRID
        const gy0 = Math.floor((lensY - LENS_RADIUS) / LENS_GRID) * LENS_GRID
        for (let gx = gx0; gx <= lensX + LENS_RADIUS; gx += LENS_GRID) {
          ctx.moveTo(gx, lensY - LENS_RADIUS)
          ctx.lineTo(gx, lensY + LENS_RADIUS)
        }
        for (let gy = gy0; gy <= lensY + LENS_RADIUS; gy += LENS_GRID) {
          ctx.moveTo(lensX - LENS_RADIUS, gy)
          ctx.lineTo(lensX + LENS_RADIUS, gy)
        }
        ctx.stroke()

        // Crisp outline strokes of the letters underneath
        ctx.font = drawFont
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.strokeStyle = `rgba(165,215,255,${0.95 * a})`
        drawLines.forEach((line, i) => {
          ctx.strokeText(line, drawW / 2, drawStartY + i * drawLineH + drawLineH / 1.15)
        })
        ctx.restore()

        // Lens ring + center crosshair
        ctx.save()
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgba(150,205,255,${0.4 * a})`
        ctx.setLineDash([6, 5])
        ctx.beginPath()
        ctx.arc(lensX, lensY, LENS_RADIUS, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(lensX - 8, lensY)
        ctx.lineTo(lensX + 8, lensY)
        ctx.moveTo(lensX, lensY - 8)
        ctx.lineTo(lensX, lensY + 8)
        ctx.stroke()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    return () => {
      cancelled = true
      clearTimeout(retryId)
      cancelAnimationFrame(animId)
    }
    // linesDesktop/linesMobile/blueprintLens intentionally omitted: the async init isn't re-entrant,
    // so text changes must remount the component (key) instead of re-running the effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
