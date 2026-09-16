import { useEffect } from 'react'
import AltLayoutPage from './layouts/AltLayoutPage'
import LayoutSwitcher from './LayoutSwitcher'
import QuietHome from './QuietHome'
import useStudioLayout from './useStudioLayout'
import useStudioTheme from './useStudioTheme'

/**
 * /studio, showing one of three homepage designs.
 *
 * The switcher is a comparison tool, not part of any of the three designs — see
 * LayoutSwitcher for why it floats rather than sitting in a header.
 */
export default function StudioHome() {
  const [layout, setLayout] = useStudioLayout()
  const [theme, toggleTheme] = useStudioTheme()

  // The three designs stand on different grounds, so body follows the choice
  useEffect(() => {
    document.body.dataset.studioLayout = layout
    return () => {
      delete document.body.dataset.studioLayout
    }
  }, [layout])

  return (
    <>
      {layout === 'quiet' && <QuietHome />}
      {layout === 'stack' && <AltLayoutPage work="stack" />}
      {layout === 'bento' && <AltLayoutPage work="bento" />}

      <LayoutSwitcher
        value={layout}
        onChange={setLayout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  )
}
