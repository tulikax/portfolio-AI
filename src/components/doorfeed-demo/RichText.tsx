import { Fragment } from 'react'
import { ink } from './styles'

/**
 * Renders `**bold**` and `_italic_` spans inside body copy. Keeping the
 * narrative as plain strings in content.ts means it stays editable without
 * touching JSX, so emphasis is encoded with the two markdown conventions this
 * page needs.
 */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} style={{ fontWeight: 500, color: ink(0.95) }}>
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
