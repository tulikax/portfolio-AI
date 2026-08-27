import { Fragment } from 'react'
import Reveal from './Reveal'
import type { TitleToken } from './content'
import { CHAPTER_TITLE, EMPHASIS, MONO, ink } from './styles'

interface Props {
  num: string
  eyebrow: string
  title: TitleToken[]
}

/** Renders a token list as a display heading with italic emphasis and line breaks. */
export function TitleTokens({ tokens }: { tokens: TitleToken[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          {token.br && <br />}
          {token.em ? <em style={EMPHASIS}>{token.text}</em> : token.text}
        </Fragment>
      ))}
    </>
  )
}

/** Chapter number, eyebrow, and display title — the repeating section opener. */
export default function ChapterHead({ num, eyebrow, title }: Props) {
  return (
    <div
      className="df-chapter-head"
      style={{ display: 'flex', gap: '1.75rem', alignItems: 'baseline', marginBottom: '2.5rem' }}
    >
      <Reveal style={{ flexShrink: 0 }}>
        <div style={{ ...MONO, color: ink(0.45), paddingTop: '0.625rem' }}>{num}</div>
      </Reveal>
      <div>
        <Reveal>
          <div style={{ ...MONO, color: ink(0.4), marginBottom: '0.75rem' }}>{eyebrow}</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 style={CHAPTER_TITLE}>
            <TitleTokens tokens={title} />
          </h2>
        </Reveal>
      </div>
    </div>
  )
}
