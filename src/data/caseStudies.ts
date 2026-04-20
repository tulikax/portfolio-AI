import type { CaseStudy } from '../types/caseStudy'

// DoorFeed assets
import df1 from '../assets/DoorFeed/DF:comparables map.png'
import df2 from '../assets/DoorFeed/DF:comps summary.png'
import df3 from '../assets/DoorFeed/DF:generation.png'
import dfHero from '../assets/DoorFeed/Bar menu.png'
import dfDropdown from '../assets/DoorFeed/DF:dropdown.png'

// SigTech assets
import st1 from '../assets/SigTech/MAGIC Hero.png'
import st2 from '../assets/SigTech/Screenshot 2025-11-11 at 14.24.19.png'
import st3 from '../assets/SigTech/Screenshot 2026-04-03 at 01.55.12.png'

// Deloitte assets
import dl1 from '../assets/Deloitte SS/Deloitte:phone screens.png'
import dl2 from '../assets/Deloitte SS/Deloitte:sketches.png'
import dl3 from '../assets/Deloitte SS/Frame 302.png'

export const CASE_STUDIES: CaseStudy[] = [
  // ── Complex case study ────────────────────────────────────────
  {
    slug: 'doorfeed',
    title: 'DoorFeed',
    tagline: 'Making property data accurate, complete, and beautiful.',
    year: '2026',
    role: 'Product Designer',
    duration: '6 months',
    company: 'DoorFeed',

    heroMedia: { src: dfHero, alt: 'DoorFeed interface overview' },

    goal: 'Design a property data platform that surfaces granular, comparable market data in a way that feels as refined as it is accurate — turning dense datasets into clear, trustworthy decision surfaces.',
    yourRole: 'Solo product designer working end-to-end: research, strategy, interaction design, and direct collaboration with engineering through 20+ pull requests.',
    outcome: 'Shipped a redesigned comparables map and comps summary view, reducing time-to-insight for analysts and establishing a design system used across the platform.',

    problemStatement: 'Property analysts were drowning in spreadsheets and switching between five different tools to get a complete picture of a market. The existing interface surfaced data, but didn\'t help users understand it — density without clarity. The challenge was to make complex, multi-dimensional data feel actionable without oversimplifying it.',
    problemImage: { src: df1, alt: 'Comparables map showing property data', caption: 'The comparables map — a key surface for understanding market context.' },

    visualBlocks: [
      {
        label: 'Core interface',
        layout: 'two-up',
        images: [
          { src: df1, alt: 'Comparables map view', caption: 'Comparable properties mapped by location and price bracket' },
          { src: df2, alt: 'Comps summary panel', caption: 'Comps summary — distilling 40+ data points into a readable brief' },
        ],
      },
      {
        label: 'Detail interactions',
        layout: 'two-up',
        images: [
          { src: df3, alt: 'Generation view', caption: 'AI-assisted generation flow for property reports' },
          { src: dfDropdown, alt: 'Dropdown filter UI', caption: 'Contextual filtering — surfacing the right data at the right time' },
        ],
      },
    ],

    platformSections: [
      {
        platform: 'Data Layer',
        heading: 'Making comparables feel like a superpower',
        description: 'The comparables map needed to communicate density, proximity, and price variance at a glance. We redesigned the map markers to encode multiple data dimensions through size, colour, and opacity — removing the need to click into each property to understand its relevance.',
        images: [
          { src: df1, alt: 'Comparables map', caption: 'Redesigned comparables map with layered data encoding' },
        ],
        layout: 'full',
      },
      {
        platform: 'Summary Views',
        heading: 'From data to decision',
        description: 'The comps summary panel aggregates 40+ data points into a structured brief that analysts can actually use. The hierarchy was designed around the mental model of a valuation report — not the shape of the underlying database.',
        images: [
          { src: df2, alt: 'Comps summary', caption: 'Summary view designed around analyst mental models' },
          { src: df3, alt: 'Generation view', caption: 'AI generation — turning structured data into narrative insights' },
        ],
        layout: 'two-up',
      },
    ],

    designDecisions: [
      {
        title: 'Map markers encode multiple dimensions',
        rationale: 'Early prototypes used uniform markers with colour alone to signal price. Testing showed analysts scanning the map quickly — we needed to encode proximity relevance, price bracket, and data confidence simultaneously without adding a legend they\'d ignore.',
      },
      {
        title: 'Summary panel uses a report hierarchy, not a data hierarchy',
        rationale: 'The original panel mirrored the database schema. We restructured it around the questions analysts actually ask: "What\'s comparable? How recent? How confident?" — a sequence that mirrors the mental model of a valuation, not a data export.',
      },
      {
        title: 'Progressive disclosure for dense fields',
        rationale: 'The dropdown filtering had 40+ options visible by default. We grouped them by decision type (proximity, price, timing) and used progressive disclosure so analysts see the 8 most-used filters first, with full access one step away.',
        before: { src: dfDropdown, alt: 'Before: flat filter list' },
        after: { src: dfDropdown, alt: 'After: grouped progressive disclosure' },
      },
    ],

    nextProject: {
      slug: 'sigtech',
      title: 'SigTech',
      coverImage: { src: st1, alt: 'SigTech MAGIC platform' },
    },
  },

  // ── Complex case study ────────────────────────────────────────
  {
    slug: 'sigtech',
    title: 'SigTech MAGIC',
    tagline: 'Designing agentic AI tools for quantitative finance.',
    year: '2024–2025',
    role: 'Product Designer',
    duration: '18 months',
    company: 'SigTech',

    heroMedia: { src: st1, alt: 'MAGIC AI platform hero' },

    goal: 'Define the interaction model for an AI-assisted research platform that lets quantitative analysts build, test, and iterate on trading strategies through natural language — without sacrificing the control and precision they expect.',
    yourRole: 'Led design end-to-end: user research with quant analysts, interaction design, design system contributions, and stakeholder alignment across product, engineering, and commercial teams.',
    outcome: 'Shipped MAGIC — SigTech\'s flagship agentic AI product — from concept to launch. Established the interaction patterns for AI-first workflows now used across the platform.',

    problemStatement: 'Quantitative analysts are power users who expect precision and control. Agentic AI tools designed for general audiences felt unreliable and opaque to them. The challenge was to design AI interactions that felt augmentative, not replacive — keeping the analyst in control while dramatically accelerating their workflow.',

    visualBlocks: [
      {
        layout: 'full',
        images: [{ src: st1, alt: 'MAGIC platform hero', caption: 'MAGIC — the AI research assistant for quantitative finance' }],
      },
      {
        layout: 'two-up',
        images: [
          { src: st2, alt: 'Agent workflow interface', caption: 'Agent workflow — showing reasoning steps and confidence signals' },
          { src: st3, alt: 'Strategy builder', caption: 'Strategy builder — structured output from natural language input' },
        ],
      },
    ],

    designDecisions: [
      {
        title: 'Show reasoning, not just results',
        rationale: 'Quant analysts are deeply skeptical of black-box outputs. Every AI response surfaces its reasoning chain — what data it used, what assumptions it made, what confidence level it assigns. This isn\'t just transparency; it\'s the information analysts need to trust and validate outputs.',
      },
      {
        title: 'Structured output over freeform chat',
        rationale: 'We tested conversational chat interfaces early. Analysts found them ambiguous — too much cognitive load in parsing free text for precise parameters. Moving to structured card outputs with editable fields gave analysts the precision they expected while keeping the natural language entry point.',
      },
      {
        title: 'Persistent context panel',
        rationale: 'As conversations extended across multiple turns, analysts lost track of active constraints and assumptions. The persistent context panel keeps the current strategy state visible at all times — so analysts always know what they\'re iterating on.',
      },
    ],

    nextProject: {
      slug: 'doorfeed',
      title: 'DoorFeed',
      coverImage: { src: dfHero, alt: 'DoorFeed interface' },
    },
  },

  // ── Minimal (side experiment) ─────────────────────────────────
  {
    slug: 'deloitte-nlg',
    title: 'NLG Reporting Tool',
    tagline: 'Cutting reporting manhours through ML-powered narrative generation.',
    year: '2020',
    role: 'UX Designer',
    duration: '9 months',
    company: 'Deloitte',

    heroMedia: { src: dl3, alt: 'NLG tool interface overview' },

    goal: 'Design an interface for an ML-powered natural language generation tool that lets audit teams produce client reports faster, with less manual drafting.',
    yourRole: 'UX designer embedded in Deloitte\'s innovations team — leading user research, interaction design, and cross-functional sprint facilitation.',
    outcome: 'The tool reduced reporting manhours by 40% in pilot. Shipped to three client audit teams and later expanded to the wider reporting practice.',

    problemStatement: 'Audit reporting is time-intensive and formulaic — senior staff were spending hours drafting sections that followed consistent patterns. The innovations team had built an ML backend that could generate first-draft narratives from structured data. The design challenge was to make the human-in-the-loop editing experience feel trustworthy, not threatening.',

    visualBlocks: [
      {
        layout: 'two-up',
        images: [
          { src: dl1, alt: 'Mobile reporting interface', caption: 'Mobile companion — reviewing and approving generated sections on the go' },
          { src: dl2, alt: 'Early sketches and concepts', caption: 'Early ideation — mapping the human-AI collaboration model' },
        ],
      },
    ],

    designDecisions: [
      {
        title: 'Track changes UI for AI-generated content',
        rationale: 'Auditors needed to clearly distinguish generated content from human edits for compliance. We adapted a familiar track-changes metaphor — ML output shown in a distinct colour, human edits in the standard style — so the provenance of every sentence was always visible.',
      },
      {
        title: 'Confidence scoring as editorial signal',
        rationale: 'The ML model assigned confidence scores to each generated sentence. Rather than hiding these, we surfaced them as subtle visual signals — a soft highlight on low-confidence sentences directing the editor\'s attention without creating anxiety about the whole document.',
      },
    ],

    prototypeEmbed: {
      type: 'figma',
      url: 'https://www.figma.com/proto/placeholder',
      caption: 'Interactive prototype — NLG report editing flow',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}
