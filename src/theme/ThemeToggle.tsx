import { useTheme } from './useTheme'

/**
 * Dev-only theme control.
 *
 * The call site wraps this in `import.meta.env.DEV`, so it is absent from
 * production bundles entirely rather than merely hidden — light mode must stay
 * unreachable for visitors while the Phase 2 and 3 work is outstanding.
 *
 * Phase 3 replaces this with a real control in the navbar. Until then it is
 * deliberately plain: styling it properly means solving the liquid-glass problem
 * in light mode, which is exactly the work this phase defers.
 */
export default function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      style={{
        position: 'fixed',
        left: '1rem',
        bottom: '1rem',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.5rem 0.8rem',
        borderRadius: '9999px',
        border: '1px solid rgb(var(--ink) / 0.22)',
        background: 'rgb(var(--ink) / 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'rgb(var(--ink) / 0.85)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.7rem',
        fontWeight: 400,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      <span aria-hidden="true">{resolved === 'dark' ? '☾' : '☀'}</span>
      {resolved}
    </button>
  )
}
