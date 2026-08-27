import MediaCollage from './MediaCollage'
import MediaGrid from './MediaGrid'
import MediaSlot from './MediaSlot'
import Reveal from './Reveal'
import RichText from './RichText'
import type { Block } from './content'
import { BODY, DISPLAY, ink } from './styles'

/**
 * Renders a chapter's ordered block list. Prose, sub-headings and media are
 * interleaved in a sequence that carries the argument, so the order lives in
 * content.ts rather than being fixed by the layout.
 */
export default function ProseBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <Reveal key={i}>
                <h3
                  style={{
                    ...DISPLAY,
                    fontSize: 'clamp(1.3125rem, 2.7vw, 1.75rem)',
                    color: ink(0.95),
                    margin: '3.5rem 0 1.125rem',
                  }}
                >
                  {block.text}
                </h3>
              </Reveal>
            )

          case 'body':
            return (
              <Reveal key={i}>
                <p style={BODY}>
                  <RichText text={block.text} />
                </p>
              </Reveal>
            )

          case 'aside':
            return (
              <Reveal key={i}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    lineHeight: 1.75,
                    color: ink(0.5),
                    borderLeft: `2px solid ${ink(0.35)}`,
                    paddingLeft: '1.25rem',
                    maxWidth: '39rem',
                    margin: '1.875rem 0',
                  }}
                >
                  <RichText text={block.text} />
                </p>
              </Reveal>
            )

          case 'media':
            return <MediaSlot key={i} spec={block.spec} />

          case 'mediaGrid':
            return <MediaGrid key={i} spec={block.spec} />

          case 'collage':
            return <MediaCollage key={i} spec={block.spec} />
        }
      })}
    </>
  )
}
