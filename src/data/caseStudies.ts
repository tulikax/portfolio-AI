import type { CaseStudy } from '../types/caseStudy'

// DoorFeed assets
import df1 from '../assets/DoorFeed/case study /New comparables with map.png'
import df2 from '../assets/DoorFeed/case study /New comps summary page.png'
import df3 from '../assets/DoorFeed/case study /MR generation FR.png'
import dfHero from '../assets/DoorFeed/case study /Doorfeed Hero.png'
import dfDropdown from '../assets/DoorFeed/case study /new dropdown menu - cleaned up.png'

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
    tagline: 'From fragmented navigation to an AI-native workspace for institutional investors operating across UK and French markets.',
    year: '2026',
    role: 'Product Designer',
    duration: '6 months',
    company: 'DoorFeed',
    heroEyebrow: '',
    heroHeadline: 'DoorFeed',
    heroSubheadline: 'From fragmented navigation to an AI-native workspace for institutional investors operating across UK and French markets.',
    heroMeta: [
      { label: 'Role', value: 'Product Designer (solo)' },
      { label: 'Markets', value: 'UK · France' },
    ],
    heroTools: [
      { name: 'Figma',   slug: 'figma' },
      { name: 'Cursor',  slug: 'cursor',  ext: 'png' },
      { name: 'Claude',  slug: 'claude' },
      { name: 'PostHog', slug: 'posthog', ext: 'png' },
    ],

    heroMedia: { src: dfHero, alt: 'DoorFeed interface overview' },

    goal: 'Design a property data platform that surfaces granular, comparable market data in a way that feels as refined as it is accurate — turning dense datasets into clear, trustworthy decision surfaces.',
    yourRole: 'Solo product designer working end-to-end: research, strategy, interaction design, and direct collaboration with engineering through 20+ pull requests.',
    outcome: 'Shipped a redesigned comparables map and comps summary view, reducing time-to-insight for analysts and establishing a design system used across the platform.',

    problemStatement: 'Users were treating DoorFeed as a data extraction layer — pulling comparables, then leaving to do analysis elsewhere. The platform had depth but no intelligence layer; no way to stay inside it for the work that mattered. Two connected design problems emerged: a fragmented navigation UX causing early exits, and a missing workspace layer that meant the platform never became essential.',

    overviewBody: '4 months at DoorFeed\n\nI joined DoorFeed right after their first public release of AI intelligence in their B2B platform for institutional real estate investors in the UK and French markets. The product worked, but it was showing the seams of a first version: navigation that overwhelmed more than it guided, a map that existed but wasn\'t usable, and users exporting data to work externally rather than staying on the platform.\n\nI owned design across two connected workstreams. The first was a focused UX fix — cleaning up navigation, and making the core comparable-finding workflow usable. The second grew out of what we found: the problem wasn\'t just the interface. Users were context-switching constantly, exporting whole datasets when they only needed a component, and running analysis in external tools.\n\nWorking closely with the founder and CTO, I am currently helping shape the strategic case for a second, transitionary product — an agentic, chat-based layer that would bring the intelligence inside the platform without abandoning the data infrastructure users already relied on.\n\nBoth workstreams ran in parallel with a live product and real enterprise clients. I worked as the sole designer throughout.',

    overviewHighlights: [
      {
        phrase: 'navigation that overwhelmed more than it guided',
        color: 'rgba(180, 140, 60, 0.45)',
        textColor: '#f5c842',
      },
      {
        phrase: "a map that existed but wasn't usable",
        color: 'rgba(70, 120, 150, 0.45)',
        textColor: '#f5c842',
      },
      {
        phrase: 'users exporting data to work externally rather than staying on the platform',
        color: 'rgba(110, 75, 130, 0.45)',
        textColor: '#f5c842',
      },
    ],


    projectTabs: [
      {
        label: 'Navigation UX',
        goal: {
          heading: 'Fixing a fragmented comparables experience',
          body: "DoorFeed's asset page surfaces comparable properties to help institutional investors build valuation models and investment strategies. The comparables section had grown fragmented — multiple disconnected navigation patterns, an undersized map buried inside a filters sidebar, and no clear relationship between the list view and the map.\n\nFor a data-heavy B2B platform serving analysts working at speed, this created real cognitive load and was causing users to exit the section before finding what they needed. The fix had to work within an existing design system with real constraints, and be validated across both UK and French markets.",
        },
        process: {
          heading: 'Research before redesign',
          body: 'I started with PostHog session recordings — identifying where users were rage-clicking and abandoning. The filter area and map interaction were the clearest pain points. I reviewed event trigger data segmented by market, since UK and French users were navigating differently. From there I wireframed in Figma, used Claude for design audits, and worked with the CTO and engineers on what was feasible within the existing component library.',
        },
        decisionsHeading: 'What shaped the outcome',
        decisions: [
          {
            title: 'Collapsible tabbed navigation over a flat layout',
            rationale: "PostHog confirmed users weren't lost — they were overwhelmed. I consolidated everything into a collapsible dropdown with tabbed navigation, kept in the same location deliberately so existing users didn't have to re-learn. This freed up significant screen real estate for the data itself.",
          },
          {
            title: 'Filters before results, not alongside them',
            rationale: 'Users were landing on 400–500 results and then trying to filter down, which drove exits. Moving filters ahead of results meant users arrived at a manageable set. This had the most direct impact on the metrics we saw post-launch.',
          },
          {
            title: 'Staying within design system constraints',
            rationale: "Some UX patterns I wanted weren't possible without breaking the existing component library. I made a deliberate call to stay within constraints for this phase, noting the debt to address in the agentic platform work, rather than creating inconsistency for a fix that didn't warrant it.",
          },
          {
            title: 'Skipping onboarding copy — and what that cost',
            rationale: "We didn't add helper text when the navigation changed. Session data showed a short spike in confusion before drop-off rates improved. The learning: even low-disruption structural changes need a lightweight transition moment for existing users.",
          },
        ],
        outcome: {
          heading: 'Results',
          stats: [
            { label: 'Exit rate', value: '↓', description: 'Comparables section exits reduced post-launch' },
            { label: 'Time to results', value: '↓', description: 'Faster due to upfront filters removing noise' },
            { label: 'Markets tested', value: '2', description: 'UK and France throughout' },
          ],
          footnote: 'The French market continued to surface data availability edge cases — empty states on asset pages where UK data was rich — which directly shaped the approach taken in the agentic platform phase.',
        },
        visualBlocks: [
          {
            layout: 'two-up' as const,
            images: [
              { src: df1, alt: 'Comparables map view', caption: 'Redesigned comparables map — expanded out of the filters sidebar' },
              { src: df2, alt: 'Comps summary panel', caption: 'Comps summary view — structured data in a scannable layout' },
            ],
          },
          {
            layout: 'two-up' as const,
            images: [
              { src: df3, alt: 'AI-assisted generation flow', caption: 'AI generation flow — surfacing intelligence inline' },
              { src: dfDropdown, alt: 'Collapsible dropdown navigation', caption: 'Collapsible tabbed navigation — consolidated and reachable' },
            ],
          },
        ],
      },
      {
        label: 'AI Platform',
        goal: {
          heading: 'Shifting DoorFeed from a data source to a workspace',
          body: 'Institutional investors were using DoorFeed primarily to pull comparables, then exporting to Excel and running analysis externally — often feeding data through internal AI tools to filter noise. The platform was a data source, not a workspace.\n\nThe business goal: bring the intelligence layer inside DoorFeed, reduce dependency on external tools, increase time on platform, and reduce churn. I owned the full strategy, phasing, and design of the agentic version — including a net-new design system for the chat-based interface.',
        },
        process: {
          heading: 'Structured audit, then phased change',
          body: 'I ran a structured audit of the existing platform using PostHog — session recordings, rage click mapping, and event trigger analytics split by UK and French markets — to understand which features users actually engaged with and where they gave up. I worked directly with the CEO, CTO, sales team, and engineers throughout. I used Figma for wireframing and asset creation, Figma Make and Cursor for implementation, and Claude for design audits and pattern research — essential for moving fast as a solo designer.',
        },
        decisionsHeading: 'What shaped the outcome',
        decisions: [
          {
            title: 'Phased rollout with shell continuity',
            rationale: "Session data showed existing users had built muscle memory around the platform's structure — even when it was imperfect. I kept the shell recognisable and introduced the agentic layer as an additive beta, not a replacement. This reduced the risk of alienating active users while the new system was validated.",
          },
          {
            title: 'Building a new design system for data-heavy chat UI',
            rationale: "The existing component library wasn't built for conversational interfaces. I designed a new system from scratch — message components, input states, and response patterns for different output types: tables, charts, maps, and embedded Excel and PPT previews. I researched how leading AI tools handle multi-modal outputs and adapted those patterns for a data-dense, professional context. Every error state was designed explicitly — empty states, failed queries, knowledge base gaps.",
          },
          {
            title: 'Knowledge base UX as a first-class problem',
            rationale: 'The agentic platform required admins to set up and maintain a knowledge base — defining data and defaults the AI reasons against — at a regular cadence. I treated this as its own design problem: readable at a glance, editable without specialist knowledge. Poorly designed, it would have become a blocker to adoption before users ever saw the chat interface.',
          },
          {
            title: 'Designing for data asymmetry across markets',
            rationale: "French real estate data is significantly less rich than UK data. During testing, French asset pages were returning partially empty states — not errors, just absence. We nearly built two completely separate UI states per market. Instead, I designed a flexible empty-state system that degrades gracefully and signals clearly what's unavailable and why. This will scale as DoorFeed expands into more European markets.",
          },
          {
            title: 'In-platform output viewing before download',
            rationale: "Consistent client feedback: users wanted to review and refine reports before downloading, not after. I prioritised in-platform Excel and PPT preview and editing as a core feature of the beta. This directly addressed the behaviour we were seeing — users exporting too early, editing externally, and not returning.",
          },
        ],
        outcome: {
          heading: 'Early beta results',
          stats: [
            { label: 'Report exports', value: '+10%', description: 'First month of beta' },
            { label: 'Standout stat', value: '14', description: 'Reports in 2 weeks by clients with 120/yr quota' },
            { label: 'Logins', value: '↑', description: 'More frequent logins among beta users' },
          ],
          footnote: 'The features most positively received: in-platform playbook checking against organisational defaults, and embedded report viewing — which removed the major friction point of the download-first workflow.',
        },
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
    tagline: 'From AI chat plugin to financial intelligence platform.',
    year: '2024–2025',
    role: 'Product Designer',
    duration: '18 months',
    company: 'SigTech',

    heroMedia: { src: st1, alt: 'MAGIC AI platform hero' },

    goal: 'Build a trusted AI partner for financial analysts — moving beyond chat simplicity to a transparent, workflow-integrated platform that earns trust through explainability, not just speed.',
    yourRole: 'Led design end-to-end: ran workshops to clarify product direction, created concept flows, wireframes, and pilot prototypes, and collaborated with PM, engineers, and data teams on metrics and analytics setup.',
    outcome: '~24% reduction in churn and ~39% faster time-to-insight. Reframed the product from "AI chat assistant" to Financial Intelligence Platform — generating stronger interest from enterprise clients and investors.',

    problemStatement: 'MAGIC started as a ChatGPT plugin for exploring macroeconomic data — powerful, but adoption was plateauing. Analysts trusted results, not the process, and clients stalled when it came to contracts. Financial teams struggled with opaque tools and manual analysis loops: AI assistants existed, but lacked explainability or real workflow integration. The core question became: "How might we increase transparency and expand the chat experience — while keeping it simple enough for a variety of users?"',

    visualBlocks: [
      {
        layout: 'full',
        images: [{ src: st1, alt: 'MAGIC platform hero', caption: 'MAGIC — the AI research assistant for financial teams' }],
      },
      {
        layout: 'two-up',
        images: [
          { src: st2, alt: 'Agent workflow interface', caption: 'Reasoning panel — surfacing the AI\'s data sources and logic chain' },
          { src: st3, alt: 'Hybrid workflow view', caption: 'Hybrid workflow — combining conversational ease with structured outputs' },
        ],
      },
    ],

    designDecisions: [
      {
        title: 'Show reasoning, not just results',
        rationale: 'Pilot data showed 65% of users actively used the reasoning panels — directly validating the transparency hypothesis. Analysts needed to see the AI\'s data sources, assumptions, and logic chain before they would trust an output. Surfacing the reasoning wasn\'t a nice-to-have; it was the condition for adoption.',
      },
      {
        title: 'Familiarity over novelty',
        rationale: 'Early iterations leaned into novel interaction patterns for the multi-agent system. Testing showed this intimidated new users. We pulled back and layered familiar micro-interactions — copy, leave feedback, edit inline — onto the new paradigm. In B2B, clarity wins trust faster than cleverness.',
      },
      {
        title: 'Hybrid workflows over pure chat',
        rationale: 'Users loved chat for speed but struggled to see how MAGIC differed from a standard LLM. Analytics revealed appetite was strongest for workflows that combined conversational ease with structured outputs — especially in document-heavy due diligence. Shifting to a hybrid model was the unlock that reframed the product category entirely.',
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
