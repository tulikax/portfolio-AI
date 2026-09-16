import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from './data'

const ROWS = [
  { term: 'The problem', key: 'problem' },
  { term: 'What I did', key: 'did' },
  { term: 'What changed', key: 'changed' },
] as const

/**
 * The short version of a case study, in a native `<dialog>`.
 *
 * `showModal()` gives the focus trap, the inert background, Escape-to-close and
 * the `::backdrop` for free — all things a div would have to reimplement badly.
 */
export default function ShortVersionSheet({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()

  // Keeps the open effect free of `onClose` in its deps, so it runs once
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  /**
   * Every route out of the sheet goes through here.
   *
   * Closing deliberately does NOT rely on the dialog's `close` event: it does
   * not bubble, and some engines do not dispatch it on a programmatic
   * `close()` at all — leaving the dialog hidden but still mounted, so it would
   * refuse to open a second time. `closed` keeps this idempotent for engines
   * that do fire the event and reach it twice.
   */
  const closed = useRef(false)
  const close = useCallback(() => {
    if (closed.current) return
    closed.current = true
    ref.current?.close()
    onCloseRef.current()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.showModal()
    el.addEventListener('close', close)
    return () => el.removeEventListener('close', close)
  }, [close])

  return (
    <dialog
      ref={ref}
      className="short-sheet"
      // Escape. preventDefault so the UA close and ours cannot both run
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      // Belt and braces where `cancel` is as unreliable as `close`
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          close()
        }
      }}
      // The dialog element itself is the backdrop's hit area
      onClick={(event) => {
        if (event.target === ref.current) close()
      }}
    >
      <div className="short-sheet-panel">
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-muted)' }}>
          {project.company}, {project.role.toLowerCase()}, {project.when.toLowerCase()}
        </p>

        <h3
          style={{
            margin: '10px 0 0',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 38px)',
            lineHeight: 1.05,
          }}
        >
          {project.headline}
        </h3>

        <dl style={{ display: 'grid', gap: 16, margin: '28px 0 0' }}>
          {ROWS.map(({ term, key }) => (
            <div key={key}>
              <dt style={{ fontWeight: 600, fontSize: 15 }}>{term}</dt>
              <dd style={{ margin: '4px 0 0', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                {project.short[key]}
              </dd>
            </div>
          ))}
        </dl>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginTop: 30,
          }}
        >
          <button
            type="button"
            className="studio-alt-link"
            onClick={() => {
              close()
              navigate(`/studio/${project.slug}`)
            }}
          >
            Read the full case study
          </button>

          <button
            type="button"
            className="studio-alt-press"
            onClick={close}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-pill)',
              color: 'var(--color-pill-ink)',
              font: 'inherit',
              fontWeight: 500,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
