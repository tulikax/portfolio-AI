import { useEffect, useState } from 'react'
import { NAV_DESKTOP_MIN_WIDTH_PX } from '../../constants/site'

export function useNavbarScroll(threshold = 30) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

export function useCloseMenuOnDesktop(setMenuOpen: (open: boolean) => void) {
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${NAV_DESKTOP_MIN_WIDTH_PX}px)`)
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setMenuOpen])
}
