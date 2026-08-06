import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DrawRule } from './motionPrimitives'

type Props = {
  /** Two-digit print index, e.g. "01". */
  n: string
  /** Small-caps label sitting next to the number on the rule. */
  label: string
  /** Optional right-aligned slot (a TextLink, a short support line). */
  right?: ReactNode
  dark?: boolean
  className?: string
}

/**
 * PLANKI section opener: a full-width hairline rule carrying the gold index
 * number + small-caps label, with an optional right-aligned slot. The only
 * permitted way to open a section. Headings follow as siblings.
 */
export function SectionIndex({ n, label, right, dark = false, className }: Props) {
  return (
    <div className={className}>
      <DrawRule dark={dark} />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-3">
        <p className={cn('flex items-baseline gap-2.5', dark ? 'text-cream' : 'text-espresso')}>
          <span className="tnum font-display text-base font-bold text-gold-deep">{n}</span>
          <span className={dark ? 'cap-label-dark' : 'cap-label'}>{label}</span>
        </p>
        {right ? <div className="flex items-baseline gap-4">{right}</div> : null}
      </div>
    </div>
  )
}
