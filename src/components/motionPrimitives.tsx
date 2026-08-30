import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The entrance system, retired on purpose (client's call, 24.08).
 *
 * The reveals used to hide content until it scrolled into view and wipe it
 * in. On a real visit that read as a LOADING BUG: photographs appeared to
 * pop in late and headings rose out of nowhere. Everything now renders
 * visible immediately; the page's motion budget is spent on the things
 * that answer scrolling directly (Lenis, the Panorama, BeforeAfter).
 *
 * The component API is unchanged so no call site had to move, and the file
 * stays the single place to reintroduce motion if that ever changes.
 */

/**
 * True until the prerendered page has been hydrated. Still exported because
 * main.tsx flips it; kept so a future entrance system inherits the same
 * first-paint contract.
 */
let firstPaint =
  typeof document !== 'undefined' && document.documentElement.dataset.prerendered === '1'

/** Called once React has taken over. */
export function markHydrated(): void {
  firstPaint = false
}

/** True when the visitor prefers reduced motion. Used by the Panorama. */
export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Static display heading, one span per line. */
export function LineReveal({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
}: {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  lineClassName?: string
  delay?: number
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn('block', lineClassName)}>
          {line}
        </span>
      ))}
    </Tag>
  )
}

/** Static block; the wipe entrance is retired. */
export function Wipe({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  from?: 'bottom' | 'left' | 'right'
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

/** Static hairline rule. */
export function DrawRule({
  className,
  dark = false,
}: {
  className?: string
  dark?: boolean
  delay?: number
}) {
  return <div className={cn(dark ? 'rule-dark' : 'rule', className)} aria-hidden />
}

/** Static block; the fade entrance is retired. */
export function FadeIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return <div className={className}>{children}</div>
}
