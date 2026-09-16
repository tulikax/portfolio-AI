import { Fragment } from 'react'
import { Link } from 'react-router-dom'

/**
 * Matches `[label](href)`. Copy in content.ts stays plain data rather than JSX,
 * so this is the smallest markup that lets a paragraph carry an inline link.
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Renders a copy string, turning `[label](href)` into a link.
 *
 * Hrefs starting with `/` route through react-router so the studio pages never
 * trigger a full page load between themselves; everything else is a plain
 * anchor, opening in a new tab when it leaves the site.
 */
export default function RichText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(LINK)) {
    const [full, label, href] = match
    const start = match.index

    if (start > cursor) nodes.push(text.slice(cursor, start))

    if (href.startsWith('/')) {
      nodes.push(
        <Link key={start} to={href} className="studio-link">
          {label}
        </Link>,
      )
    } else {
      const external = href.startsWith('http')
      nodes.push(
        <a
          key={start}
          href={href}
          className="studio-link"
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {label}
        </a>,
      )
    }

    cursor = start + full.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))

  return (
    <>
      {nodes.map((node, i) => (
        <Fragment key={i}>{node}</Fragment>
      ))}
    </>
  )
}
