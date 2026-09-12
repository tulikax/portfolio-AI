import { useState, type CSSProperties, type ReactNode } from 'react'
import { ThemeRootContext, type ResolvedTheme } from './ThemeContext'

/**
 * Pins a subtree to one theme regardless of the global choice.
 *
 * Unused in Phase 1. It exists so that locking case studies to dark — the open
 * question this phase is meant to answer — is a one-line change. Descendant
 * canvas components resolve tokens against this element rather than <html>,
 * which is why theme.ts takes a root parameter.
 */
export default function ThemeScope({
  theme,
  children,
  style,
}: {
  theme: ResolvedTheme
  children: ReactNode
  style?: CSSProperties
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  return (
    <div ref={setElement} data-theme={theme} style={style}>
      <ThemeRootContext.Provider value={element}>{children}</ThemeRootContext.Provider>
    </div>
  )
}
