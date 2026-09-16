import { Link } from 'react-router-dom'
import type { Project } from './data'
import { useLayoutSearch } from '../useStudioLayout'

/**
 * A project tile on the bento board. The whole tile is the link.
 *
 * At rest the screenshot sits slightly low and the outcome band is hidden; on
 * hover or focus the screenshot rises and the band comes up over it. On touch
 * the band is simply part of the tile — there is no hover to reveal it.
 */
export default function BentoTile({ project, eager = false }: { project: Project; eager?: boolean }) {
  const layoutSearch = useLayoutSearch()

  return (
    <Link
      // Lets the back link from a case study return the reader to this tile
      id={`project-${project.slug}`}
      to={`/studio/${project.slug}${layoutSearch}`}
      className="bento-tile bento-project"
      style={{ ['--tint' as string]: `var(--tint-${project.tint})` }}
    >
      <span style={{ fontSize: 14, color: 'var(--color-muted)' }}>
        {project.company}, {project.when.toLowerCase()}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 2.6vw, 36px)',
          lineHeight: 1.05,
          maxWidth: '16ch',
        }}
      >
        {project.shortTitle}
      </span>

      {project.screenshot && (
        <span className="bento-shot">
          <img
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </span>
      )}

      <span className="bento-band">{project.headline}</span>
    </Link>
  )
}
