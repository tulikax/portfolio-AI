// ─── Project Tab types ─────────────────────────────────────────

export interface OutcomeStat {
  label: string
  value: string
  description: string
}

export interface ProjectTab {
  label: string
  goal: { heading: string; body: string }
  process?: { heading: string; body: string }
  decisionsHeading?: string
  decisionsLayout?: 'grid' | 'side-by-side' | 'caption'
  /** When true, renders problem + goal + process as a horizontal 3-card intro instead of stacked sections */
  showProblemStatement?: boolean
  /** When true, renders problem as a full-width section (with optional problemImage), then goal + process as regular section blocks */
  problemFirst?: boolean
  /** Image shown below the problem statement when problemFirst is true */
  problemImage?: CaseStudyImage
  /** Media shown directly below the project goal section */
  goalMedia?: CaseStudyImage
  /** Media shown directly below the process section */
  processMedia?: CaseStudyImage
  /** Secondary decisions block rendered after the main decisions (e.g. key design decisions in Pivots tab) */
  keyDecisions?: Array<{ title: string; rationale: string; image?: CaseStudyImage & { scale?: number; cropTop?: number; cropBottom?: number } }>
  keyDecisionsHeading?: string
  /** Replaces outcome block — rendered as a plain section (heading + body, no stat cards) */
  learnings?: { heading: string; body: string }
  /** Visuals rendered after the Goal section but before the Process section */
  postGoalVisuals?: VisualBlock[]
  /** Visuals rendered between the Process section and the Decisions block */
  preDecisionVisuals?: VisualBlock[]
  /** Visuals rendered between the Decisions block and the Outcome block */
  postDecisionVisuals?: VisualBlock[]
  decisions: Array<{
    title: string
    rationale: string
    /** Optional single image rendered inline below this decision card */
    image?: CaseStudyImage & { scale?: number; cropTop?: number; cropBottom?: number }
    /** Multiple images — renders a responsive grid instead of single image (caption layout only) */
    images?: Array<CaseStudyImage & { scale?: number }>
    /** Layout for the images array: 'grid' (default) or 'column' (stacked vertically, respects scale per image) */
    imagesLayout?: 'grid' | 'column' | 'side-all' | 'side-column'
  }>
  /** Image shown at the very top of the tab section, before the goal block (default layout only) */
  introMedia?: CaseStudyImage
  outcome?: {
    heading: string
    stats?: OutcomeStat[]
    footnote?: string
    /** 'teal-labels' hides the large value and renders the label in teal at 40% opacity */
    variant?: 'teal-labels'
    /** Image shown below the stats grid */
    outcomeMedia?: CaseStudyImage
    /** 'problem-callout' renders the footnote as an amber highlighted problem block */
    footnoteVariant?: 'problem-callout'
  }
  visualBlocks?: VisualBlock[]
  /** If set, renders a WIP info box and skips process/decisions/outcome */
  wip?: { message: string }
}

// ─── Primitives ────────────────────────────────────────────────

export type ImageLayout = 'full' | 'two-up' | 'three-up' | 'scroll-horizontal' | 'carousel'

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
  height?: string        // fixed card height — makes all items same height (image uses objectFit: cover)
  columns?: string       // override grid-template-columns (e.g. '7fr 3fr' for asymmetric splits)
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
  /** Wide image shown below problem media; auto-scrolls right-to-left on loop */
  overviewScrollMedia?: { src: string; alt: string; startX?: number }
  /** Media injected inline after specific paragraphs in the overview body */
  overviewInlineMedia?: Array<{ afterParagraph: number; src: string; alt: string; caption?: string; scale?: number }>
  /** If true, hides the problem statement block in the Overview tab */
  overviewHideProblem?: boolean
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
  postDecisionBodyBelow?: string

  // Navigation
  nextProject?: {
    slug: string
    title: string
    coverImage: CaseStudyImage
  }
}
