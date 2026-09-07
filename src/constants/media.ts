/**
 * Cloudinary-hosted media for the DoorFeed case study.
 *
 * Large screenshots and screen recordings live on Cloudinary rather than in the
 * repo — 361MB of assets in git made clones and builds slow, and nothing here
 * was compressed. `f_auto,q_auto:best` lets Cloudinary negotiate AVIF/WebP (and
 * MP4/WebM for video) per browser, so the source files stay untouched and the
 * delivered bytes stay small.
 *
 * Only the cloud name is needed to build these URLs, and it is public — it
 * appears in every image the site serves. No API key or secret is involved at
 * runtime, and none belongs in this repo.
 *
 * ─── On the public IDs ───────────────────────────────────────────────────────
 * The account uses Cloudinary's dynamic-folders model, where an asset's
 * *display name* in the Media Library is only a label. The real public ID is
 * flat — no folder path — and derived from the original filename with spaces
 * replaced by underscores and the extension dropped. So `old comps.png`
 * delivers at `/old_comps`, regardless of which folder it appears in.
 *
 * That is why the identifiers below look nothing like the tidy folder tree in
 * the Media Library. Every ID here was verified against the live CDN; renaming
 * an asset's display name will not change them, but re-uploading it will.
 */

/** From the Cloudinary dashboard — public, safe to commit. */
const CLOUD_NAME = 'yerdzcw2'

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`

/**
 * Image URL.
 *
 * `q_auto:best` rather than plain `q_auto`: these are dense UI screenshots with
 * small type, and the default quality target visibly softens them. `c_limit`
 * caps the delivered width without ever upscaling.
 */
export function img(id: string, width = 2400): string {
  return `${BASE}/image/upload/f_auto,q_auto:best,c_limit,w_${width}/${id}`
}

/** Video URL — Cloudinary transcodes to MP4/WebM per browser on delivery. */
export function video(id: string): string {
  return `${BASE}/video/upload/f_auto,q_auto/${id}`
}

/** The platform as it was before any of this work. */
export const OLD_PLATFORM = {
  /** Annotated breakdown of the navigation problems. */
  issues: img('issues_with_navigation'),
  /** Comparables view, unfiltered result set. */
  comps: img('old_comps'),
  /** Comparables with the map nested in the filter sidebar. */
  sidebarComps: img('old_comps_1'),
  /** Section navigation flattened into rows of sibling tabs. */
  navigation: img('navigation_-_old'),
  /** Left-hand navigation bar. */
  leftNav: img('nav_bar_old'),
  /** Deal ingestion — normalised rent roll. */
  ingestionClean: img('ingestion_AI_-_2'),
  /** Deal ingestion — the blocking resolve-and-confirm step. */
  ingestionSelect: img('ingestion_AI_-_3'),
  /** Dataroom, already built and already buried. */
  dataroom: img('dataroom'),
  /** PostHog session review — rage clicks concentrated in the comparables area. */
  posthog: img('old_platform_-_posthog_review'),
} as const

/** The shipped platform improvements — the unglamorous first workstream. */
export const MID_PLATFORM = {
  /** Restructured comparables, dark. */
  compsDark: img('new_comps'),
  /** Restructured comparables, light. */
  compsLight: img('new_comps_-_light_mode'),
  /** Consolidated navigation, grouped into a single dropdown. */
  navBar: img('navigation_-_new'),
  /** Business plan view. */
  businessPlan: img('business_plan'),
} as const

/** The agentic layer. */
export const NEW_PLATFORM = {
  /** Round 1 — the open chat interface. */
  chatInterface: img('open_chat_interface'),
  /** Round 2 — the prompt with named workflow cards beneath it. */
  chatWorkflows: img('hybrid_ui'),
  /** Round 3 — hybrid workspace with the structured panel expanded. */
  hybridWorkspaceExpanded: img('hybrid_workspace2'),
  /** Round 3 — a workflow opening into a free-flowing conversation. */
  workflowsIntoConversation: img('workflows_that_open_into_conversations'),
  /** Chat action — adding a column to the comparables table. */
  compsAddColumn: img('chat_comps_add_column'),
  /** Asset-first homepage. */
  homepageAssetFirst: img('final_new_homepage_-_asset'),
  /** Early direction sketches. */
  earlyDirection: img('directions_sketches_-_early'),

  /** Hero clip — comparables output on the agentic platform. */
  compsOutput: video('comps-output'),
  /** Creating an asset from a file drop, before any structured input. */
  createNewAsset: video('create-new-asset'),
  /** Dropping files straight into the dataroom. */
  dataroomFileDrop: video('dataroom-file-drop'),
  /** Calculating ERV inside a workflow. */
  calculateErv: video('calculate-erv'),
  /** Generating a market report end to end. */
  marketReportGeneration: video('market-report-generation'),

  /** Drilling into comparables from chat. */
  compsChatDrilldown: video('comps_in_caht'),
  /** Jumping to a step inside a running workflow. */
  jumpToStep: video('jump_to_steo_in_the_workflow'),
  /** Starting a task from the prompt. */
  startWithPrompt: video('chat_video_-_start_with_prompt'),
} as const
