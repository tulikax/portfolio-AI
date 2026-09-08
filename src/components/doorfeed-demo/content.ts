/**
 * All copy for the DoorFeed agentic case study demo.
 *
 * Kept separate from the components so the narrative can be edited without
 * touching layout — this page is a treatment being trialled against the live
 * /work/doorfeed case study, so the copy is expected to churn.
 *
 * Inline emphasis uses two markdown conventions, rendered by RichText:
 * `**bold**` and `_italic_`.
 */

/*
 * Screenshots are served from Cloudinary — see src/constants/media.ts for why,
 * and for the mapping between these identifiers and their public IDs. Slots
 * with no matching asset stay as placeholders.
 */
import { MID_PLATFORM, NEW_PLATFORM, OLD_PLATFORM } from '../../constants/media'
// Still bundled: this clip is not on Cloudinary yet. It is also the same file
// the homepage role card plays on hover.
import homepageGlow from '../../assets/DoorFeed/homepage glow.mov'
import type { Crop } from './CroppedImage'

/**
 * One run of a chapter title. Titles break at different points and italicise
 * different fragments, so they're stored as tokens rather than lines —
 * `br` starts a new line before the token, `em` renders it as the italic
 * display emphasis that replaces the source design's coloured span.
 */
export interface TitleToken {
  text: string
  em?: boolean
  br?: boolean
}

export interface MediaSpec {
  /** Shown in the frame's title bar — reads like a filename. */
  name: string
  /** When set, the frame renders the real asset; otherwise it draws a placeholder. */
  src?: string
  alt?: string
  /** Placeholder glyph and copy — ignored once `src` is present. */
  icon?: string
  label?: string
  hint?: string
  caption: string
  /** Trims empty canvas off a screenshot at render time. */
  crop?: Crop
  /** Rendered width as a percentage of the column — centred. Defaults to full width. */
  width?: number
}

export interface MediaGridCell {
  label: string
  src?: string
  alt?: string
  /** Renders a looping muted clip instead of a still. Takes precedence over `src`. */
  videoSrc?: string
  /** Trims empty canvas off a screenshot at render time. */
  crop?: Crop
  /** Rendered width as a percentage of the cell — centred. Defaults to full width. */
  width?: number
  /** When set, the cell renders a draggable before/after comparison instead of a still. */
  compare?: {
    beforeSrc: string
    beforeAlt: string
    beforeLabel: string
    beforeWidth: number
    afterSrc: string
    afterAlt: string
    afterLabel: string
    afterWidth: number
    cropRight?: number
    aspect?: number
    beforeZoom?: number
    afterZoom?: number
  }
  icon?: string
  title?: string
}

export interface MediaGridSpec {
  columns: 1 | 2 | 3
  cells: MediaGridCell[]
  caption: string
  /** Bleeds the block past the text column so stacked screens read at full size. */
  wide?: boolean
  /**
   * Drops the cell chrome — background, hairlines and the label bar's rule — so
   * each cell is exactly its media plus a caption. Use when cells carry their
   * own `width`, where a full-column card would frame empty space around them.
   */
  bare?: boolean
}

export interface CollageItem {
  label: string
  src: string
  alt: string
  /**
   * Width as a percentage of the collage frame. Set inversely to the image's
   * aspect ratio so every item lands at the same rendered height.
   */
  width: number
  /** Top-left corner, as a percentage of the frame. */
  x: number
  y: number
  crop?: Crop
}

export interface CollageSpec {
  /** Rendered in order — later items overlap earlier ones. */
  items: CollageItem[]
  /** Frame width ÷ height. Lower values pull the items further apart. */
  aspect: number
  caption: string
  wide?: boolean
}

/**
 * Chapters interleave prose, sub-headings and media in an order that matters,
 * so their bodies are an ordered block list rather than fixed fields.
 */
export type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'body'; text: string }
  | { kind: 'aside'; text: string }
  | { kind: 'media'; spec: MediaSpec }
  | { kind: 'mediaGrid'; spec: MediaGridSpec }
  | { kind: 'collage'; spec: CollageSpec }
  /** Copy on the left, media stacked alongside it on the right. */
  | { kind: 'split'; text: string[]; spec: MediaGridSpec }

/** What fills the media half of a pinned round. */
export type RoundMedia =
  | { kind: 'image'; label: string; src: string; alt: string; crop?: Crop }
  | { kind: 'video'; label: string; src: string }
  | { kind: 'collage'; spec: CollageSpec }
  | { kind: 'grid'; spec: MediaGridSpec }
  | { kind: 'placeholder'; label: string; hint: string }

export interface Round {
  num: string
  stage: string
  title: string
  /** A paragraph beginning `> ` renders as a pull quote. */
  paragraphs: string[]
  verdict: string
  /** Rendered under the verdict tag — what the round sent us off to do next. */
  afterVerdict?: string
  /** no = dead end, partial = progress with a cost, yes = the resolution. */
  tone: 'no' | 'partial' | 'yes'
  media: RoundMedia
}

export interface Decision {
  idx: string
  title: string
  paragraphs: string[]
  tags: string[]
}

export interface ComponentCard {
  title: string
  body: string
  /**
   * The component's Storybook view. Left without a `src` until the captures are
   * uploaded, in which case the panel draws a placeholder frame.
   */
  storybook?: { src?: string; alt?: string }
}

/**
 * One item in "What shipped inside the prototype".
 *
 * Numbers are set explicitly rather than derived from position: the carousel is
 * the outcome of the point above it, not a point of its own, so it carries a
 * label and no number.
 */
export type ShippedItem =
  | { kind: 'heading'; text: string }
  | {
      kind: 'point'
      num?: string
      label?: string
      text: string
      withComponents?: boolean
      /** Status tag rendered under the copy, e.g. an unfinished section's date. */
      pill?: string
    }
  | { kind: 'flows'; label?: string }
  | { kind: 'placeholder'; num?: string; label: string; hint: string; pill?: string }

export interface StatusCard {
  label: string
  value: string
  sub: string
}

export interface Flag {
  heading: string
  body: string
}

export interface Reflection {
  num: string
  title: string
  body: string
}

export const RAIL_SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'context', label: 'Context' },
  { id: 'exploration', label: 'Exploration' },
  { id: 'artifacts', label: 'Final artifacts' },
  { id: 'decisions', label: 'Key decisions' },
  { id: 'impact', label: 'Impact' },
  { id: 'reflections', label: 'Reflections' },
]

export const HERO = {
  kicker: 'Product Design · DoorFeed · 2026',
  title: [
    { text: 'From data platform' },
    { text: 'to ', br: true },
    { text: 'agentic product', em: true },
  ] satisfies TitleToken[],
  lede: 'A real estate investment platform built for retrieval, redesigned for reasoning.',
  scrollCue: 'Scroll to begin',
}

export const OPENING_PULL = {
  lines: ['What if we already had the pieces, just in the wrong order?'],
  attrib: 'The question that started the exploration',
  /** Sits directly under the question — the answer it turned out to have. */
  note: 'Two capabilities, both real, both mis-framed: AI with the wrong pacing, a dataroom with the wrong prominence. The problem was surfacing and sequencing, not inventing.',
}

export const CONTEXT = {
  num: '01',
  eyebrow: 'Context',
  title: [
    { text: 'A platform built for retrieval,' },
    { text: 'not ', br: true },
    { text: 'reasoning', em: true },
  ] satisfies TitleToken[],
  blocks: [
    {
      kind: 'body',
      text: 'DoorFeed began as a dense, functional data platform — structured screens, filters, sortable tables. It was fast because it was predictable, but it had a ceiling: it surfaced data, and never touched the synthesis analysts actually needed to underwrite a deal.',
    },
    { kind: 'heading', text: 'Starting with the platform, not the AI' },
    {
      kind: 'body',
      text: 'The first work was unglamorous. The comparables view — the reason most analysts opened the platform at all — had fragmented navigation, 500+ unfiltered results, and a map buried inside the filter sidebar where it had no relationship to the list beside it. PostHog recordings showed rage clicks concentrated in exactly those areas.',
    },
    {
      kind: 'mediaGrid',
      spec: {
        columns: 1,
        wide: true,
        cells: [
          {
            label: 'Comparables — before',
            src: OLD_PLATFORM.issues,
            alt: 'Annotated breakdown of the navigation problems in the original comparables view',
            width: 80,
          },
          {
            label: 'PostHog — rage clicks',
            src: OLD_PLATFORM.posthog,
            alt: 'PostHog session review showing rage clicks concentrated in the comparables area',
            // The capture includes the empty replay pane to the left of the event list
            crop: { width: 2094, height: 938, left: 1015 },
            width: 32,
          },
        ],
        caption:
          'Fragmented navigation, 500+ unfiltered results, map nested in the filter sidebar with no relation to the list — and the rage clicks that followed.',
      },
    },
    {
      kind: 'body',
      text: "I consolidated the sections into a collapsible tabbed structure, kept it in the same location so existing users didn't have to re-learn the page, and **moved filters ahead of results** so analysts arrived at a workable set rather than filtering their way out of 500. Exit rates from the section fell. It also surfaced the constraint that shaped everything after: the existing design system couldn't stretch much further.",
    },
    {
      kind: 'mediaGrid',
      spec: {
        columns: 1,
        wide: true,
        cells: [
          {
            label: 'Comparables — drag to compare',
            compare: {
              beforeSrc: OLD_PLATFORM.comps,
              beforeAlt: 'The original comparables view, returning an unfiltered result set',
              beforeLabel: 'Before',
              // Natural pixel widths — the two screenshots were captured at
              // different resolutions, so the slider needs both to fit them.
              beforeWidth: 2048,
              // Light mode, so the reveal reads as a clear change of state
              afterSrc: MID_PLATFORM.compsLight,
              afterAlt:
                'The restructured comparables view in light mode, with filters ahead of results and the map alongside the list',
              afterLabel: 'After',
              afterWidth: 5106,
              // Both are full-screen captures at near-identical aspect (1.76 and
              // 1.78), so the frame matches them rather than cropping to a band.
              aspect: 1.77,
            },
          },
        ],
        caption:
          'The same view, before and after: filters ahead of results, sections consolidated, and the map given a relationship to the list beside it. Drag to compare.',
      },
    },
    { kind: 'heading', text: 'There was already AI in the product' },
    {
      kind: 'split',
      text: [
        'This is the part that reframed the project. The asset ingestion page already ran a small AI system that converted and normalised rent rolls arriving in any format — a genuinely hard problem, solved, and largely invisible.',
        "But it was slow, and it was **blocking**: users couldn't move on until each item was resolved. The intelligence was there; the interaction model around it forced a stop-and-wait rhythm that didn't match how analysts work. That gap — capable AI, wrong pacing — became the clearest argument for what the agentic layer needed to get right.",
      ],
      spec: {
        // Stacked at one column, so both screens render at the same width
        columns: 1,
        bare: true,
        cells: [
          {
            label: 'Resolve & confirm',
            src: OLD_PLATFORM.ingestionSelect,
            alt: 'The deal ingestion step where each unresolved item must be confirmed before proceeding',
          },
          {
            label: 'Upload & normalisation',
            src: OLD_PLATFORM.ingestionClean,
            alt: 'The deal ingestion flow converting and normalising an uploaded rent roll',
          },
        ],
        caption:
          'The existing deal ingestion flow — AI-powered rent roll normalisation, but sequential and blocking.',
      },
    },
    { kind: 'heading', text: 'A dormant dataroom, built but unused' },
    {
      kind: 'body',
      text: "The same pattern, in a different place. The platform had a dataroom and file versioning — both built, both working, both buried. We knew they were useful; we hadn't worked out how to surface them or what they were _for_ in the flow of a deal.",
    },
    {
      kind: 'media',
      spec: {
        name: 'dataroom — already built, already buried',
        src: OLD_PLATFORM.dataroom,
        alt: 'The platform dataroom, with file versioning',
        width: 50,
        caption:
          'The dataroom and its versioning already existed — the design problem was prominence, not capability.',
      },
    },
  ] satisfies Block[],
}

/**
 * Round 3's media. Widths are inverse to each image's aspect (1.62, 1.61, 1.26),
 * so all three render at a matching height and cascade cleanly.
 */
/**
 * Round 3's media. Stacked at full column width rather than overlapped — the
 * two screens each carry a distinct point, and a collage shrank both.
 */
const HYBRID_STACK: MediaGridSpec = {
  columns: 1,
  cells: [
    {
      label: 'Hybrid workspace — expanded',
      src: NEW_PLATFORM.hybridWorkspaceExpanded,
      alt: 'The hybrid workspace with the structured panel expanded for review',
      // Held back so the conversation screen below reads as the larger of the two
      width: 76,
    },
    {
      label: 'Workflows that open into conversation',
      src: NEW_PLATFORM.workflowsIntoConversation,
      alt: 'A workflow opening into a free-flowing conversation where the agent asks for what it needs',
    },
  ],
  caption:
    'Chat panel for reasoning, structured panel for review and direct action. Both stay on screen.',
}

export const EXPLORATION = {
  num: '02',
  eyebrow: 'Exploration',
  title: [
    { text: 'Three rounds to find' },
    { text: 'the ', br: true },
    { text: 'interaction model', em: true },
  ] satisfies TitleToken[],
  blocks: [
    {
      kind: 'body',
      text: '**The motivation.** User signals and the market pointed the same way — competitors were moving on AI, and AI-assisted development meant we could build fast enough to reach for something larger than a single enhanced feature.',
    },
    {
      kind: 'body',
      text: '**The bet.** Rather than bolt intelligence onto one flow, we reconsidered the whole product around it: analysts going from data to finished artifact without leaving the platform. Agents wrap existing microservices, not replace them. The data layer and outputs stay the same. What changes is the entry point, and how the work is extracted.',
    },
  ] satisfies Block[],
  intro:
    "The agentic layer then went through three shapes, each a reasonable answer to the last round's problem.",
  rounds: [
    {
      num: 'Round 01',
      stage: 'Open chat',
      title: 'A clean prompt-first interface, prototyped in Figma Make',
      paragraphs: [
        'I built a working prototype quickly in Figma Make and put it in front of two groups.',
        '**Internally first.** Dogfooding with our SME and in-house analysts went well. Their reaction to being able to do almost any asset valuation using AI was strong; the only feedback that came back was about navigation refinements and information architecture rather than the flow or the journey, because they were able to get to the happy path.',
        "**Next, existing clients.** The reaction came as a surprise. These were experienced users, months into the old platform, and the clean, low-density interface was itself a surprise coming from a data-heavy tool. But the real issue was that the open prompt left everything equally available, and nothing pointed at the task they'd actually come to do. There were generic pointers we'd provided, but they didn't fit naturally with their real flow. This exposed a major flaw in our assumptions about why users weren't reaching for the tool.",
        '> It\'s fun to play around and see how the AI can quickly do things, but I need a starting point for my usual tasks that I was doing already.',
        "The prompt was open enough to support every workflow and specific enough to suggest none. **The gap wasn't capability, it was a default path.**",
      ],
      verdict: 'Too little structure',
      tone: 'no',
      afterVerdict:
        "This finding drove me back to the drawing board, to the workspace version, and eventually to the decision to lead with structure and let conversation follow. It also exposed a problem with how we were testing: the briefing we'd given internally was doing work the interface should have been doing on its own, which is why the internal sessions looked fine and the client sessions didn't. Round 2 was tested cold for exactly that reason.",
      media: {
        kind: 'video',
        label: 'Open chat interface',
        src: homepageGlow,
      },
    },
    {
      num: 'Round 02',
      stage: 'Structured',
      title: 'Lead with structure, keep the conversation available',
      paragraphs: [
        '**The correction:** give the page a shape. Asset context in the header, the dataroom pulled out of hiding into a persistent left panel, three contextually relevant workflows as named entry points, and running tasks visible below. The open prompt stayed, but now sat inside a screen that told you where you were and what was available.',
        "**How we tested it.** This round was dogfooded cold, with minimal context and only two or three tasks to complete, so we could watch where people went rather than where we'd pointed them. Testing Round 1 with a full brief had masked the orientation problem; **stripping the setup out was the only way to see whether the structure did the work on its own.** It did. Users knew what the page was for and what came next without being told.",
        '**What still came up:** pulling a comps set with known parameters still felt faster on the original platform — click through, wait for ingestion, get comps. A task that had been tedious but low-effort became a conversation, and **conversations carry their own overhead**: composing the request, reading the response, confirming it understood.',
        "The input wasn't just an option sitting alongside the workflows. It was an invitation, and it competed with the faster path. The affordance itself was shaping behaviour — which meant the question wasn't whether to offer chat, but when to put it in front of someone.",
      ],
      verdict: 'Oriented, but competing with itself',
      tone: 'partial',
      media: {
        kind: 'image',
        label: 'Chat workflows',
        src: NEW_PLATFORM.chatWorkflows,
        alt: 'Named workflow cards offered beneath the prompt — underwrite a deal, generate a market report, generate a business plan',
      },
    },
    {
      num: 'Round 03',
      stage: 'Hybrid',
      title: 'Workflows that open into conversation',
      paragraphs: [
        'The resolution splits the difference along the axis the testing actually revealed: **chat wins on synthesis, structure wins on retrieval.**',
        'Analysts start from asset details and a workflow catalogue — concrete, familiar, oriented. Any workflow can then open into free-flowing conversation where the agent asks for what it needs, rather than a form guessing at it. Results populate into tabs on the existing page structure, so the platform\'s integrity holds.',
      ],
      verdict: 'Shipped into prototype',
      tone: 'yes',
      media: { kind: 'grid', spec: HYBRID_STACK },
    },
  ] satisfies Round[],
}

export const ARTIFACTS = {
  num: '03',
  eyebrow: 'Final artifacts',
  title: [
    { text: 'What the prototype' },
    { text: 'actually ', br: true },
    { text: 'ships', em: true },
  ] satisfies TitleToken[],
  componentsHeading: 'What shipped inside the prototype',
  shipped: [
    {
      kind: 'point',
      label: 'Insight',
      text: 'Not every enriched flow needed a conversation. The signal was both qualitative and quantitative: dogfooding sessions and interviews with our asset acquisition SMEs, the customer support requests coming in from existing clients, and PostHog session reviews of how beta users actually moved through the product.',
    },
    {
      kind: 'point',
      label: 'Outcome',
      text: "Some of those processes were audited, and I proposed **removing the use of chat where it added friction** rather than eased the work. This strengthened the platform, and we're still defining the balance between user control and AI optimisation taking over the steering wheel.",
    },
    { kind: 'flows' },
    { kind: 'heading', text: 'From tokens to components, in code' },
    {
      kind: 'point',
      num: '02',
      text: 'I set the foundations in Figma first — defined design tokens, spacing and type scales, and the rules governing how each response type renders — then built the system directly in code using Claude Code and Cursor, with assistant-ui and shadcn primitives as a tested starting point. Components were developed in Storybook, so every state was reviewable and testable in isolation as it was built.',
    },
    {
      kind: 'point',
      text: 'There were still custom components that had to be rendered in the chat.',
      pill: 'More coming soon — last updated July 2026',
      withComponents: true,
    },
    {
      kind: 'placeholder',
      num: '04',
      label: 'Storybook artefacts',
      hint: 'A few Storybook artefacts to come.',
      pill: 'Coming soon — last updated July 2026',
    },
  ] satisfies ShippedItem[],
  components: [
    {
      title: 'Comp summary cards',
      body: 'Colour-coded across three categories, responsive carousel on mobile.',
    },
    { title: 'Split table / map', body: 'Right-panel comp mode with bidirectional hover to the map.' },
    { title: 'Income & NOI strip', body: 'Feeding a NOI bridge with attached leakage bar chart.' },
    { title: 'Playbook panel', body: 'Deviation flags with citation highlighting back to the rule.' },
    {
      title: 'Business plan card',
      body: 'KPI strip, Sources & Uses, Returns Summary in one view.',
    },
    { title: 'Workflow catalogue', body: 'Quick-action cards replacing the blank prompt.' },
  ] satisfies ComponentCard[],
  flows: {
    columns: 1,
    wide: true,
    bare: true,
    cells: [
      // NEW_PLATFORM.createNewAsset — the asset-creation clip — is deliberately
      // not shown here; the manifest entry stays so it can be dropped back in.
      {
        label: 'Dataroom — enhanced with AI-assisted document classification',
        videoSrc: NEW_PLATFORM.dataroomFileDrop,
        alt: 'Files dropped into the dataroom and classified automatically',
      },
      {
        label:
          "Using the AI chat to build out valuation model outputs that can be transformed into Excel files enriched with the user's organisation template",
        videoSrc: NEW_PLATFORM.calculateErv,
        alt: 'A valuation model built in chat and exported to an organisation-templated Excel file',
      },
      {
        label:
          'Using AI behind the scenes — generating AI-enriched market reports for users without having to go to chat',
        videoSrc: NEW_PLATFORM.marketReportGeneration,
        alt: 'A market report generated and previewed inside the platform, without a chat step',
      },
    ],
    caption: '',
  } satisfies MediaGridSpec,
}

export const DECISIONS = {
  num: '04',
  eyebrow: 'Key design decisions',
  title: [
    { text: 'Where it could have' },
    { text: 'gone ', br: true },
    { text: 'differently', em: true },
  ] satisfies TitleToken[],
  intro:
    'Each of these had a defensible alternative. These are the trade-offs and the reasoning behind where I landed.',
  items: [
    {
      idx: '01',
      title: 'Lead with workflows, not chat',
      paragraphs: [
        'The central call. Start from workflows and asset details, populate results into the existing tab structure, and let chat come second — because **chat is only helpful once users know where they are.**',
        'This preserves the original platform\'s integrity and the muscle memory analysts had already built. It also means the agentic layer is additive rather than a replacement, so both versions can run in parallel during rollout without forcing a migration on anyone mid-deal.',
      ],
      tags: ['Orientation first', 'Progressive disclosure', 'Parallel rollout'],
    },
    {
      idx: '02',
      title: 'Dataroom front and centre, not buried',
      paragraphs: [
        'The dataroom and versioning already existed but sat somewhere nobody found them. Promoting them wasn\'t a navigation tweak — it changed what the product is for. Once the dataroom is the anchor, the platform stops being a place you _get data from_ and becomes the place the work lives.',
        "The value is in the combination: **the organisation's own documents and models, sitting alongside DoorFeed's market data, workable together in one place.** Neither is that useful alone. An analyst's Excel model without live comps is stale; live comps without their model and assumptions is just a data feed. Putting both in the same surface — with versioning visible rather than implicit — is what makes generating the final artifact inside the platform reasonable rather than an extra step.",
        'Excel and PPT preview follow directly from this. If the artifact is going to be produced here, it has to be readable here — reviewing and refining before export, instead of exporting to find out what needs fixing.',
      ],
      tags: ['Surfacing latent value', 'Version control', 'Data + documents'],
    },
    {
      idx: '03',
      title: 'Property-first navigation, staged in two moves',
      paragraphs: [
        'Sessions and Projects lived on separate pages. A session could exist with no parent, and the same address could appear multiple times across the Projects list — there was no single place representing "this building." People navigate a deal by address, not by session type.',
        'I recommended a property-first hierarchy with sessions nested beneath assets, but staged it rather than shipping it whole: **Option A first** — separate pages cleaned up, named sections, session-type filter chips, duplicate addresses collapsed — then migrate to the unified Option B workspace once the data model reliably enforced the project-to-session relationship. Shipping the ideal structure on top of a model that couldn\'t guarantee it would have produced a worse experience than the mess it replaced.',
        'The homepage was re-anchored on the asset in the same pass: personal greeting instead of a page title, filters collapsed to a single dropdown, "New asset" always first in the grid, and terminology moved from Projects to Assets throughout — matching how the team actually talked about deals.',
      ],
      tags: ['Information architecture', 'Staged migration', 'Terminology'],
    },
    {
      idx: '04',
      title: 'Grouping by causal relationship, not content type',
      paragraphs: [
        'The asset detail page took three rounds. Round 1 was a tabbed Overview / Investment / Asset Management page with a bento layout — workflows were one tile among many, and the primary action on the page read as visually weak. Round 2 promoted workflows to a four-tile hero section, which helped but was still organising by content type.',
        'Round 3 was the actual insight: group by **causal relationship**. Workflows and Chats belong together because launching a workflow _creates_ a chat. Dataroom, Rent roll, and Asset details group separately as reference material — consulted rather than acted on. Three layout directions were then prototyped behind a keyboard-switchable picker so the team could compare them live rather than in static frames.',
      ],
      tags: ['Iteration', 'Rapid prototyping', 'Cursor / Figma Make'],
    },
    {
      idx: '05',
      title: 'Designing for data asymmetry across markets',
      paragraphs: [
        'French real estate data is significantly less rich than UK data. In testing, French asset pages returned partially or fully empty states — not errors, just absence. The obvious path was two separate UI states per market, which would have doubled the maintenance surface with every new feature.',
        "Instead I designed a flexible empty-state system that degrades gracefully and tells the user what's unavailable and why, rather than presenting a page that looks broken. Each new European market inherits the pattern rather than needing its own branch — which matters more as the platform expands.",
      ],
      tags: ['Localisation', 'Graceful degradation', 'Scalability'],
    },
    {
      idx: '06',
      title: 'Knowledge base and hard constraints',
      paragraphs: [
        "Firms upload an investment playbook so organisational defaults are visible in the flow and deviations get flagged against the rule they break. That requires admins to set up and maintain a knowledge base at regular cadence — easy to dismiss as back-office config, and fatal to adoption if it's unusable.",
        'I treated it as its own design problem: readable at a glance, editable without specialist knowledge. The proposed architecture is three-tier — always-loaded rules, system prompt fragment, and RAG — with **hard constraints like IRR floors and LTV limits deliberately kept out of RAG entirely**, so non-negotiables are enforced structurally rather than left to inference. This tier structure is proposed and not yet formally signed off by the team.',
      ],
      tags: ['Admin UX', 'AI constraints', 'Governance'],
    },
    {
      idx: '07',
      title: 'Session locking and failure states',
      paragraphs: [
        'Deal ingestion became a session with three asset states — fresh, processing, processed — and the session locks to read-only once processed. Anyone can launch a session, but once live only the launcher can interact with it; everyone else sees "in progress by X."',
        'The interesting part is the failure path. A 3–5 day timeout with advance warning prevents an abandoned session from blocking a team indefinitely, and an abort route archives a broken session rather than leaving the lock stuck. Multi-user tools break at the edges, not the middle.',
      ],
      tags: ['Multi-user states', 'Failure design', 'Edge cases'],
    },
  ] satisfies Decision[],
  mediaGrid: {
    columns: 2,
    cells: [
      { label: 'UK — full data', icon: '◫', title: 'UK asset state' },
      { label: 'France — partial data', icon: '◫', title: 'FR asset state' },
    ],
    caption: 'One flexible system instead of two market-specific UIs.',
  } satisfies MediaGridSpec,
}

export const IMPACT = {
  num: '05',
  eyebrow: 'Impact',
  title: [
    { text: 'Where it stands,' },
    { text: 'honestly', em: true, br: true },
  ] satisfies TitleToken[],
  intro:
    'The platform improvements shipped and held. The agentic layer is Phase 1 of four, in active build, with the core underwriting journey working end to end as a prototype. Some of what follows is measured; some is still open.',
  statuses: [
    {
      label: 'Platform work',
      value: 'Shipped',
      sub: 'Comparables navigation and filter restructure live; exit rates down, time-to-information reduced',
    },
    {
      label: 'Agentic layer',
      value: 'Phase 1',
      sub: 'In active build — deal ingestion agent, market report agent, hybrid chat UI, default schema export',
    },
    {
      label: 'Underwriting journey',
      value: 'Prototype',
      sub: 'Address through to business plan export, working end to end',
    },
  ] satisfies StatusCard[],
  body: 'Early qualitative signal from client sessions points at two things consistently: **in-platform playbook checking** — validating a deal against organisational defaults before it reaches anyone who signs off — and **embedded report viewing**, which removes the core friction of the download-first workflow. Analysts can review and refine before exporting, rather than exporting to find out what needs fixing.',
  openHeading: "What's still open",
  flags: [
    {
      heading: 'Flagged — data reliability',
      body: 'Agent outputs are only as defensible as the data underneath them, and reliability issues surfaced during testing. For a product whose entire premise is _trust the reasoning because you trust the data_, this is the load-bearing risk — not a polish item.',
    },
    {
      heading: 'Flagged — chat action consistency',
      body: 'Some chat actions post a visible message, some silently update a component, some regenerate a file with no signal. Three different mental models for what "doing something" means. I flagged this as a **sequencing decision rather than a bug** — every new component built on the inconsistency compounds it, so it gates further build rather than queuing behind it.',
    },
    {
      heading: 'Pending — knowledge base sign-off',
      body: 'The three-tier architecture is proposed and working in prototype, but not yet formally agreed by the team.',
    },
  ] satisfies Flag[],
  media: {
    name: 'measurement — posthog / testing artefacts',
    icon: '▤',
    label: 'Research artefact',
    hint: 'Rage-click map, session clip, or the data reliability audit',
    caption: 'Market-segmented event data informed which parts of the flow to rebuild first.',
  } satisfies MediaSpec,
}

export const REFLECTIONS = {
  num: '06',
  eyebrow: 'Reflections',
  title: [
    { text: "What I'd carry" },
    { text: 'forward', em: true, br: true },
  ] satisfies TitleToken[],
  items: [
    {
      num: '01',
      title: "Fluency with a tool isn't fluency with a prompt",
      body: 'The users who struggled most with open chat were the ones who knew the old platform best. Expertise in a structured tool doesn\'t transfer to an unstructured input — if anything it works against it, because the mental model is "which control do I use" not "what do I ask." Orientation isn\'t an onboarding problem you solve once; it\'s a structural property of the interface.',
    },
    {
      num: '02',
      title: "Ship the change users can absorb, not the one that's correct",
      body: 'Twice the right answer was to stage it — Option A before Option B on navigation, additive beta rather than replacement on the agentic layer. And once I got this wrong: we changed the comparables navigation without any helper text, and session data showed a short confusion spike before the improvement landed. Even low-disruption structural changes need a transition moment.',
    },
    {
      num: '03',
      title: 'Some bugs are architecture in disguise',
      body: 'A stuck loading state in the playbook flow turned out to be new HTML silently wiping the persistent overlay. Rather than patching each call site, a single helper that always re-appends the overlay turned a recurring bug class into a structural guarantee. The chat action inconsistency is the same shape of problem at a larger scale — which is why it\'s flagged as gating rather than queued.',
    },
    {
      num: '04',
      title: 'Working solo means the tooling is the team',
      body: 'Figma for ideation and assets, Cursor and Figma Make for implementation, Claude for design audits and pattern research. Prototyping in code rather than static frames meant three layout directions could be compared live by the CTO and CEO in one session instead of three rounds of review — which is the only reason the causal-grouping insight surfaced when it did.',
    },
    {
      num: '05',
      title: "The question doesn't stop being asked",
      body: 'When to use AI and when not to is not a decision made once at the start of a project. It came up at every feature, and the honest answer changed depending on whether the task was retrieval or synthesis. A comps pull with known parameters doesn\'t need a conversation. Interrogating why a valuation looks wrong does.',
    },
  ] satisfies Reflection[],
  media: {
    name: 'early direction sketches',
    src: NEW_PLATFORM.earlyDirection,
    alt: 'Early sketches exploring layout directions for the agentic layer',
    caption:
      'Early direction sketches — the layout explorations that preceded the three rounds, compared live rather than in static frames.',
  } satisfies MediaSpec,
}

export const CLOSING = {
  quote: 'A platform that thinks alongside the analyst, not instead of them.',
  status: 'Phase 1 in active build · prototype iterating',
}
