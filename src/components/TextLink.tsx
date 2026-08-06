import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  to?: string
  href?: string
  children: ReactNode
  dark?: boolean
  className?: string
  ariaLabel?: string
}

/** Editorial underlined text link: 2px underline, grows and recolors gold on hover. */
export function TextLink({ to, href, children, dark = false, className, ariaLabel }: Props) {
  const classes = cn('u-link', dark && 'u-link-dark', className)
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
