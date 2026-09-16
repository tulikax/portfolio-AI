import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './studio.css'

/**
 * Layout route for /studio. The light counterpart to the dark site's chrome —
 * no grain, no custom cursor, no navbar.
 *
 * The body class is what undoes `cursor: none` and the black background set
 * globally in index.css; it is removed on unmount so leaving /studio hands the
 * dark site back exactly what it had.
 */
export default function StudioShell() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.classList.add('studio-ground')
    return () => document.body.classList.remove('studio-ground')
  }, [])

  // `html` carries scroll-behavior: smooth, which would animate this
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="studio">
      <Outlet />
    </div>
  )
}
