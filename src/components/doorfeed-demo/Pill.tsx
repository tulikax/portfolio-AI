import { HAIRLINE_STRONG, MONO, ink } from './styles'

/**
 * Small status tag — same shape as the hero chips, quieter.
 *
 * Used where a section is deliberately unfinished, so the gap reads as a
 * known state with a date on it rather than as something missing.
 */
export default function Pill({ text }: { text: string }) {
  return (
    <span
      style={{
        ...MONO,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.75rem',
        fontSize: '0.56rem',
        border: `1px solid ${HAIRLINE_STRONG}`,
        borderRadius: '9999px',
        color: ink(0.5),
      }}
    >
      <span
        style={{
          width: '0.3125rem',
          height: '0.3125rem',
          borderRadius: '50%',
          background: ink(0.35),
        }}
      />
      {text}
    </span>
  )
}
