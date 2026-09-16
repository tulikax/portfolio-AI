import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AltLayoutPage from './layouts/AltLayoutPage'
import QuietHome from './QuietHome'
import useStudioLayout from './useStudioLayout'

/**
 * /studio, showing one of three homepage designs. The switcher and the theme
 * live in StudioShell, which wraps the case study pages too.
 */
export default function StudioHome() {
  const [layout] = useStudioLayout()
  const location = useLocation()
  const navigate = useNavigate()
  const scrollToProject = location.state?.scrollToProject as string | undefined

  useEffect(() => {
    document.title = 'Tulika Singh, product designer'
  }, [])

  /**
   * Coming back from a case study, return the reader to the project they left
   * rather than the top of the page.
   *
   * Done straight in the effect rather than inside requestAnimationFrame: the
   * tiles are already committed to the DOM by the time effects run, and rAF
   * does not fire in a background tab — which would leave the state uncleared
   * and fire the jump later, when the reader came back to the tab.
   *
   * Brushh is not in the Pocket stack, so an absent project falls back to the
   * work section.
   */
  useEffect(() => {
    if (!scrollToProject) return

    const target =
      document.getElementById(`project-${scrollToProject}`) ?? document.getElementById('work')
    target?.scrollIntoView({ block: 'center', behavior: 'auto' })

    // Otherwise a refresh would jump again
    navigate(location.pathname + location.search, { replace: true, state: null })
  }, [scrollToProject, navigate, location.pathname, location.search])

  if (layout === 'quiet') return <QuietHome />
  return <AltLayoutPage work={layout} />
}
