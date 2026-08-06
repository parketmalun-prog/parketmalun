import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type QA = { q: string; a: string }

/** PLANKI accordion: hairline ledger rows, Fraunces questions, square plus mark. */
export function FaqAccordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="rule mx-auto max-w-3xl">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-espresso/15">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-baseline justify-between gap-4 py-5 text-left transition-colors hover:bg-sand-light/60"
              aria-expanded={isOpen}
            >
              <span className="flex items-baseline gap-3.5">
                <span className="tnum font-display text-sm font-bold text-gold-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-lg font-semibold text-espresso">{item.q}</span>
              </span>
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 translate-y-1 items-center justify-center border border-espresso/20 text-gold-deep transition-transform duration-300',
                  isOpen && 'rotate-45 border-gold-deep',
                )}
                aria-hidden
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-6 pl-9 leading-relaxed text-ink/75">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
