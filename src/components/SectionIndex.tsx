import type { ReactNode } from 'react'

/**
 * What is left of the PLANKI section opener: an optional right-aligned slot
 * (a TextLink, a short support line) and nothing else. The index numbers and
 * labels went 2026-08-26, the hairline rule 2026-08-29, both at the client's
 * request; call sites that passed only those were removed with them.
 */
export function SectionIndex({ right, className }: { right?: ReactNode; className?: string }) {
  if (!right) return null
  return <div className={className ? className + ' flex justify-end' : 'flex justify-end'}>{right}</div>
}
