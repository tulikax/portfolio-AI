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
 * per-particle draw loops — so resolved values are cached, keyed by the element
 * they were resolved against. A `let` (not `const`) because clearing a WeakMap
 * means replacing it. Call `refreshTheme()` after flipping the theme.
 */
let cachesByRoot = new WeakMap<Element, Map<string, string>>()

function cacheFor(root: Element): Map<string, string> {
  let cache = cachesByRoot.get(root)
  if (!cache) {
    cache = new Map()
    cachesByRoot.set(root, cache)
  }
  return cache
}

function readToken(name: string, fallback: string, root?: Element): string {
  if (typeof window === 'undefined') return fallback
  const el = root ?? document.documentElement
  const cache = cacheFor(el)
  const cached = cache.get(name)
  if (cached !== undefined) return cached
  const value = getComputedStyle(el).getPropertyValue(name).trim() || fallback
  cache.set(name, value)
  return value
}

/** Drop every cached token value — call when the theme changes. */
export function refreshTheme(): void {
  cachesByRoot = new WeakMap()
}

/** Display family, e.g. `'Bodoni Moda', serif` — for building `ctx.font` strings. */
export function displayFontFamily(root?: Element): string {
  return readToken('--font-display', FALLBACK_DISPLAY, root)
}

/** A `ctx.font` string in the display family at the given size. */
export function displayFont(sizePx: number, style = 'italic', root?: Element): string {
  return `${style} ${sizePx}px ${displayFontFamily(root)}`
}

/** Foreground RGB channel, e.g. `255 255 255` — flips with the theme. */
export function inkChannel(root?: Element): string {
  return readToken('--ink', FALLBACK_INK, root)
}

/** Foreground colour at an alpha, as a canvas-ready `rgb(R G B / a)` string. */
export function ink(alpha = 1, root?: Element): string {
  return `rgb(${inkChannel(root)} / ${alpha})`
}
