import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SiteFooter, SiteHeader } from '../Chrome'
import PocketStage from '../PocketStage'
import { getNextProject, getProject, type CaseStudy } from '../data'
import { useLayoutSearch } from '../../useStudioLayout'
import CaseBento from './CaseBento'

const container: React.CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  paddingInline: 'var(--space-page-x)',
  paddingTop: 12,
}

/**
 * Back to the homepage, carrying which project to return the reader to.
 *
 * The layout param rides along so the reader lands back in the layout they
 * left, rather than whichever one localStorage happens to hold.
 */
function BackLink({ slug }: { slug: string }) {
  const [params] = useSearchParams()
  const layout = params.get('layout')

  return (
    <Link
      to={{ pathname: '/studio', search: layout ? `?layout=${layout}` : '' }}
      state={{ scrollToProject: slug }}
      className="case-back"
    >
      Back to all work
    </Link>
  )
}

function CaseHeader({ project }: { project: ReturnType<typeof getProject> & object }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Arriving on the page, the reader should start at the title, not mid-scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    headingRef.current?.focus()
  }, [project.slug])

  const hasHero = !!project.screenshot

  return (
    <header>
      <BackLink slug={project.slug} />

      <p
        style={{
          margin: 'var(--space-section) 0 10px',
          color: 'var(--color-muted)',
          fontSize: 15,
        }}
      >
        {project.company}, {project.when.toLowerCase()}
      </p>

      <h1
        ref={headingRef}
        tabIndex={-1}
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(34px, 5vw, 64px)',
          lineHeight: 1.04,
          maxWidth: '24ch',
          outline: 'none',
        }}
      >
        {project.headline}
      </h1>

      {project.tags.length > 0 && (
        // With a hero the pocket already shows these above md, so the chips
        // become screen-reader-only there rather than disappearing entirely
        <ul className={hasHero ? 'case-chips case-chips--hero' : 'case-chips'}>
          {project.tags.map((tag) => (
            <li key={tag} className="case-chip">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

function LongformSections({ sections }: { sections: CaseStudy['sections'] }) {
  if (!sections || sections.length === 0) return null

  return (
    <div className="case-longform" style={{ marginTop: 'var(--space-section)' }}>
      {sections.map((section) => (
        <section
          key={section.heading}
          style={{ maxWidth: 'var(--measure-longform)', marginBottom: 'var(--space-section)' }}
        >
          <h2
            style={{
              margin: '0 0 14px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(28px, 3vw, 38px)',
              lineHeight: 1.1,
            }}
          >
            {section.heading}
          </h2>

          {section.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {section.image && (
            <figure style={{ margin: '24px 0 0' }}>
              <img
                src={section.image.src}
                alt={section.image.alt}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  aspectRatio: '16 / 10',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-stage)',
                  display: 'block',
                }}
              />
              {section.image.caption && (
                <figcaption style={{ marginTop: 10, fontSize: 14, color: 'var(--color-muted)' }}>
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}
        </section>
      ))}
    </div>
  )
}

function NextProject({ slug, hasLongform }: { slug: string; hasLongform: boolean }) {
  const next = getNextProject(slug)
  const layoutSearch = useLayoutSearch()

  return (
    <Link
      to={`/studio/${next.slug}${layoutSearch}`}
      className="case-next"
      aria-label={`Next project: ${next.company}, ${next.shortTitle}`}
      style={{
        marginTop: hasLongform ? 'var(--space-section)' : 12,
        ['--tint' as string]: `var(--tint-${next.tint})`,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
        Next project: {next.company}
      </span>
      <span aria-hidden="true" className="case-next-title">
        {next.shortTitle}
      </span>
    </Link>
  )
}

function CaseNotFound() {
  useEffect(() => {
    document.title = 'Case study not found | Tulika Singh'
  }, [])

  return (
    <div className="studio-alt">
      <SiteHeader />
      <main style={container}>
        <h1
          style={{
            margin: 'var(--space-section) 0 0',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(34px, 5vw, 64px)',
            lineHeight: 1.04,
          }}
        >
          That case study doesn&rsquo;t exist.
        </h1>
        <p style={{ color: 'var(--color-muted)', marginTop: 14 }}>
          It may have been renamed or removed.
        </p>
        <Link to="/studio" className="studio-alt-link">
          Back to all work
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}

/** The bento-summary case study, used by the Pocket stack and Bento layouts. */
export default function CasePage({ slug }: { slug: string }) {
  const project = getProject(slug)

  useEffect(() => {
    if (project) document.title = `${project.company} case study | Tulika Singh`
  }, [project])

  if (!project) return <CaseNotFound />

  const sections = project.caseStudy.sections
  const hasLongform = !!sections && sections.length > 0

  return (
    <div className="studio-alt">
      <SiteHeader />

      <main style={container}>
        <CaseHeader project={project} />

        {project.screenshot && (
          <div style={{ marginTop: 'var(--space-section)' }}>
            <PocketStage project={project} variant="static" hero eager />
          </div>
        )}

        <CaseBento project={project} />
        <LongformSections sections={sections} />
        <NextProject slug={slug} hasLongform={hasLongform} />
      </main>

      <SiteFooter />
    </div>
  )
}
