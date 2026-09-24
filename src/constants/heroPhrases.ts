/**
 * Personality tags shown around the portrait in the hero.
 *
 * Each entry is one idea with three wordings. A roll picks a phrase, then picks
 * a wording — so the same tag reads differently on a second visit without the
 * list getting longer or the voice drifting.
 */
export interface HeroPhrase {
  /** Three ways of saying the same thing */
  variants: readonly [string, string, string]
  emoji: string
}

/** A phrase with its wording chosen — what the hero actually renders */
export interface PickedPhrase {
  text: string
  emoji: string
  /**
   * Stable across variants. Dedupe keys off this rather than the rendered text,
   * so a reroll cannot bring the same idea straight back in other words.
   */
  id: string
}

export const HERO_PHRASES: HeroPhrase[] = [
  {
    emoji: '🧩',
    variants: [
      'half PM, half design engineer',
      'PM on Mondays, design engineer the rest of the week',
      'somewhere between PM and design engineer',
    ],
  },
  {
    emoji: '🎧',
    variants: [
      'makes playlists nobody asked for',
      'curates playlists, mostly an audience of one',
      'playlist perfectionist, private audience',
    ],
  },
  {
    emoji: '🎥',
    variants: [
      "films things that don't need filming",
      'has 4000 videos, no idea why',
      'documents everything, edits nothing',
    ],
  },
  {
    emoji: '✏️',
    variants: [
      'pen in hand, thoughts in order',
      "ideas don't count until they're handwritten",
      'thinks slower, thinks better, with a pen',
    ],
  },
  {
    emoji: '📝',
    variants: [
      'paper beats keyboard, every time',
      'still takes notes the analog way',
      'typing is for later, paper is for thinking',
    ],
  },
  {
    emoji: '🚶',
    variants: [
      "walks like she's late, isn't",
      'outpaces everyone, unintentionally',
      'speed-walks through calm moments',
    ],
  },
  {
    emoji: '🐕',
    variants: [
      'will stop for any dog, no exceptions',
      'dog person, unapologetically',
      "known to talk to strangers' dogs",
    ],
  },
  {
    emoji: '🗂️',
    variants: [
      'never deletes a file, just archives it',
      'version history hoarder',
      'saves everything, deletes nothing',
    ],
  },
]

/** Chooses one of a phrase's three wordings. */
export function pickVariant(phrase: HeroPhrase): PickedPhrase {
  const text = phrase.variants[Math.floor(Math.random() * phrase.variants.length)]
  return { text, emoji: phrase.emoji, id: phrase.variants[0] }
}

export function shufflePhrases<T>(input: readonly T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
