import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Shared in-view hook with the anti-stuck failsafe: anything visible at first
 * paint force-reveals after 500ms even if the IntersectionObserver never
 * fires (flaky webviews, embedded panes). Off-screen content still waits.
 */
function useRevealState(ref: React.RefObject<HTMLElement>) {
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [failsafe, setFailsafe] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setFailsafe(true)
      return
    }
    const id = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setFailsafe(true)
    }, 500)
    return () => window.clearTimeout(id)
  }, [ref])

  return inView || failsafe
}

/**
 * LineReveal: display-heading entrance. Each line of the heading is wrapped
 * in an overflow-hidden strip and rises from 110% to 0. Pass the heading text
 * pre-split into lines; the component renders one strip per line.
 * Use ONLY on H1 / section H2s (motion is rationed by design).
 */
export function LineReveal({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  delay = 0,
}: {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  lineClassName?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const shown = useRevealState(ref)

  return (
    <div ref={ref}>
      <Tag className={className}>
        {lines.map((line, i) => (
          // The clip strip is padded at the bottom and pulled back up by the
          // same amount: descenders (g, j, p, y, þ) stay inside the clip box
          // instead of being sliced off, while line spacing is unchanged.
          <span key={i} className="-mb-[0.16em] block overflow-hidden">
            {reduce ? (
              <span className={cn('block pb-[0.16em]', lineClassName)}>{line}</span>
            ) : (
              <m.span
                className={cn('block pb-[0.16em]', lineClassName)}
                initial={{ y: '110%' }}
                animate={shown ? { y: '0%' } : { y: '110%' }}
                transition={{ duration: 0.75, delay: delay + i * 0.11, ease: EASE }}
              >
                {line}
              </m.span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  )
}

/**
 * Wipe: block/image entrance: clip-path inset wipe revealing from the top.
 * For PhotoSlots, espresso bars and panels. Never for body text.
 */
export function Wipe({
  children,
  className,
  delay = 0,
  from = 'bottom',
}: {
  children: ReactNode
  className?: string
  delay?: number
  from?: 'bottom' | 'left' | 'right'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const shown = useRevealState(ref)

  const hidden =
    from === 'left'
      ? 'inset(0 100% 0 0)'
      : from === 'right'
        ? 'inset(0 0 0 100%)'
        : 'inset(0 0 100% 0)'

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ clipPath: hidden }}
      animate={shown ? { clipPath: 'inset(0 0 0 0)' } : { clipPath: hidden }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </m.div>
  )
}

/**
 * DrawRule: a hairline rule drawing itself scaleX 0 → 1 from the left.
 * Used by SectionIndex; reusable for standalone rules.
 */
export function DrawRule({ className, dark = false, delay = 0 }: { className?: string; dark?: boolean; delay?: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const shown = useRevealState(ref)

  return (
    <div ref={ref} className={cn(dark ? 'rule-dark' : 'rule', className)} aria-hidden>
      {!reduce && (
        <m.div
          className={cn('h-px w-full -translate-y-px', dark ? 'bg-cream/15' : 'bg-espresso/15')}
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay, ease: EASE }}
        />
      )}
    </div>
  )
}

/**
 * FadeIn: quiet opacity-only entrance for the rare block that needs to
 * arrive with its section but is not a heading/panel (e.g. a lead sentence
 * directly under an H1). Use sparingly; body copy renders static.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const shown = useRevealState(ref)

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={shown ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
