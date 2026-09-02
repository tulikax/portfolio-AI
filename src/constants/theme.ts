/**
 * Bridge between CSS custom properties and canvas drawing code.
 *
 * Canvas `ctx.font` and `ctx.fillStyle` cannot resolve `var(--…)`, so canvas
 * components read the tokens at runtime instead of hardcoding families/colours.
 * This keeps :root in index.css the single source of truth — including when the
 * light theme flips `--ink`.
 */

const FALLBACK_DISPLAY = "'Bodoni Moda', serif"
const FALLBACK_INK = '255 255 255'

/**
 * getComputedStyle forces a style recalc, and these tokens are read inside
 * per-particle draw loops — so resolved values are cached. Call `refreshTheme()`
 * after flipping the theme to invalidate.
 */
const cache = new Map<string, string>()

function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const cached = cache.get(name)
  if (cached !== undefined) return cached
  const value =
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  cache.set(name, value)
  return value
}

/** Drop cached token values — call when the theme changes. */
export function refreshTheme(): void {
  cache.clear()
}

/** Display family, e.g. `'Bodoni Moda', serif` — for building `ctx.font` strings. */
export function displayFontFamily(): string {
  return readToken('--font-display', FALLBACK_DISPLAY)
}

/** A `ctx.font` string in the display family at the given size. */
export function displayFont(sizePx: number, style = 'italic'): string {
  return `${style} ${sizePx}px ${displayFontFamily()}`
}

/** Foreground RGB channel, e.g. `255 255 255` — flips with the theme. */
export function inkChannel(): string {
  return readToken('--ink', FALLBACK_INK)
}

/** Foreground colour at an alpha, as a canvas-ready `rgb(R G B / a)` string. */
export function ink(alpha = 1): string {
  return `rgb(${inkChannel()} / ${alpha})`
}
