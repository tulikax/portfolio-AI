import type { CaseStudy } from '../types/caseStudy'

// DoorFeed assets
import df1 from '../assets/DoorFeed/case study /New comparables with map.png'
import dfHero from '../assets/DoorFeed/case study /new dropdown hhorizontal tab.png'
import dfHeroVideo from '../assets/DoorFeed/case study /hero video.mov'
import dfBeforeMapsNav from '../assets/DoorFeed/case study /before - maps and navigation.png'
import dfMapsAnalysisPins from '../assets/DoorFeed/case study /maps location analysis pins.mov'
import dfGenerateResultsComps from '../assets/DoorFeed/case study /generate results-comps.mov'
import dfIssuesNav from '../assets/DoorFeed/case study /issues with navigation.png'
import dfPosthog from '../assets/DoorFeed/case study /posthog review.png'
import dfNewfrenchTabs from '../assets/DoorFeed/case study /newfrench dropdown tabs.mov'
import dfMapsExploration from '../assets/DoorFeed/case study /maps exploration.png'
import dfViewComparable from '../assets/DoorFeed/case study /view comparable.mov'
import dfMRHomepage from '../assets/DoorFeed/case study /MR homepage.mov'

// SigTech assets — root
import st1        from '../assets/SigTech/MAGIC Hero.png'
import stChatFlow        from '../assets/SigTech/chat-flow.mp4'
import stAgentsInAction  from '../assets/SigTech/agents-in-action.mp4'
// SigTech — Overview
import stIDEv1     from '../assets/SigTech/Case Study/Overview/SigTech IDE.png'
import stIDEv2     from '../assets/SigTech/Case Study/Overview/SigTech IDE2.png'
import stPluginMov from '../assets/SigTech/Case Study/Overview/plugin.mov'
import stChatV1    from '../assets/SigTech/Case Study/Overview/Chat v1.png'
// SigTech — Approach
import stProcess             from '../assets/SigTech/Case Study/Approach/process.png'
import stResearchUsers       from '../assets/SigTech/Case Study/Approach/research with users:stakeholders.png'
import stResearchCompetition from '../assets/SigTech/Case Study/Approach/research -competition analysis.png'
// SigTech — Finding Direction
import stPivot1            from '../assets/SigTech/Case Study/Finding Direction - 3 pivots/starting point or pivot 1 - Multiple GPTs within existing IDE.png'
import stPivot2ChatBased   from '../assets/SigTech/Case Study/Finding Direction - 3 pivots/pivot 2 fully chat based.png'
import stPivot2Agent       from '../assets/SigTech/Case Study/Finding Direction - 3 pivots/pivot 2.2 - thikning about agent use in real life.png'
import stPivot3Exploration from '../assets/SigTech/Case Study/Finding Direction - 3 pivots/pivot 3 explorations - beyond chats exploration - making the use case generic but scalable or adaptable.png'
// SigTech — What finally shipped
import stDay1         from '../assets/SigTech/Case Study/What finally shipped/Day 1 - chat only.png'
import stFinalOutcome from '../assets/SigTech/Case Study/What finally shipped/Final outcome - Jobs as a concept.png'
import stTaskTransp   from '../assets/SigTech/Case Study/What finally shipped/Task list as an idea for transperancy.png'
import stFinalDraft   from '../assets/SigTech/Case Study/What finally shipped/final draft - verify source, view related, copy with attribition.png'
import stMetabase     from '../assets/SigTech/Case Study/What finally shipped/metabase tracking.webp'

// Deloitte assets
import dlHeroVideo  from '../assets/Deloitte SS/Case study/nlg2final.mov'
import dlProtoVideo from '../assets/Deloitte SS/Case study/nlg.mov'
import dlBento      from '../assets/Deloitte SS/Case study/final bento.png'

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

    problemStatement: 'Users were treating DoorFeed as a data extraction layer — pulling comparables, then leaving to do analysis elsewhere. Two connected design problems emerged: a fragmented navigation UX causing early exits, and a missing workspace layer that meant the platform never became essential.',

    overviewSubtitle: '4 months at DoorFeed',
    overviewBody: 'I joined DoorFeed right after their first public release of AI intelligence in their B2B platform for institutional real estate investors in the UK and French markets. The product worked, but it was showing the seams of a first version: navigation that overwhelmed more than it guided, a map that existed but wasn\'t usable, and users exporting data to work externally rather than staying on the platform.\n\nI owned design across two connected workstreams. The first was a focused UX fix — cleaning up navigation, and making the core comparable-finding workflow usable. The second grew out of what we found: the problem wasn\'t just the interface. Users were context-switching constantly, exporting whole datasets when they only needed a component, and running analysis in external tools.\n\nWorking closely with the founder and CTO, I am currently helping shape the strategic case for a second, transitionary product — an agentic, chat-based layer that would bring the intelligence inside the platform without abandoning the data infrastructure users already relied on.\n\nBoth workstreams ran in parallel with a live product and real enterprise clients. I worked as the sole designer throughout.',

    overviewHighlights: [
      {
        phrase: 'navigation that overwhelmed more than it guided',
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
      {
        phrase: "a map that existed but wasn't usable",
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
      {
        phrase: 'users exporting data to work externally rather than staying on the platform',
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
    ],

    overviewHideProblem: true,
    overviewInlineMedia: [
      { afterParagraph: 0, src: dfBeforeMapsNav, alt: 'Before — maps and navigation', scale: 60 },
      { afterParagraph: 1, src: dfMapsAnalysisPins, alt: 'Maps location analysis — pins', scale: 60 },
      { afterParagraph: 2, src: dfGenerateResultsComps, alt: 'Generate results comps' },
    ],

    projectTabs: [
      {
        label: 'Research & Redesign',
        problemFirst: true,
        problemImage: { src: dfIssuesNav, alt: 'Issues with navigation' },
        goal: {
          heading: 'Fixing a fragmented comparables experience',
          body: "DoorFeed's asset page surfaces comparable properties to help institutional investors build valuation models and investment strategies. The comparables section had grown fragmented — multiple disconnected navigation patterns, an undersized map buried inside a filters sidebar, and no clear relationship between the list view and the map.\n\nFor a data-heavy B2B platform serving analysts working at speed, this created real cognitive load and was causing users to exit the section before finding what they needed. The fix had to work within an existing design system with real constraints, and be validated across both UK and French markets.",
        },
        process: {
          heading: 'Research before redesign',
          body: 'I started with PostHog session recordings — identifying where users were rage-clicking and abandoning. The filter area and map interaction were the clearest pain points. I reviewed event trigger data segmented by market, since UK and French users were navigating differently. From there I wireframed in Figma, used Claude for design audits, and worked with the CTO and engineers on what was feasible within the existing component library.',
        },
        preDecisionVisuals: [
          {
            layout: 'full' as const,
            images: [{ src: dfPosthog, alt: 'PostHog session review', caption: 'PostHog session recording review — identifying rage clicks and abandonment patterns' }],
          },
        ],
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
        postDecisionVisuals: [
          {
            layout: 'two-up' as const,
            height: '320px',
            // NOTE: 'Doorfeed Final outcome.png' is missing from assets — second slot pending
            images: [
              { src: dfNewfrenchTabs, alt: 'New French dropdown tabs', caption: 'New dropdown navigation — tabbed layout for French and UK markets' },
              { src: df1, alt: 'New comparables with map', caption: 'New comparables with map — redesigned comparables layout' },
            ],
          },
        ],
        outcome: {
          heading: 'Results',
          stats: [
            { label: 'Exit rate', value: '↓', description: 'Comparables section exits reduced post-launch' },
            { label: 'Time to results', value: '↓', description: 'Faster due to upfront filters removing noise' },
            { label: 'Markets tested', value: '2', description: 'UK and France throughout' },
          ],
          variant: 'teal-labels' as const,
          footnote: 'The French market remains a live constraint in the product. Where UK data is rich, French asset pages surface sparse or empty states — not errors, just absence. The approach: surface what\'s unavailable clearly, never filling gaps with false accuracy, while actively working to strengthen data coverage. Trust is earned by being honest about limitations, not by hiding them.',
          footnoteVariant: 'problem-callout' as const,
        },
        visualBlocks: [
          {
            layout: 'two-up' as const,
            height: '320px',
            images: [
              { src: dfMapsExploration, alt: 'Maps exploration' },
              { src: dfViewComparable, alt: 'View comparable', caption: 'View comparable — in-platform comparable review' },
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
        goalMedia: { src: dfMRHomepage, alt: 'MR homepage — AI workspace interface' },
        wip: { message: 'work in progress — last updated 29th April 2026' },
        /* Remaining content commented out pending further updates:
        process: {
          heading: 'Structured audit, then phased change',
          body: 'I ran a structured audit of the existing platform using PostHog — session recordings, rage click mapping, and event trigger analytics split by UK and French markets — to understand which features users actually engaged with and where they gave up. I worked directly with the CEO, CTO, sales team, and engineers throughout. I used Figma for wireframing and asset creation, Figma Make and Cursor for implementation, and Claude for design audits and pattern research — essential for moving fast as a solo designer.',
        },
        decisionsHeading: 'What shaped the outcome',
        decisions: [
          { title: 'Phased rollout with shell continuity', rationale: "..." },
          { title: 'Building a new design system for data-heavy chat UI', rationale: "..." },
          { title: 'Knowledge base UX as a first-class problem', rationale: '...' },
          { title: 'Designing for data asymmetry across markets', rationale: "..." },
          { title: 'In-platform output viewing before download', rationale: "..." },
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
        */
        decisions: [],
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

    heroHeadline: 'MAGIC',
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

    problemStatement: 'MAGIC started as an internal ChatGPT-style plugin for macroeconomic data at SigTech. Usage was reasonable — but churn was high, and enterprise contracts were stalling. When I joined sales feedback sessions and cross-referenced session data, the signal was consistent: users weren\'t rejecting the AI.\n\nThey were rejecting the opacity. They couldn\'t see how conclusions were reached, which sources were used, or why one output differed from the last. In mid-2024, ChatGPT responses didn\'t include citations — adding verifiable sources was genuinely novel. But without them, analysts had no reason to trust outputs enough to act on them, and no reason to switch from ChatGPT at all.',

    overviewBody: 'I was brought in to improve SigTech\'s Quant IDE platform. The team had a separate internal experiment running — a ChatGPT plugin, originally built to enhance the IDE, now showing enough promise to become a standalone product. My first instinct was to build a copilot directly into the existing platform. Users in early demo calls were excited. But excitement and conviction aren\'t the same thing. Nobody was quite sure they\'d actually use it. We killed that direction fast, and started asking the real question: what would make someone trust an AI enough to stake a financial decision on it?\n\nThe path wasn\'t linear. We went through three distinct directions before landing on what MAGIC needed to be — each abandoned faster than the last, but each teaching us something the final design couldn\'t have done without.\n\nThe demos were going well. But without trust, there was no stickiness. Without stickiness, enterprise contracts didn\'t close. Leadership knew the tool needed to evolve — and that\'s where I came in. How do we make the AI\'s reasoning visible enough to build trust, distinct enough to justify switching, and structured enough to replace the manual workflows analysts were doing around it — without making any of it feel more complex to use?',

    overviewHighlights: [
      {
        phrase: 'what would make someone trust an AI enough to stake a financial decision on it',
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
      {
        phrase: 'three distinct directions',
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
      {
        phrase: 'without making any of it feel more complex to use',
        color: 'rgba(255, 255, 255, 0.92)',
        textColor: '#000000',
      },
    ],

    overviewSideMedia: [
      { src: stIDEv1, alt: 'SigTech IDE' },
      { src: stIDEv2, alt: 'SigTech IDE — second view' },
    ],

    problemMedia: { src: stPluginMov, alt: 'The original ChatGPT plugin that became MAGIC' },
    overviewScrollMedia: { src: stChatV1, alt: 'Chat v1 — the original plugin interface', startX: 60 },

    showOverviewCards: true,

    // Overview tab has no visualBlocks — overview1 lives in Outcomes tab
    visualBlocks: [],

    projectTabs: [
      // ── Tab 1: Process ──────────────────────────────────────
      {
        label: 'Approach',
        introMedia: { src: stProcess, alt: 'Design process overview' },
        goal: {
          heading: 'Four tensions. Four choices.',
          body: 'The design challenges on MAGIC weren\'t about aesthetics — they were about trust. Every decision had a north star: surfacing reasoning without overwhelming users, without making it unfamiliar. Building a system that felt simple even as it did something novel.\n\nThe persona spectrum — from basic user to power user — drove every layering decision. In B2B, clarity earns trust faster than cleverness.',
        },
        process: {
          heading: 'End-to-end ownership',
          body: 'My ownership spanned the full design lifecycle: competitive analysis (FinChat, Perplexity, OpenAI\'s GPT editor), user journey mapping, design workshops with the PM and engineers, three major interface versions, and the design system and component library through to production. I also collaborated with the data team to instrument the pilot metrics used to validate each direction.\n\nMidway through the project, I began using Cursor to make direct code pushes for spacing, copy, and component state tweaks — reducing back-and-forth on changes engineers often deprioritised. When an FE engineer became unavailable during a critical build phase, I used a Figma-to-code workflow to build new components directly into the internal UI library, with states integrated into Storybook. What started as a workaround became the standard: by mid-2025 the handoff process had moved to a Figma MCP setup, significantly tightening the design-to-production loop.',
        },
        preDecisionVisuals: [
          {
            layout: 'two-up' as const,
            images: [
              { src: stResearchUsers, alt: 'Research with users and stakeholders', caption: 'User & stakeholder research' },
              { src: stResearchCompetition, alt: 'Competitive analysis — FinChat, Perplexity, OpenAI', caption: 'Competitive analysis' },
            ],
          },
        ],
        decisions: [],
      },

      // ── Tab 2: Three Pivots ──────────────────────────────────
      {
        label: 'Finding Direction',
        goal: {
          heading: 'Three dead ends. One direction.',
          body: 'The path wasn\'t linear. We went through three distinct directions before landing on what MAGIC needed to be — each abandoned faster than the last, but each teaching us something the final design couldn\'t have done without.\n\nUnderstanding why each direction failed was as important as what replaced it. The failures shaped the product just as much as the successes.',
        },
        process: {
          heading: 'How we found the right direction',
          body: 'I joined sales feedback sessions, reviewed session data, and ran workshops with the PM and engineers. The signal from every direction was consistent: users weren\'t rejecting the AI — they were rejecting the opacity.\n\nWe used rapid prototyping with select users to kill bad directions fast, before significant design investment. What changed with each pivot wasn\'t just the interface — it was our understanding of what the product actually needed to be.',
        },
        decisionsHeading: 'The three pivots',
        decisionsLayout: 'caption' as const,
        decisions: [
          {
            title: '01 — Build a copilot inside the SigTech ecosystem.',
            rationale: 'The initial direction was to embed an AI coding assistant directly into SigTech\'s existing platform — a Copilot for quants. Rapid prototyping with select users killed this quickly. The value proposition immediately ran into Cursor and GitHub Copilot on one side, and SigTech\'s own developer tooling on the other. We were building into a crowded lane we couldn\'t win. Abandoned early, before significant design investment.',
            image: { src: stPivot1, alt: 'Pivot 1 — Multiple GPTs within existing IDE', cropTop: 40, cropBottom: 60 },
          },
          {
            title: '02 · Focus on transparency and error detection',
            rationale: 'We started to build an enriched chat architecture with an added transparency layer — users could see tasks assigned to each agent, queries sent, and responses returned. For mid-2024, before any mainstream LLM surfaced this kind of reasoning visibility, it was new. But the core experience still felt like a better ChatGPT. Seeing the work behind the answer wasn\'t enough of a reason to switch.',
            imagesLayout: 'side-column' as const,
            images: [
              { src: stPivot2ChatBased, alt: 'Pivot 2 — fully chat based' },
              { src: stPivot2Agent,     alt: 'Pivot 2 — thinking about agent use in real life' },
            ],
          },
          {
            title: '03 — From "talk to AI" to "delegate to AI."',
            rationale: 'Pilot data showed analysts repeating the same complex prompts session after session. Chat was flexible, but flexibility was the wrong value for structured, recurring workflows. The insight: the product didn\'t need to be a better chat interface — it needed to let users create jobs, not conversations. Pre-configured, schedulable, executable workflows. Chat for exploration; Jobs for execution. This reframe separated MAGIC from every general-purpose LLM on the market. Exploration in Figma Make + Cursor gave me the freedom to rapidly prototype ideas to very high fidelity, while some were half baked and dropped early at the wireframing stage.',
            image: { src: stPivot3Exploration, alt: 'Pivot 3 — beyond chat explorations' },
          },
        ],
        keyDecisionsHeading: 'Key decisions',
        keyDecisions: [
          {
            title: 'Show reasoning, not just results.',
            rationale: 'Stakeholders wanted to surface all reasoning. Engineering favoured raw JSON logs. Both would overwhelm users and bury the signal in noise. I chose a collapsible side panel: scannable summary by default, full JSON and cited sources on demand. Progressive disclosure as a trust mechanism — not just a UI pattern. Pilot data showed 65% of users actively used the reasoning panels.',
            image: { src: stTaskTransp, alt: 'Task list as an idea for transparency', scale: 0.7, cropBottom: 150 },
          },
          {
            title: 'Chat for exploration. Jobs for delegation.',
            rationale: 'Chat was flexible but indistinguishable from general LLMs. Pilot logs showed the same complex prompts repeated session after session — friction disguised as flexibility. I introduced a Jobs system: pre-configured, schedulable, executable workflows alongside chat. Two modes, one platform. The shift that repositioned MAGIC as a Financial Intelligence Platform.',
            image: { src: stFinalOutcome, alt: 'Final outcome — Jobs as a concept' },
          },
          {
            title: 'Familiarity over novelty in interaction patterns.',
            rationale: 'A differentiated product invites differentiated UI. But novel patterns that delighted power users confused analysts new to LLMs — and confusion erodes the trust we were trying to build. I used established conventions (copy, feedback, sidebar) as the foundation, with progressive disclosure for advanced features.',
            image: { src: stChatFlow, alt: 'Chat flow — familiar interaction pattern in action' },
          },
          {
            title: 'Inline source verification at the point of doubt.',
            rationale: 'Session data showed users weren\'t opening the side panel proactively. Doubt surfaced at a specific claim in the response — navigating away broke the reading flow. I introduced "highlight text → verify source" directly within the response, meeting analysts at the exact moment doubt arises rather than asking them to go looking for it.',
            image: { src: stFinalDraft, alt: 'Final draft — verify source, view related, copy with attribution' },
          },
        ],
      },

      // ── Tab 3: Outcomes and Learning ─────────────────────────
      {
        label: 'What Shipped',
        goal: {
          heading: 'What we shipped.',
          body: '',
        },
        process: {
          heading: 'What I carried forward.',
          body: 'This was the project where I moved from designing systems to shipping them. I started making direct code pushes via Cursor midway through — reducing back-and-forth on small changes engineers deprioritised. By mid-2025 the handoff process had moved to a Figma MCP setup. The lesson that stuck: in B2B, clarity earns trust faster than cleverness. Know the full range of your audience, not just the cutting edge.',
        },
        decisions: [],
        outcome: {
          heading: 'Impact',
          stats: [
            { label: 'Churn', value: '↓24%', description: 'After repositioning around transparency and structured workflows. The shift from "AI chat" to "Financial Intelligence Platform" changed how enterprise buyers evaluated the product.' },
            { label: 'Time-to-insight', value: '↓39%', description: 'Measured across the pilot cohort. The Jobs system and structured reasoning panels meant analysts spent less time wrestling with the tool and more time on judgement.' },
            { label: 'Reasoning panel', value: '65%', description: 'Pilot users actively opened the reasoning panel — validating the bet on transparency over simplicity. Trust was the right problem to solve.' },
            { label: 'Interface versions', value: '3', description: 'Each killed before significant sunk cost. Rapid prototyping with select users to validate or discard directions fast was the process discipline that made the final version possible.' },
          ],
          footnote: 'The third pivot — from chat to jobs — drove renewed enterprise interest and changed how leadership framed the product to investors.',
        },
        learnings: {
          heading: 'What I learnt',
          body: 'This was the project where I moved from designing systems to shipping them. What started as a workaround — making direct code pushes via Cursor — became the standard. By mid-2025 the handoff process had moved to a Figma MCP setup, significantly tightening the design-to-production loop.\n\nKnowing the full range of your audience matters as much as knowing the cutting edge of the space. In B2B, clarity earns trust faster than cleverness.',
        },
        postGoalVisuals: [
          {
            layout: 'carousel' as const,
            height: '440px',
            images: [
              { src: stDay1,         alt: 'Day 1 — chat only interface',                                caption: 'Day 1 — chat only' },
              { src: stAgentsInAction, alt: 'Agents in action — reasoning visibility demo',              caption: 'Agents in action' },
              { src: stFinalDraft,   alt: 'Final draft — verify source, view related, copy',            caption: 'Final design — verify source, view related, copy' },
              { src: stFinalOutcome, alt: 'Final outcome — Jobs as a concept',                          caption: 'Final outcome — Jobs' },
              { src: stMetabase,     alt: 'Metabase pilot analytics',                                   caption: 'Pilot analytics' },
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
    tagline: 'and other selected highlights',
    year: '2020',
    role: 'UX Designer',
    duration: '9 months',
    company: 'Deloitte',

    heroMedia: { src: dlHeroVideo, alt: 'NLG tool interface overview' },

    heroTools: [
      { name: 'Figma',  slug: 'figma' },
      { name: 'Sketch', slug: 'Sketch', ext: 'png' },
      { name: 'Axure',  slug: 'axure',  ext: 'png' },
    ],

    goal: '',
    yourRole: '',
    outcome: '',
    problemStatement: '',

    bodyParagraphs: [
      'I was one of three designers on the Innovations team, splitting time between internal R&D and client engagements. Most of the work landed in enterprise contexts where the stakes were high but design maturity was low. I helped organisations that were ready to adopt new technology but without the defined patterns to do it well.',
      'My favorite project being there was an NLG reporting tool built during a Covid-era innovation sprint where I helped conceptualise a five-step wizard that used extractive NLP to reduce analyst drafting time from around 45 minutes to a guided ten-minute flow, with per-team templates across four service lines and a track-changes editorial interface designed to meet compliance requirements.',
    ],

    designDecisions: [
      {
        title: 'Track changes UI for AI-generated content',
        rationale: 'Analysts needed to clearly distinguish final generated content from human edits for compliance and visibility. We adapted a familiar track-changes metaphor from MS Word: any generated numerical output (specifically numbers) were highlighted to draw user to verify, general words and phrases from the tool in the standard style so the origin of every sentence was always clear.',
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

    postDecisionBody: 'Besides that, I worked on an HR conversational assistant for a major bank\'s internal teams — combining leave management, policy lookup, and a company knowledge base into a single chat interface, with accessibility treated as a core design constraint rather than an afterthought.',
    postDecisionImage: { src: dlBento, alt: 'Deloitte project overview' },
    postDecisionBodyBelow: 'The third was a knowledge base UX refresh for Deloitte Think, where I learnt just how a large internal knowledge system was structured and surfaced for the people who relied on it daily.',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}
