// ─── Project Tab types ─────────────────────────────────────────

export interface OutcomeStat {
  label: string
  value: string
  description: string
}

export interface ProjectTab {
  label: string
  goal: { heading: string; body: string }
  process: { heading: string; body: string }
  decisionsHeading?: string
  decisionsLayout?: 'grid' | 'side-by-side'
  /** When true, renders problem + goal + process as a horizontal 3-card intro instead of stacked sections */
  showProblemStatement?: boolean
  /** Visuals rendered between the Process section and the Decisions block */
  preDecisionVisuals?: VisualBlock[]
  decisions: Array<{
    title: string
    rationale: string
    /** Optional image rendered inline below this decision card */
    image?: CaseStudyImage
  }>
  outcome?: {
    heading: string
    stats: OutcomeStat[]
    footnote?: string
  }
  visualBlocks?: VisualBlock[]
}

// ─── Primitives ────────────────────────────────────────────────

export type ImageLayout = 'full' | 'two-up' | 'three-up' | 'scroll-horizontal'

export interface CaseStudyImage {
  src: string
  alt: string
  caption?: string
}

export interface DesignDecision {
  title: string
  rationale: string
  before?: CaseStudyImage
  after?: CaseStudyImage
}

export interface PlatformSection {
  platform: string       // e.g. "iOS", "Desktop", "Admin Dashboard"
  heading: string
  description: string
  images: CaseStudyImage[]
  layout?: ImageLayout   // defaults to 'full'
}

export interface VisualBlock {
  images: CaseStudyImage[]
  layout: ImageLayout
  label?: string         // optional section label above block
}

// ─── Main CaseStudy interface ──────────────────────────────────

export interface CaseStudy {
  // Identity
  slug: string
  title: string
  tagline: string

  // Meta
  year: string
  role: string
  duration: string
  company?: string

  // Hero — required
  heroMedia: CaseStudyImage  // .mp4/.webm → video; anything else → img
  heroAccentColor?: string   // optional CSS color for gradient overlay tint
  heroEyebrow?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroMeta?: Array<{ label: string; value: string }>
  heroTools?: Array<{ name: string; slug: string; ext?: string }>

  // Overview strip — always shown, required
  goal: string
  yourRole: string
  outcome: string

  // Problem/Context — always shown, required
  problemStatement: string
  problemImage?: CaseStudyImage
  /** Media shown directly below the problem statement in the Overview tab */
  problemMedia?: CaseStudyImage

  // Optional deeper content — presence drives rendering
  overviewSubtitle?: string    // small-caps label above the body text (e.g. "4 months at DoorFeed")
  overviewBody?: string        // paragraph text for Overview tab (split on \n\n)
  overviewHighlights?: Array<{ phrase: string; color: string; textColor?: string }>
  showOverviewCards?: boolean
  /** Images shown to the right of the overview body text, stacked vertically */
  overviewSideMedia?: CaseStudyImage[]
  projectTabs?: ProjectTab[]   // if present, replaces platformSections + designDecisions
  visualBlocks?: VisualBlock[]
  platformSections?: PlatformSection[]
  designDecisions?: DesignDecision[]
  prototypeEmbed?: {
    type: 'figma' | 'loom' | 'youtube' | 'iframe' | 'video'
    url: string
    aspectRatio?: string  // e.g. "16/9", defaults to "16/9"
    caption?: string
  }
  // Replaces ProblemSection when present; prototype is inserted after these, before designDecisions
  bodyParagraphs?: string[]
  // Rendered after designDecisions
  postDecisionBody?: string
  postDecisionImage?: CaseStudyImage

  // Navigation
  nextProject?: {
    slug: string
    title: string
    coverImage: CaseStudyImage
  }
}
