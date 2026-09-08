import ArtifactsChapter from '../doorfeed-demo/ArtifactsChapter'
import '../doorfeed-demo/doorfeed-demo.css'

/**
 * The Final artifacts chapter on the live case study.
 *
 * Sits outside ProjectTabs' container rather than inside it: the three rounds
 * lay media and copy side by side across their own full-width column, and
 * nesting them in a second 72rem wrapper would squeeze them narrower than the
 * chapter above.
 */
export default function DoorFeedArtifacts() {
  return (
    <section
      id="section-artifacts"
      style={{
        padding: '5rem 0 4rem',
        borderTop: '1px solid rgb(var(--ink) / 0.07)',
        marginTop: '2rem',
      }}
    >
      <ArtifactsChapter />
    </section>
  )
}
