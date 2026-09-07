import { Fragment } from 'react'
import Reveal from './Reveal'
import type { TitleToken } from './content'
import { CHAPTER_TITLE, EMPHASIS, MONO, ink } from './styles'

interface Props {
  num: string
  eyebrow: string
  /**
   * Optional. Chapters whose sub-headings already carry the argument omit it —
   * a display title on top of them just repeats the section twice.
   */
  title?: TitleToken[]
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
          {/*
           * Serif and larger than a standard eyebrow: in chapters that drop the
           * display title, this is what names the section on the page. Colour
           * stays where it was so it still reads as a label.
           */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: '1.0625rem',
              letterSpacing: '0.01em',
              color: ink(0.4),
              marginBottom: title ? '0.75rem' : 0,
            }}
          >
            {eyebrow}
          </div>
        </Reveal>
        {title && (
          <Reveal delay={0.06}>
            <h2 style={CHAPTER_TITLE}>
              <TitleTokens tokens={title} />
            </h2>
          </Reveal>
        )}
      </div>
    </div>
  )
}
