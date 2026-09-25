import { createContext } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const STORAGE_KEY = 'portfolio:theme-mode'

/**
 * Phase 3 flips this to true, at which point 'system' starts following the OS.
 * Until then every visitor gets dark and light mode is reachable only by the
 * Ctrl+Alt+L shortcut.
 *
 * KEEP IN SYNC with the inline pre-paint script in index.html, which duplicates
 * this value because it runs before any module loads.
 */
export const SYSTEM_FOLLOWS_OS = false

export interface ThemeState {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export const ThemeStateContext = createContext<ThemeState | null>(null)

/** The element carrying the active `data-theme`. Overridden by <ThemeScope>. */
export const ThemeRootContext = createContext<Element | null>(null)
