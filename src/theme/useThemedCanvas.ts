import { useContext, useMemo } from 'react'
import { displayFont, ink, inkChannel } from '../constants/theme'
import { ThemeRootContext, type ResolvedTheme } from './ThemeContext'
import { useTheme } from './useTheme'

export interface ThemedCanvas {
  resolved: ResolvedTheme
  themeRoot: Element
  inkChannel: () => string
  ink: (alpha?: number) => string
  displayFont: (sizePx: number, style?: string) => string
}

/**
 * Ink accessors bundled with the theme identity that invalidates them.
 *
 * Canvas effects cache colours at effect start, so they must re-run on a theme
 * flip. Put the whole returned object in the effect's dependency array: because
 * reading the ink and subscribing to its changes come from the same value, a
 * component cannot do one without the other.
 *
 * Ordering is safe because ThemeProvider stamps `data-theme` and calls
 * `refreshTheme()` in a LAYOUT effect: every layout effect completes before any
 * passive effect, so by the time a consumer's useEffect calls `inkChannel()` the
 * attribute is set and the cache is empty.
 */
export function useThemedCanvas(): ThemedCanvas {
  const { resolved } = useTheme()
  const scopedRoot = useContext(ThemeRootContext)

  return useMemo(() => {
    const themeRoot = scopedRoot ?? document.documentElement
    return {
      resolved,
      themeRoot,
      inkChannel: () => inkChannel(themeRoot),
      ink: (alpha = 1) => ink(alpha, themeRoot),
      displayFont: (sizePx: number, style = 'italic') => displayFont(sizePx, style, themeRoot),
    }
  }, [resolved, scopedRoot])
}
