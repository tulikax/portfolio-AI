import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import useFinePointer from './useFinePointer'

const OFFSET = 14

/**
 * "View case study" following the pointer while it is over a pocket stage.
 *
 * Both the position and the visibility are written straight to the DOM node
 * rather than held in React state. A pointermove fires dozens of times a
 * second; routing that through a render — or through a CSS variable on a
 * parent, which would recalculate styles for every child — is exactly the kind
 * of cost that shows up as dropped frames while the page is still loading.
 */
export default function CursorPill() {
  const ref = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!finePointer) return

    const move = (event: PointerEvent) => {
      const el = ref.current
      if (!el) return

      el.style.transform = `translate3d(${event.clientX + OFFSET}px, ${event.clientY + OFFSET}px, 0)`

      const overPocket = (event.target as Element | null)?.closest?.('.pocket')
      // A modal sits above everything; the pill would float over its backdrop
      const sheetOpen = !!document.querySelector('dialog[open]')
      el.dataset.visible = String(!!overPocket && !sheetOpen)
    }

    const hide = () => {
      if (ref.current) ref.current.dataset.visible = 'false'
    }

    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
    }
  }, [finePointer])

  // Route change: the pointer has not moved, so nothing else would clear it
  useEffect(() => {
    if (ref.current) ref.current.dataset.visible = 'false'
  }, [pathname])

  if (!finePointer) return null

  return (
    <div ref={ref} className="cursor-pill" data-visible="false" aria-hidden="true">
      View case study
    </div>
  )
}
