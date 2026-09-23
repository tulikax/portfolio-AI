import { useState } from 'react'
import HomePage from './HomePage'
import HeroSection, { type HeroBodyBlock } from './HeroSection'

interface HeroVariant {
  name: string
  titleLinesDesktop: string[]
  titleLinesMobile: string[]
  blueprintLens?: boolean
  splitLayout?: boolean
  intro?: string
  bodyBefore?: HeroBodyBlock[]
  bodyAfter?: HeroBodyBlock[]
  subtitle: string
}

// Sans copy moved out of the hero and appended to the About section
const VARIANTS: HeroVariant[] = [
  {
    name: 'Option 1',
    titleLinesDesktop: ["I don't avoid complexity.", 'I take it apart.'],
    titleLinesMobile: ["I don't avoid", 'complexity.', 'I take it apart.'],
    subtitle: "Product designer with a habit of pulling systems apart to see how they should've worked in the first place.",
  },
  {
    name: 'Option 2',
    titleLinesDesktop: ['Between the noise and the shape,', "that's where I work."],
    titleLinesMobile: ['Between the noise', 'and the shape,', "that's where I work."],
    blueprintLens: true,
    splitLayout: true,
    intro: "Hi, I'm Tulika",
    bodyBefore: [],
    bodyAfter: [],
    // Typed as the second serif line, in the same animation as the intro
    subtitle: "Product designer with a habit of pulling systems apart to see how they work and what's really worth building.",
  },
  {
    name: 'Option 3',
    titleLinesDesktop: ['Give me the mess.', "I'll find the shape in it."],
    titleLinesMobile: ['Give me the mess.', "I'll find the", 'shape in it.'],
    subtitle: 'I design where AI moves fast and humans need to stay in control.',
  },
]

export default function HeroCopyDemo() {
  const [idx, setIdx] = useState(0)
  const [replayCount, setReplayCount] = useState(0)
  const variant = VARIANTS[idx]

  return (
    <div style={{ position: 'relative' }}>
      <HomePage
        hero={
          <HeroSection
            key={`${idx}-${replayCount}`}
            titleLinesDesktop={variant.titleLinesDesktop}
            titleLinesMobile={variant.titleLinesMobile}
            titleBlueprintLens={variant.blueprintLens ?? false}
            splitLayout={variant.splitLayout ?? false}
            {...(variant.intro ? { intro: variant.intro } : {})}
            bodyBefore={variant.bodyBefore}
            bodyAfter={variant.bodyAfter}
            subtitle={variant.subtitle}
          />
        }
      />

      {/* Top label */}
      <div
        style={{
          position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, fontFamily: 'var(--font-body)', fontSize: '0.62rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        Hero Copy Demo — /demo/hero
      </div>

      {/* Variant switcher */}
      <div
        style={{
          // Bottom-right so the switcher never sits on top of hero content
          position: 'fixed', bottom: '1.25rem', right: '1.25rem',
          zIndex: 99999, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end',
        }}
      >
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            onClick={() => setIdx(i)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '9999px',
              border: `1px solid ${idx === i ? 'rgb(var(--ink) / 0.45)' : 'rgb(var(--ink) / 0.12)'}`,
              background: idx === i ? 'rgb(var(--ink) / 0.10)' : 'rgb(var(--ink) / 0.03)',
              color: idx === i ? 'rgb(var(--ink) / 0.9)' : 'rgb(var(--ink) / 0.4)',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {v.name}
          </button>
        ))}
        <button
          onClick={() => setReplayCount(c => c + 1)}
          style={{
            padding: '0.4rem 1.1rem', borderRadius: '9999px',
            border: '1px solid rgb(var(--ink) / 0.22)',
            background: 'rgb(var(--ink) / 0.07)',
            color: 'var(--text-1)',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
          }}
        >
          ↺ Replay
        </button>
      </div>
    </div>
  )
}
