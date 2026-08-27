import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface LightboxContextType {
  openLightbox: (src: string, alt: string) => void
}

const LightboxContext = createContext<LightboxContextType>({ openLightbox: () => {} })

export function useLightbox() {
  return useContext(LightboxContext)
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ src: string; alt: string } | null>(null)

  const openLightbox = useCallback((src: string, alt: string) => {
    setState({ src, alt })
  }, [])

  const close = useCallback(() => setState(null), [])

  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      {createPortal(
        <AnimatePresence>
          {state && (
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={close}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.90)',
                backdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'zoom-out',
              }}
            >
              <motion.img
                src={state.src}
                alt={state.alt}
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.93, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '86vh',
                  borderRadius: '0.75rem',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
                  objectFit: 'contain',
                  cursor: 'default',
                  display: 'block',
                }}
              />
              <button
                onClick={close}
                aria-label="Close lightbox"
                style={{
                  position: 'fixed',
                  top: '1.25rem',
                  right: '1.25rem',
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '50%',
                  background: 'rgb(var(--ink) / 0.08)',
                  border: '1px solid rgb(var(--ink) / 0.18)',
                  color: 'rgb(var(--ink) / 0.80)',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </LightboxContext.Provider>
  )
}
