import { useEffect, useRef, type MutableRefObject } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  baseOpacity: number
  speed: number
  drift: number
  phase: number
  // original position for spring-back
  ox: number
  oy: number
  vx: number
  vy: number
}

interface Props {
  cursorRef?: MutableRefObject<{ x: number; y: number }>
}

const BG_REPEL_RADIUS = 120
const BG_REPEL_STRENGTH = 3.5
const BG_SPRING = 0.02
const BG_FRICTION = 0.88

export default function ParticleCanvas({ cursorRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 110
    let particles: Particle[] = []
    let animId: number

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles()
    }

    function initParticles() {
      if (!canvas) return
      particles = Array.from({ length: COUNT }, () => {
        const x = Math.random() * canvas!.width
        const y = Math.random() * canvas!.height
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.6 + 0.2,
          baseOpacity: Math.random() * 0.55 + 0.08,
          speed: Math.random() * 0.35 + 0.08,
          drift: (Math.random() - 0.5) * 0.25,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const rect = canvas.getBoundingClientRect()
      const vx = cursorRef?.current.x ?? -9999
      const vy = cursorRef?.current.y ?? -9999
      const cx = vx === -9999 ? -9999 : vx - rect.left
      const cy = vy === -9999 ? -9999 : vy - rect.top

      for (const p of particles) {
        // Cursor repulsion on background particles
        const cdx = p.x - cx
        const cdy = p.y - cy
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist < BG_REPEL_RADIUS && cdist > 0) {
          const force = (BG_REPEL_RADIUS - cdist) / BG_REPEL_RADIUS
          p.vx += (cdx / cdist) * force * BG_REPEL_STRENGTH
          p.vy += (cdy / cdist) * force * BG_REPEL_STRENGTH
        }

        // Gentle spring back toward drifting origin
        p.vx += (p.ox - p.x) * BG_SPRING
        p.vy += (p.oy - p.y) * BG_SPRING
        p.vx *= BG_FRICTION
        p.vy *= BG_FRICTION
        p.x += p.vx
        p.y += p.vy

        // Normal drift
        p.ox -= p.speed
        p.ox += p.drift
        p.phase += 0.012

        if (p.ox < -p.r * 3) { p.ox = canvas.width + p.r; p.x = p.ox }
        if (p.ox < -p.r * 3) p.ox = canvas.width + p.r
        if (p.ox > canvas.width + p.r * 3) { p.ox = -p.r; p.x = p.ox }

        const opacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.phase))

        // Near-cursor glow
        if (cdist < BG_REPEL_RADIUS) {
          const nearFactor = Math.max(0, 1 - cdist / BG_REPEL_RADIUS)
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          glow.addColorStop(0, `rgba(255,255,255,${nearFactor * 0.5 * opacity})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5)
        grad.addColorStop(0, `rgba(255,255,255,${opacity})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [cursorRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}
