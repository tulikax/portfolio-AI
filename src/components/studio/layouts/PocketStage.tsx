import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from './data'
import useFinePointer from './useFinePointer'

/**
 * Where each tag sits at rest and where it flies to when the pocket opens.
 * Offsets are in `cqw` so they scale with the stage, not the viewport.
 */
const TAGS = [
  { place: { left: '18%', top: '62%' }, x: '-13cqw', y: '-20cqw', rotate: '-7deg' },
  { place: { right: '18%', top: '62%' }, x: '13cqw', y: '-24cqw', rotate: '6deg' },
  { place: { left: '20%', top: '70%' }, x: '-17cqw', y: '-9cqw', rotate: '5deg' },
  { place: { right: '20%', top: '70%' }, x: '17cqw', y: '-11cqw', rotate: '-6deg' },
] as const

interface PocketStageProps {
  project: Project
  tagCount?: number
  /** Defaults to the project's studio detail page. */
  href?: string
  /** The first stage on the page loads its image eagerly. */
  eager?: boolean
}

/**
 * A project screenshot tucked into a tinted pocket. At rest only the top of the
 * screenshot shows above a frosted front panel; on hover, focus or (on touch)
 * scrolling into view, the screenshot rises, the panel drops and the tags fly
 * out to the sides.
 *
 * The movement is CSS transitions rather than Framer Motion on purpose: it is a
 * pure hover state, so it belongs on the compositor where it stays smooth even
 * while the main thread is busy.
 */
export default function PocketStage({ project, tagCount = 4, href, eager = false }: PocketStageProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const finePointer = useFinePointer()

  // Touch devices have no hover, so the stage opens when it is mostly on screen
  useEffect(() => {
    if (finePointer) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-open', entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [finePointer])

  const tags = project.tags.slice(0, tagCount)

  return (
    <Link
      ref={ref}
      to={href ?? `/studio/${project.slug}`}
      className="pocket"
      aria-label={`View the ${project.company} case study`}
      style={{ ['--tint' as string]: `var(--tint-${project.tint})` }}
    >
      <span className="pocket-back" aria-hidden="true" />

      {tags.map((tag, i) => {
        const config = TAGS[i]
        if (!config) return null
        return (
          <span
            key={tag}
            className="pocket-tag"
            aria-hidden="true"
            style={{
              ...config.place,
              ['--tag-x' as string]: config.x,
              ['--tag-y' as string]: config.y,
              ['--tag-rotate' as string]: config.rotate,
              ['--tag-delay' as string]: `calc(${i} * var(--stagger-tags))`,
            }}
          >
            {tag}
          </span>
        )
      })}

      <span className="pocket-shot">
        {project.screenshot ? (
          <img
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          // Media for this project is not on Cloudinary yet; hold the space
          <span
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: '100%', background: 'var(--color-surface)' }}
          />
        )}
      </span>

      <span className="pocket-front" aria-hidden="true" />
    </Link>
  )
}
