import { ArrowUpRight } from 'lucide-react'
import { CV_PUBLIC_PATH } from '../../constants/site'

type NavbarCvLinkProps = {
  variant: 'pill' | 'menu'
  onNavigate?: () => void
}

export function NavbarCvLink({ variant, onNavigate }: NavbarCvLinkProps) {
  const isPill = variant === 'pill'

  return (
    <a
      href={CV_PUBLIC_PATH}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={
        isPill
          ? 'btn-press hidden md:inline-flex'
          : 'btn-press flex items-center justify-center gap-1.5'
      }
      style={{
        background: 'white',
        color: 'black',
        borderRadius: isPill ? '9999px' : '1rem',
        padding: isPill ? '0.375rem 1.25rem' : '0.75rem 1rem',
        fontSize: isPill ? '0.875rem' : '0.95rem',
        fontWeight: 500,
        fontFamily: "'Barlow', sans-serif",
        textDecoration: 'none',
        alignItems: 'center',
        gap: isPill ? '0.25rem' : '0.375rem',
        whiteSpace: isPill ? 'nowrap' : undefined,
      }}
    >
      See CV
      <ArrowUpRight style={{ width: isPill ? '0.875rem' : '1rem', height: isPill ? '0.875rem' : '1rem' }} />
    </a>
  )
}
