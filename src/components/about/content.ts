/**
 * Copy for the /about page. Kept beside the page like the doorfeed-demo content module.
 */

export interface JourneyEntry {
  /** e.g. "2024 — 2025" */
  period: string
  role: string
  place: string
  /** What actually changed in how she designs */
  body: string
  /** Optional one-liner pulled out as the takeaway */
  takeaway?: string
}

/**
 * ⚠️ TODO (Tulika): there's a gap between Deloitte (2021) and SigTech (2024) — the
 * masters / move to London / whatever belongs there. Add an entry for it rather than
 * letting the timeline jump three years. Same for anything before Deloitte that shaped
 * how you design.
 */
export const JOURNEY: JourneyEntry[] = [
  {
    period: '2019 — 2021',
    role: 'UX Designer, Web',
    place: 'Deloitte',
    body: 'Consulting taught me to design at scale and in public. I ran sprints that put engineering, subject-matter experts and business stakeholders in the same room, and built an NLG tool with the innovations team that cut reporting hours through ML.',
    takeaway: 'Learned that a design frame is only as good as the people who agree to it.',
  },
  {
    period: '2024 — 2025',
    role: 'Product Designer',
    place: 'SigTech',
    body: 'Designing agentic AI tools for workflows that were still being imagined, deep in developer experience and quantitative finance. The ownership was unusual for the stage — prioritisation, sprint cadence and stakeholder negotiation alongside the hands-on craft.',
    takeaway: 'Went properly AI-first: 200+ podcast episodes on evals and agents, learning MCPs, and closing the gap between design systems and UI libraries.',
  },
  {
    period: '2026 — Present',
    role: 'Product Designer',
    place: 'DoorFeed',
    body: 'Solo designer on data granular enough that being accurate, complete and beautiful to look at are the same problem. I think like a PM and ship like an engineer — 20+ pull requests in the first three months.',
    takeaway: "Learning to diagnose friction like a more senior designer, and to make the case for the smaller UI joys that never make it onto a roadmap.",
  },
]
