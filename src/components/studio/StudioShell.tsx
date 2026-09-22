import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LayoutSwitcher from './LayoutSwitcher'
import useStudioLayout, { useEffectiveLayout, useIsCompact } from './useStudioLayout'
import useStudioTheme from './useStudioTheme'
import './studio.css'

/**
 * Layout route for /studio. The light counterpart to the dark site's chrome —
 * no grain, no custom cursor, no navbar.
 *
 * Layout and theme live here rather than on the homepage because the case study
 * pages need them too: the ground colour and the case study template both
 * follow the chosen layout, so leaving the homepage must not drop it.
 */
export default function StudioShell() {
  const location = useLocation()
  const [layout, setLayout] = useStudioLayout()
  const effectiveLayout = useEffectiveLayout()
  const compact = useIsCompact()
  const [theme, toggleTheme] = useStudioTheme()

  // The body class is what undoes `cursor: none` and the black background set
  // globally in index.css; removed on unmount so the dark site gets it back
  useEffect(() => {
    document.body.classList.add('studio-ground')
    return () => document.body.classList.remove('studio-ground')
  }, [])

  // The rendered layout, not the chosen one — the ground colour has to match
  // what is actually on screen when a narrow viewport forces the board
  useEffect(() => {
    document.body.dataset.studioLayout = effectiveLayout
    return () => {
      delete document.body.dataset.studioLayout
    }
  }, [effectiveLayout])

  useEffect(() => {
    // Returning from a case study scrolls to that project instead — see
    // StudioHome — so this must not fight it
    if (location.state?.scrollToProject) return
    // `html` carries scroll-behavior: smooth, which would animate this
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.state])

  return (
    <div className="studio">
      <Outlet />
      <LayoutSwitcher
        value={layout}
        onChange={setLayout}
        showLayouts={!compact}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  )
}
