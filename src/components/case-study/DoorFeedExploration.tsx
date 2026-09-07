import ExplorationChapter from '../doorfeed-demo/ExplorationChapter'
import '../doorfeed-demo/doorfeed-demo.css'

/**
 * The Exploration chapter on the live case study.
 *
 * Sits outside ProjectTabs' container for the same reason DoorFeedArtifacts
 * does: the three rounds lay media and copy side by side across their own
 * column, and a second 72rem wrapper would squeeze them.
 */
export default function DoorFeedExploration() {
  return (
    <section
      id="section-exploration"
      style={{
        padding: '5rem 0 4rem',
        borderTop: '1px solid rgb(var(--ink) / 0.07)',
        marginTop: '2rem',
      }}
    >
      <ExplorationChapter />
    </section>
  )
}
