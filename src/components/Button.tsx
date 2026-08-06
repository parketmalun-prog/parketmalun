import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'light' | 'gold' | 'ghost-light'
type Size = 'md' | 'lg'

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  icon?: ReactNode
}

type Props = BaseProps & {
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  ariaLabel?: string
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  light: 'btn-light',
  gold: 'btn-gold',
  'ghost-light': 'btn-ghost-light',
}

/** Square print-block button. No pills, no shimmer, no hover lift. */
export function Button({ variant = 'primary', size = 'md', className, children, icon, to, href, onClick, type = 'button', ariaLabel }: Props) {
  const classes = cn('btn', size === 'lg' ? 'btn-lg' : 'btn-md', variantClass[variant], className)
  const content = (
    <>
      {children}
      {icon}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }
  return (
    <button type={type} className={classes} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  )
}
