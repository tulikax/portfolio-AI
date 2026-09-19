import { Link } from 'react-router-dom'
import type { Project } from './data'
import PocketStage from './PocketStage'
import { useLayoutSearch } from '../useStudioLayout'

/**
 * A project tile on the bento board. The whole tile is the link.
 *
 * The screenshot sits in a pocket, the same one the Pocket stack uses: at rest
 * only its top shows above the front panel, and on hover or focus it rises
 * while the panel drops and the tags fly out. The outcome band still comes up
 * over the foot of the tile. On touch, where there is no hover, the pocket
 * opens on scrolling into view and the band is simply part of the tile.
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

      {/* The pocket is the hover reveal here too; the tile is the link around it */}
      <PocketStage project={project} variant="embedded" eager={eager} />

      <span className="bento-band">{project.headline}</span>
    </Link>
  )
}
