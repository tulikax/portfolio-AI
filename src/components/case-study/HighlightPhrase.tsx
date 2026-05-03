import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

interface Props {
  children: string
  color?: string
}

export default function HighlightPhrase({
  children,
  color = 'rgba(200, 168, 75, 0.55)',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const split = new SplitText(el, { type: 'words' })
    const words = split.words as HTMLElement[]
    const marks: HTMLSpanElement[] = []

    words.forEach((word) => {
      word.style.position = 'relative'
      word.style.display = 'inline-block'

      const mark = document.createElement('span')
      mark.style.cssText = `
        position: absolute;
        inset: 1px -3px;
        background: ${color};
        border-radius: 3px;
        z-index: -1;
        display: block;
        pointer-events: none;
      `
      word.appendChild(mark)
      gsap.set(mark, { scaleX: 0, transformOrigin: 'left center' })
      marks.push(mark)
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline()
          marks.forEach((mark, i) => {
            tl.to(mark, {
              scaleX: 1,
              duration: 0.4,
              ease: 'power3.out',
            }, i * 0.08)
          })
        } else {
          gsap.to(marks, {
            scaleX: 0,
            duration: 0.3,
            ease: 'power2.in',
            stagger: { each: 0.05, from: 'end' },
          })
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(marks)
      split.revert()
    }
  }, [color])

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline' }}>
      {children}
    </span>
  )
}
