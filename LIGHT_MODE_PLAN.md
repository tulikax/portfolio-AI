# Light mode — implementation plan

Branch: `audit/font-typography` · Follows the token refactor in `54975c3`

## Where we are

The tokenisation commit means a light theme no longer needs a 26-file edit. Text,
surfaces, borders and glass fills all resolve through `--ink` (an RGB channel used
as `rgb(var(--ink) / <alpha>)`) and `--surface`. Canvas code reads the same tokens
at runtime via `src/constants/theme.ts`.

Flipping those two values gets roughly 80% of the way. This plan covers the
remaining 20%, which is where the design work actually is.

## The design direction

Not "dark mode inverted". Bodoni Moda is a didone — the same lineage as fashion
and editorial print — and it renders far better dark-on-light, where its hairlines
stay crisp instead of blooming. The light theme should read as **heavy printed
paper**: warm off-white stock, warm near-black ink, generous margins, and the
serif carrying the personality.

```
--surface: 250 249 246   /* warm paper, not #fff */
--ink:      26  24  22   /* warm near-black, not #000 */
```

Both poles pulled off the extremes. This is also the fix to backport to the dark
theme, which currently runs pure `#000`/`#fff` — the harshest possible pairing and
the direct cause of the light-weight legibility problem in the font audit (F3).

## Phase 1 — Make the flip possible (mechanical)

1. **Move the palette into a `[data-theme]` block.** Define both themes in
   `:root` / `:root[data-theme="light"]`, defaulting to `prefers-color-scheme`
   when no attribute is set.
2. **Section backgrounds** — 8 hardcoded `background: 'black'` declarations
   (`App.tsx`, `HomePage.tsx`, `WorkSection`, `ProcessSection`, `StackSection`,
   `Footer`, `AboutSection` ×2) become `rgb(var(--surface))`.
3. **Shadow token.** 18 files carry `rgba(0,0,0,0.4–0.9)` shadows. On paper these
   must get tighter and softer, not lighter-black. Add `--shadow-color` and
   `--shadow-strength`.
4. **Theme toggle.** Sets `data-theme` on `<html>`, persists to `localStorage`,
   defaults to system. Must also call `refreshTheme()` (already exported from
   `constants/theme.ts`) and force the canvas components to re-init, since they
   cache `inkChannel()` at effect start.

Leave `-webkit-mask: linear-gradient(#fff 0 0)` in `index.css` alone — that white
is a mask channel, not a colour.

## Phase 2 — Semantic alpha tokens (the real fix)

A straight `--ink` flip is imperfect because **the same alpha does not read the
same on both grounds**. `rgb(255 255 255 / 0.08)` on black is a barely-there
raised tint; `rgb(26 24 22 / 0.08)` on paper is a distinctly visible grey box.
Light mode needs a compressed ramp for fills and an expanded one for text.

The existing alphas already cluster into three roles — this is what to name:

| Role | Current alphas (count) | Purpose |
|---|---|---|
| Surface fills | 0.02–0.12 (~90 uses) | Card fills, hover states, glass |
| Borders | 0.09–0.20 (~40 uses) | Hairlines, dividers, rings |
| Secondary text | 0.20–0.45 (~70 uses) | Labels, metadata, eyebrows |
| Primary-ish text | 0.55–0.92 (~50 uses) | Body copy, active states |

Replace with `--fill-subtle`, `--fill-raised`, `--border-hairline`, `--text-2`,
`--text-3`, each defined per theme. This is the change that makes light mode look
*designed* rather than *inverted*, and it also lets the dark theme raise its
sub-0.8rem labels off 300-weight/35%-opacity (audit F3) without touching call sites.

## Phase 3 — The things that genuinely break

These are the interesting problems; none are solved by token flips.

**Case study screenshots.** Every product shot is dark fintech UI. On a white page
they become black rectangles punched out of paper — the single biggest visual risk
in this whole project. Options: give media a warm-grey mat/frame with a soft inset
shadow, or keep case study pages dark regardless of theme and treat the shift as an
intentional gear-change into "the work". **Recommend the latter** — it's less work,
it protects the screenshots, and a dark case-study reading mode is a legitimate
editorial choice.

**Particle fields** (`ParticleTitle`, `ParticleCanvas`, `HeroWireframe`,
`ProjectLoadingScreen`). `inkChannel()` flips them to dark particles automatically,
but the *glow* passes are additive white halos — as dark halos on paper they read as
dirt, not light. Each needs its glow disabled or inverted in light mode, and the
particle radius/opacity re-tuned: dark-on-light needs fewer, smaller, higher-contrast
dots than light-on-dark.

**Liquid glass.** `.liquid-glass` builds depth from white tint plus an edge ring
that fades top-to-bottom. On paper the whole metaphor flips: glass over a light
ground needs a *darker* tint and a much subtler ring, or it looks like grey plastic.
Budget real time here — the navbar pill is the most-seen component on the site.

**GradientBlobs.** Six pastel radial blobs at 0.25–0.38 alpha. They glow on black
and vanish on paper. Needs deeper, more saturated stops and higher alpha for light.

**Custom cursor.** The white ✦ becomes invisible on paper.

**Type weights.** Light text on dark blooms and reads optically bolder. Body should
sit at 400 on paper where dark mode uses 300 — worth a `--weight-body` token rather
than editing 77 call sites.

Also: `<meta name="theme-color">` and the favicon both assume a dark page.

## Suggested order

Phase 1 and the toggle first — that makes the theme switchable and reveals how much
Phase 2 actually matters in context. Then Phase 2 tokens. Then Phase 3, starting
with liquid glass and the case-study-media decision, since those two shape
everything else.

Worth doing on a branch off this one, with the toggle shipped behind a temporary
keyboard shortcut so the light theme can be reviewed in place before it goes public.
