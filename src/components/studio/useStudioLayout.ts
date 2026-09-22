import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const STUDIO_LAYOUTS = ['stack', 'bento'] as const
export type StudioLayout = (typeof STUDIO_LAYOUTS)[number]

export const STUDIO_LAYOUT_LABELS: Record<StudioLayout, string> = {
  stack: 'Pocket stack',
  bento: 'Bento board',
}

const DEFAULT_LAYOUT: StudioLayout = 'stack'
const STORAGE_KEY = 'studio-layout'

/**
 * Below the bento grid's four-column breakpoint (see tokens.css).
 *
 * The Pocket stack is a desktop composition — full-height stages, a parallax
 * backdrop, a cursor-tracking pill — so narrow viewports get the board instead
 * of a stack squeezed into a width it was never drawn for.
 */
const COMPACT_QUERY = '(max-width: 899.98px)'

export function useIsCompact(): boolean {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY)
    const sync = () => setCompact(query.matches)
    // Re-read on mount: the width can differ from the first render's guess
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return compact
}

/**
 * The layout actually rendered, as opposed to the one chosen.
 *
 * The stored choice is left alone when it is overridden — widening the window
 * should hand the reader back the layout they picked, not the one the width
 * forced on them.
 */
export function useEffectiveLayout(): StudioLayout {
  const [layout] = useStudioLayout()
  return useIsCompact() ? 'bento' : layout
}

function isLayout(value: string | null): value is StudioLayout {
  return !!value && (STUDIO_LAYOUTS as readonly string[]).includes(value)
}

/**
 * Which homepage layout /studio is currently showing.
 *
 * The URL is the source of truth so a layout can be linked and shared;
 * localStorage only remembers the last choice for a plain visit to /studio.
 */
/**
 * `?layout=…` for the current layout, to hang off in-studio links.
 *
 * Without this a link drops the param and the next page has to fall back to
 * localStorage — which works, but leaves URLs that don't describe what they
 * open, so a shared link can show a different layout than the sender saw.
 */
export function useLayoutSearch(): string {
  const [layout] = useStudioLayout()
  return `?layout=${layout}`
}

export default function useStudioLayout(): [StudioLayout, (next: StudioLayout) => void] {
  const [params, setParams] = useSearchParams()

  const fromUrl = params.get('layout')
  let layout: StudioLayout = DEFAULT_LAYOUT

  if (isLayout(fromUrl)) {
    layout = fromUrl
  } else if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLayout(stored)) layout = stored
  }

  const setLayout = useCallback(
    (next: StudioLayout) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private browsing can refuse writes; the URL still carries the choice
      }
      const updated = new URLSearchParams(params)
      updated.set('layout', next)
      setParams(updated, { replace: true })
    },
    [params, setParams],
  )

  return [layout, setLayout]
}
