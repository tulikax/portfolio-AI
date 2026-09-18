import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { STACK_PROJECTS } from './data'

/**
 * Where the glow sits for each project in the stack. Percentages are of the
 * glow's own box, so it stays put across viewport sizes.
 */
const ANCHORS = [
  { x: '-6%', y: '-4%' },
  { x: '16%', y: '6%' },
  { x: '-12%', y: '14%' },
]

/** How much of the scroll the glow takes, and the furthest it may drift. */
const PARALLAX_RATE = 0.06
const PARALLAX_MAX = 220

/**
 * The ambient background for the Pocket stack: a soft glow in the active
 * project's tint that washes the whole area at 20%, and moves to a new anchor
 * each time a different case study takes the viewport.
 *
 * Two nested layers rather than one, because the two movements have different
 * jobs and cannot share a transform. The outer layer makes the anchored move on
 * a CSS transition — an ease-in-out cubic, so arriving at a new project has a
 * settle to it. The inner layer carries the continuous parallax drift, written
 * straight to `style.transform` from a passive scroll listener so it never goes
 * through a render.
 *
 * The 700ms on the outer move is longer than the 300ms ceiling for UI motion on
 * purpose: nothing here is feedback to an action. It is ambient, it is behind
 * the content, and at 300ms a colour wash this large reads as a flicker.
 */
export default function StackBackdrop() {
  const [active, setActive] = useState(0)
  const driftRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Whichever project crosses the middle of the viewport owns the backdrop
  useEffect(() => {
    const articles = STACK_PROJECTS.map((project) =>
      document.getElementById(`project-${project.slug}`),
    ).filter((el): el is HTMLElement => !!el)

    if (articles.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = articles.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      // A band one pixel tall across the viewport's centre line
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    articles.forEach((article) => observer.observe(article))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const onScroll = () => {
      const el = driftRef.current
      if (!el) return
      const drift = Math.min(window.scrollY * PARALLAX_RATE, PARALLAX_MAX)
      el.style.transform = `translate3d(0, ${-drift}px, 0)`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  const project = STACK_PROJECTS[active] ?? STACK_PROJECTS[0]
  const anchor = ANCHORS[active] ?? ANCHORS[0]

  return (
    <div
      className="stack-backdrop"
      aria-hidden="true"
      style={{ ['--stack-accent' as string]: `var(--tint-${project.tint})` }}
    >
      <div
        className="stack-backdrop-anchor"
        style={{ ['--anchor-x' as string]: anchor.x, ['--anchor-y' as string]: anchor.y }}
      >
        <div ref={driftRef} className="stack-backdrop-drift">
          <div className="stack-backdrop-glow" />
        </div>
      </div>
    </div>
  )
}
