import ChapterHead from '../doorfeed-demo/ChapterHead'
import ProseBlocks from '../doorfeed-demo/ProseBlocks'
import OpeningQuote from '../doorfeed-demo/OpeningQuote'
import { CONTEXT } from '../doorfeed-demo/content'
import '../doorfeed-demo/doorfeed-demo.css'

/**
 * The opening question and the Context chapter, shared with the demo treatment
 * at /work/doorfeed/demo.
 *
 * Both pages tell the same story here, so the copy and the block layout live in
 * one place — doorfeed-demo/content.ts — rather than being duplicated into
 * caseStudies.ts, where the ordered interleaving of sub-headings, the drag
 * comparison and the collage have no equivalent representation.
 *
 * Rendered in place of the generic Overview section, so it inherits that
 * section's anchor and side-nav entry.
 */
export default function DoorFeedContext() {
  return (
    <>
      <ChapterHead num={CONTEXT.num} eyebrow={CONTEXT.eyebrow} />
      <ProseBlocks blocks={CONTEXT.blocks} />
      <OpeningQuote />
    </>
  )
}
