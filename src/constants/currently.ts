/**
 * The "currently" block on the homepage About section — the personal, frequently
 * refreshed half of the page. Edit this file and nothing else to update it.
 */

export interface NowPlaying {
  title: string
  artist: string
  /** YouTube video id — the tile plays this inline on click, and supplies the artwork */
  youtubeId: string
  /** Where the good bit starts, in seconds */
  startAtSeconds?: number
}

export interface RecentRead {
  title: string
  /** Byline + publication, e.g. "Verified Insider · Tom Scott & Vitor Amaral" */
  source: string
  /** Shown on hover — her take on it */
  take: string
  href?: string
  /** Square icon from the source publication; falls back to a tinted tile if it fails */
  iconUrl?: string
}

export interface SubstackPost {
  title: string
  /** e.g. "Mar 2026" */
  date: string
  href: string
  /** Square icon for your publication; falls back to a pen glyph if absent */
  iconUrl?: string
}

export const NOW_PLAYING: NowPlaying = {
  title: 'Hands',
  artist: 'Point Point feat. Denai Moore',
  youtubeId: 'MREMUOjoyCc',
  startAtSeconds: 45,
}

export const RECENT_READ: RecentRead = {
  title: 'Operating as an AI-native product designer in 2026',
  source: 'Verified Insider · Tom Scott & Vitor Amaral',
  // ⚠️ PLACEHOLDER — your take, not mine
  take: 'PLACEHOLDER — one or two sentences on what stuck with you.',
  href: 'https://verifiedinsider.substack.com/p/operating-as-an-ai-native-product',
  // The publication's own apple-touch-icon
  iconUrl: 'https://substack-post-media.s3.amazonaws.com/public/images/5d5a7648-aa0b-4ce6-932c-e766428d1589/apple-touch-icon-120x120.png',
}

// ⚠️ PLACEHOLDER — your own Substack, not the one above
export const SUBSTACK_URL = 'https://substack.com'

export const LATEST_POST: SubstackPost = {
  title: 'PLACEHOLDER — your most recent Substack post',
  date: 'Mon 2026',
  href: SUBSTACK_URL,
}

/** Where she is — drives the live clock tile */
export const HOME_CITY = { label: 'London, UK', timeZone: 'Europe/London' }
