import { MID_PLATFORM } from '../../../constants/media'

/**
 * Content for the Pocket stack and Bento board layouts, and for the bento
 * case study pages they link to.
 *
 * Separate from `content.ts` (the quiet layout) and from `data/caseStudies.ts`
 * (the dark site) because the copy is written differently again — outcome-first
 * headlines, a three-part short version, and a Problem/Solution/Result story.
 *
 * ⚠️ Tulika: Brushh is new here — it is in neither of the other two content
 * files. Deloitte keeps the existing `deloitte-nlg` slug so its link resolves
 * alongside the quiet layout's case study.
 */

export type CaseStudy = {
  product: string
  details: { value: string; label: 'surface' | 'role' | 'team' | 'scope' }[]
  story: { label: 'Problem' | 'Solution' | 'Result'; subtitle: string; body: string }[]
  /** Optional italic note after "Impact" */
  impactNote?: string
  impact: { figure: string; title: string; body: string }[]
  /** Optional long-form content below the bento */
  sections?: {
    heading: string
    paragraphs: string[]
    image?: { src: string; alt: string; caption?: string }
  }[]
}

export type Project = {
  slug: string
  company: string
  /** Shown lowercase after the company: "DoorFeed, current role" */
  when: string
  role: string
  tint: 'doorfeed' | 'sigtech' | 'deloitte' | 'brushh'
  /** Outcome sentence, first person */
  headline: string
  /** Bento tile title */
  shortTitle: string
  /** Up to 4, used in the pocket */
  tags: string[]
  screenshot?: { src: string; alt: string }
  short: { problem: string; did: string; changed: string }
  caseStudy: CaseStudy
}

export const PROJECTS: Project[] = [
  {
    slug: 'doorfeed',
    company: 'DoorFeed',
    when: 'Current role',
    role: 'Senior product designer',
    tint: 'doorfeed',
    headline:
      'I untangled location analysis for a real estate investment platform, turning four upload paths into one filtered view.',
    shortTitle: 'Four upload paths, one filtered map',
    tags: ['Solo designer', 'UX audit', 'Maps and location', 'Live product'],
    screenshot: { src: MID_PLATFORM.compsLight, alt: 'DoorFeed comparables, restructured around the map' },
    short: {
      problem:
        'Uploading and analysing locations was split across four separate interactions, and session replays showed people dropping off between them.',
      did: 'Ran an end-to-end audit of the maps and location flows, redesigned the information architecture for portfolio views, and worked with engineering on Mapbox accuracy limits across regions.',
      changed:
        'One filter-driven view replaced four upload paths, redundant UI states were cut, and the pattern is now reused across other flows.',
    },
    caseStudy: {
      product:
        'A real estate investment platform where investors upload, filter and analyse property locations and portfolios on a map.',
      details: [
        { value: 'Web platform: maps and portfolio views', label: 'surface' },
        { value: 'Senior product designer', label: 'role' },
        { value: 'Solo designer working with product and engineering', label: 'team' },
        { value: 'UX audit, information architecture, session replay analysis, microcopy', label: 'scope' },
      ],
      story: [
        {
          label: 'Problem',
          subtitle: 'Four ways in',
          body: 'Uploading and analysing locations was split across four separate interactions, and session replays showed people dropping off between them.',
        },
        {
          label: 'Solution',
          subtitle: 'One view, driven by filters',
          body: 'A single filter-driven view for uploading and analysing locations, a simpler information architecture for portfolio views, and clear microcopy where location accuracy has real limits.',
        },
        {
          label: 'Result',
          subtitle: 'A pattern other flows reuse',
          body: 'One filter-driven view replaced four upload paths, redundant UI states were cut, and the pattern is now reused across other flows.',
        },
      ],
      impactNote: 'so far',
      impact: [
        {
          figure: '4 to 1',
          title: 'Upload interactions merged',
          body: 'Four fragmented upload interactions became one filter-driven view',
        },
        {
          figure: '~20',
          title: 'Pull requests shipped',
          body: 'Made directly in the codebase in my first three months',
        },
      ],
      sections: [],
    },
  },
  {
    slug: 'sigtech',
    company: 'SigTech',
    when: '2024 to 2025',
    role: 'Product designer',
    tint: 'sigtech',
    headline:
      'As the only designer on two finance analytics products, I rebuilt the design system and cut design-to-build cycles by 40%.',
    shortTitle: 'Two analytics products, one designer',
    tags: ['Sole designer', 'AI use cases', 'Design system', 'Figma MCP'],
    // No screenshot: SigTech media has never been migrated to Cloudinary
    short: {
      problem:
        'Two B2B finance analytics products needed product definition and delivery, with a single designer and a Figma system that had to line up with engineering libraries.',
      did: 'Led product definition, validated five AI use cases through rapid prototyping and stakeholder review, rebuilt the design system around the engineering libraries, and shipped features directly in Cursor via Figma MCP.',
      changed:
        'Design-to-build iteration cycles got 40% shorter, with accessible, reusable patterns shared by design and engineering.',
    },
    caseStudy: {
      product:
        'Two B2B analytics products for finance teams, including AI features for exploring and explaining strategy data.',
      details: [
        { value: 'Web analytics platform', label: 'surface' },
        { value: 'Product designer, sole designer', label: 'role' },
        { value: 'Cross-functional product and engineering team', label: 'team' },
        { value: 'Product definition, AI prototyping, design system, Cursor and Figma MCP', label: 'scope' },
      ],
      story: [
        {
          label: 'Problem',
          subtitle: 'One designer, two products',
          body: 'Two B2B finance analytics products needed product definition and delivery, with a single designer and a Figma system that had to line up with engineering libraries.',
        },
        {
          label: 'Solution',
          subtitle: 'Prototype first, then ship in code',
          body: 'Rapid prototypes to test AI use cases with stakeholders, a design system rebuilt around the engineering libraries, and features shipped directly in Cursor via Figma MCP.',
        },
        {
          label: 'Result',
          subtitle: 'Faster from Figma to production',
          body: 'Design-to-build iteration cycles got 40% shorter, with accessible, reusable patterns shared by design and engineering.',
        },
      ],
      impact: [
        {
          figure: '40%',
          title: 'Shorter iteration cycles',
          body: 'From design to build, after the design system rebuild',
        },
        {
          figure: '5',
          title: 'AI use cases validated',
          body: 'Through rapid prototyping and stakeholder review',
        },
        {
          figure: '2',
          title: 'Products, one designer',
          body: 'B2B finance analytics products taken from definition to delivery',
        },
      ],
      sections: [],
    },
  },
  {
    slug: 'deloitte-nlg',
    company: 'Deloitte',
    when: '2019 to 2021',
    role: 'UX designer, web and mobile',
    tint: 'deloitte',
    headline:
      'I helped design a tool that used machine learning to draft the reports analysts had been writing by hand.',
    shortTitle: 'Reports that draft themselves',
    tags: ['Innovation team', 'Language generation', 'Accessibility', 'Enterprise'],
    // No screenshot: Deloitte media has never been migrated to Cloudinary
    short: {
      problem:
        'Teams spent many hours writing reports by hand from data that already existed, on enterprise platforms that also had to meet WCAG.',
      did: 'Worked with the innovation team on a natural language generation tool, ran sprints that aligned engineering, subject experts and business stakeholders, and designed with accessibility specialists.',
      changed: 'Reporting took fewer hours, and task completion got faster on the accessible enterprise platforms.',
    },
    caseStudy: {
      product:
        'An internal natural language generation tool that used machine learning to draft reports from existing data, alongside accessible enterprise web and mobile platforms.',
      details: [
        { value: 'Enterprise web and mobile', label: 'surface' },
        { value: 'UX designer', label: 'role' },
        { value: 'Innovation team, engineering, accessibility specialists', label: 'team' },
        { value: 'Sprint facilitation, ML tooling, accessibility, enterprise UX', label: 'scope' },
      ],
      story: [
        {
          label: 'Problem',
          subtitle: 'Hours lost to writing reports',
          body: 'Teams spent many hours writing reports by hand from data that already existed, on enterprise platforms that also had to meet WCAG.',
        },
        {
          label: 'Solution',
          subtitle: 'Let the data draft the first pass',
          body: 'A generation tool that drafts reports from the source data so people review and edit instead of writing from scratch, designed in sprints with engineering, subject experts and business stakeholders.',
        },
        {
          label: 'Result',
          subtitle: 'Fewer hours on reporting',
          body: 'Reporting took fewer hours, and task completion got faster on the accessible enterprise platforms.',
        },
      ],
      impact: [
        {
          figure: 'WCAG',
          title: 'Compliant interfaces',
          body: 'Designed and checked with accessibility specialists',
        },
        {
          figure: '3',
          title: 'Groups in one sprint cadence',
          body: 'Engineering, subject experts and business stakeholders',
        },
      ],
      sections: [],
    },
  },
  {
    slug: 'brushh',
    company: 'Brushh',
    when: '2021 to 2023',
    role: 'Product designer',
    tint: 'brushh',
    headline: 'I halved the time start-ups took to validate an MVP by prototyping in Framer and Webflow.',
    shortTitle: 'MVPs validated in half the time',
    tags: [],
    short: {
      problem: 'Early-stage start-ups needed to know whether an idea worked before paying to build it properly.',
      did: 'Built design systems and validated product concepts across several start-ups and scale-ups, using fast prototypes in Framer and Webflow.',
      changed: 'MVP validation time was halved.',
    },
    caseStudy: {
      product:
        'Design work across several start-ups and scale-ups: design systems, product concepts and fast prototypes to test ideas before a full build.',
      details: [
        { value: 'Web products and no-code prototypes', label: 'surface' },
        { value: 'Product designer', label: 'role' },
        { value: 'Founders and small product teams', label: 'team' },
        { value: 'Design systems, concept validation, Framer, Webflow', label: 'scope' },
      ],
      story: [
        {
          label: 'Problem',
          subtitle: 'Expensive to learn an idea is wrong',
          body: 'Early-stage start-ups needed to know whether an idea worked before paying to build it properly.',
        },
        {
          label: 'Solution',
          subtitle: 'Prototype before building',
          body: 'Built design systems and validated product concepts across several start-ups and scale-ups, using fast prototypes in Framer and Webflow.',
        },
        {
          label: 'Result',
          subtitle: 'Answers in half the time',
          body: 'MVP validation time was halved.',
        },
      ],
      impact: [
        {
          figure: '50%',
          title: 'Less time to validate an MVP',
          body: 'Using Framer and Webflow prototypes instead of early builds',
        },
      ],
      sections: [],
    },
  },
]

/** The three projects with screenshots — Brushh is not in the Pocket stack. */
export const STACK_PROJECTS = PROJECTS.filter((p) => p.slug !== 'brushh')

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

/** DoorFeed → SigTech → Deloitte → Brushh → back to DoorFeed. */
export function getNextProject(slug: string): Project {
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(index + 1) % PROJECTS.length]
}

export const EMAIL_ADDRESS = `${'tulikaxu'}@${'gmail.com'}`

export const HERO_HEADLINE = 'I make complex, data-heavy products feel obvious to use.'

export const HERO_BODY =
  'Senior product designer in London. Currently at DoorFeed, before that SigTech, Brushh and Deloitte.'
