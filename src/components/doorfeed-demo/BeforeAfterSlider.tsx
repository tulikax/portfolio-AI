import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion'
import { inkChannel } from '../../constants/theme'
import { MONO, ink } from './styles'

interface Props {
  beforeSrc: string
  beforeAlt: string
  beforeLabel: string
  afterSrc: string
  afterAlt: string
  afterLabel: string
  /**
   * Frame width ÷ height. UI screenshots are mostly empty canvas below the
   * region that changed, so the frame is cropped to a band rather than taking
   * the source images' full aspect. Both images are anchored top-left inside it.
   */
  aspect?: number
  /** Natural pixel widths — needed to convert `cropRight` into a scale factor. */
  beforeWidth: number
  afterWidth: number
  /** Pixels trimmed off the right edge of each source image. */
  cropRight?: number
  /** Per-side zoom, anchored top-left. 1.3 crops a further 30% off right and bottom. */
  beforeZoom?: number
  afterZoom?: number
}

/** Arrow-key step, in percent. */
const STEP = 2

/**
 * Fits a layer by width rather than `object-fit: cover`, so both images start at
 * source x=0 and share a left edge, and overflow is clipped off the bottom. The
 * width is inflated so that `cropRight` source pixels fall outside the frame.
 */
function layerImage(naturalWidth: number, cropRight: number, zoom: number): React.CSSProperties {
  const visible = Math.max(1, naturalWidth - cropRight)
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    // Zoom scales from the top-left origin, so it crops the same proportion off
    // the right and bottom rather than pushing content out of frame on all sides.
    width: `${(naturalWidth / visible) * zoom * 100}%`,
    height: 'auto',
    display: 'block',
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
}

/**
 * Draggable before/after comparison. The "before" image sizes the frame and the
 * "after" is clipped over it, so the handle reveals the new version in place
 * rather than putting two screenshots side by side — the point of the
 * comparison is that the same regions changed, which is hard to see when the
 * eye has to travel between two frames.
 *
 * The handle position is a MotionValue rather than React state: dragging then
 * mutates styles directly instead of re-rendering the tree every pointer move,
 * and the same value drives the demo sweep and the dust emitter.
 *
 * On first scroll into view the handle sweeps once by itself to show it can be
 * moved, and pulses until the reader takes over. Movement throws a little dust
 * off the divider, opposite to the direction of travel.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  beforeAlt,
  beforeLabel,
  afterSrc,
  afterAlt,
  afterLabel,
  aspect = 4.5,
  beforeWidth,
  afterWidth,
  cropRight = 0,
  beforeZoom = 1,
  afterZoom = 1,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef(false)
  const demoRef = useRef<AnimationPlaybackControls | null>(null)

  const position = useMotionValue(50)
  const [hinting, setHinting] = useState(true)
  // Mirrors the motion value for aria only, so assistive tech reads a live
  // figure without the visual updates going through React.
  const [announced, setAnnounced] = useState(50)

  useEffect(
    () =>
      position.on('change', (value) => {
        setAnnounced((current) => {
          const next = Math.round(value)
          return next === current ? current : next
        })
      }),
    [position],
  )

  const clipPath = useTransform(position, (p) => `inset(0 0 0 ${p}%)`)
  const leftPercent = useTransform(position, (p) => `${p}%`)
  const beforeLabelOpacity = useTransform(position, [8, 18], [0, 1])
  const afterLabelOpacity = useTransform(position, [82, 92], [1, 0])

  const inView = useInView(containerRef, { once: true, margin: '-15%' })

  /** Ends the demo sweep and retires the hint the moment the reader engages. */
  const takeOver = useCallback(() => {
    demoRef.current?.stop()
    demoRef.current = null
    setHinting(false)
  }, [])

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width) return
      const pct = ((clientX - rect.left) / rect.width) * 100
      position.set(Math.min(100, Math.max(0, pct)))
    },
    [position],
  )

  // Demo sweep on first view — shows the control is draggable without a caption
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const controls = animate(position, [50, 76, 26, 50], {
      duration: 2.8,
      delay: 0.45,
      ease: 'easeInOut',
      times: [0, 0.32, 0.72, 1],
    })
    demoRef.current = controls

    return () => controls.stop()
  }, [inView, position])

  // Dust thrown off the divider, opposite to the direction of travel
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    let width = 0
    let height = 0

    function resize() {
      const rect = container!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const particles: Particle[] = []
    const colour = `rgb(${inkChannel()})`
    let previous = position.get()
    let frame = 0
    let last = 0

    function tick(now: number) {
      const dt = Math.min(48, now - last)
      last = now
      ctx!.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += dt
        if (p.life >= p.max) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx * dt * 0.06
        p.y += p.vy * dt * 0.06
        ctx!.globalAlpha = (1 - p.life / p.max) * 0.6
        ctx!.fillStyle = colour
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      if (particles.length > 0) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = 0
        ctx!.clearRect(0, 0, width, height)
      }
    }

    const unsubscribe = position.on('change', (value) => {
      const delta = value - previous
      previous = value
      if (Math.abs(delta) < 0.15 || !width) return

      const direction = Math.sign(delta)
      const x = (value / 100) * width
      const count = Math.min(6, Math.max(2, Math.round(Math.abs(delta))))

      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 3,
          y: Math.random() * height,
          // Opposite to the drag, so the dust reads as thrown off the edge
          vx: -direction * (0.4 + Math.random() * 1.7),
          vy: (Math.random() - 0.5) * 0.55,
          life: 0,
          max: 380 + Math.random() * 420,
          size: 0.6 + Math.random() * 1.4,
        })
      }

      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })

    return () => {
      unsubscribe()
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [position])

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    takeOver()
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (draggingRef.current) updateFromClientX(e.clientX)
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const current = position.get()
    if (e.key === 'ArrowLeft') position.set(Math.max(0, current - STEP))
    else if (e.key === 'ArrowRight') position.set(Math.min(100, current + STEP))
    else if (e.key === 'Home') position.set(0)
    else if (e.key === 'End') position.set(100)
    else return
    takeOver()
    e.preventDefault()
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: `${aspect}`,
        // Both screenshots are transparent PNGs, so they need a ground of their own
        background: 'rgb(var(--surface))',
        // Stops the browser claiming the drag as a scroll gesture on touch
        touchAction: 'none',
        userSelect: 'none',
        display: 'block',
        lineHeight: 0,
      }}
    >
      {/* Before */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        loading="lazy"
        style={layerImage(beforeWidth, cropRight, beforeZoom)}
      />

      {/*
       * After — the clip lives on an opaque wrapper rather than the image, so a
       * transparent PNG can't let the "before" show through on the reveal side.
       */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: 'rgb(var(--surface))',
          clipPath,
        }}
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          loading="lazy"
          style={layerImage(afterWidth, cropRight, afterZoom)}
        />
      </motion.div>

      <motion.span
        style={{
          ...MONO,
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          padding: '0.3rem 0.6rem',
          fontSize: '0.54rem',
          borderRadius: '9999px',
          background: 'rgb(var(--surface) / 0.72)',
          color: ink(0.8),
          opacity: beforeLabelOpacity,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        {beforeLabel}
      </motion.span>

      <motion.span
        style={{
          ...MONO,
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          padding: '0.3rem 0.6rem',
          fontSize: '0.54rem',
          borderRadius: '9999px',
          background: 'rgb(var(--surface) / 0.72)',
          color: ink(0.8),
          opacity: afterLabelOpacity,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        {afterLabel}
      </motion.span>

      {/* Dust — sits above the images, below the handle */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Divider */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: leftPercent,
          width: '1px',
          background: ink(0.85),
          transform: 'translateX(-0.5px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Handle */}
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={`Reveal ${afterLabel} over ${beforeLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={announced}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={hinting ? 'df-slider-hint' : undefined}
        style={{
          position: 'absolute',
          top: '50%',
          left: leftPercent,
          x: '-50%',
          y: '-50%',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '50%',
          background: 'rgb(var(--surface) / 0.85)',
          border: `1px solid ${ink(0.55)}`,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          color: ink(0.9),
          fontSize: '0.65rem',
          lineHeight: 1,
          zIndex: 3,
        }}
      >
        <span aria-hidden="true">‹</span>
        <span aria-hidden="true">›</span>
      </motion.div>
    </div>
  )
}
