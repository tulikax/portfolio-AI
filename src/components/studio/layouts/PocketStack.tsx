import { STACK_PROJECTS } from './data'
import PocketStage from './PocketStage'
import ProjectLinks from './ProjectLinks'

/**
 * Layout 1 — a vertical run of the three projects with screenshots, one per
 * viewport. Brushh has no screenshot, so it is not in this layout.
 *
 * There are no scroll-triggered fade-ins: the pocket opening is the one motion
 * moment, and competing entrances would blunt it.
 */
export default function PocketStack() {
  return (
    <div
      className="studio-alt-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-stack-gap)' }}
    >
      {STACK_PROJECTS.map((project, i) => (
        <article key={project.slug} id={`project-${project.slug}`}>
          <PocketStage project={project} tagCount={4} eager={i === 0} />

          <h3 className="stack-headline">{project.headline}</h3>

          <div className="stack-meta">
            {/* The pocket hides its tags below md, so they reappear as chips */}
            {project.tags.map((tag) => (
              <span key={tag} className="stack-chip">
                {tag}
              </span>
            ))}

            <span style={{ color: 'var(--color-muted)' }}>
              {project.company}, {project.when.toLowerCase()}
            </span>

            <ProjectLinks project={project} />
          </div>
        </article>
      ))}
    </div>
  )
}
