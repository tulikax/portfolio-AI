# Typography Audit — tulika.design portfolio

Branch: `audit/font-typography` · Audited 2026-08-16

## 1. Current state

Three families load from Google Fonts via a render-blocking `@import` at the top of [src/index.css](src/index.css):

| Family | Styles loaded | Uses in `src/` | Where |
|---|---|---|---|
| **Barlow** | 300, 400, 500, 600 | 131 | Body, labels, buttons, metadata — everything |
| **Source Serif 4** | Variable 300–900, roman + italic, full optical axis | 16 | Section headings (italic on home, roman on case studies) |
| **Instrument Serif** | Italic 400 only | 8 | Hero particle title (canvas), Playground moments |

Weight usage across inline styles: 300 ×77, 400 ×25, 500 ×31, 600 ×3.

## 2. Findings

### F1 — Two serifs competing for the same job (highest impact)
Instrument Serif (hero, Playground) and Source Serif 4 (every other heading) are both
"the italic serif voice" of the site, but they are different faces: Instrument is a
high-contrast, quirky display face with real personality; Source Serif 4 is a bookish
text serif doing display work it wasn't drawn for. The hero promises one voice and the
rest of the site delivers a blander one. A visitor won't name the problem, but the site
reads slightly less considered than it is — which matters on a designer's portfolio.

### F2 — Barlow is a filler choice for this content
Barlow is a DIN-flavoured, slightly condensed grotesque drawn for signage. It's
inoffensive, which is the problem: the site's voice ("Designer, tinkerer, always with a
side project", playful cursor microcopy, liquid glass, particle physics) is crafted and
personal, and the case studies (AI-native fintech at DoorFeed and SigTech) are precise
and technical. Barlow says neither. It's carrying 131 call sites without adding character.

### F3 — Light weight at micro sizes on black
Dozens of labels render at `fontWeight: 300` at 0.6–0.75rem, letter-spaced uppercase,
on pure black at 35–45% white opacity. Light weights lose stroke on dark backgrounds
(halation); at these sizes the labels sit near the edge of legibility on non-retina
screens. Minimum for sub-0.8rem text should be 400.

### F4 — Fonts are hardcoded in 26 files
[src/index.css](src/index.css:10) defines `--font-heading` / `--font-body` tokens, but
almost nothing uses them — 155 inline `fontFamily:` declarations repeat the literal
family strings. Changing a font today means touching 26 files. (The canvas title in
[ParticleTitle.tsx](src/components/ParticleTitle.tsx:73) is the one legitimate literal:
canvas `ctx.font` can't read CSS variables.)

### F5 — Loading is heavier and slower than it needs to be
- `@import` in CSS is the slowest way to load web fonts: the browser must download and
  parse `index.css` before it even discovers the font request. No `preconnect` to
  `fonts.gstatic.com` exists in [index.html](index.html).
- Source Serif 4 loads the **full variable range** (300–900, roman + italic, full
  optical axis) while the site uses roughly two weights and mostly italic.
- Barlow 600 loads for 3 uses.

## 3. Recommendation

### Option A — Unify on the Instrument family (recommended)

The hero already made the site's best typographic decision. Extend it.

- **Display: Instrument Serif** (roman + italic) replaces Source Serif 4 everywhere.
  One serif voice from hero to case study. It has real character at display sizes —
  the ball terminals and high contrast match the site's playful-but-precise tone.
  Single weight (400) is not a limitation for a display-only role.
- **Body: Instrument Sans** (variable) replaces Barlow. Drawn by the same designer to
  pair with Instrument Serif — the pairing is designed, not assembled. It's a grotesque
  with warmth and slightly generous proportions; noticeably more "designed" than Barlow
  at UI sizes. Map Barlow 300→Instrument Sans 400, 400→450–500, 500→550–600 (variable
  axis makes this tunable).
- **Micro-labels: Geist Mono** (or Spline Sans Mono) for the uppercase eyebrows,
  metadata rows, and stat labels. The AI/fintech case-study content earns a mono
  accent; it also fixes F3 — monos hold up at tiny sizes where light grotesques fail.

Net: 3 families, but each with one clear job — serif = voice, sans = reading,
mono = data. Payload goes down (Instrument Serif ~2 styles, Instrument Sans one
variable file, one mono weight vs. today's 4 Barlow cuts + full Source Serif 4 range).

### Option B — More editorial character

If the appetite is for a bigger swing: **Fraunces** (variable, with its `SOFT`/`WONK`
axes) as the display serif — wonky and warm at hero sizes, disciplined at small optical
sizes — paired with **Schibsted Grotesk** or **Hanken Grotesk** for body. More
distinctive than Option A, but it replaces the hero's existing identity rather than
extending it, and the canvas particle title would need re-tuning.

### Option C — Keep families, fix execution only

Zero-risk path: drop one of the two serifs (keep Instrument Serif), raise every
sub-0.8rem label from 300 to 400, and do the §4 fixes. The site gets cheaper and more
coherent without changing its look.

## 4. Fixes to make regardless of option

1. **Load fonts from `index.html`**, not CSS `@import`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap">
   ```
2. **Subset what's requested** — only the weights/styles actually used.
3. **Route all `fontFamily` through the existing tokens** (`--font-heading`,
   `--font-body`, plus a new `--font-mono`) so the next font change is a one-line edit.
   Keep the literal string only in `ParticleTitle.tsx`, with a comment linking it to
   the token.
4. **Minimum weight 400 below 0.8rem** (F3).
5. Keep the `document.fonts.load(...)` guard in `ParticleTitle.tsx` in sync with
   whatever display face ships — a canvas draw before the font resolves rasterises the
   fallback serif permanently into the particle field.
