import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import type { ComponentCard } from './content'
import { EASE_OUT, H4, HAIRLINE, HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * The chat components as tabs, each opening its Storybook view.
 *
 * They were a static card grid, which listed the components without showing
 * any of them. As tabs the list stays scannable and the panel carries the
 * evidence — which is the point of having built them in Storybook.
 */
export default function ComponentTabs({ components }: { components: ComponentCard[] }) {
  const [active, setActive] = useState(0)
  const current = components[active]

  return (
    <div style={{ margin: '1.75rem 0 0' }}>
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Chat components"
        className="df-component-tabs"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        {components.map((component, i) => {
          const selected = i === active
          return (
            <button
              key={component.title}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              style={{
                ...H4,
                fontSize: '0.9375rem',
                background: 'none',
                border: 'none',
                padding: '0.625rem 0.875rem',
                // Selected reads by the rule beneath it; the rest simply recede
                borderBottom: selected ? `2px solid ${ink(0.85)}` : '2px solid transparent',
                marginBottom: '-1px',
                color: selected ? ink(0.95) : ink(0.4),
                transition: 'color 0.25s var(--ease-out), border-color 0.25s var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
            >
              {component.title}
            </button>
          )
        })}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          role="tabpanel"
          style={{ paddingTop: '1.5rem' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 300,
              lineHeight: 1.75,
              color: ink(0.68),
              maxWidth: '38rem',
              margin: '0 0 1.25rem',
            }}
          >
            {current.body}
          </p>

          {current.storybook?.src ? (
            <div
              style={{
                borderRadius: '0.5rem',
                overflow: 'hidden',
                border: `1px solid ${HAIRLINE_STRONG}`,
              }}
            >
              <img
                src={current.storybook.src}
                alt={current.storybook.alt ?? `${current.title} in Storybook`}
                loading="lazy"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          ) : (
            <div
              style={{
                minHeight: '16rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                padding: '2.5rem',
                textAlign: 'center',
                borderRadius: '0.5rem',
                border: `1px solid ${HAIRLINE}`,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${ink(
                  0.025,
                )} 12px, ${ink(0.025)} 24px)`,
              }}
            >
              <div style={{ ...MONO, color: ink(0.42) }}>Storybook — {current.title}</div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  color: ink(0.3),
                  lineHeight: 1.6,
                  maxWidth: '22rem',
                }}
              >
                Storybook capture to come.
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Wrapped so the tabs animate in with the rest of the chapter. */
export function ComponentTabsBlock({ components }: { components: ComponentCard[] }) {
  return (
    <Reveal>
      <ComponentTabs components={components} />
    </Reveal>
  )
}
