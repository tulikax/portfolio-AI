/**
 * All copy and media for the /studio routes.
 *
 * Kept beside the pages like `about/content.ts`, and deliberately separate from
 * `data/caseStudies.ts`: the five-beat structure here does not map onto that
 * file's chapter model, and bending it to fit would mean adding studio-only
 * fields to a type the dark site also depends on.
 *
 * ─── On the pending slabs ────────────────────────────────────────────────────
 * SigTech and Deloitte media has never been migrated to Cloudinary — it still
 * lives as 25MB+ `.mov` and `.png` files in `src/assets`, which is too heavy to
 * ship and unreliable to autoplay. Those slabs are `kind: 'pending'`: the space
 * and caption are correct, the media is not there yet. To fill one, upload the
 * asset and swap `kind: 'pending'` for `kind: 'image' | 'video'` with the ID.
 *
 * ─── ⚠️ Tulika ──────────────────────────────────────────────────────────────
 * Lines marked `⚠️ inferred` are the places where I filled a gap rather than
 * found the fact. Everything else is compressed from data/caseStudies.ts or
 * about/content.ts. Edit freely — this file is the whole content surface.
 */

import { MID_PLATFORM, NEW_PLATFORM, OLD_PLATFORM, poster } from '../../constants/media'
import type { SlabMedia } from './MediaFrame'

export interface StudioSlab {
  media: SlabMedia
  caption?: string
  /**
   * Width ÷ height. On the intro page this also sets the tile's width, so
   * varying it across a gallery is what makes the brick pattern irregular.
   */
  ratio?: number
  /**
   * Intro-page carousel only. `large` takes a full-height column to itself,
   * `small` (the default) pairs with its neighbour. Ignored on detail pages.
   */
  size?: 'large' | 'small'
}

export interface StudioBeat {
  /** Shown as the eyebrow above the paragraph. */
  label: string
  body: string
  slabs: StudioSlab[]
}

export interface StudioProject {
  slug: string
  name: string
  year: string
  company: string
  /** Shown on the intro page under this project's eyebrow. */
  gallery: StudioSlab[]
  beats: StudioBeat[]
  /** Slug of the project linked at the foot of the detail page. */
  next: string
}

/* ── Intro page ─────────────────────────────────────────────────────────── */

export const NAME = 'Tulika'

/** Split across expressions to keep the address out of scrapers, as CTASection does. */
export const EMAIL = `${'hello'}@${'tulika.design'}`

export const LINKEDIN = 'https://linkedin.com/in/tulika-'

/**
 * The whole of the text on the intro page. Inline links use `[label](href)`;
 * hrefs starting with `/` route client-side.
 */
export const BIO: string[] = [
  "I'm Tulika, a product designer in London. My focus has always been finance and complex systems — dense workflows, high-stakes platforms, legacy systems. The spaces where trust and speed both have to hold.",

  "Right now I'm the solo designer at [DoorFeed](/studio/doorfeed), building an AI-native workspace for institutional real estate investors across the UK and French markets. I think like a PM and ship like an engineer — twenty-odd pull requests in my first three months.",

  "Before that I designed agentic AI tools for quantitative finance at [SigTech](/studio/sigtech), deep in developer experience and the question of what makes an analyst trust a machine enough to act on it. I started out at [Deloitte](/studio/deloitte-nlg) on the Innovations team, where consulting taught me to design at scale and in public.",

  `I'm working out what it means to build AI into highly regulated spaces — what to optimise, and where to draw the line. If you're building something in that territory, [say hello](mailto:${EMAIL}).`,
]

/* ── Projects ───────────────────────────────────────────────────────────── */

const doorfeed: StudioProject = {
  slug: 'doorfeed',
  name: 'DoorFeed',
  year: '2026',
  company: 'DoorFeed',

  gallery: [
    {
      media: {
        kind: 'video',
        src: NEW_PLATFORM.compsOutput,
        poster: poster('comps-output'),
        alt: 'Comparables output on the agentic platform',
      },
      caption: 'Comparables output, generated in-platform.',
      size: 'large',
      ratio: 1.62,
    },
    {
      media: {
        kind: 'image',
        src: NEW_PLATFORM.hybridWorkspaceExpanded,
        alt: 'Hybrid workspace with the structured panel expanded',
      },
      caption: 'Hybrid workspace — structured panel expanded.',
      ratio: 1.78,
    },
    {
      media: { kind: 'image', src: NEW_PLATFORM.chatInterface, alt: 'The open chat interface' },
      caption: 'Round one — open chat over the data.',
      ratio: 1.78,
    },
    {
      media: { kind: 'image', src: MID_PLATFORM.compsLight, alt: 'Restructured comparables, light' },
      caption: 'Comparables, restructured around the map.',
      size: 'large',
      ratio: 1.45,
    },
    {
      media: { kind: 'image', src: NEW_PLATFORM.homepageAssetFirst, alt: 'Asset-first homepage' },
      caption: 'The homepage, rebuilt around assets.',
      ratio: 1.5,
    },
    {
      media: {
        kind: 'image',
        src: NEW_PLATFORM.workflowsIntoConversation,
        alt: 'A workflow opening into a conversation',
      },
      caption: 'A workflow opening into a conversation.',
      ratio: 1.5,
    },
    {
      media: {
        kind: 'video',
        src: NEW_PLATFORM.compsChatDrilldown,
        poster: poster('comps_in_caht'),
        alt: 'Drilling into comparables from chat',
      },
      caption: 'Drilling into a comparable from the conversation.',
      size: 'large',
      ratio: 1.7,
    },
    {
      media: { kind: 'image', src: MID_PLATFORM.navBar, alt: 'Consolidated navigation' },
      caption: 'Navigation, consolidated into one dropdown.',
      ratio: 1.9,
    },
    {
      media: { kind: 'image', src: MID_PLATFORM.businessPlan, alt: 'Business plan view' },
      caption: 'The business plan view.',
      ratio: 1.6,
    },
    {
      media: {
        kind: 'video',
        src: NEW_PLATFORM.marketReportGeneration,
        poster: poster('market-report-generation'),
        alt: 'Generating a market report end to end',
      },
      caption: 'A market report, generated end to end.',
      size: 'large',
      ratio: 1.55,
    },
    {
      media: { kind: 'image', src: NEW_PLATFORM.earlyDirection, alt: 'Early direction sketches' },
      caption: 'Early direction sketches.',
      ratio: 1.4,
    },
    {
      media: { kind: 'image', src: OLD_PLATFORM.dataroom, alt: 'The dataroom, already built and buried' },
      caption: 'The dataroom — already built, and buried.',
      ratio: 1.7,
    },
  ],

  beats: [
    {
      label: 'Context',
      body: 'I joined DoorFeed just after their first public release of AI intelligence inside a B2B platform for institutional real estate investors across the UK and French markets. The product worked. It also showed every seam of a first version — navigation that overwhelmed more than it guided, and a map that existed but was not usable.',
      slabs: [
        {
          media: { kind: 'image', src: OLD_PLATFORM.navigation, alt: 'The platform before — section navigation flattened into rows of sibling tabs' },
          caption: 'Before — section navigation flattened into rows of sibling tabs.',
        },
      ],
    },
    {
      label: 'Problem',
      body: 'Users were treating DoorFeed as a data extraction layer: pull the comparables, leave, do the actual analysis somewhere else. Session review put numbers on it — rage clicks concentrated in the comparables area, and consistent early exits. The platform was supplying data without ever becoming the place the work happened.',
      slabs: [
        {
          media: { kind: 'image', src: OLD_PLATFORM.posthog, alt: 'PostHog session review showing rage clicks in the comparables area' },
          caption: 'Session review — rage clicks concentrated in one area of the product.',
        },
      ],
    },
    {
      label: 'Exploration',
      body: 'Three rounds, each abandoned faster than the last. Round one put an open chat interface over the data, which tested as powerful and directionless — nobody knew what to ask it. Round two named the work: the prompt stayed, with workflow cards underneath it. Round three stopped treating chat and structure as alternatives and let a workflow open into a conversation, with the structured panel still there beside it.',
      slabs: [
        {
          media: { kind: 'image', src: NEW_PLATFORM.chatInterface, alt: 'Round one — the open chat interface' },
          caption: 'Round one — open chat over the data. Powerful, and directionless.',
        },
        {
          media: { kind: 'image', src: NEW_PLATFORM.chatWorkflows, alt: 'Round two — prompt with named workflow cards beneath' },
          caption: 'Round two — naming the work with workflow cards.',
        },
        {
          media: { kind: 'image', src: NEW_PLATFORM.workflowsIntoConversation, alt: 'Round three — a workflow opening into a conversation' },
          caption: 'Round three — a workflow that opens into a conversation rather than replacing it.',
        },
      ],
    },
    {
      label: 'Decisions Made',
      // ⚠️ inferred — the changes themselves are recorded; the reasoning
      // ("cost a click and bought a mental model") is my reading of them.
      body: 'The navigation collapsed into a single grouped dropdown, which cost a click and bought a mental model. Comparables were restructured around the map rather than burying it in a filter sidebar. And the homepage became asset-first — the thing an investor actually holds in their head — instead of opening on a tool menu.',
      slabs: [
        {
          media: { kind: 'image', src: MID_PLATFORM.navBar, alt: 'Consolidated navigation grouped into a single dropdown' },
          caption: 'Navigation consolidated into one grouped dropdown.',
        },
        {
          media: { kind: 'image', src: MID_PLATFORM.compsDark, alt: 'Restructured comparables with the map surfaced' },
          caption: 'Comparables restructured around the map.',
        },
        {
          media: {
            kind: 'video',
            src: NEW_PLATFORM.compsChatDrilldown,
            poster: poster('comps_in_caht'),
            alt: 'Drilling into comparables from chat',
          },
          caption: 'Drilling into a comparable without leaving the conversation.',
        },
      ],
    },
    {
      label: 'Impact',
      body: 'Shipped a redesigned comparables map and summary view, cutting the time an analyst needs to reach an insight, and established the design system the rest of the platform now builds on. The agentic layer is live in front of enterprise clients, and the strategic case for it — built with the founder and CTO — is what the next phase of the product is being shaped around.',
      slabs: [
        {
          media: {
            kind: 'video',
            src: NEW_PLATFORM.marketReportGeneration,
            poster: poster('market-report-generation'),
            alt: 'Generating a market report end to end',
          },
          caption: 'A market report generated end to end, inside the platform.',
        },
      ],
    },
  ],

  next: 'sigtech',
}

const sigtech: StudioProject = {
  slug: 'sigtech',
  name: 'SigTech MAGIC',
  year: '2024–2025',
  company: 'SigTech',

  gallery: [
    {
      media: { kind: 'pending', alt: 'MAGIC — the shipped chat flow' },
      caption: 'MAGIC — the shipped interface.',
      size: 'large',
      ratio: 1.62,
    },
    {
      media: { kind: 'pending', alt: 'Jobs as a concept' },
      caption: 'Jobs — the unit that replaced the conversation.',
      ratio: 1.78,
    },
    {
      media: { kind: 'pending', alt: 'Task list as a transparency device' },
      caption: 'The task list, making reasoning visible.',
      ratio: 1.5,
    },
    {
      media: { kind: 'pending', alt: 'Verify source, view related, copy with attribution' },
      caption: 'Every claim carrying its source.',
      size: 'large',
      ratio: 1.5,
    },
    {
      media: { kind: 'pending', alt: 'The SigTech Quant IDE' },
      caption: 'The Quant IDE this began inside.',
      ratio: 1.9,
    },
    {
      media: { kind: 'pending', alt: 'Pivot explorations beyond chat' },
      caption: 'Explorations beyond chat.',
      ratio: 1.4,
    },
    {
      media: { kind: 'pending', alt: 'Metabase tracking of pilot metrics' },
      caption: 'Pilot metrics, instrumented to validate each direction.',
      size: 'large',
      ratio: 1.7,
    },
  ],

  beats: [
    {
      label: 'Context',
      body: 'I was brought in to improve SigTech’s Quant IDE. Running alongside it was an internal experiment — a ChatGPT-style plugin for macroeconomic data, originally built to enhance the IDE, by then showing enough promise to become a product of its own.',
      slabs: [
        { media: { kind: 'pending', alt: 'The SigTech Quant IDE' }, caption: 'The Quant IDE — the platform I was hired to work on.' },
      ],
    },
    {
      label: 'Problem',
      body: 'Usage was reasonable and churn was high, and enterprise contracts kept stalling at the same point. Sitting in on sales calls and cross-referencing session data, the signal was consistent: analysts were not rejecting the AI, they were rejecting its opacity. They could not see how a conclusion was reached, which sources it used, or why today’s output differed from yesterday’s. In mid-2024 ChatGPT answers carried no citations — so there was no reason to trust an output enough to act on it, and no reason to switch.',
      slabs: [
        { media: { kind: 'pending', alt: 'The original ChatGPT plugin that became MAGIC' }, caption: 'The original plugin — answers with no way to verify them.' },
      ],
    },
    {
      label: 'Exploration',
      body: 'Three directions, each killed faster than the last. First, multiple GPTs living inside the existing IDE — demo calls were enthusiastic, but nobody was sure they would actually use it, so we stopped. Second, fully chat-based, which ran straight back into the opacity problem. Third, we stopped designing a chat product and started designing for the shape of the work: generic enough to scale, specific enough to trust.',
      slabs: [
        { media: { kind: 'pending', alt: 'Pivot one — multiple GPTs within the existing IDE' }, caption: 'Pivot one — multiple GPTs inside the IDE.' },
        { media: { kind: 'pending', alt: 'Pivot two — fully chat based' }, caption: 'Pivot two — fully chat-based, and back to square one on trust.' },
        { media: { kind: 'pending', alt: 'Pivot three — explorations beyond chat' }, caption: 'Pivot three — beyond chat, toward something scalable.' },
      ],
    },
    {
      label: 'Decisions Made',
      body: 'Jobs replaced open-ended conversation as the core unit, giving the work a shape an analyst could hand to someone else. A visible task list turned the model’s reasoning from a black box into something you could watch happen. And every generated claim carried its source, with verify, view-related and copy-with-attribution built into the output rather than bolted beside it.',
      slabs: [
        { media: { kind: 'pending', alt: 'Day one — chat only' }, caption: 'Day one — chat only, for contrast.' },
        { media: { kind: 'pending', alt: 'Jobs as a concept' }, caption: 'Jobs — the unit that replaced the conversation.' },
        { media: { kind: 'pending', alt: 'Verify source, view related, copy with attribution' }, caption: 'Every claim carrying its source.' },
      ],
    },
    {
      label: 'Impact',
      body: 'Churn fell by around 24% and time-to-insight improved by roughly 39%, measured against pilot metrics the data team and I instrumented for exactly this. The bigger shift was positional: MAGIC stopped being pitched as an AI chat assistant and became a Financial Intelligence Platform, which is the framing that moved enterprise clients and investors.',
      slabs: [
        { media: { kind: 'pending', alt: 'Metabase tracking of pilot metrics' }, caption: 'Pilot metrics — instrumented to validate each direction.' },
      ],
    },
  ],

  next: 'deloitte-nlg',
}

const deloitte: StudioProject = {
  slug: 'deloitte-nlg',
  name: 'NLG Reporting Tool',
  year: '2020',
  company: 'Deloitte',

  gallery: [
    {
      media: { kind: 'pending', alt: 'The NLG reporting tool interface' },
      caption: 'The NLG reporting tool.',
      size: 'large',
      ratio: 1.6,
    },
    {
      media: { kind: 'pending', alt: 'Track changes UI for AI-generated content' },
      caption: 'Track changes — every sentence declaring its origin.',
      ratio: 1.78,
    },
    {
      media: { kind: 'pending', alt: 'Confidence scoring surfaced as editorial signal' },
      caption: 'Confidence scores as a soft editorial signal.',
      ratio: 1.5,
    },
    {
      media: { kind: 'pending', alt: 'Wireframes for the five-step wizard' },
      caption: 'Wireframes — the five-step guided flow.',
      size: 'large',
      ratio: 1.45,
    },
    {
      media: { kind: 'pending', alt: 'Deloitte project overview' },
      caption: 'Selected work from the Innovations team.',
      ratio: 1.7,
    },
    {
      media: { kind: 'pending', alt: 'HR conversational assistant' },
      caption: 'The HR conversational assistant.',
      ratio: 1.4,
    },
  ],

  beats: [
    {
      label: 'Context',
      body: 'One of three designers on the Innovations team, splitting time between internal R&D and client engagements. Most of it landed in enterprise contexts where the stakes were high and design maturity was low — organisations ready to adopt new technology without the patterns to do it well.',
      slabs: [
        { media: { kind: 'pending', alt: 'Early sketches from the innovation sprint' }, caption: 'Early sketches — a Covid-era innovation sprint.' },
      ],
    },
    {
      label: 'Problem',
      // ⚠️ inferred — the source only records "45 minutes" and "four service lines".
      // The framing about compliance expectations differing between them is mine.
      body: 'Analysts were spending around forty-five minutes hand-drafting each report, across four service lines with different templates and different compliance expectations. The obvious move was to generate the text. The non-obvious problem was that generated text nobody can audit is worth less than text that took forty-five minutes.',
      slabs: [
        { media: { kind: 'pending', alt: 'The manual reporting process being mapped' }, caption: 'The drafting process, before.' },
      ],
    },
    {
      label: 'Exploration',
      // ⚠️ inferred — this beat is almost entirely mine. caseStudies.ts records the
      // five-step wizard and the extractive NLP, but nothing about what was tried
      // along the way. Replace with what actually happened.
      body: 'We worked toward a five-step wizard using extractive NLP, testing how much structure analysts would accept before it stopped feeling like their own writing. Most of the exploration went into the editorial surface rather than the generation — the question was never whether the model could draft, it was what a person needed to see to sign their name under the result.',
      slabs: [
        { media: { kind: 'pending', alt: 'Wireframes for the five-step wizard' }, caption: 'Wireframes — the five-step guided flow.' },
        { media: { kind: 'pending', alt: 'Editorial interface explorations' }, caption: 'Explorations of the editorial surface.' },
      ],
    },
    {
      label: 'Decisions Made',
      body: 'Generated content borrowed the track-changes metaphor from Word, so the origin of every sentence stayed legible — numerical output highlighted specifically, because numbers are what an analyst must verify. And rather than hiding the model’s per-sentence confidence scores, we surfaced them as a soft highlight on low-confidence sentences: enough to direct attention, not enough to cast doubt over the whole document.',
      slabs: [
        { media: { kind: 'pending', alt: 'Track changes UI for AI-generated content' }, caption: 'Track changes — every sentence declaring where it came from.' },
        { media: { kind: 'pending', alt: 'Confidence scoring surfaced as editorial signal' }, caption: 'Confidence scores as a soft editorial signal.' },
        { media: { kind: 'pending', alt: 'The NLG report editing flow in product' }, caption: 'The editing flow, in product.' },
      ],
    },
    {
      label: 'Impact',
      body: 'Drafting went from roughly forty-five minutes to a guided ten-minute flow, with per-team templates across four service lines and an editorial interface that met compliance requirements rather than working around them. Alongside it I built an HR conversational assistant for a major bank — leave management, policy lookup and a knowledge base in one interface, with accessibility treated as a constraint rather than an afterthought.',
      slabs: [
        { media: { kind: 'pending', alt: 'The shipped NLG tool' }, caption: 'The shipped tool — forty-five minutes down to ten.' },
      ],
    },
  ],

  next: 'doorfeed',
}

export const STUDIO_PROJECTS: StudioProject[] = [doorfeed, sigtech, deloitte]

export function getStudioProject(slug: string): StudioProject | undefined {
  return STUDIO_PROJECTS.find((p) => p.slug === slug)
}
