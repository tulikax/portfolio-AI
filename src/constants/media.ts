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

/**
 * Poster frame for a video, taken at the first frame (`so_0`).
 *
 * Videos that only start on scroll need something to show before they do,
 * otherwise the slab sits empty until it is played.
 */
export function poster(id: string): string {
  return `${BASE}/video/upload/so_0,f_auto,q_auto/${id}.jpg`
}

/**
 * SigTech MAGIC.
 *
 * Note the public IDs: colons and commas in the original filenames are dropped
 * rather than turned into underscores, which is why `research with
 * users:stakeholders` delivers at `research_with_users_stakeholders`.
 */
export const SIGTECH = {
  /** The Quant IDE the work started inside. */
  quantIde: img('original_IDE'),
  /** The original ChatGPT-style plugin — answers with no way to verify them. */
  pluginChat: img('Chat_v1'),

  /** Design process. */
  process: img('process'),
  processBloomberg: img('process_-_bloomberg'),
  researchCompetition: img('research_-competition_analysis'),
  researchUsers: img('research_with_users_stakeholders'),

  /** Pivot 1 — multiple GPTs inside the existing IDE. */
  pivot1: img('starting_point_or_pivot_1_-_Multiple_GPTs_within_existing_IDE'),
  /** Pivot 2 — fully chat based. */
  pivot2: img('pivot_2_fully_chat_based'),
  pivot2Agents: img('pivot_2.2_-_thikning_about_agent_use_in_real_life'),
  pivot2InfoArch: img('pivot_2_info_arch'),
  pivot2Tasks: img('pivot_2_chat_view_tasks_and_actions'),
  /** Pivot 3 — beyond chat, toward something scalable. */
  pivot3: img('pivot_3_explorations'),
  pivot3Jobs: img('pivot_3_workflows_and_jobs_as_an_idea'),

  /** Day one — chat only. */
  dayOne: img('Day_1_-_chat_only'),
  /** Jobs — the unit that replaced the open conversation. */
  jobs: img('Final_outcome_-_Jobs_as_a_concept'),
  createJob: img('Create_a_Job'),
  /** The task list, making the model's reasoning visible. */
  taskList: img('Task_list_as_an_idea_for_transperancy'),
  /** Verify source, view related, copy with attribution. */
  verifySource: img('final_draft_-_verify_source_view_related_copy_with_attribition'),
  /** Pilot metrics, instrumented to validate each direction. */
  metabase: img('metabase_tracking'),
  /** The shipped product — chat beside tasks and actions. */
  shipped: img('what_shipped'),
  overview: img('overview_1'),

  chatFlow: video('chat-flow'),
  agentsInAction: video('agents-in-action'),
  pluginDemo: video('plugin'),
} as const

/** Deloitte — the NLG reporting tool and the work around it. */
export const DELOITTE = {
  /**
   * The Insight Summariser at step one of five. Taken from the first frame of
   * the walkthrough, because the tool itself was only ever captured on video.
   */
  nlgWizard: poster('nlg2final'),

  /** Selected work from the Innovations team, as one board. */
  bento: img('final_bento'),
  bentoAlt: img('deloitte_bento'),
  /** Deloitte THiNK — the knowledge base UX refresh. */
  think: img('KMS_1'),
  thinkWireframe: img('KMS_wierframe'),
  /** The HR conversational assistant for a major bank. */
  hrAssistant: img('Deloitte_phone_screens'),
  sketches: img('Deloitte_sketches'),

  /** The report editing flow, end to end. */
  nlgFlow: video('nlg2final'),
  nlgPrototype: video('nlg'),
  nlgEditing: video('nlg2'),
} as const

/**
 * Photographs for the bento board's photography tile.
 *
 * Read out of the shared collection rather than typed by hand — the folder name
 * in the Media Library is only a label, the delivered ID is flat, and this
 * account has Cloudinary's resource-list delivery disabled, so a folder cannot
 * be enumerated over the delivery URL. The collection link itself expires, so
 * these are pinned here rather than fetched.
 *
 * The collection holds 21 assets: these 19 images plus 2 videos, which the tile
 * has no way to show. To add one, upload it and append its public ID to the
 * list matching its orientation.
 *
 * They are split that way because the tile composes three photographs at once
 * and each slot is shaped for one orientation — a portrait dropped into a wide
 * slot is mostly crop. Every ratio here was read from Cloudinary, not guessed.
 */

/** Landscape — the two outer frames of the tile's stack. */
export const PHOTOGRAPHY_LANDSCAPE: string[] = [
  img('IMG_0451'),
  img('IMG_0459'),
  img('IMG_0514'),
  img('IMG_6187'),
  img('21BD7A29-BCD3-46BD-A687-A1835E0993A0'),
  img('Screenshot_2025-06-21_at_15.20.09'),
  img('Screenshot_2025-06-21_at_15.20.24'),
  img('Screenshot_2025-06-21_at_15.20.48'),
]

/** Portrait photographs — the middle frame. */
export const PHOTOGRAPHY_PORTRAIT: string[] = [
  img('IMG_0312'),
  img('IMG_1397'),
  img('IMG_4189'),
  img('IMG_6173'),
  img('IMG_6200_2'),
  img('IMG_9284'),
  img('IMG_9811'),
  img('IMG_9813'),
  img('IMG_9838'),
  /** Birds on a streetlamp. */
  img('Screenshot_2025-06-21_at_15.19.54'),
  img('Screenshot_2025-06-21_at_15.20.35'),
]

/** All 19, for anything that wants the set rather than one orientation. */
export const PHOTOGRAPHY: string[] = [...PHOTOGRAPHY_LANDSCAPE, ...PHOTOGRAPHY_PORTRAIT]

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
