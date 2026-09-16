import { Moon, Sun } from 'lucide-react'
import { STUDIO_LAYOUTS, STUDIO_LAYOUT_LABELS, type StudioLayout } from './useStudioLayout'
import type { StudioTheme } from './useStudioTheme'

/**
 * Floating control for comparing the three homepage layouts.
 *
 * Deliberately pinned to the bottom of the viewport rather than placed in any
 * one design's header: it belongs to none of them, and each layout should be
 * judged without a foreign control sitting inside its composition.
 */
export default function LayoutSwitcher({
  value,
  onChange,
  theme,
  onToggleTheme,
}: {
  value: StudioLayout
  onChange: (next: StudioLayout) => void
  theme: StudioTheme
  onToggleTheme: () => void
}) {
  return (
    <div className="layout-switcher">
      <span role="group" aria-label="Homepage layout" style={{ display: 'contents' }}>
        {STUDIO_LAYOUTS.map((layout) => (
          <button
            key={layout}
            type="button"
            aria-pressed={value === layout}
            onClick={() => onChange(layout)}
          >
            {STUDIO_LAYOUT_LABELS[layout]}
          </button>
        ))}
      </span>

      <span className="layout-switcher-divider" aria-hidden="true" />

      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-pressed={theme === 'dark'}
        aria-label="Dark mode"
      >
        {/* The stack takes the half-turn; the two faces cross over inside it */}
        <span className="theme-toggle-spin" aria-hidden="true">
          <span className="theme-toggle-face theme-toggle-sun">
            <Sun size={17} strokeWidth={1.75} />
          </span>
          <span className="theme-toggle-face theme-toggle-moon">
            <Moon size={17} strokeWidth={1.75} />
          </span>
        </span>
      </button>
    </div>
  )
}
