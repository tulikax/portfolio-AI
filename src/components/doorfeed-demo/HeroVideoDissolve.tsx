import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import heroVideo from '../../assets/DoorFeed/case study /hero video.mov'

/**
 * Hero background: the DoorFeed product video, which comes apart into a field
 * of points as the hero scrolls away — so the product itself performs the
 * dissolve rather than a decorative graphic sitting next to it.
 *
 * At rest the real <video> element is what you see, pixel-sharp. The point
 * field is fully transparent until the scroll starts, then fades in over the
 * first few percent while the video fades out underneath it. Because the points
 * sample the same frame, and barely move that early, the handover reads as one
 * continuous image rather than a cut.
 *
 * Colour comes from a VideoTexture read in the vertex shader, not a CPU
 * readback — that keeps the whole thing off the main thread and is what makes a
 * grid this fine affordable.
 *
 * Falls back to the plain video when WebGL is unavailable or the visitor has
 * asked for reduced motion.
 */

/** Target cell size in CSS pixels. */
const CELL_PX = 3.5
const MAX_POINTS = 250_000
/** Scroll fraction over which the video hands off to the point field. */
const HANDOFF = 0.1

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aUv;
  attribute vec3 aOffset;
  attribute float aDelay;

  uniform sampler2D uVideo;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Each point starts dissolving at its own delay, so the image comes apart
    // in a scatter rather than all at once.
    float span = 1.0 - aDelay * 0.45;
    float t = clamp((uProgress - aDelay * 0.45) / span, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    // Hidden at rest so the sharp <video> underneath is what shows.
    float fadeIn = smoothstep(0.0, ${HANDOFF.toFixed(2)}, uProgress);

    vColor = texture2D(uVideo, aUv * uCoverScale + uCoverOffset).rgb;
    vAlpha = fadeIn * (1.0 - t);

    vec3 displaced = position + aOffset * t;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 - t * 0.45);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

/** Capability probe, run at render time so the first paint already picks a mode. */
function prefersPlainVideo(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    const probe = document.createElement('canvas')
    return !(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return true
  }
}

export default function HeroVideoDissolve() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Decided once, before first paint — never reassigned, so no cascading render.
  const [plain] = useState(prefersPlainVideo)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (plain || !canvas || !video) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    } catch {
      // Context creation can still fail after the probe; leave the video showing.
      canvas.style.display = 'none'
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000)

    // Default colour handling passes the frame through unchanged, so the points
    // match the DOM video exactly and the crossfade stays invisible.
    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uVideo: { value: texture },
        uCoverScale: { value: new THREE.Vector2(1, 1) },
        uCoverOffset: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
        uSize: { value: CELL_PX },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
    })

    let geometry: THREE.BufferGeometry | null = null
    let points: THREE.Points | null = null

    /** Crop the video to fill the hero without distortion, as object-fit: cover does. */
    function updateCover() {
      const vw = video!.videoWidth
      const vh = video!.videoHeight
      if (!vw || !vh) return

      const screenAspect = window.innerWidth / window.innerHeight
      const videoAspect = vw / vh
      const scale = material.uniforms.uCoverScale.value as THREE.Vector2
      const offset = material.uniforms.uCoverOffset.value as THREE.Vector2

      if (videoAspect > screenAspect) {
        const visible = screenAspect / videoAspect
        scale.set(visible, 1)
        offset.set((1 - visible) / 2, 0)
      } else {
        const visible = videoAspect / screenAspect
        scale.set(1, visible)
        offset.set(0, (1 - visible) / 2)
      }
    }

    function build() {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height)
      camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        -1000,
        1000,
      )

      // Keep the grid under the point budget on very large viewports.
      let cell = CELL_PX
      while ((width / cell) * (height / cell) > MAX_POINTS) cell += 0.5

      const cols = Math.max(2, Math.ceil(width / cell))
      const rows = Math.max(2, Math.ceil(height / cell))
      const cellW = width / cols
      const cellH = height / rows
      const count = cols * rows

      const positions = new Float32Array(count * 3)
      const uvs = new Float32Array(count * 2)
      const offsets = new Float32Array(count * 3)
      const delays = new Float32Array(count)

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i
          const i3 = idx * 3

          const x = (i + 0.5) * cellW - width / 2
          const y = height / 2 - (j + 0.5) * cellH

          positions[i3] = x
          positions[i3 + 1] = y
          positions[i3 + 2] = 0

          uvs[idx * 2] = (i + 0.5) / cols
          // Texture origin is bottom-left once three applies its default flip.
          uvs[idx * 2 + 1] = 1 - (j + 0.5) / rows

          // Outward drift from centre, plus jitter so the scatter isn't radial-clean.
          const len = Math.hypot(x, y) || 1
          const push = 60 + Math.random() * 190
          offsets[i3] = (x / len) * push + (Math.random() - 0.5) * 190
          offsets[i3 + 1] = (y / len) * push * 0.7 + (Math.random() - 0.5) * 190
          offsets[i3 + 2] = 0

          delays[idx] = Math.random()
        }
      }

      geometry?.dispose()
      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2))
      geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3))
      geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))

      // Slightly over one cell, so the points tile solid rather than leaving a
      // screen-door gap between them as they fade in.
      material.uniforms.uSize.value = Math.max(cellW, cellH) * 1.15

      if (points) scene.remove(points)
      points = new THREE.Points(geometry, material)
      scene.add(points)

      updateCover()
    }

    build()

    let progress = 0
    function readScroll() {
      progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
    }
    readScroll()

    let resizeTimer = 0
    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    }

    video.addEventListener('loadedmetadata', updateCover)
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', onResize)

    let frame = 0
    let lastVideoOpacity = -1

    function animate() {
      frame = requestAnimationFrame(animate)

      material.uniforms.uProgress.value = progress

      // Video hands off to the point field over the same range the points fade in.
      const handoff = Math.min(1, progress / HANDOFF)
      const opacity = Math.round((1 - handoff) * 100) / 100
      if (opacity !== lastVideoOpacity) {
        video!.style.opacity = String(opacity)
        lastVideoOpacity = opacity
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      video.removeEventListener('loadedmetadata', updateCover)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', onResize)
      geometry?.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [plain])

  return (
    <>
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      {!plain && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
        />
      )}
    </>
  )
}
