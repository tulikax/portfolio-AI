import type { CSSProperties } from 'react'

/**
 * Shared style tokens for the DoorFeed demo page.
 *
 * The source design was a cream/ink editorial layout with a blue accent. Here
 * the palette collapses onto the site's single `--ink` channel, so hierarchy is
 * carried by opacity and weight rather than hue. The one exception is `WARM`,
 * a lifted terracotta used only for the live status dot and the "pain" flags in
 * the journey — the two places where the original's colour was doing semantic
 * work rather than decorative work.
 */

/** Foreground at an alpha, against the page's black surface. */
export const ink = (alpha: number) => `rgb(var(--ink) / ${alpha})`

/** Terracotta, lifted from the source `#C4562E` to stay legible on black. */
export const WARM = '224 122 79'
export const warm = (alpha: number) => `rgb(${WARM} / ${alpha})`

export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/**
 * Page gutter. 72rem matches the container every section of the live case
 * studies uses, so the left edge of titles and copy lines up between the two.
 * Body copy keeps its own narrower measure via BODY below.
 */
export const WRAP: CSSProperties = {
  maxWidth: '72rem',
  margin: '0 auto',
  padding: '0 2rem',
}

/**
 * Stands in for the source design's JetBrains Mono. Barlow at a small size with
 * wide tracking reads as the same "technical label" register without loading a
 * third family.
 */
export const MONO: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.68rem',
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}

export const DISPLAY: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  letterSpacing: '-0.02em',
}

export const BODY: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  fontWeight: 300,
  lineHeight: 1.8,
  color: ink(0.72),
  maxWidth: '42rem',
  margin: '0 0 1.375rem',
}

/*
 * Heading scale. Four steps, used everywhere on the page so a sub-heading in
 * one chapter is the same size as a sub-heading in another:
 *
 *   CHAPTER_TITLE  chapter openers
 *   H2             sub-headings inside a chapter
 *   H3             item titles — rounds, findings, reflections, decisions
 *   H4             card titles
 */
export const H2: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(1.3125rem, 2.7vw, 1.75rem)',
  lineHeight: 1.15,
  color: 'rgb(var(--ink) / 0.95)',
}

export const H3: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  letterSpacing: '-0.015em',
  fontSize: 'clamp(1.125rem, 2.1vw, 1.375rem)',
  lineHeight: 1.25,
  color: 'rgb(var(--ink) / 0.95)',
}

export const H4: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  fontSize: '1.0625rem',
  lineHeight: 1.3,
  color: 'rgb(var(--ink) / 0.95)',
}

export const CHAPTER_TITLE: CSSProperties = {
  ...DISPLAY,
  fontWeight: 300,
  fontSize: 'clamp(1.875rem, 4.6vw, 3.25rem)',
  lineHeight: 1.06,
  color: ink(0.95),
  margin: 0,
}

/** The source used a coloured italic for emphasis; here italic Bodoni alone carries it. */
export const EMPHASIS: CSSProperties = {
  fontStyle: 'italic',
  color: ink(0.95),
}

export const HAIRLINE = ink(0.08)
export const HAIRLINE_STRONG = ink(0.18)
