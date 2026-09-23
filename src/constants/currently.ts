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
  title: 'Imagine an Organism',
  source: 'Inference · David Lobina',
  // ⚠️ PLACEHOLDER — your take, not mine
  take: 'PLACEHOLDER — one or two sentences on what stuck with you.',
  href: 'https://inference-review.com/article/imagine-an-organism',
  // Inference publishes no favicon or apple-touch-icon (both 404); this is its
  // masthead logo, the only icon asset the site serves. If it ever moves, the
  // tile falls back to the tinted glyph on its own.
  iconUrl: 'https://inference-review.com/webpack/dist/inference_logo_2026.svg',
}

/** Tulika's own publication — distinct from RECENT_READ above, which is someone else's. */
export const SUBSTACK_URL = 'https://engineeredbydesign.substack.com'

export const LATEST_POST: SubstackPost = {
  title: 'Designing for delegation',
  date: 'Sep 2026',
  href: `${SUBSTACK_URL}/p/designing-for-delegation`,
}

/** Where she is — drives the live clock tile */
export const HOME_CITY = { label: 'London, UK', timeZone: 'Europe/London' }
