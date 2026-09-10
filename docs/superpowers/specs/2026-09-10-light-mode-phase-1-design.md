# Light mode, Phase 1 — design

Date: 2026-09-10 · Branch: off `refactor/home-september`
Builds on [`LIGHT_MODE_PLAN.md`](../../../LIGHT_MODE_PLAN.md) and the token refactor in `54975c3`.

## Goal

Make the site's theme switchable, with a light palette that is *reviewable* but not
yet public. Phase 1 delivers the mechanism and the palette; the visual work that
makes light mode look designed rather than inverted (Phases 2 and 3 of the plan)
is deliberately out of scope.

Success looks like: `Ctrl+Alt+L` flips the site between two themes, the choice
survives a reload, no visitor can reach light mode by accident, and the dark theme
looks the same as it does today apart from an intentional softening of both poles.

## Decisions taken

| Decision | Choice | Why |
|---|---|---|
| Scope | Phase 1 only | Reveals how much Phase 2 matters before committing to ~250 call sites |
| Case study pages | Convert them with everything else | Makes the "do screenshots survive on paper?" question answerable from evidence; `ThemeScope` makes locking them back to dark a one-line change |
| Theme selection | Dark default, `Ctrl+Alt+L` to flip | No visitor lands on an unfinished theme, and the deployed site stays reviewable |
| Dark palette | Softened in the same change | One coherent family across both themes; fixes the halation behind audit F3 |

The dark-palette decision was taken against a recommendation to defer it, on the
grounds that both themes should feel like one family. The mitigation is the
two-commit split below, which keeps the review baseline separable.

## Asset audit (input to the dark palette)

Softening `--surface` off pure `#000` exposes any asset with a baked black
background as a visible rectangle. Audit of all 102 raster assets under
`src/assets` and `public`:

- **46** have transparent borders — safe by construction.
- **50** have no dark edge.
- **6** have a dark mat, of which **3 are referenced in code**:

| Asset | Dark border | Referenced from |
|---|---|---|
| `SigTech/Case Study/Approach/research with users:stakeholders.png` | 100% | `src/data/caseStudies.ts` |
| `section 2/maybe/PHOTO-2024-10-16-22-50-46.jpg` | 93% | `src/components/AboutSection.tsx` |
| `DoorFeed/demo/old comps.png` | 80% | `src/constants/media.ts` |

Three assets to check by eye, not a re-export marathon. The DoorFeed one is at 80%,
meaning it already seams on some edges against pure black. Remedy is decided at
review: re-export, or give media a CSS mat (which Phase 3 wants regardless).

## Architecture

### `src/theme/` — new module

**`ThemeProvider.tsx`** owns theme state and is mounted in `main.tsx` outside
`BrowserRouter`.

- State is `mode: 'system' | 'light' | 'dark'`, not a boolean. Only two values are
  reachable during review, but `'system'` is a genuinely distinct third state that
  Phase 3 needs as its default; storing a boolean now would mean touching every
  consumer later.
- `SYSTEM_FOLLOWS_OS = false` makes `'system'` resolve to dark. Flipping this
  constant is the whole of "go public" — it is self-documenting and greppable.
- On resolve: stamps `data-theme` on `document.documentElement`, writes `mode` to
  `localStorage` under `portfolio:theme-mode`, calls `refreshTheme()`, increments
  `themeVersion`.
- Reads `prefers-color-scheme` via `matchMedia` and keeps it in state, so the
  system option works the moment the constant flips.

**`useThemedCanvas.ts`** returns `{ ink, inkChannel, themeRoot, themeVersion }`.

This is the load-bearing piece. Canvas components cache `inkChannel()` at effect
start (`ParticleTitle.tsx:67`), so they need re-initialising when the theme flips.
Relying on each component to remember to add `themeVersion` to its deps is a
convention, and conventions rot: a canvas component added next year that forgets
the dep renders white particles on paper, silently, with no type or lint error.

Bundling the ink accessor and the version into one hook makes reading the colour
and subscribing to its changes the same act. The four existing canvas components
(`ParticleTitle`, `ParticleCanvas`, `HeroWireframe`, `ProjectLoadingScreen`)
migrate to it.

**`useTheme.ts`** exposes `{ mode, resolved, setMode, toggle }` for everything
that is not canvas.

**`ThemeScope.tsx`** pins a subtree to a fixed theme by rendering a wrapper with
its own `data-theme` and providing that element as the theme root via context.
Built in Phase 1 and left unused, so that locking case studies to dark later is a
one-line application rather than a refactor.

### `src/constants/theme.ts` — changes

Two related defects, both latent today and both cheap to fix now:

1. `readToken` calls `getComputedStyle(document.documentElement)`, hardcoding the
   root. The moment `ThemeScope` pins a subtree, canvas components inside that
   subtree read the *root's* ink rather than the scope's — drawing dark particles
   on a dark ground. Fix: `readToken(name, fallback, root = document.documentElement)`,
   threaded through `inkChannel(root?)` and `ink(alpha, root?)`.
2. The cache is a module-scope `Map`, so a token read before `data-theme` is
   stamped is cached wrong until someone calls `refreshTheme()` — a
   timing-dependent bug, intermittent and unpleasant to trace. Fix: a `WeakMap`
   keyed by root element, holding a per-root `Map` of tokens. The pre-paint script
   below closes most of the window; this closes the rest.

Both changes are backwards compatible — existing call sites keep working unchanged.

### `src/index.css` — palette

```css
:root {
  --ink: 242 240 236;      /* warm off-white, was 255 255 255 */
  --surface: 10 10 10;     /* warm off-black, was 0 0 0 */
}

:root[data-theme='light'] {
  --ink: 26 24 22;         /* warm near-black */
  --surface: 250 249 246;  /* warm paper */
}
```

Both poles pulled off the extremes. Pure `#000`/`#fff` is the harshest available
pairing and the direct cause of the halation making 300-weight labels hard to read
(font audit, F3).

**Shadow tokens.** 19 files carry `rgba(0,0,0,0.4–0.9)`. On paper these need to be
tighter and softer, not lighter-black — so a colour token alone is insufficient;
the blur and spread have to change too. Because the call sites are inline styles,
which can only consume a finished value, the tokens are composite:

```css
:root {
  --shadow-hairline: 0 1px 0 rgb(0 0 0 / 0.5);
  --shadow-card:     0 4px 16px rgb(0 0 0 / 0.6);
  --shadow-float:    0 12px 40px rgb(0 0 0 / 0.7);
}

:root[data-theme='light'] {
  --shadow-hairline: 0 1px 0 rgb(26 24 22 / 0.06);
  --shadow-card:     0 2px 8px rgb(26 24 22 / 0.08);
  --shadow-float:    0 6px 20px rgb(26 24 22 / 0.10);
}
```

Note the light values are not the dark ones at lower opacity: the blur radius
roughly halves and the offset tightens. A shadow on paper comes from a near light
source and stays close to its object; the same geometry at lower alpha reads as a
grey smudge. Call sites become `boxShadow: 'var(--shadow-card)'`.

Mapping the existing 19 files' shadows onto three tokens is a judgement call per
call site, not a mechanical substitution — some will not fit and should keep a
bespoke value rather than be forced into the nearest token.

Leave `-webkit-mask: linear-gradient(#fff 0 0)` alone — that white is a mask
channel, not a colour.

### `index.html`

- Inline script before the stylesheet reads `localStorage` and stamps `data-theme`
  pre-paint. Without it a light-mode reload flashes dark and looks broken.
- Add the missing `<meta name="theme-color">`, updated by the provider on flip.

### Sweeps

- ~20 hardcoded `background: 'black'` → `rgb(var(--surface))`, across `App`,
  `HomePage`, `WorkSection`, `ProcessSection`, `StackSection`, `PlaygroundSection`,
  `CTASection`, `Footer`, `HeroSection`, `AboutSection`, `AboutPage`,
  `ProjectLoadingScreen`, `CaseStudyPage`, `CaseStudyHero`.
- 19 files' `rgba(0,0,0,…)` shadows → shadow tokens.

## Out of scope

Named explicitly so the review does not read these as bugs:

- Semantic alpha tokens (`--fill-subtle`, `--border-hairline`, `--text-2`,
  `--weight-body`). Phase 2. Until they land, the same alpha reads differently on
  the two grounds — fills will look heavier on paper than they do on black.
- Liquid glass, particle glow inversion, gradient blobs, custom cursor, case-study
  media treatment. Phase 3. These will look wrong in light mode; that is expected.
- A visible theme toggle. Phase 3, once the theme is worth showing.
- Vitest. Agreed as a separate piece of work.

**Phase 2 debt compounds.** Every component written between Phase 1 and Phase 2
adds new raw-alpha call sites to the eventual migration, so the cost of Phase 2
grows with the delay. This argues for a short gap, not an open-ended one.

## Commit sequence

1. **Plumbing.** Theme module, `theme.ts` changes, `[data-theme]` blocks, shadow
   tokens, sweeps, pre-paint script, shortcut — with the dark palette still
   resolving to pure `#000`/`#fff`. Renders pixel-identical to today; any
   regression here is unambiguously from the plumbing.
2. **Palette.** Soften dark to `10 10 10` / `242 240 236`, add the light values,
   check the three matted assets.

## Verification

No test runner exists in `package.json`, so verification is mechanical plus visual:

- `npm run lint` — zero errors
- `npx tsc --noEmit` — zero errors
- `npm run build` — clean
- Commit 1 only: confirm rendering is unchanged against pre-change screenshots
- Both themes screenshotted across `/`, `/about`, `/work/:slug`
- Flip the theme with all four canvas components on screen; confirm each re-inits
- Reload in light mode; confirm no dark flash
- Confirm a fresh visitor (cleared `localStorage`) with an OS light preference
  still gets dark
