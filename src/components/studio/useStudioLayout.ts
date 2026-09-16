import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const STUDIO_LAYOUTS = ['quiet', 'stack', 'bento'] as const
export type StudioLayout = (typeof STUDIO_LAYOUTS)[number]

export const STUDIO_LAYOUT_LABELS: Record<StudioLayout, string> = {
  quiet: 'Quiet',
  stack: 'Pocket stack',
  bento: 'Bento board',
}

const DEFAULT_LAYOUT: StudioLayout = 'quiet'
const STORAGE_KEY = 'studio-layout'

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
