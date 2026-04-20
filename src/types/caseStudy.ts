// ─── Primitives ────────────────────────────────────────────────

export type ImageLayout = 'full' | 'two-up' | 'three-up'

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

  // Overview strip — always shown, required
  goal: string
  yourRole: string
  outcome: string

  // Problem/Context — always shown, required
  problemStatement: string
  problemImage?: CaseStudyImage

  // Optional deeper content — presence drives rendering
  visualBlocks?: VisualBlock[]
  platformSections?: PlatformSection[]
  designDecisions?: DesignDecision[]
  prototypeEmbed?: {
    type: 'figma' | 'loom' | 'youtube' | 'iframe'
    url: string
    aspectRatio?: string  // e.g. "16/9", defaults to "16/9"
    caption?: string
  }

  // Navigation
  nextProject?: {
    slug: string
    title: string
    coverImage: CaseStudyImage
  }
}
