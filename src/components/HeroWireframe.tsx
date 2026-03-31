import { useEffect, useRef, type MutableRefObject } from 'react'

interface Props {
  cursorRef?: MutableRefObject<{ x: number; y: number }>
}

interface Vertex3D { x: number; y: number; z: number }
interface WireVertex {
  ox: number; oy: number; oz: number
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  px: number; py: number
}

interface Shape {
  verts: WireVertex[]
  edges: [number, number][]
  rx: number; ry: number; rz: number
  drx: number; dry: number; drz: number
  cx: number; cy: number; scale: number
  opacity: number
}

const REPEL_RADIUS = 140
const REPEL_STRENGTH = 6
const SPRING = 0.04
const FRICTION = 0.84

// Square-base pyramid: base square + apex
function pyramid(base: number, height: number): { verts: Vertex3D[]; edges: [number, number][] } {
  const h = base / 2
  const verts: Vertex3D[] = [
    { x: -h, y: -height / 2, z: -h },  // 0 base corners
    { x:  h, y: -height / 2, z: -h },  // 1
    { x:  h, y: -height / 2, z:  h },  // 2
    { x: -h, y: -height / 2, z:  h },  // 3
    { x:  0, y:  height / 2, z:  0 },  // 4 apex
  ]
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],  // base square
    [0, 4], [1, 4], [2, 4], [3, 4],  // sides to apex
  ]
  return { verts, edges }
}

function makeShape(
  geom: { verts: Vertex3D[]; edges: [number, number][] },
  cx: number, cy: number, scale: number,
  drx: number, dry: number, drz: number,
  opacity: number
): Shape {
  return {
    verts: geom.verts.map(v => ({
      ox: v.x, oy: v.y, oz: v.z,
      x: v.x, y: v.y, z: v.z,
      vx: 0, vy: 0, vz: 0,
      px: 0, py: 0,
    })),
    edges: geom.edges,
    rx: Math.random() * Math.PI * 2,
    ry: Math.random() * Math.PI * 2,
    rz: Math.random() * Math.PI * 2,
    drx, dry, drz,
    cx, cy, scale, opacity,
  }
}

function rotateX(v: Vertex3D, a: number): Vertex3D {
  return { x: v.x, y: v.y * Math.cos(a) - v.z * Math.sin(a), z: v.y * Math.sin(a) + v.z * Math.cos(a) }
}
function rotateY(v: Vertex3D, a: number): Vertex3D {
  return { x: v.x * Math.cos(a) + v.z * Math.sin(a), y: v.y, z: -v.x * Math.sin(a) + v.z * Math.cos(a) }
}
function rotateZ(v: Vertex3D, a: number): Vertex3D {
  return { x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a), z: v.z }
}

export default function HeroWireframe({ cursorRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let shapes: Shape[] = []
    let animId: number

    function buildShapes(W: number, H: number) {
      shapes = [
        // Large pyramid — left mid
        makeShape(pyramid(130, 160), W * 0.12, H * 0.40, 1,  0.0004,  0.0007,  0.0002, 0.18),
        // Large pyramid — right upper
        makeShape(pyramid(110, 140), W * 0.85, H * 0.28, 1,  0.0003,  0.0005,  0.0006, 0.16),
        // Medium pyramid — right lower
        makeShape(pyramid(95, 120),  W * 0.75, H * 0.70, 1, -0.0005,  0.0004,  0.0003, 0.15),
        // Small pyramid — left lower
        makeShape(pyramid(75, 95),   W * 0.22, H * 0.75, 1,  0.0006, -0.0003,  0.0005, 0.17),
        // Tiny pyramid — top center
        makeShape(pyramid(60, 75),   W * 0.52, H * 0.18, 1, -0.0004,  0.0006, -0.0004, 0.13),
        // Extra — far right edge
        makeShape(pyramid(80, 100),  W * 0.94, H * 0.60, 1,  0.0005, -0.0004,  0.0003, 0.12),
      ]
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      buildShapes(canvas.width, canvas.height)
    }

    function project(v: Vertex3D, fov: number): { px: number; py: number } {
      const z = v.z + fov
      const scale = fov / Math.max(z, 1)
      return { px: v.x * scale, py: v.y * scale }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const rect = canvas.getBoundingClientRect()
      const vx = cursorRef?.current.x ?? -9999
      const vy = cursorRef?.current.y ?? -9999
      const cx = vx === -9999 ? -9999 : vx - rect.left
      const cy = vy === -9999 ? -9999 : vy - rect.top

      for (const s of shapes) {
        s.rx += s.drx
        s.ry += s.dry
        s.rz += s.drz

        for (const v of s.verts) {
          let r = { x: v.ox, y: v.oy, z: v.oz }
          r = rotateX(r, s.rx)
          r = rotateY(r, s.ry)
          r = rotateZ(r, s.rz)

          const screenX = s.cx + r.x * s.scale
          const screenY = s.cy + r.y * s.scale
          const ddx = screenX - cx
          const ddy = screenY - cy
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy)

          if (ddist < REPEL_RADIUS && ddist > 0) {
            const force = (REPEL_RADIUS - ddist) / REPEL_RADIUS
            v.vx += (ddx / ddist) * force * REPEL_STRENGTH * 0.8
            v.vy += (ddy / ddist) * force * REPEL_STRENGTH * 0.8
          }

          v.vx += (r.x - v.x) * SPRING
          v.vy += (r.y - v.y) * SPRING
          v.vz += (r.z - v.z) * SPRING
          v.vx *= FRICTION
          v.vy *= FRICTION
          v.vz *= FRICTION
          v.x += v.vx
          v.y += v.vy
          v.z += v.vz

          const proj = project({ x: v.x, y: v.y, z: v.z }, 400)
          v.px = s.cx + proj.px * s.scale
          v.py = s.cy + proj.py * s.scale
        }

        // Draw edges with gradient stroke for depth effect
        ctx.lineWidth = 0.8
        for (const [a, b] of s.edges) {
          const va = s.verts[a]
          const vb = s.verts[b]
          const grad = ctx.createLinearGradient(va.px, va.py, vb.px, vb.py)
          grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`)
          grad.addColorStop(1, `rgba(255,255,255,${s.opacity * 0.5})`)
          ctx.strokeStyle = grad
          ctx.beginPath()
          ctx.moveTo(va.px, va.py)
          ctx.lineTo(vb.px, vb.py)
          ctx.stroke()
        }

        // Vertex dots
        for (const v of s.verts) {
          const ddx = v.px - cx
          const ddy = v.py - cy
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy)
          const nearFactor = ddist < REPEL_RADIUS ? Math.max(0, 1 - ddist / REPEL_RADIUS) : 0

          if (nearFactor > 0) {
            const glow = ctx.createRadialGradient(v.px, v.py, 0, v.px, v.py, 10)
            glow.addColorStop(0, `rgba(255,255,255,${nearFactor * 0.55})`)
            glow.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.beginPath()
            ctx.arc(v.px, v.py, 10, 0, Math.PI * 2)
            ctx.fillStyle = glow
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(v.px, v.py, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${s.opacity * 2})`
          ctx.fill()
        }
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
        zIndex: 1,
      }}
    />
  )
}
