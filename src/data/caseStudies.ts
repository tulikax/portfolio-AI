import type { CaseStudy } from '../types/caseStudy'

// DoorFeed assets
import df1 from '../assets/DoorFeed/case study /New comparables with map.png'
import df2 from '../assets/DoorFeed/case study /New comps summary page.png'
import df3 from '../assets/DoorFeed/case study /MR generation FR.png'
import dfHero from '../assets/DoorFeed/case study /new dropdown hhorizontal tab.png'
import dfHeroVideo from '../assets/DoorFeed/case study /hero video.mov'
import dfDropdown from '../assets/DoorFeed/case study /new dropdown menu - cleaned up.png'

// SigTech assets
import st1 from '../assets/SigTech/MAGIC Hero.png'
import st2 from '../assets/SigTech/Case Study/Task list.png'
import st3 from '../assets/SigTech/Screenshot 2026-04-03 at 01.55.12.png'
import stChatFlow    from '../assets/SigTech/chat-flow.mp4'
import stIDE         from '../assets/SigTech/Case Study/SigTech IDE.png'
import stOriginalIDE from '../assets/SigTech/Case Study/original IDE.png'
import stTaskList    from '../assets/SigTech/Case Study/Task list.png'
import stTrust       from '../assets/SigTech/Case Study/building trust in AI responses.png'
import stWireframes  from '../assets/SigTech/Case Study/copilot wireframes.webp'
import stMetabase    from '../assets/SigTech/Case Study/metabase tracking.webp'
import stDeployment  from '../assets/SigTech/Case Study/more sigtech deployment.png'
import stInfoArch    from '../assets/SigTech/Case Study/pivot 2 info arch.png'
import stPlugin      from '../assets/SigTech/Case Study/plugin.mov'
import stOverview1   from '../assets/SigTech/Case Study/overview 1.png'
import stBBTerminal1 from '../assets/SigTech/Case Study/BB terminal inspo idea1.png'
import stBBTerminal2 from '../assets/SigTech/Case Study/BB terminal inspo idea2.png'

// Deloitte assets
import dlHeroVideo  from '../assets/Deloitte SS/Case study/nlg2.mov'
import dlProtoVideo from '../assets/Deloitte SS/Case study/nlg.mov'
import dlBento      from '../assets/Deloitte SS/Case study/deloitte bento.png'

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

    heroMedia: { src: dfHeroVideo, alt: 'DoorFeed interface overview' },

    goal: 'Design a property data platform that surfaces granular, comparable market data in a way that feels as refined as it is accurate — turning dense datasets into clear, trustworthy decision surfaces.',
    yourRole: 'Solo product designer working end-to-end: research, strategy, interaction design, and direct collaboration with engineering through 20+ pull requests.',
    outcome: 'Shipped a redesigned comparables map and comps summary view, reducing time-to-insight for analysts and establishing a design system used across the platform.',

    problemStatement: 'Users were treating DoorFeed as a data extraction layer — pulling comparables, then leaving to do analysis elsewhere. The platform had depth but no intelligence layer; no way to stay inside it for the work that mattered. Two connected design problems emerged: a fragmented navigation UX causing early exits, and a missing workspace layer that meant the platform never became essential.',

    overviewSubtitle: '4 months at DoorFeed',
    overviewBody: 'I joined DoorFeed right after their first public release of AI intelligence in their B2B platform for institutional real estate investors in the UK and French markets. The product worked, but it was showing the seams of a first version: navigation that overwhelmed more than it guided, a map that existed but wasn\'t usable, and users exporting data to work externally rather than staying on the platform.\n\nI owned design across two connected workstreams. The first was a focused UX fix — cleaning up navigation, and making the core comparable-finding workflow usable. The second grew out of what we found: the problem wasn\'t just the interface. Users were context-switching constantly, exporting whole datasets when they only needed a component, and running analysis in external tools.\n\nWorking closely with the founder and CTO, I am currently helping shape the strategic case for a second, transitionary product — an agentic, chat-based layer that would bring the intelligence inside the platform without abandoning the data infrastructure users already relied on.\n\nBoth workstreams ran in parallel with a live product and real enterprise clients. I worked as the sole designer throughout.',

    overviewHighlights: [
      {
        phrase: 'navigation that overwhelmed more than it guided',
        color: 'rgba(180, 140, 60, 0.35)',
        textColor: '#f5c842',
      },
      {
        phrase: "a map that existed but wasn't usable",
        color: 'rgba(180, 140, 60, 0.35)',
        textColor: '#f5c842',
      },
      {
        phrase: 'users exporting data to work externally rather than staying on the platform',
        color: 'rgba(180, 140, 60, 0.35)',
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
    duration: '11 months',
    company: 'SigTech',

    heroMedia: { src: stChatFlow, alt: 'MAGIC AI platform — chat flow demo' },

    heroTools: [
      { name: 'Figma',   slug: 'figma' },
      { name: 'Cursor',  slug: 'cursor',  ext: 'png' },
      { name: 'Claude',  slug: 'claude' },
      { name: 'Linear',  slug: 'linear',  ext: 'png' },
    ],

    goal: 'Build a trusted AI partner for financial analysts — moving beyond chat simplicity to a transparent, workflow-integrated platform that earns trust through explainability, not just speed.',
    yourRole: 'Led design end-to-end: competitive analysis, user journey mapping, design workshops, three major interface versions, design system and component library through to production. Collaborated with the data team to instrument pilot metrics used to validate each direction.',
    outcome: '~24% reduction in churn and ~39% faster time-to-insight. Reframed the product from "AI chat assistant" to Financial Intelligence Platform — generating stronger interest from enterprise clients and investors.',

    problemStatement: 'MAGIC started as an internal ChatGPT-style plugin for macroeconomic data at SigTech. Usage was reasonable — but churn was high, and enterprise contracts were stalling. When I joined sales feedback sessions and cross-referenced session data, the signal was consistent: users weren\'t rejecting the AI. They were rejecting the opacity. They couldn\'t see how conclusions were reached, which sources were used, or why one output differed from the last. In mid-2024, ChatGPT responses didn\'t include citations — adding verifiable sources was genuinely novel. But without them, analysts had no reason to trust outputs enough to act on them, and no reason to switch from ChatGPT at all.',

    overviewBody: 'I was brought in to improve SigTech\'s Quant IDE platform. The team had a separate internal experiment running — a ChatGPT plugin, originally built to enhance the IDE, now showing enough promise to become a standalone product. My first instinct was to build a copilot directly into the existing platform. Users in early demo calls were excited. But excitement and conviction aren\'t the same thing. Nobody was quite sure they\'d actually use it. We killed that direction fast, and started asking the real question: what would make someone trust an AI enough to stake a financial decision on it?\n\nThe path wasn\'t linear. We went through three distinct directions before landing on what MAGIC needed to be — each abandoned faster than the last, but each teaching us something the final design couldn\'t have done without.\n\nThe demos were going well. But without trust, there was no stickiness. Without stickiness, enterprise contracts didn\'t close. Leadership knew the tool needed to evolve — and that\'s where I came in. How do we make the AI\'s reasoning visible enough to build trust, distinct enough to justify switching, and structured enough to replace the manual workflows analysts were doing around it — without making any of it feel more complex to use?',

    overviewHighlights: [
      {
        phrase: 'what would make someone trust an AI enough to stake a financial decision on it',
        color: 'rgba(180, 140, 60, 0.35)',
        textColor: '#f5c842',
      },
      {
        phrase: 'three distinct directions',
        color: 'rgba(180, 140, 60, 0.35)',
        textColor: '#f5c842',
      },
      {
        phrase: 'without making any of it feel more complex to use',
        color: 'rgba(180, 140, 60, 0.35)',
        textColor: '#f5c842',
      },
    ],

    overviewSideMedia: [
      { src: stIDE, alt: 'SigTech IDE' },
      { src: stOriginalIDE, alt: 'Original SigTech IDE' },
    ],

    problemMedia: { src: stPlugin, alt: 'The original ChatGPT plugin that became MAGIC' },

    showOverviewCards: true,

    // Overview tab has no visualBlocks — overview1 lives in Outcomes tab
    visualBlocks: [],

    projectTabs: [
      // ── Tab 1: Three Pivots ──────────────────────────────────
      {
        label: 'Three Pivots',
        goal: {
          heading: 'Three dead ends. One direction.',
          body: 'The path wasn\'t linear. We went through three distinct directions before landing on what MAGIC needed to be — each abandoned faster than the last, but each teaching us something the final design couldn\'t have done without.\n\nUnderstanding why each direction failed was as important as what replaced it. The failures shaped the product just as much as the successes.',
        },
        process: {
          heading: 'How we found the right direction',
          body: 'I joined sales feedback sessions, reviewed session data, and ran workshops with the PM and engineers. The signal from every direction was consistent: users weren\'t rejecting the AI — they were rejecting the opacity.\n\nWe used rapid prototyping with select users to kill bad directions fast, before significant design investment. What changed with each pivot wasn\'t just the interface — it was our understanding of what the product actually needed to be.',
        },
        decisionsHeading: 'The three pivots',
        decisionsLayout: 'side-by-side' as const,
        decisions: [
          {
            title: '01 — Build a copilot inside the SigTech ecosystem.',
            rationale: 'The initial direction was to embed an AI coding assistant directly into SigTech\'s existing platform — a Copilot for quants. Rapid prototyping with select users killed this quickly. The value proposition immediately ran into Cursor and GitHub Copilot on one side, and SigTech\'s own developer tooling on the other. We were building into a crowded lane we couldn\'t win. Abandoned early, before significant design investment.',
            image: { src: stWireframes, alt: 'Copilot wireframes — initial direction' },
          },
          {
            title: '02 — Focus on simplifying high-value recurring tasks.',
            rationale: 'Research surfaced what users actually needed: not a smarter coding assistant, but a way to eliminate manual overhead around decisions — writing summary reports, running underwriting checks, synthesising data from multiple sources. Analysts were spending cognitive energy on preparation when their real value was in judgement. This direction shaped the transparency features and multi-agent architecture. But a problem remained: the experience still felt like a better ChatGPT. Not different enough.',
            image: { src: stInfoArch, alt: 'Information architecture — pivot 2 restructure' },
          },
          {
            title: '03 — From "talk to AI" to "delegate to AI."',
            rationale: 'Pilot data showed analysts repeating the same complex prompts session after session. Chat was flexible, but flexibility was the wrong value for structured, recurring workflows. The insight: the product didn\'t need to be a better chat interface — it needed to let users create jobs, not conversations. Pre-configured, schedulable, executable workflows. Chat for exploration; Jobs for execution. This reframe separated MAGIC from every general-purpose LLM on the market.',
            image: { src: stTaskList, alt: 'Jobs system — task list view' },
          },
        ],
      },

      // ── Tab 2: Process ──────────────────────────────────────
      {
        label: 'Process',
        goal: {
          heading: 'Four tensions. Four choices.',
          body: 'The design challenges on MAGIC weren\'t about aesthetics — they were about trust. Every decision had a tension at its core: surfacing reasoning without overwhelming users, making the product distinct without making it unfamiliar, building a system that felt simple even as it did something genuinely novel.\n\nThe persona spectrum — from basic user to power user — drove every layering decision. In B2B, clarity earns trust faster than cleverness.',
        },
        process: {
          heading: 'End-to-end ownership',
          body: 'My ownership spanned the full design lifecycle: competitive analysis (FinChat, Perplexity, OpenAI\'s GPT editor), user journey mapping, design workshops with the PM and engineers, three major interface versions, and the design system and component library through to production. I also collaborated with the data team to instrument the pilot metrics used to validate each direction.\n\nMidway through the project, I began using Cursor to make direct code pushes for spacing, copy, and component state tweaks — reducing back-and-forth on changes engineers often deprioritised. When an FE engineer became unavailable during a critical build phase, I used a Figma-to-code workflow to build new components directly into the internal UI library, with states integrated into Storybook. What started as a workaround became the standard: by mid-2025 the handoff process had moved to a Figma MCP setup, significantly tightening the design-to-production loop. This was the project where I moved from designing systems to shipping them.',
        },
        decisionsHeading: 'Key decisions',
        decisionsLayout: 'side-by-side' as const,
        decisions: [
          {
            title: 'Show reasoning, not just results.',
            rationale: 'Stakeholders wanted to surface all reasoning. Engineering favoured raw JSON logs. Both would overwhelm users and bury the signal in noise. I chose a collapsible side panel: scannable summary by default, full JSON and cited sources on demand. Progressive disclosure as a trust mechanism — not just a UI pattern. Pilot data showed 65% of users actively used the reasoning panels.',
            image: { src: stTrust, alt: 'Building trust in AI responses — reasoning panel' },
          },
          {
            title: 'Chat for exploration. Jobs for delegation.',
            rationale: 'Chat was flexible but indistinguishable from general LLMs. Pilot logs showed the same complex prompts repeated session after session — friction disguised as flexibility. I introduced a Jobs system: pre-configured, schedulable, executable workflows alongside chat. Two modes, one platform. The shift that repositioned MAGIC as a Financial Intelligence Platform.',
            image: { src: stTaskList, alt: 'Jobs system — task list view' },
          },
          {
            title: 'Familiarity over novelty in interaction patterns.',
            rationale: 'A differentiated product invites differentiated UI. But novel patterns that delighted power users confused analysts new to LLMs — and confusion erodes the trust we were trying to build. I used established conventions (copy, feedback, sidebar) as the foundation, with progressive disclosure for advanced features.',
            image: { src: stBBTerminal1, alt: 'BB terminal — familiar interaction patterns reference' },
          },
          {
            title: 'Inline source verification at the point of doubt.',
            rationale: 'Session data showed users weren\'t opening the side panel proactively. Doubt surfaced at a specific claim in the response — navigating away broke the reading flow. I introduced "highlight text → verify source" directly within the response, meeting analysts at the exact moment doubt arises rather than asking them to go looking for it.',
            image: { src: stBBTerminal2, alt: 'BB terminal — inline verification reference' },
          },
        ],
        outcome: {
          heading: 'What I took forward',
          stats: [
            { label: 'Interface versions', value: '3', description: 'Major iterations before final shipping' },
            { label: 'Reasoning panel usage', value: '65%', description: 'Pilot users actively opened it — validating the transparency bet' },
            { label: 'Design-to-prod', value: 'Figma MCP', description: 'Loop tightened significantly by mid-2025' },
          ],
          footnote: 'Knowing the full range of your audience matters as much as knowing the cutting edge of the space. In B2B, clarity earns trust faster than cleverness.',
        },
      },

      // ── Tab 3: Outcomes and Learning ─────────────────────────
      {
        label: 'Outcomes and Learning',
        goal: {
          heading: 'What we shipped.',
          body: 'Three pivots. Eleven months. The product went from a ChatGPT plugin to a Financial Intelligence Platform. ~24% reduction in churn. ~39% faster time-to-insight. Enterprise interest that had stalled started moving again.',
        },
        process: {
          heading: 'What I carried forward.',
          body: 'This was the project where I moved from designing systems to shipping them. I started making direct code pushes via Cursor midway through — reducing back-and-forth on small changes engineers deprioritised. By mid-2025 the handoff process had moved to a Figma MCP setup. The lesson that stuck: in B2B, clarity earns trust faster than cleverness. Know the full range of your audience, not just the cutting edge.',
        },
        decisionsHeading: 'Key numbers',
        decisions: [
          {
            title: '~24% churn reduction',
            rationale: 'After repositioning around transparency and structured workflows. The shift from "AI chat" to "Financial Intelligence Platform" changed how enterprise buyers evaluated the product.',
          },
          {
            title: '~39% faster time-to-insight',
            rationale: 'Measured across the pilot cohort. The Jobs system and structured reasoning panels meant analysts spent less time wrestling with the tool and more time on judgement.',
          },
          {
            title: '65% reasoning panel usage',
            rationale: 'Pilot users actively opened the reasoning panel — validating the bet on transparency over simplicity. Trust was the right problem to solve.',
          },
          {
            title: '3 interface versions',
            rationale: 'Each killed before significant sunk cost. Rapid prototyping with select users to validate or discard directions fast was the process discipline that made the final version possible.',
          },
        ],
        outcome: {
          heading: 'Impact',
          stats: [
            { label: 'Churn', value: '↓24%', description: 'After pivot to transparency-first design' },
            { label: 'Time-to-insight', value: '↓39%', description: 'Faster across pilot cohort' },
            { label: 'Reasoning panel', value: '65%', description: 'Pilot users actively used it' },
          ],
          footnote: 'The third pivot — from chat to jobs — drove renewed enterprise interest and changed how leadership framed the product to investors.',
        },
        visualBlocks: [
          {
            label: 'Platform overview',
            layout: 'scroll-horizontal' as const,
            images: [{ src: stOverview1, alt: 'MAGIC platform overview', caption: 'MAGIC — full platform view' }],
          },
          {
            label: 'Process & production',
            layout: 'two-up' as const,
            images: [
              { src: stMetabase, alt: 'Metabase tracking', caption: 'Pilot analytics — metrics used to validate each direction' },
              { src: stDeployment, alt: 'SigTech deployment', caption: 'Deployment — rolling out across quant and macro teams' },
            ],
          },
        ],
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

    heroMedia: { src: dlHeroVideo, alt: 'NLG tool interface overview' },

    goal: '',
    yourRole: '',
    outcome: '',
    problemStatement: '',

    bodyParagraphs: [
      'My work spanned multiple distinct projects, with mostly Tax and Audit teams.',
      'My favorite project being there was an NLG reporting tool built during a Covid-era innovation sprint where I helped conceptualise a five-step wizard that used extractive NLP to reduce analyst drafting time from around 45 minutes to a guided ten-minute flow, with per-team templates across four service lines and a track-changes editorial interface designed to meet compliance requirements.',
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
      type: 'video',
      url: dlProtoVideo,
      caption: 'NLG report editing flow — in product',
    },

    postDecisionBody: 'Besides that, I worked on a knowledge base UX refresh for Deloitte Think, where I learnt just how a large internal knowledge system was structured and surfaced for the people who relied on it daily. The third was an HR conversational assistant for a major bank\'s internal teams — combining leave management, policy lookup, and a company knowledge base into a single chat interface, with accessibility treated as a core design constraint rather than an afterthought.',
    postDecisionImage: { src: dlBento, alt: 'Deloitte project overview' },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}
