import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RichText from './RichText'
import { DECISIONS } from './content'
import { EASE_OUT, H3, HAIRLINE, HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * The key design decisions, as an accordion. Each is a trade-off with a real
 * alternative, so they stay collapsed by default — the titles alone give the
 * shape of the argument, and the reasoning is there for anyone who wants it.
 * At seven items, collapsing is what keeps the chapter scannable.
 */
export default function DeepDiveAccordion() {
  const [openIdx, setOpenIdx] = useState<string | null>(null)

  return (
    <div style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: '2.5rem' }}>
      {DECISIONS.items.map((dive) => {
        const open = openIdx === dive.idx
        return (
          <div key={dive.idx} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <button
              onClick={() => setOpenIdx(open ? null : dive.idx)}
              aria-expanded={open}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                width: '100%',
                padding: '1.625rem 0',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                paddingLeft: open ? '0.5rem' : 0,
                transition: 'padding-left 0.35s var(--ease-out)',
              }}
            >
              <span style={{ ...MONO, color: ink(0.4), flexShrink: 0, width: '1.375rem' }}>
                {dive.idx}
              </span>
              <span
                style={{ ...H3, flex: 1 }}
              >
                {dive.title}
              </span>

              {/* Plus that rotates into a minus */}
              <span
                style={{
                  width: '1.375rem',
                  height: '1.375rem',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '0.875rem',
                    height: '1px',
                    background: ink(0.7),
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '1px',
                    height: '0.875rem',
                    background: ink(0.7),
                    transform: `translate(-50%, -50%) rotate(${open ? 90 : 0}deg)`,
                    transition: 'transform 0.4s var(--ease-out)',
                  }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="df-dive-body" style={{ padding: '0 0 2.125rem 2.625rem' }}>
                    {dive.paragraphs.map((para, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          fontWeight: 300,
                          lineHeight: 1.8,
                          color: ink(0.68),
                          maxWidth: '40rem',
                          margin: i === dive.paragraphs.length - 1 ? 0 : '0 0 1rem',
                        }}
                      >
                        <RichText text={para} />
                      </p>
                    ))}
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1.125rem' }}
                    >
                      {dive.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            ...MONO,
                            fontSize: '0.62rem',
                            padding: '0.3rem 0.7rem',
                            border: `1px solid ${HAIRLINE_STRONG}`,
                            borderRadius: '0.125rem',
                            color: ink(0.45),
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
