import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { refreshTheme } from '../constants/theme'
import {
  STORAGE_KEY,
  SYSTEM_FOLLOWS_OS,
  ThemeRootContext,
  ThemeStateContext,
  type ResolvedTheme,
  type ThemeMode,
} from './ThemeContext'

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Private browsing or a blocked storage partition — fall through to default.
  }
  return 'system'
}

function resolve(mode: ThemeMode, prefersLight: boolean): ResolvedTheme {
  if (mode !== 'system') return mode
  return SYSTEM_FOLLOWS_OS && prefersLight ? 'light' : 'dark'
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode)
  const [prefersLight, setPrefersLight] = useState(
    () => typeof window !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches,
  )
  const resolved = resolve(mode, prefersLight)

  // Track the OS preference even while SYSTEM_FOLLOWS_OS is false, so that
  // flipping the constant in Phase 3 needs no further wiring.
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: light)')
    const onChange = (event: MediaQueryListEvent) => setPrefersLight(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Layout effect, not passive: every layout effect completes before any passive
  // effect, so consumers reading tokens in a useEffect are guaranteed to see the
  // stamped attribute and the cleared cache. A passive effect here would run
  // child-first — after the consumers that depend on it.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolved === 'light' ? '#faf9f6' : '#000000')
    }
    // Tokens are cached against the old palette until this runs.
    refreshTheme()
  }, [resolved])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable — the choice just won't survive a reload.
    }
  }, [])

  const toggle = useCallback(() => {
    setModeState((current) => {
      const next: ThemeMode = resolve(current, prefersLight) === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // See above.
      }
      return next
    })
  }, [prefersLight])

  // Private review shortcut. Phase 3 replaces this with a visible control.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const state = useMemo(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved, setMode, toggle],
  )

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeRootContext.Provider value={null}>{children}</ThemeRootContext.Provider>
    </ThemeStateContext.Provider>
  )
}
