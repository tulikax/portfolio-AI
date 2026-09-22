# Light mode — status after Phase 1

Branch: `feature/light-mode-phase-1` · 16 commits off `refactor/home-september` (418f0b2)
Spec: [`docs/superpowers/specs/2026-09-10-light-mode-phase-1-design.md`](docs/superpowers/specs/2026-09-10-light-mode-phase-1-design.md)
Plan: [`docs/superpowers/plans/2026-09-10-light-mode-phase-1.md`](docs/superpowers/plans/2026-09-10-light-mode-phase-1.md)
Original three-phase direction: [`LIGHT_MODE_PLAN.md`](LIGHT_MODE_PLAN.md)

This document records what Phase 1 actually built, the decisions taken while
building it, and what Phases 2 and 3 still need. It exists because the session's
working ledger was destroyed when a scratch directory was deleted mid-flight, and
the reasoning behind several non-obvious choices lived only there.

## What works today

- The theme switches and persists to `localStorage` under `portfolio:theme-mode`.
- No flash on load: an inline script in `index.html` stamps `data-theme` on
  `<html>` before the stylesheet is parsed.
- Every colour token flips — `--ink`, `--surface`, `--shadow-ink`, and three
  composite shadows.
- All six canvas components redraw in the correct ink on a flip, without a reload.
- `ThemeScope` can pin any subtree to a fixed theme, verified working in both
  directions.
- Light mode is **compiled out of production builds** — the toggle sits behind
  `import.meta.env.DEV` and `SYSTEM_FOLLOWS_OS` is `false`, so no visitor can
  reach it.

Reaching it in development: the toggle at bottom-left, or `Ctrl+Alt+L`
(Control-Option-L on a Mac).

**Light mode deliberately looks unfinished.** Glass panels read as grey plastic,
gradient blobs nearly vanish, case-study screenshots are dark rectangles on paper,
and text alphas are still tuned for a dark ground. That is Phases 2 and 3 below,
not damage.

## What changed for existing (dark) visitors

One deliberate change: both poles moved off the extremes.

```
--ink:     255 255 255  →  242 240 236
--surface:       0 0 0  →     10 10 10
```

Pure `#000`/`#fff` is the harshest available pairing and is the direct cause of
the halation behind finding F3 in [`FONT_AUDIT.md`](FONT_AUDIT.md). `--shadow-ink`
stays `0 0 0` — shadows are still cast in true black even though the page is not.

Every other commit on the branch is pixel-neutral in dark by construction, so any
dark-mode regression is attributable to this one change.

### Asset check

Three assets have baked dark backgrounds and were checked by eye after the change.
Softening dark created **no new seams**: the SigTech "research with users" image
already seamed against pure black and still does (more softly), the DoorFeed
"old comps" image likewise, and the AboutSection photo actually blends slightly
better than before.

## Architecture

| File | Responsibility |
|---|---|
| `src/constants/theme.ts` | Reads CSS tokens for canvas code. Element-scoped, cached per root in a `WeakMap`. |
| `src/theme/ThemeContext.ts` | Types, `STORAGE_KEY`, `SYSTEM_FOLLOWS_OS`, and the two contexts. |
| `src/theme/ThemeProvider.tsx` | Owns theme state, stamps `data-theme`, persists, owns the shortcut. |
| `src/theme/useTheme.ts` | Consumer hook for non-canvas code. |
| `src/theme/useThemedCanvas.ts` | Ink accessors bundled with theme identity, for canvas effects. |
| `src/theme/ThemeScope.tsx` | Pins a subtree to one theme. Built, currently unused. |
| `src/theme/ThemeToggle.tsx` | Dev-only control. Compiled out of production. |
| `src/index.css` | The palettes. `:root, [data-theme='dark']` and `:root[data-theme='light'], [data-theme='light']`. |

Three design points that are not obvious from reading the code:

**`ThemeProvider` syncs the DOM in a `useLayoutEffect`, not a `useEffect`.** React
runs every layout effect before any passive effect, so a consumer reading tokens in
an ordinary `useEffect` is guaranteed to see the stamped attribute and the cleared
cache. A passive effect here would run child-first — after the consumers depending
on it — and hand them stale tokens.

**`useThemedCanvas` returns the accessors and the theme identity as one object.**
Reading the ink and subscribing to its changes are therefore the same act. A canvas
component cannot read the colour without also acquiring the value that invalidates
it, which is what stops the next canvas component added to this codebase from
silently drawing white particles on paper.

**`ThemeScope` stores its element in `useState` via a callback ref, not `useRef`.**
The context value has to *change* when the element mounts so descendants re-render
and re-resolve their tokens against it. A ref mutation would not re-render.

## Decisions taken during implementation

Recorded because several are non-obvious and at least three were corrections to
the plan itself.

| Decision | Why | Cost if wrong |
|---|---|---|
| Branched from `refactor/home-september`, not `base` | `CLAUDE.md` mandates branching off `base`, but no such branch exists locally or on origin. The repo actually runs `main` plus feature branches. | A rebase. |
| Lint gate is "no new errors", not "zero errors" | `npm run lint` already failed at the branch point on `LightboxContext.tsx:11`. The pre-commit hook runs `lint-staged`, which only lints staged files, so it never blocked a commit. | A clean lint needs that file fixed separately. |
| Replaced the planned `themeVersion` counter with `useLayoutEffect` | The counter incremented state inside an effect, tripping `react-hooks/set-state-in-effect`. Deleting it naively would have broken ordering (effects run child-first). The layout-effect guarantee gives the same ordering with no counter and no suppression. | Canvas components read stale tokens on flip — visible immediately. |
| `event.code === 'KeyL'`, not `event.key` | On macOS, Option changes the emitted character: Option+L produces `¬`, so a key-based check can never match. The shortcut worked on Windows and failed silently on a Mac. | — |
| Added a dev-only toggle | A visible control is a better review affordance than a hidden keystroke. `import.meta.env.DEV` answers the "don't expose visitors" objection better than obscurity does — the component is absent from production bundles, not merely hidden. | If the guard failed, visitors reach an unfinished theme. Verified by grepping `dist/`. |
| Gradient fades converted, media scrims left dark | A hardcoded black inside a gradient is either a page-ground fade (its black *is* the page) or a media treatment (darkening video so overlaid text stays readable). Only the former should follow the theme. The split is structural, not aesthetic: the converted fade sits in `CaseStudyHero`'s mobile branch terminating against a painted sibling panel; the scrims sit in the desktop branch over full-bleed video. | Three gradients stay dark in light mode. Easily reverted. |
| Shadow sweep covers `box-shadow` values only | Seven `rgba(0,0,0,…)` occurrences are background overlays — a modal backdrop, a media overlay, two control pills, three video scrims. Routing a modal backdrop through `--shadow-ink` would make it theme-dependent, which is a Phase 3 design decision about overlay treatment, not a mechanical sweep. | Overlays stay pure black in light mode. |
| Theme selectors generalised beyond `:root` | `:root[data-theme='light']` matches only `<html>`; it never matches a descendant. `ThemeScope` puts `data-theme` on a `<div>`, so the component was inert — the React half worked, the CSS half never fired. The dark values had the same problem, which matters more, because the case-study lock pins dark *inside* a light page. | A scoped subtree resolves the wrong palette. |
| Three files excluded from the sweeps | `HeroNameStrip.tsx`, `AboutSection.tsx` and `about/CurrentlyBlock.tsx` had substantial uncommitted work at the time. | Since cleared — see below. |

## Cleared after the first light-mode review

The three excluded files were swept once their uncommitted work was stashed. Six
sites: four shadows (`HeroNameStrip` ×2, `AboutSection`, `CurrentlyBlock`), the
page-ground fade at `AboutSection` that had been painting a dark band across the
bottom of the About section, and the card overlay.

The card overlay is worth recording, because the obvious fix was wrong. It reads
`linear-gradient(145deg, rgba(0,0,0,0.08), rgba(0,0,0,0.22))` and its own comment
says *"Subtle overlay to blend with dark bg"* — it blends a floating image card
into the page ground. So the right token is **`--surface`, not `--shadow-ink`**:

```js
linear-gradient(145deg, rgb(var(--surface) / 0.08), rgb(var(--surface) / 0.22))
```

The same alphas work in both themes, because "blend toward the page ground" is
exactly what `--surface` means — it darkens on dark and lightens toward paper on
light. Routing it through `--shadow-ink` would have put a grey slab on paper, and
it needs no Phase 2 fill token after all.

### A category every sweep missed: hardcoded white

Every sweep in Phase 1 searched for **black**. None searched for white, and there
are 24 hardcoded white values. Most are harmless; three were not:

| Site | Problem |
|---|---|
| `navbar/Navbar.tsx` ×2 | Nav links hover to a hardcoded `'white'` while their resting colour is themed. Invisible on paper, on every route. Now `var(--ink-solid)`. |
| `HeroNameStrip.tsx` | `border: '1px solid rgba(255,255,255,0.16)'` on the portrait — invisible on paper. Now `rgb(var(--ink) / 0.16)`. |

Correctly left alone:

- `ParticleTitle.tsx` and `ProjectLoadingScreen.tsx` set `offCtx.fillStyle = 'white'`
  on an **offscreen alpha-sampling mask**. Both carry a comment saying the colour is
  never displayed. Like the `-webkit-mask` white, it is a channel, not a colour.
- `ProjectLoadingScreenDemo.tsx` (12 sites) — dev-only route behind `import.meta.env.DEV`.
- `src/data/caseStudies.ts` (6 sites) — per-case-study content config, paired with six
  `#000000` values. Correct under a case-study dark lock; needs revisiting only if
  case studies follow the theme.
- `about/CurrentlyBlock.tsx` — a white play glyph on a dark scrim over album art.
  A media overlay, same category as the video scrims below.

**The lesson for Phase 2 and 3: search for both poles.** A sweep that greps only
for the current theme's background colour will silently miss every foreground
hardcoded against it.

**One pre-existing lint error**, unrelated to this work:
`src/components/case-study/LightboxContext.tsx:11` exports a non-component
alongside a component, breaking fast refresh. Move the non-component export to its
own file.

---

# Phase 2 — semantic alpha tokens

**The problem.** The same alpha does not read the same on both grounds.
`rgb(255 255 255 / 0.08)` on black is a barely-there raised tint;
`rgb(26 24 22 / 0.08)` on paper is a distinctly visible grey box. Light mode needs
a compressed ramp for fills and an expanded one for text. Until this lands, light
mode is permanently *slightly wrong* rather than designed.

**The scale.** 341 `rgb(var(--ink) / X)` call sites, which cluster into four roles:

| Role | Alpha range | Count | Proposed token |
|---|---|---|---|
| Surface fills | ≤ 0.12 | 120 | `--fill-subtle`, `--fill-raised` |
| Borders and hairlines | 0.13–0.20 | 47 | `--border-hairline` |
| Secondary text | 0.21–0.45 | 80 | `--text-2`, `--text-3` |
| Primary-ish text | > 0.45 | 94 | `--text-1` |

Plus `--weight-body`: light text on dark blooms and reads optically bolder, so body
copy should sit at 400 on paper where dark uses 300. There are **101
`fontWeight: 300` occurrences across 36 files** — a token is the only sane route.

**This debt compounds.** Every component written before Phase 2 lands adds new raw
alpha call sites to the eventual migration, so the cost grows with the delay.

---

# Phase 3 — the things that genuinely break

None of these is solved by token flips. Roughly in order of visual impact.

### Liquid glass

`.liquid-glass`, `.liquid-glass-strong`, `.nav-glass-pill` and `.btn-glass` — 11
rule blocks in `index.css`. Glass builds depth from a white tint plus an edge ring
that fades top-to-bottom. On paper the whole metaphor inverts: glass over a light
ground needs a *darker* tint and a much subtler ring, or it reads as grey plastic.

Budget real time here. The navbar pill is the most-seen component on the site, and
it is the single most obviously wrong thing in light mode today.

### Case-study media — the decision this phase existed to inform

Every product shot is dark fintech UI. On paper they become black rectangles
punched out of the page. Two options:

1. **Pin case studies to dark.** `ThemeScope` exists for this and is verified
   working — wrap the `/work/:slug` route and it is genuinely a one-line change.
   Treats the shift into a case study as an intentional gear-change into "the work".
2. **Give media a warm-grey mat** with a soft inset shadow, and let case studies
   follow the theme.

Option 1 is less work, protects the screenshots, and is a legitimate editorial
choice. It also keeps the six hardcoded `#000000` `textColor` values in
`src/data/caseStudies.ts` correct without touching them — under option 2 those
need revisiting too.

### Particle glow

Four `createRadialGradient` glow passes — `ParticleTitle.tsx`, `HeroWireframe.tsx`,
and two in `ParticleCanvas.tsx`. The particles themselves already flip correctly
via `useThemedCanvas`, but the glow halos do not: as dark halos on paper they read
as dirt, not light. Each needs its glow disabled or inverted in light mode, and the
radius and opacity re-tuned — dark-on-light wants fewer, smaller, higher-contrast
dots than light-on-dark.

### Gradient blobs

`GradientBlobs.tsx` — six pastel radial gradients. They glow on black and vanish on
paper. Needs deeper, more saturated stops and higher alpha for the light theme.

### Background overlays

The seven deliberately skipped in Phase 1: a modal backdrop at 0.90
(`LightboxContext.tsx`), a media overlay (`PlaygroundSection.tsx`), two control
pills over media (`ProjectTabs.tsx`), and three video scrims (`CaseStudyHero.tsx`).
Each needs a decision about whether a scrim on a light page should stay dark, and
the answer likely differs between the modal backdrop and the video scrims.

### Going public

- Flip `SYSTEM_FOLLOWS_OS` to `true` in `src/theme/ThemeContext.ts` **and** in the
  inline script in `index.html`. They are two copies of the same constant by
  necessity — the script runs before any module loads — and both carry
  `KEEP IN SYNC` comments. If they drift, system-preference users get a flash on
  every load.
- Replace `ThemeToggle` with a real control in the navbar, and drop the
  `import.meta.env.DEV` guard. The current toggle also sets `cursor: pointer`
  inline, which overrides the site's global `cursor: none` — fine for a dev tool,
  wrong for a shipped control.
- The favicon still assumes a dark page.

### Already handled — do not redo

The original plan listed the custom cursor as a Phase 3 item, expecting the white
`✦` to vanish on paper. It does not: `CustomCursor.tsx` already renders with
`color: 'var(--ink-solid)'`, so it flips with the theme. Nothing to do.

---

## Suggested order

Liquid glass and the case-study decision first — those two shape everything else,
and the case-study answer determines whether the `caseStudies.ts` text colours and
the media scrims are work at all. Then Phase 2's tokens, which is when light mode
starts looking designed rather than inverted. Particle glow, blobs and the overlays
after that, since they are independent of each other.
