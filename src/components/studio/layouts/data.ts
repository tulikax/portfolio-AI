import { MID_PLATFORM } from '../../../constants/media'

/**
 * Content for the Pocket stack and Bento board layouts.
 *
 * Separate from `content.ts` (the quiet layout) and from `data/caseStudies.ts`
 * (the dark site) because the copy is written differently again — outcome-first
 * headlines and a three-part short version.
 *
 * ⚠️ Tulika: Brushh is new here — it is in neither of the other two content
 * files. Its slug has no detail page, so its links fall through to /studio.
 * Deloitte keeps the existing `deloitte-nlg` slug so its link resolves.
 */
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
  },
]

/** The three projects with screenshots — Brushh is not in the Pocket stack. */
export const STACK_PROJECTS = PROJECTS.filter((p) => p.slug !== 'brushh')

export const EMAIL_ADDRESS = `${'tulikaxu'}@${'gmail.com'}`

export const HERO_HEADLINE = 'I make complex, data-heavy products feel obvious to use.'

export const HERO_BODY =
  'Senior product designer in London. Currently at DoorFeed, before that SigTech, Brushh and Deloitte.'
