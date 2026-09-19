import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from './data'
import useFinePointer from './useFinePointer'
import { useLayoutSearch } from '../useStudioLayout'

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
  /**
   * `interactive` is the stack: the stage is itself the link.
   * `static` is the case study hero: held permanently open, no link, no tab
   * stop, no observer.
   * `embedded` is a bento tile: the motion is the same, but the tile around it
   * is already the link, so this renders a plain element and opens from the
   * tile's hover and focus instead of its own.
   */
  variant?: 'interactive' | 'static' | 'embedded'
  /** Widens the stage to the hero aspect ratio. */
  hero?: boolean
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
export default function PocketStage({
  project,
  tagCount = 4,
  href,
  eager = false,
  variant = 'interactive',
  hero = false,
}: PocketStageProps) {
  // A callback ref, because the root is an <a> in one variant and a <div> in
  // the others and a typed useRef cannot be handed to both
  const ref = useRef<HTMLElement | null>(null)
  const setRef = (el: HTMLElement | null) => {
    ref.current = el
  }

  const finePointer = useFinePointer()
  const layoutSearch = useLayoutSearch()
  const isStatic = variant === 'static'
  const isEmbedded = variant === 'embedded'

  // Touch devices have no hover, so the stage opens when it is mostly on screen
  useEffect(() => {
    if (isStatic || finePointer) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-open', entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [finePointer, isStatic])

  const tags = project.tags.slice(0, tagCount)
  const className =
    `pocket${isStatic ? ' pocket--static' : ''}${hero ? ' pocket--hero' : ''}` +
    `${isEmbedded ? ' pocket--embedded' : ''}`

  const layers = (
    <>
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
            alt={isStatic ? '' : project.screenshot.alt}
            loading={eager ? 'eager' : 'lazy'}
            // The hero is the largest paint on the case study page
            {...(eager ? { fetchPriority: 'high' as const } : {})}
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
    </>
  )

  if (isStatic) {
    return (
      <figure style={{ margin: 0 }}>
        <div
          className={className}
          aria-hidden="true"
          style={{ ['--tint' as string]: `var(--tint-${project.tint})` }}
        >
          {layers}
        </div>
        {project.screenshot && (
          <figcaption className="studio-alt-sr">{project.screenshot.alt}</figcaption>
        )}
      </figure>
    )
  }

  if (isEmbedded) {
    // The bento tile around this is already the link and the hover target, so
    // the stage is a plain element with no name of its own to announce
    return (
      <div
        ref={setRef}
        className={className}
        aria-hidden="true"
        style={{ ['--tint' as string]: `var(--tint-${project.tint})` }}
      >
        {layers}
      </div>
    )
  }

  return (
    <Link
      ref={setRef}
      to={href ?? `/studio/${project.slug}${layoutSearch}`}
      className={className}
      aria-label={`View the ${project.company} case study`}
      style={{ ['--tint' as string]: `var(--tint-${project.tint})` }}
    >
      {layers}
    </Link>
  )
}
