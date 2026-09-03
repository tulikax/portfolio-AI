import ChapterHead from '../doorfeed-demo/ChapterHead'
import ProseBlocks from '../doorfeed-demo/ProseBlocks'
import Reveal from '../doorfeed-demo/Reveal'
import { CONTEXT, OPENING_PULL } from '../doorfeed-demo/content'
import { DISPLAY, MONO, ink } from '../doorfeed-demo/styles'
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
      {/* Opening pull quote */}
      <div style={{ padding: '2rem 0 6rem', textAlign: 'center' }}>
        <Reveal>
          <blockquote
            style={{
              ...DISPLAY,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.375rem)',
              lineHeight: 1.32,
              color: ink(0.95),
              maxWidth: '46rem',
              margin: '0 auto',
            }}
          >
            {OPENING_PULL.lines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </blockquote>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ ...MONO, color: ink(0.4), marginTop: '1.625rem' }}>
            {OPENING_PULL.attrib}
          </div>
        </Reveal>
      </div>

      <ChapterHead num={CONTEXT.num} eyebrow={CONTEXT.eyebrow} title={CONTEXT.title} />
      <ProseBlocks blocks={CONTEXT.blocks} />
    </>
  )
}
