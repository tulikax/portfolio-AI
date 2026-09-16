import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from './data'
import ShortVersionSheet from './ShortVersionSheet'
import { useLayoutSearch } from '../useStudioLayout'

/** "Read the short version" and "Read the full case study", side by side. */
export default function ProjectLinks({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const layoutSearch = useLayoutSearch()

  return (
    <>
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px' }}>
        <button
          ref={triggerRef}
          type="button"
          className="studio-alt-link"
          onClick={() => setOpen(true)}
        >
          Read the short version
        </button>

        <Link to={`/studio/${project.slug}${layoutSearch}`} className="studio-alt-link">
          Read the full case study
        </Link>
      </span>

      {open && (
        <ShortVersionSheet
          project={project}
          onClose={() => {
            setOpen(false)
            // Put the caret back where the reader left it
            triggerRef.current?.focus()
          }}
        />
      )}
    </>
  )
}
