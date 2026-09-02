export interface HeroPhrase {
  text: string
  emoji: string
}

/** Personality tags shown around the portrait in the hero */
export const HERO_PHRASES: HeroPhrase[] = [
  { text: 'oat latte', emoji: '☕' },
  { text: 'painting', emoji: '🎨' },
  { text: 'cityscape appreciation', emoji: '🌆' },
  { text: 'still mad about that one dropdown', emoji: '😤' },
  { text: 'good defaults beat clever ones', emoji: '⚙️' },
  { text: 'keeps every version, just in case', emoji: '🗂️' },
  { text: 'thinks better with a pen', emoji: '✏️' },
  { text: "automation isn't a personality", emoji: '🤖' },
  { text: 'might argue over 2px if it matters', emoji: '📐' },
  { text: 'no is a design deliverable', emoji: '✋' },
  { text: 'handwritten notes > typed', emoji: '📝' },
  { text: 'scope is a design decision too', emoji: '🧭' },
  { text: 'do we really need to add that AI feature?', emoji: '🤔' },
]

export function shufflePhrases<T>(input: readonly T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
