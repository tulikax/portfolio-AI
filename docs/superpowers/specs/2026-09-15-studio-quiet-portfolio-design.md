# Studio — a quiet parallel portfolio

Date: 2026-09-15
Status: awaiting review
Reference: [fetch.design](https://fetch.design)

## Why

The portfolio at `/` is maximal — black ground, grain, particle canvas, custom
cursor, seven stacked sections. It suits people who want to be shown something.
It does not suit people who want the short version: a paragraph about who
Tulika is, the work itself, and a way through to detail if they want it.

`/studio` is that second entry point. It is not a replacement and not a
throwaway. Both sites stay, permanently, and each owns its own chrome.

## Reference, in one paragraph

fetch.design is a single page on `#F5F5F2` in one neutral sans. A narrow
centred column holds the whole bio in four short paragraphs with inline
underlined links and one pill CTA. Below it, roughly 6,000px of scroll: uniform
media slabs about 1050px wide at 16:10 with an 8px radius, images and silent
video, grouped by project with no headings. Everything below the fold is
invisible until scrolled into view. There are no internal links anywhere on the
site.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Permanence | Parallel permanent page | Production quality, real data, lives alongside `/` indefinitely |
| Detail pages | One per study, shared template | Mirrors the existing `/work/:slug` shape; three studies |
| Visual language | Light and quiet, wholesale | Full adoption of the reference palette. No grain, no particles, no custom cursor |
| Typography | Barlow only | No new font loads. No display face at all — the reference's own wordmark is set in its body face |
| Detail structure | Five beats, middle-weighted | Exploration and Decisions Made carry the page |
| Shell | Layout routes in `App.tsx` | The only edit to existing code; each site owns its chrome |
| Motion | framer-motion only | Already a dependency; reveal-on-enter is the reference's entire vocabulary. Keeps `gsap` and `three` out of this bundle |
| Un-migrated media | Reserved slots with captions | No layout shift when the real media lands |

### Rejected

- **Reskinning the existing case study components.** They are coupled to the
  dark design throughout, and the five-beat structure does not map onto their
  chapter model.
- **GSAP ScrollTrigger.** Nothing here is scrubbed to scroll position. If one
  signature scrubbed moment is wanted later, GSAP gets added for that alone.
- **Shipping the un-migrated media from `src/assets`.** Two of those files are
  25MB and 46MB, and `.mov` autoplay is unreliable in Chrome regardless of size.
- **Reading narrative from `caseStudies.ts`.** The five beats do not map onto
  its fields; forcing them through would mean adding studio-only fields to a
  type the dark site also depends on.

## Routes

```
/studio              the intro page
/studio/:slug        doorfeed | sigtech | deloitte-nlg
```

An unknown slug redirects to `/studio`.

## Shell split

`App.tsx` gains two layout routes. The dark chrome — `background: black`, the
`grain-overlay` div, `CustomCursor`, `Navbar` — moves out of the top-level
wrapper and into `DarkShell`, which wraps `/`, `/about`, `/work/:slug` and the
existing dev-only demo routes. Their rendered output is unchanged.

`StudioShell` wraps the two new routes: `#F5F5F2` ground, native cursor, no
grain, no navbar, scroll-to-top on route change.

This is the only modification to existing source. No component outside
`src/components/studio/` is touched.

## File layout

```
src/components/studio/
  StudioShell.tsx    layout route — ground, cursor, scroll reset
  StudioHome.tsx     the intro page
  StudioCase.tsx     the detail template, one component for all three
  Carousel.tsx       the intro page's horizontal bento track
  Slab.tsx           a full-width media unit, used by the detail pages
  MediaFrame.tsx     renders image / video / reserved slot into any box
  Reveal.tsx         motion primitive
  RichText.tsx       inline `[label](href)` links in copy
  content.ts         all copy and media IDs
  studio.css         scoped tokens, track and arrow styles
```

`content.ts` sits beside its pages, matching the convention already used by
`src/components/about/content.ts` and the doorfeed demo.

## The intro page

Four bands.

**Masthead.** Tulika's name at the top of the narrow column, set in Barlow at
~28px medium. One pill button top-right: `Get in touch`, linking to
`hello@tulika.design`. The reference places a hand-drawn mark above its
wordmark; that slot is left empty rather than inventing one.

The email address is split across template expressions in `CTASection.tsx`
(`` `mailto:${'hello'}@${'tulika.design'}` ``) as an anti-scrape measure. That
pattern is preserved here rather than writing the address as a plain literal.

**Bio.** Centred column, `max-width: 460px`, body ~15px / 1.62 line-height.
Four short paragraphs drawn from the existing About copy and tightened: who she
is, what she is doing now at DoorFeed, the shape of the path here, and what she
is open to. Inline underlined links on company names and on the three case
studies. This is the only dense text on the page.

**The scroll.** One horizontal bento carousel per project — DoorFeed, SigTech,
Deloitte — each carrying that project's full media set rather than a few hero
shots, since the track is browsable.

Tiles are `large` (a full-height column to themselves) or `small` (paired two to
a column), and each tile's width comes from its own aspect ratio, so varying
ratios in `content.ts` is what makes the brick pattern irregular. Fixed
geometry: 210px rows, 16px gaps, a 36px caption band, giving a 508px track. The
track scrolls natively, snaps on proximity, is keyboard-reachable, and carries
prev/next arrows that disable at each end.

Each group opens with a small always-visible eyebrow — `DoorFeed · 2026`, 12px,
letterspaced, muted — which on hover gains an arrow and reads `DoorFeed · Read
the case study →`.

Two deliberate departures from the reference. First, fetch has no internal
links, so its groups need no labels and get none; these groups have somewhere to
go, and a set of images that silently happens to be clickable is a detail page
nobody finds. Second, **the link sits on the eyebrow, not the group** — a
scrollable region inside an anchor fights itself, because releasing a drag would
navigate. That also gives screen readers one clean link instead of one wrapping
a dozen images.

**Footer.** One line: email, LinkedIn (`linkedin.com/in/tulika-`), and the CV at
`CV_PUBLIC_PATH`. No X link — there is no account to point at, and the existing
footer doesn't carry one.

## The detail template

One component, three content entries.

**Return.** `← Studio`, small, static, top-left. No sticky navigation; the page
is short enough not to need it.

**Header.** Project name, year, company. Nothing else — no tagline, no role, no
duration. Year and company are read from `caseStudies.ts`, which is factual
rather than narrative and so carries no duplication risk.

**Five beats.** Each beat is the same unit: eyebrow label, then one paragraph in
the 460px column, then its media at slab width.

| Beat | Weight | Slabs |
|---|---|---|
| Context | one paragraph | 1 |
| Problem | one paragraph | 1 |
| Exploration | the heart of the page | up to 3 |
| Decisions Made | what shipped, and why that | up to 3 |
| Impact | one paragraph | 1 |

Exploration and Decisions Made carry the page. Context and Problem are
compressed deliberately — the reference for how much space they get is a short
paragraph each, not a chapter.

**Next project.** One link at the foot. `caseStudies.ts` only chains doorfeed ↔
sigtech and leaves `deloitte-nlg` unchained, so the studio content defines its
own cycle: doorfeed → sigtech → deloitte-nlg → doorfeed.

## Motion

A single `<Reveal>` primitive wraps everything below the fold.

- `whileInView` with `once: true`, `margin: '-10% 0px'` so elements are settling
  as they arrive rather than popping at the viewport edge
- opacity 0→1, y 24→0, 600ms, ease `[0.22, 0.61, 0.36, 1]`
- text blocks stagger children by 60ms; a slab animates as one piece
- `useReducedMotion` renders everything at its final state — no transform, no
  fade, no exception

**Video.** `muted loop playsInline preload="none"` with a poster frame. Playback
starts only when in view and pauses when out. This is a performance measure
rather than an effect: a dozen videos decoding at once is how a page like this
dies on a laptop.

## Media model

All media resolves through the existing `img()` and `video()` helpers in
`src/constants/media.ts`, which hand Cloudinary `f_auto,q_auto` so browsers
negotiate AVIF/WebP and MP4/WebM per request.

DoorFeed is already migrated and renders complete.

SigTech and Deloitte are not. Their slabs render as a reserved slot: an
`#EDEDEA` box at the correct aspect ratio with the caption beneath it, sitting
exactly where the media will sit. Filling one means changing an ID in
`content.ts` — no component changes, no layout shift.

The reweighting toward Exploration lands hardest on exactly these two projects.
SigTech's three pivots and Deloitte's sketches are the richest exploration
material and none of it is uploaded, so both pages will read as mostly empty
captioned slots until the migration happens.

## Content plan

Fifteen beats — five per project across three projects — drafted by compressing
existing material rather than inventing it. `overviewBody`, `problemStatement`,
`goal`, `outcome` and `yourRole` in `caseStudies.ts` are rich enough to source
from directly. Anything inferred rather than found is marked inline in
`content.ts` for Tulika to correct.

## Out of scope

- Any change to `/`, `/about`, or `/work/:slug` beyond the shell split
- Uploading SigTech and Deloitte media to Cloudinary (needs Tulika's account)
- Light mode for the existing dark site — unrelated to this work, tracked
  separately in `LIGHT_MODE_PLAN.md`
- Replacing Barlow site-wide, as proposed in `FONT_AUDIT.md`

## Dependencies on Tulika

1. Commit or stash the uncommitted work on `refactor/home-september`
   (`AboutSection.tsx`, `HeroNameStrip.tsx`, `about/CurrentlyBlock.tsx`,
   `constants/currently.ts`) so the studio branch can come off `base`.
2. Edit the fifteen drafted beats — particularly anything marked inferred.
3. Upload SigTech and Deloitte media to Cloudinary, then swap the IDs in
   `content.ts`.

## Verification

Automated: `npm run lint`, `npx tsc --noEmit`, and `npm run build` all clean.

By eye:

- `/`, `/about` and `/work/doorfeed` render **visually unchanged**. The shell
  split is the only thing that can regress the existing site, so this is the
  check that matters most.
- `/studio` and all three detail routes render; reveal fires on scroll; an
  unknown slug redirects.
- Reduced-motion preference is honoured on both pages.
- Reserved slots hold their aspect ratio — nothing shifts when media lands.
- Videos play only while in view.
