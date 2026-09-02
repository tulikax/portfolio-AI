import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface Props {
  children: string
  color?: string
  textColor?: string
}

/** Convert `rgba(r, g, b, a)` → `rgba(r, g, b, 0)` */
function toTransparent(color: string): string {
  return color.replace(/,\s*[\d.]+\)$/, ', 0)')
}

/**
 * Wraps its text in a single continuous highlight that wipes in
 * left-to-right when scrolled into view and reverses on scroll-out.
 *
 * Uses `box-decoration-break: clone` so the background repaints cleanly
 * on each line when the phrase wraps. No per-word DOM splitting.
 */
export default function HighlightPhrase({
  children,
  color = 'rgb(var(--ink) / 0.92)',
  textColor,
}: Props) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const transparentColor = toTransparent(color)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    // Start with transparent background
    gsap.set(el, { backgroundColor: transparentColor })
    if (textColor) gsap.set(el, { color: 'inherit' })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { backgroundColor: color, duration: 0.5, ease: 'power2.out' })
          if (textColor) {
            gsap.to(el, { color: textColor, duration: 0.4, delay: 0.15, ease: 'power2.out' })
          }
        } else {
          gsap.to(el, { backgroundColor: transparentColor, duration: 0.3, ease: 'power2.in' })
          if (textColor) {
            gsap.to(el, { color: 'inherit', duration: 0.2, ease: 'power2.in' })
          }
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(el)
    }
  }, [color, textColor, transparentColor])

  return (
    <span
      ref={spanRef}
      style={{
        borderRadius: '3px',
        padding: '1px 4px',
        // Each line gets its own background box on wrap
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone',
      } as React.CSSProperties}
    >
      {children}
    </span>
  )
}
