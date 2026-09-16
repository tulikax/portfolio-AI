import type { CaseStudy, Project } from '../data'

/**
 * The four summary cards. At `lg` and up they sit in two columns with Story
 * spanning both rows and Impact running full width; below that they stack in
 * reading order.
 */

function ProductCard({ project }: { project: Project }) {
  return (
    <section className="case-card case-bento-product">
      <h2 className="case-h2">
        Product <em>{project.company}</em>
      </h2>
      <p className="case-body">{project.caseStudy.product}</p>
    </section>
  )
}

function DetailsCard({ details }: { details: CaseStudy['details'] }) {
  return (
    <section className="case-card case-bento-details">
      <h2 className="case-h2">Details</h2>

      {/*
        `dt` before `dd` in the markup so a screen reader hears "surface: Web
        platform"; CSS order flips them visually so the value reads first.
      */}
      <dl style={{ margin: 0 }}>
        {details.map((detail) => (
          <div key={detail.label} className="case-details-row">
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function StoryCard({ story }: { story: CaseStudy['story'] }) {
  return (
    <section className="case-card case-bento-story">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {story.map((block) => (
          <div key={block.label} className="case-story-block">
            <h2 className="case-h2">
              {block.label} <em>{block.subtitle}</em>
            </h2>
            <p className="case-body">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * The impact stats on their own, so the short-version sheet can show the same
 * figures beneath its details without duplicating the markup.
 */
export function ImpactStats({ impact }: { impact: CaseStudy['impact'] }) {
  return (
    <div className="case-stats" style={{ ['--stat-count' as string]: String(impact.length) }}>
      {impact.map((stat) => (
        <div key={stat.title} className="case-stat">
          <span className="case-figure">{stat.figure}</span>
          <h3 className="case-stat-title">{stat.title}</h3>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.5 }}>
            {stat.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function ImpactCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section className="case-card case-bento-impact">
      <h2 className="case-h2">
        Impact {caseStudy.impactNote && <em>{caseStudy.impactNote}</em>}
      </h2>
      <ImpactStats impact={caseStudy.impact} />
    </section>
  )
}

export default function CaseBento({ project }: { project: Project }) {
  const { caseStudy } = project

  return (
    <div className="case-bento">
      <ProductCard project={project} />
      <DetailsCard details={caseStudy.details} />
      <StoryCard story={caseStudy.story} />
      <ImpactCard caseStudy={caseStudy} />
    </div>
  )
}
