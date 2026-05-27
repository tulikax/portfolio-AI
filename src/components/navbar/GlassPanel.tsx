import type { CSSProperties, ReactNode } from 'react'

type GlassPanelProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Nav uses a simple opaque frosted bar (reliable when pseudo-element glass fails) */
  variant?: 'default' | 'nav'
}

const NAV_SURFACE: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.22)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(16px) saturate(140%)',
  WebkitBackdropFilter: 'blur(16px) saturate(140%)',
}

/** Static panel — nav variant avoids liquid-glass pseudo-elements entirely. */
export function GlassPanel({ children, className = '', style, variant = 'default' }: GlassPanelProps) {
  if (variant === 'nav') {
    return (
      <div
        className={`nav-glass-pill ${className}`.trim()}
        style={{ ...NAV_SURFACE, ...style }}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`liquid-glass ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
