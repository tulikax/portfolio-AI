import ChapterHead from './ChapterHead'
import ProseBlocks from './ProseBlocks'
import Reveal from './Reveal'
import Rounds from './Rounds'
import { EXPLORATION } from './content'
import { BODY, WRAP } from './styles'

/**
 * The Exploration chapter — the bet that framed the work, then the three
 * rounds of getting the interaction model wrong before getting it right.
 *
 * Shared by the demo treatment and the live case study. `Rounds` sits outside
 * the text column deliberately: it alternates media and copy side by side and
 * needs the extra width.
 */
export default function ExplorationChapter() {
  return (
    <>
      <div style={WRAP}>
        <ChapterHead num={EXPLORATION.num} eyebrow={EXPLORATION.eyebrow} />

        <ProseBlocks blocks={EXPLORATION.blocks} />

        <Reveal>
          <p style={BODY}>{EXPLORATION.intro}</p>
        </Reveal>
      </div>

      <Rounds />
    </>
  )
}
