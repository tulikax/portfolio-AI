import { useState } from 'react'
import BentoBoard, { BentoFilter, type Filter } from './BentoBoard'
import { Hero, SiteFooter, SiteHeader, WorkHeader } from './Chrome'
import CursorPill from './CursorPill'
import PocketStack from './PocketStack'
import './tokens.css'

/**
 * The shared page shell for the two alternative layouts. Everything above and
 * below the work section is identical; only the work section differs.
 *
 * `.studio-alt` carries the token set — scoped rather than global, so the dark
 * site keeps its own palette untouched.
 */
export default function AltLayoutPage({ work }: { work: 'stack' | 'bento' }) {
  const [filter, setFilter] = useState<Filter>('all')

  return (
    <div className="studio-alt">
      <SiteHeader />
      <Hero />
      <WorkHeader filter={work === 'bento' ? <BentoFilter value={filter} onChange={setFilter} /> : undefined} />

      {work === 'stack' ? <PocketStack /> : <BentoBoard filter={filter} />}

      <SiteFooter />

      {/* Pocket stages are the only thing the pill tracks, so it is stack-only */}
      {work === 'stack' && <CursorPill />}
    </div>
  )
}
