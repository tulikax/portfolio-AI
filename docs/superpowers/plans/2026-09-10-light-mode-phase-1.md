# Light Mode Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site's theme switchable between a softened dark and a warm light palette, reviewable via a private keyboard shortcut and unreachable by visitors.

**Architecture:** The palette lives entirely in `index.css` under `:root` / `:root[data-theme='light']`. A small React module (`src/theme/`) stamps `data-theme` on `<html>` in a layout effect, persists the choice, and hands canvas components a memoised accessor object whose identity changes with the theme, so their effects re-run and re-read the tokens. Canvas code keeps reading tokens out of CSS through `src/constants/theme.ts`, which becomes element-scoped so a pinned subtree resolves correctly.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, react-router-dom 7, Tailwind v4 (installed, CSS-first, barely used — the codebase is inline styles).

**Spec:** [`docs/superpowers/specs/2026-09-10-light-mode-phase-1-design.md`](../specs/2026-09-10-light-mode-phase-1-design.md)

## Global Constraints

- **No test runner exists.** `package.json` has no vitest/jest, and adding one is explicitly out of scope. Every task verifies with `npx tsc --noEmit`, `npm run lint`, and a named browser check instead of a red-green test cycle. Do not add a test framework.
- **Lint is zero-warning.** `lint-staged` runs `eslint --max-warnings=0`; a husky pre-commit hook enforces it. Warnings block commits.
- **Conventional commits.** commitlint is installed. Use `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- **Never commit** `.claude/launch.json`, `.claude/run-dev.sh`, or any `.env*` file.
- **Branch off `base`,** per `CLAUDE.md`. Never commit directly to `main` or `base`.
- **Storage key** is exactly `portfolio:theme-mode`.
- **`SYSTEM_FOLLOWS_OS` is `false`** throughout Phase 1. It appears in two places (TypeScript and the inline `index.html` script) which must stay in sync — both carry a comment saying so.
- **Do not touch** `-webkit-mask: linear-gradient(#fff 0 0)` in `index.css`. That white is a mask channel, not a colour.

---

## Stage boundaries

The spec called for two commits. Having measured the shadow call sites, this plan
uses **three stages** — the shadow sweep needs its own boundary because it is a
judgement call per site, not a mechanical substitution:

| Stage | Tasks | Visual effect in dark mode |
|---|---|---|
| 1 — Plumbing | 1–7 | None. Pixel-identical to today. |
| 2 — Shadows | 8 | None in dark (`rgb(0 0 0 / 0.5)` ≡ `rgba(0,0,0,0.5)`); light mode gains theme-aware shadows. |
| 3 — Palette | 9 | Deliberate. Both poles soften off pure black/white. |

If a regression appears, `git diff` between stage boundaries isolates the cause.

---

### Task 1: Element-scoped token reads in `theme.ts`

Two latent defects, fixed before anything depends on them: the token reader
hardcodes `document.documentElement` (so a pinned subtree would resolve the wrong
theme), and its cache is a module-scope `Map` (so a token read before `data-theme`
is stamped stays wrong until `refreshTheme()`).

**Files:**
- Modify: `src/constants/theme.ts` (whole file)

**Interfaces:**
- Consumes: nothing (first task)
- Produces:
  - `refreshTheme(): void`
  - `displayFontFamily(root?: Element): string`
  - `displayFont(sizePx: number, style?: string, root?: Element): string`
  - `inkChannel(root?: Element): string`
  - `ink(alpha?: number, root?: Element): string`

  All `root` parameters default to `document.documentElement`, so every existing
  call site keeps working unchanged.

- [ ] **Step 1: Replace the cache with a per-root WeakMap**

Replace lines 17–32 of `src/constants/theme.ts` (the `cache` declaration and
`readToken`/`refreshTheme`) with:

```ts
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
```

- [ ] **Step 2: Thread `root` through the four public accessors**

Replace the remainder of the file (from `displayFontFamily` to the end) with:

```ts
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
```

- [ ] **Step 3: Verify types and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: both clean. Every existing call site omits `root`, so nothing else changes.

- [ ] **Step 4: Verify the site still renders**

Start the dev server and load `/`. The particle hero must render exactly as before —
white particles, no blank canvas. A blank canvas means `readToken` is returning the
fallback, i.e. the WeakMap wiring is wrong.

- [ ] **Step 5: Commit**

```bash
git add src/constants/theme.ts
git commit -m "refactor(theme): scope token reads to an element and cache per root"
```

---

### Task 2: Theme state module

**Files:**
- Create: `src/theme/ThemeContext.ts`
- Create: `src/theme/ThemeProvider.tsx`
- Create: `src/theme/useTheme.ts`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `refreshTheme` from `src/constants/theme.ts` (Task 1)
- Produces:
  - `type ThemeMode = 'system' | 'light' | 'dark'`
  - `type ResolvedTheme = 'light' | 'dark'`
  - `SYSTEM_FOLLOWS_OS: boolean` (const `false`)
  - `STORAGE_KEY: string` (`'portfolio:theme-mode'`)
  - `ThemeStateContext` — value `{ mode, resolved, setMode, toggle }`
  - `ThemeRootContext` — value `Element | null` (null until mounted; consumers fall back to `document.documentElement`)
  - `<ThemeProvider>` component
  - `useTheme(): { mode, resolved, setMode, toggle }`

Two separate contexts on purpose: `ThemeScope` (Task 5) overrides only the *root
element*, never the mode. Bundling them would make a pinned subtree look like it
had its own mode state, which it does not.

- [ ] **Step 1: Create the contexts**

Create `src/theme/ThemeContext.ts`:

```ts
import { createContext } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const STORAGE_KEY = 'portfolio:theme-mode'

/**
 * Phase 3 flips this to true, at which point 'system' starts following the OS.
 * Until then every visitor gets dark and light mode is reachable only by the
 * Ctrl+Alt+L shortcut.
 *
 * KEEP IN SYNC with the inline pre-paint script in index.html, which duplicates
 * this value because it runs before any module loads.
 */
export const SYSTEM_FOLLOWS_OS = false

export interface ThemeState {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export const ThemeStateContext = createContext<ThemeState | null>(null)

/** The element carrying the active `data-theme`. Overridden by <ThemeScope>. */
export const ThemeRootContext = createContext<Element | null>(null)
```

- [ ] **Step 2: Create the provider**

Create `src/theme/ThemeProvider.tsx`:

```tsx
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { refreshTheme } from '../constants/theme'
import {
  STORAGE_KEY,
  SYSTEM_FOLLOWS_OS,
  ThemeRootContext,
  ThemeStateContext,
  type ResolvedTheme,
  type ThemeMode,
} from './ThemeContext'

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Private browsing or a blocked storage partition — fall through to default.
  }
  return 'system'
}

function resolve(mode: ThemeMode, prefersLight: boolean): ResolvedTheme {
  if (mode !== 'system') return mode
  return SYSTEM_FOLLOWS_OS && prefersLight ? 'light' : 'dark'
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode)
  const [prefersLight, setPrefersLight] = useState(
    () => typeof window !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches,
  )
  const resolved = resolve(mode, prefersLight)

  // Track the OS preference even while SYSTEM_FOLLOWS_OS is false, so that
  // flipping the constant in Phase 3 needs no further wiring.
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: light)')
    const onChange = (event: MediaQueryListEvent) => setPrefersLight(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // A LAYOUT effect, deliberately. React's commit phase runs every layout effect
  // (child-first, then parent) before any passive effect. Consumers read tokens in
  // ordinary useEffects, so this is guaranteed to have stamped the attribute and
  // cleared the cache before any of them look. A passive effect here would run
  // child-first — i.e. after the consumers that depend on it — and hand them stale
  // tokens.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolved === 'light' ? '#faf9f6' : '#000000')
    }
    // Tokens are cached against the old palette until this runs.
    refreshTheme()
  }, [resolved])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable — the choice just won't survive a reload.
    }
  }, [])

  const toggle = useCallback(() => {
    setModeState((current) => {
      const next: ThemeMode = resolve(current, prefersLight) === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // See above.
      }
      return next
    })
  }, [prefersLight])

  // Private review shortcut. Phase 3 replaces this with a visible control.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const state = useMemo(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved, setMode, toggle],
  )

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeRootContext.Provider value={null}>{children}</ThemeRootContext.Provider>
    </ThemeStateContext.Provider>
  )
}
```

- [ ] **Step 3: Create the consumer hook**

Create `src/theme/useTheme.ts`:

```ts
import { useContext } from 'react'
import { ThemeStateContext, type ThemeState } from './ThemeContext'

export function useTheme(): ThemeState {
  const state = useContext(ThemeStateContext)
  if (!state) throw new Error('useTheme must be used inside <ThemeProvider>')
  return state
}
```

- [ ] **Step 4: Mount the provider**

In `src/main.tsx`, add the import and wrap `<App />`. It goes **outside**
`BrowserRouter` so the theme survives navigation:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './theme/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit && npm run lint
```

In the browser on `/`: open devtools, confirm `<html data-theme="dark">` is present.
Press `Ctrl+Alt+L` and confirm the attribute flips to `light` (the page will barely
change yet — the palette blocks land in Task 6). Run
`localStorage.getItem('portfolio:theme-mode')` in the console and confirm it reads
`"light"`. Reload; the attribute must still be `light`.

- [ ] **Step 6: Commit**

```bash
git add src/theme/ThemeContext.ts src/theme/ThemeProvider.tsx src/theme/useTheme.ts src/main.tsx
git commit -m "feat(theme): add tri-state theme provider with review shortcut"
```

---

### Task 3: Pre-paint theme script and `theme-color` meta

Without this, a reload in light mode paints dark first and snaps — which reads as
a broken page rather than a theme.

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: the `portfolio:theme-mode` storage key and the `SYSTEM_FOLLOWS_OS` value from Task 2 (duplicated here by necessity — this runs before any module loads)
- Produces: `<html data-theme>` set before first paint; a `<meta name="theme-color">` element for the provider to update

- [ ] **Step 1: Add the meta tag and inline script**

In `index.html`, immediately after the existing `<meta name="viewport" …>` line,
insert:

```html
    <meta name="theme-color" content="#000000" />
    <script>
      // Runs before the stylesheet so the first paint is already correct.
      // Without it, a light-mode reload flashes dark.
      // KEEP IN SYNC with SYSTEM_FOLLOWS_OS in src/theme/ThemeContext.ts.
      ;(function () {
        var SYSTEM_FOLLOWS_OS = false
        var resolved = 'dark'
        try {
          var mode = localStorage.getItem('portfolio:theme-mode') || 'system'
          if (mode === 'light' || mode === 'dark') {
            resolved = mode
          } else if (SYSTEM_FOLLOWS_OS && matchMedia('(prefers-color-scheme: light)').matches) {
            resolved = 'light'
          }
        } catch (e) {
          // Storage blocked — dark is the safe default.
        }
        document.documentElement.dataset.theme = resolved
      })()
    </script>
```

- [ ] **Step 2: Verify no flash**

Flip to light with `Ctrl+Alt+L`, then hard-reload. Watch the very first frame:
there must be no dark flash. Confirm in devtools that `<html>` carries
`data-theme="light"` before React mounts (throttle CPU 6× to make the window
observable if needed).

- [ ] **Step 3: Verify a fresh visitor gets dark**

In the console: `localStorage.removeItem('portfolio:theme-mode')`, then reload.
`<html>` must be `data-theme="dark"` even on a machine set to a light OS theme.
This is the check that light mode is not publicly reachable.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(theme): stamp data-theme before first paint"
```

---

### Task 4: `useThemedCanvas` and canvas migration

Canvas components capture `inkChannel()` once at effect start, so they keep drawing
the old colour after a flip. Rather than asking each component to remember a
theme dep — a convention that will rot the first time someone adds a
canvas component — this hook returns the ink accessors and the version as one
memoised object. Depending on it is the only way to read the ink, so the two cannot
drift apart.

**Files:**
- Create: `src/theme/useThemedCanvas.ts`
- Modify: `src/components/ParticleTitle.tsx:1-2,63-67,410`
- Modify: `src/components/ParticleCanvas.tsx:1-2,31-35,144`
- Modify: `src/components/HeroWireframe.tsx:1-2,82-86,222`
- Modify: `src/components/ProjectLoadingScreen.tsx:1-4,27-31,120,148-152,338`

**Interfaces:**
- Consumes: `ThemeStateContext`, `ThemeRootContext` (Task 2); `inkChannel`, `ink`, `displayFont` (Task 1)
- Produces: `useThemedCanvas(): ThemedCanvas` where

  ```ts
  interface ThemedCanvas {
    resolved: ResolvedTheme
    themeRoot: Element
    inkChannel: () => string
    ink: (alpha?: number) => string
    displayFont: (sizePx: number, style?: string) => string
  }
  ```

  The returned object's identity changes whenever the resolved theme changes.

- [ ] **Step 1: Create the hook**

Create `src/theme/useThemedCanvas.ts`:

```ts
import { useContext, useMemo } from 'react'
import { displayFont, ink, inkChannel } from '../constants/theme'
import { ThemeRootContext, type ResolvedTheme } from './ThemeContext'
import { useTheme } from './useTheme'

export interface ThemedCanvas {
  resolved: ResolvedTheme
  themeRoot: Element
  inkChannel: () => string
  ink: (alpha?: number) => string
  displayFont: (sizePx: number, style?: string) => string
}

/**
 * Ink accessors bundled with the theme identity that invalidates them.
 *
 * Canvas effects cache colours at effect start, so they must re-run on a theme
 * flip. Put the whole returned object in the effect's dependency array: because
 * reading the ink and subscribing to its changes come from the same value, a
 * component cannot do one without the other.
 *
 * Ordering is safe because ThemeProvider stamps `data-theme` and calls
 * `refreshTheme()` in a LAYOUT effect: every layout effect completes before any
 * passive effect, so by the time a consumer's useEffect calls `inkChannel()` the
 * attribute is set and the cache is empty.
 */
export function useThemedCanvas(): ThemedCanvas {
  const { resolved } = useTheme()
  const scopedRoot = useContext(ThemeRootContext)

  return useMemo(() => {
    const themeRoot = scopedRoot ?? document.documentElement
    return {
      resolved,
      themeRoot,
      inkChannel: () => inkChannel(themeRoot),
      ink: (alpha = 1) => ink(alpha, themeRoot),
      displayFont: (sizePx: number, style = 'italic') => displayFont(sizePx, style, themeRoot),
    }
  }, [resolved, scopedRoot])
}
```

- [ ] **Step 2: Migrate `ParticleTitle.tsx`**

Change the import on line 2 from:

```ts
import { displayFont, inkChannel } from '../constants/theme'
```

to:

```ts
import { useThemedCanvas } from '../theme/useThemedCanvas'
```

Add inside the component body, above the `useEffect` on line 63:

```ts
  const theme = useThemedCanvas()
```

Replace line 67 (`const INK = inkChannel()`) with:

```ts
    const INK = theme.inkChannel()
```

Replace every other `displayFont(` call inside the effect with `theme.displayFont(`.
Change the dependency array on line 410 from `[activeCursorRef]` to
`[activeCursorRef, theme]`.

- [ ] **Step 3: Migrate `ParticleCanvas.tsx`**

Change the import on line 2 from:

```ts
import { inkChannel } from '../constants/theme'
```

to:

```ts
import { useThemedCanvas } from '../theme/useThemedCanvas'
```

Add inside the component body, above the `useEffect` on line 31:

```ts
  const theme = useThemedCanvas()
```

Replace line 35 (`const INK = inkChannel()`) with:

```ts
    const INK = theme.inkChannel()
```

Change the dependency array on line 144 from `[cursorRef]` to `[cursorRef, theme]`.

- [ ] **Step 4: Migrate `HeroWireframe.tsx`**

Change the import on line 2 from:

```ts
import { inkChannel } from '../constants/theme'
```

to:

```ts
import { useThemedCanvas } from '../theme/useThemedCanvas'
```

Add inside the component body, above the `useEffect` on line 82:

```ts
  const theme = useThemedCanvas()
```

Replace line 86 (`const INK = inkChannel()`) with:

```ts
    const INK = theme.inkChannel()
```

Change the dependency array on line 222 from `[cursorRef]` to `[cursorRef, theme]`.

- [ ] **Step 5: Migrate `ProjectLoadingScreen.tsx` — both effects**

This file holds **two** components, each with its own canvas effect (lines 27 and
148). Both need migrating, and each needs its **own** `useThemedCanvas()` call —
hooks cannot be shared across components.

Change the import on line 4 from:

```ts
import { displayFont, inkChannel } from '../constants/theme'
```

to:

```ts
import { useThemedCanvas } from '../theme/useThemedCanvas'
```

In the first component, above the `useEffect` on line 27, add:

```ts
  const theme = useThemedCanvas()
```

Replace line 31 (`const INK = inkChannel()`) with:

```ts
    const INK = theme.inkChannel()
```

Change the dependency array on line 120 from `[cursorRef]` to `[cursorRef, theme]`.

In the second component, above the `useEffect` on line 148, add:

```ts
  const theme = useThemedCanvas()
```

Replace line 152 (`const INK = inkChannel()`) with:

```ts
    const INK = theme.inkChannel()
```

Change the dependency array on line 338 from `[cursorRef]` to `[cursorRef, theme]`.

In both components, replace every `displayFont(` call inside the effects with
`theme.displayFont(`.

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit && npm run lint
```

`eslint-plugin-react-hooks` is configured; if any dependency array is wrong it will
say so. Fix by adding `theme`, never by suppressing the rule.

- [ ] **Step 7: Verify canvas re-initialisation**

On `/`, with the particle hero visible, press `Ctrl+Alt+L`. The particles must
visibly re-initialise. They will still be light-coloured until Task 6 lands the
palette — what you are checking is that the effect *re-ran*, which is easiest to see
as the particles resetting their positions. Repeat on `/demo/loading` (dev-only
route) for `ProjectLoadingScreen`'s two canvases.

- [ ] **Step 8: Commit**

```bash
git add src/theme/useThemedCanvas.ts src/components/ParticleTitle.tsx src/components/ParticleCanvas.tsx src/components/HeroWireframe.tsx src/components/ProjectLoadingScreen.tsx
git commit -m "feat(theme): re-init canvas components on theme change"
```

---

### Task 5: `ThemeScope`

Built now, deliberately unused. Pinning case studies to dark is the decision
deferred to review; having this in place makes that a one-line application rather
than a refactor, and it is what makes Task 1's element-scoped reads pay off.

**Files:**
- Create: `src/theme/ThemeScope.tsx`

**Interfaces:**
- Consumes: `ThemeRootContext` (Task 2)
- Produces: `<ThemeScope theme="light" | "dark">` — renders a `<div>` carrying its own `data-theme` and provides that element as the theme root to descendants

- [ ] **Step 1: Create the component**

Create `src/theme/ThemeScope.tsx`:

```tsx
import { useState, type CSSProperties, type ReactNode } from 'react'
import { ThemeRootContext, type ResolvedTheme } from './ThemeContext'

/**
 * Pins a subtree to one theme regardless of the global choice.
 *
 * Unused in Phase 1. It exists so that locking case studies to dark — the open
 * question this phase is meant to answer — is a one-line change. Descendant
 * canvas components resolve tokens against this element rather than <html>,
 * which is why theme.ts takes a root parameter.
 */
export default function ThemeScope({
  theme,
  children,
  style,
}: {
  theme: ResolvedTheme
  children: ReactNode
  style?: CSSProperties
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  return (
    <div ref={setElement} data-theme={theme} style={style}>
      <ThemeRootContext.Provider value={element}>{children}</ThemeRootContext.Provider>
    </div>
  )
}
```

A callback ref in state, not `useRef`, because the context value must *change*
once the element mounts — a ref mutation would not re-render the descendants that
need to re-resolve their tokens.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit && npm run lint
```

Expected: clean. The component is unreferenced, which is fine — it is not a lint
error to export an unused component.

- [ ] **Step 3: Commit**

```bash
git add src/theme/ThemeScope.tsx
git commit -m "feat(theme): add ThemeScope for pinning a subtree to one theme"
```

---

### Task 6: Palette and shadow tokens in `index.css`

**Files:**
- Modify: `src/index.css:14-53` (the `:root` block)

**Interfaces:**
- Consumes: nothing
- Produces: CSS custom properties `--ink`, `--surface`, `--shadow-ink`, `--shadow-hairline`, `--shadow-card`, `--shadow-float`, defined for both themes

Dark values in this task are **exactly today's values** — pure black and pure
white. Softening happens in Task 9, so that anything that breaks here is
unambiguously the plumbing.

- [ ] **Step 1: Add the shadow channel and composite tokens to `:root`**

In `src/index.css`, inside the existing `:root` block, immediately after the
`--surface: 0 0 0;` line (line 26), add:

```css
  /* Shadow ink is its own channel: on paper a shadow is not the foreground
     colour at low alpha, and the two need to diverge in light mode. */
  --shadow-ink: 0 0 0;

  /* Composite because inline styles can only consume a finished value.
     Compose them at call sites: `var(--shadow-hairline), var(--shadow-float)`.
     Geometry is per-theme — see the light block below for why. */
  --shadow-hairline: 0 1px 0 rgb(var(--ink) / 0.08) inset;
  --shadow-card: 0 8px 32px rgb(var(--shadow-ink) / 0.5);
  --shadow-float: 0 20px 60px rgb(var(--shadow-ink) / 0.5);
```

These dark values are chosen to match the most common existing declarations
exactly, so Task 8's sweep changes no pixels in dark mode.

- [ ] **Step 2: Add the light theme block**

Immediately after the closing brace of the `:root` block (after line 53), add:

```css
/* Warm paper and warm ink — both poles pulled off the extremes. Bodoni Moda is
   a didone and renders far better dark-on-light, where its hairlines stay crisp
   instead of blooming. */
:root[data-theme='light'] {
  --ink: 26 24 22;
  --ink-solid: rgb(var(--ink));
  --surface: 250 249 246;

  --shadow-ink: 26 24 22;

  /* Not the dark values at lower opacity: the blur roughly halves and the offset
     tightens. A shadow on paper comes from a near light source and stays close
     to its object; the same geometry at low alpha reads as a grey smudge. */
  --shadow-hairline: 0 1px 0 rgb(var(--ink) / 0.06) inset;
  --shadow-card: 0 2px 8px rgb(var(--shadow-ink) / 0.08);
  --shadow-float: 0 6px 20px rgb(var(--shadow-ink) / 0.10);
}
```

- [ ] **Step 3: Verify dark is unchanged**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Load `/` in dark mode and compare against the pre-change site. Nothing may have
moved or changed colour — this task only *adds* declarations that are inert while
`data-theme="dark"`.

- [ ] **Step 4: Verify the light block resolves**

Press `Ctrl+Alt+L`. Body text and background must flip (they already read
`var(--ink-solid)` and `rgb(var(--surface))` from `body`). Section backgrounds will
still be black — those are hardcoded inline and land in Task 7. Confirm in devtools
that `getComputedStyle(document.documentElement).getPropertyValue('--ink')` returns
` 26 24 22`.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat(theme): add light palette and shadow tokens"
```

---

### Task 7: Surface background sweep

20 hardcoded `background: 'black'` declarations across 14 files. Purely
mechanical — every one becomes `rgb(var(--surface))`, which resolves to pure black
until Task 9.

**Files (exact lines):**
- Modify: `src/App.tsx:18`
- Modify: `src/components/HomePage.tsx:28`
- Modify: `src/components/AboutSection.tsx:101`
- Modify: `src/components/CTASection.tsx:12`
- Modify: `src/components/PlaygroundSection.tsx:320`
- Modify: `src/components/ProcessSection.tsx:362`
- Modify: `src/components/Footer.tsx:10`
- Modify: `src/components/WorkSection.tsx:392`
- Modify: `src/components/StackSection.tsx:121`
- Modify: `src/components/HeroSection.tsx:376,533`
- Modify: `src/components/about/AboutPage.tsx:45,50,109,152`
- Modify: `src/components/ProjectLoadingScreen.tsx:445`
- Modify: `src/components/case-study/CaseStudyHero.tsx:150,174,190`
- Modify: `src/components/case-study/CaseStudyPage.tsx:108`

**Interfaces:**
- Consumes: `--surface` from Task 6
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Replace every occurrence**

In each file and line above, replace `background: 'black'` with
`background: 'rgb(var(--surface))'`. Two occurrences use different property syntax —
check each line rather than assuming. For example `src/App.tsx:18` becomes:

```tsx
    <div style={{ background: 'rgb(var(--surface))', minHeight: '100vh' }}>
```

- [ ] **Step 2: Confirm none were missed**

```bash
grep -rn "background: 'black'\|backgroundColor: 'black'\|background: \"black\"\|background:'black'" src/
```

Expected: no output.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

In dark mode, load `/`, `/about` and a case study. All three must look exactly as
before. Then press `Ctrl+Alt+L` on each: backgrounds must now go to warm paper.
Text and section fills will look wrong in places — expected, that is Phase 2.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components src/components/about src/components/case-study
git commit -m "refactor(theme): route section backgrounds through --surface"
```

---

### Task 8: Shadow sweep

41 `rgba(0,0,0,…)` occurrences across 19 files. The bulk is mechanical, but a
minority needs judgement, so this gets its own commit.

**Rule:** if a declaration matches a composite token exactly, adopt the token.
Otherwise convert `rgba(0,0,0,X)` to `rgb(var(--shadow-ink) / X)` and keep the
bespoke geometry. **Do not force a non-matching shadow into the nearest token** —
that changes the dark theme, which this stage must not do.

**Files (occurrence counts):**
- `src/components/case-study/ProjectTabs.tsx` (10), `src/components/WorkSection.tsx` (5), `src/index.css` (3), `src/components/case-study/VisualShowcase.tsx` (3), `src/components/case-study/CaseStudyHero.tsx` (3), `src/components/case-study/LightboxContext.tsx` (2), `src/components/ProcessSection.tsx` (2), `src/components/PlaygroundSection.tsx` (2), `src/components/HeroNameStrip.tsx` (2), `src/components/AboutSection.tsx` (2), and one each in `src/components/navbar/Navbar.tsx`, `src/components/doorfeed-demo/RoundMediaView.tsx`, `src/components/doorfeed-demo/MediaCollage.tsx`, `src/components/case-study/ProblemSection.tsx`, `src/components/case-study/NextProject.tsx`, `src/components/about/JourneyTimeline.tsx`, `src/components/about/CurrentlyBlock.tsx`, `src/components/StackSection.tsx`, `src/components/HeroNameReveal.tsx`

**Interfaces:**
- Consumes: `--shadow-ink`, `--shadow-hairline`, `--shadow-card`, `--shadow-float` from Task 6
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Adopt tokens where the geometry already matches**

These sites match `--shadow-float` composed with `--shadow-hairline` exactly.
`src/components/WorkSection.tsx:183` currently reads:

```tsx
          boxShadow: '0 1px 0 rgb(var(--ink) / 0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
```

and becomes:

```tsx
          boxShadow: 'var(--shadow-hairline), var(--shadow-float)',
```

Apply the identical change at `src/components/WorkSection.tsx:196,367` and
`src/components/PlaygroundSection.tsx:66`.

`src/components/WorkSection.tsx:110` has the same two parts in the opposite order:

```tsx
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgb(var(--ink) / 0.08) inset',
```

becomes:

```tsx
      boxShadow: 'var(--shadow-card), var(--shadow-hairline)',
```

- [ ] **Step 2: Convert every remaining site to the shadow channel**

Everything else keeps its geometry and swaps only the colour function. Because
`rgb(0 0 0 / 0.5)` is identical to `rgba(0,0,0,0.5)`, dark mode does not move.
Examples covering each shape you will meet:

`src/components/ProcessSection.tsx:180`:

```tsx
                  boxShadow: '0 1px 0 rgb(var(--ink) / 0.10) inset, 0 20px 50px rgb(var(--shadow-ink) / 0.60)',
```

`src/components/case-study/LightboxContext.tsx:68`:

```tsx
                  boxShadow: '0 32px 80px rgb(var(--shadow-ink) / 0.85)',
```

`src/components/HeroNameStrip.tsx:249`:

```tsx
              boxShadow: '0 3px 12px rgb(var(--shadow-ink) / 0.30)',
```

`src/components/doorfeed-demo/MediaCollage.tsx:39` builds its shadow in a template
literal and stays computed — only the colour function changes:

```tsx
                  boxShadow: `0 ${8 + i * 6}px ${30 + i * 14}px rgb(var(--shadow-ink) / ${0.35 + i * 0.1})`,
```

- [ ] **Step 3: Confirm none were missed**

```bash
grep -rn "rgba(0, *0, *0," src/
```

Expected: no output.

- [ ] **Step 4: Verify dark is pixel-identical**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Load `/`, `/about` and a case study in dark mode. Shadows must be indistinguishable
from before. If any shadow visibly changed, a non-matching site was forced into a
token — revert that site to bespoke geometry.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components
git commit -m "refactor(theme): route shadows through --shadow-ink"
```

---

### Task 9: Soften both palettes

The only task that deliberately changes the existing site. Pure `#000`/`#fff` is
the harshest available pairing and the direct cause of the halation making
300-weight labels hard to read (font audit, F3).

**Files:**
- Modify: `src/index.css` (the `:root` block from Task 6)
- Modify: `index.html` (the `theme-color` default)
- Review only: the three matted assets listed below

**Interfaces:**
- Consumes: the token structure from Task 6
- Produces: nothing

- [ ] **Step 1: Soften the dark palette**

In `src/index.css`, change the two dark channel values:

```css
  --ink: 242 240 236;
  --surface: 10 10 10;
```

Leave `--shadow-ink: 0 0 0` alone — shadows should still be cast in true black.

- [ ] **Step 2: Update the dark `theme-color`**

In `index.html`, change the meta default from `#000000` to `#0a0a0a`. In
`src/theme/ThemeProvider.tsx`, change the dark branch of the `theme-color` update
from `'#000000'` to `'#0a0a0a'`.

- [ ] **Step 3: Check the three matted assets**

These have baked dark backgrounds and blended invisibly into pure black. Against
`#0a0a0a` they may now show a visible rectangle:

| Asset | Dark border | Seen at |
|---|---|---|
| `src/assets/SigTech/Case Study/Approach/research with users:stakeholders.png` | 100% | SigTech case study, Approach section |
| `src/assets/section 2/maybe/PHOTO-2024-10-16-22-50-46.jpg` | 93% | `AboutSection` |
| `src/assets/DoorFeed/demo/old comps.png` | 80% | referenced from `src/constants/media.ts` |

Load each in dark mode and look at the edges. The DoorFeed one is at 80%, so it may
already seam today — compare against the pre-change site before attributing it to
this task. Record what you find; the remedy (re-export, or a CSS mat) is a decision
for review, not for this task.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Screenshot `/`, `/about` and one case study in **both** themes. Six screenshots.
The dark ones should read as slightly warmer and less harsh, with no layout change.

- [ ] **Step 5: Commit**

```bash
git add src/index.css index.html src/theme/ThemeProvider.tsx
git commit -m "feat(theme): soften both palettes off pure black and white"
```

---

## Review checklist

Before opening a PR, confirm:

- [ ] `npm run lint` — zero errors
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run build` — clean, `dist/` non-empty
- [ ] Fresh visitor (cleared `localStorage`) on a light-preference OS still gets dark
- [ ] `Ctrl+Alt+L` flips both ways and survives a reload
- [ ] No dark flash when reloading in light mode
- [ ] All five canvas effects re-initialise on flip (`/` hero, `/demo/loading` ×2, wireframe, particle canvas)
- [ ] Dark mode after Task 8 is indistinguishable from before the branch
- [ ] `.claude/launch.json` and `.claude/run-dev.sh` are not staged

**Known-rough in light mode, and out of scope** — do not file these as bugs:
liquid glass (grey plastic), particle glow (dark halos reading as dirt), gradient
blobs (near-invisible), custom cursor (white ✦ on paper), case-study screenshots
(black rectangles), and every fill whose alpha was tuned for a dark ground.
