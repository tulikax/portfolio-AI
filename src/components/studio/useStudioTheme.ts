import { useCallback, useEffect, useState } from 'react'

export type StudioTheme = 'light' | 'dark'

const STORAGE_KEY = 'studio-theme'

/**
 * Light, unless the visitor says otherwise.
 *
 * Deliberately not seeded from `prefers-color-scheme`: all three layouts are
 * composed light, and dark is an alternative to try rather than the default a
 * system setting should be able to impose.
 */
function initial(): StudioTheme {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export default function useStudioTheme(): [StudioTheme, () => void] {
  const [theme, setTheme] = useState<StudioTheme>(initial)

  // Body carries it so the ground, the switcher and all three palettes follow
  useEffect(() => {
    document.body.dataset.studioTheme = theme
    return () => {
      delete document.body.dataset.studioTheme
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private browsing can refuse writes; the session still honours it
      }
      return next
    })
  }, [])

  return [theme, toggle]
}
