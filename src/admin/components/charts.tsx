import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { formatNumber, percent } from '@/lib/format'
import type { DayPoint, Slice } from '../lib/stats'

/**
 * The dashboard's shapes. Two charts cover every breakdown, a day column
 * chart for the trend and a ranked bar list for the rest, and two containers
 * carry the figures: an espresso band for the three numbers that matter and a
 * flat strip for the rest. All plain elements, no charting dependency.
 */

/* --------------------------------- band ---------------------------------- */

/**
 * The dark band at the top of the overview, cut like the site's own dark
 * sections: a finished floor behind an espresso wash, the figures in gold
 * serif on top. Three numbers, never more; anything that has to compete with
 * them belongs in the strip below.
 */
export function HeadlineBand({
  period,
  title,
  lead,
  controls,
  children,
}: {
  period: string
  title: string
  lead?: string
  controls?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-espresso text-cream">
      <img
        src="/photos/after-floor-640.webp"
        srcSet="/photos/after-floor-640.webp 640w, /photos/after-floor-900.webp 900w, /photos/after-floor-1400.webp 1400w"
        sizes="(min-width: 1024px) 1100px, 100vw"
        alt=""
        decoding="async"
        className="absolute inset-0 h-full w-full select-none object-cover opacity-30"
        draggable={false}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-espresso via-espresso/90 to-espresso/60" />

      <div className="relative px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <p className="cap-label-dark">{period}</p>
            {/* Explicit cream: a base rule paints every h1 espresso, which vanishes on this ground. */}
            <h1 className="pt-2 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none text-cream">
              {title}
            </h1>
            {lead ? <p className="max-w-[52ch] pt-3 text-[14px] leading-relaxed text-cream/65">{lead}</p> : null}
          </div>
          {controls}
        </div>

        <div className="mt-7 grid gap-6 border-t border-cream/15 pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-cream/15">
          {children}
        </div>
      </div>
    </section>
  )
}

/** One of the three figures in the band. */
export function HeadlineFigure({
  label,
  value,
  delta,
  deltaNote,
  note,
}: {
  label: string
  value: string
  delta?: number | null
  deltaNote?: string
  note?: string
}) {
  return (
    <div className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <p className="cap-label-dark">{label}</p>
      {/* Grotesk, not the display serif. Fraunces ships here with its optical
          size pinned to the display end, and at figure sizes its hairlines go
          thin enough that a number stops reading as a number. The grotesk is
          the other half of the site's own pair, so this stays in the family
          and gains the weight these need. */}
      <p className="tnum pt-2 font-sans text-[clamp(2.75rem,7vw,4rem)] font-bold leading-none tracking-tight text-gold-bright">
        {value}
      </p>
      <p className="flex items-baseline gap-2 pt-2.5 text-[13px] text-cream/55">
        {delta !== undefined && delta !== null ? (
          <>
            <span className={cn('tnum font-bold', delta > 0 ? 'text-cream' : delta < 0 ? 'text-gold-bright' : '')}>
              {delta > 0 ? '+' : ''}
              {delta}%
            </span>
            {deltaNote}
          </>
        ) : (
          (note ?? ' ')
        )}
      </p>
    </div>
  )
}

/* --------------------------------- strip --------------------------------- */

/**
 * The secondary figures, one flat strip with hairlines between the cells
 * instead of a field of boxes. The hairlines are the gaps of a grid painted
 * on a line-coloured ground, so they stay right at every column count without
 * a single border rule to keep in step.
 */
export function FigureStrip({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-line">
      <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">{children}</div>
    </div>
  )
}

/** One cell of the strip. Every cell holds the same three lines so the row keeps one height. */
export function Figure({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex flex-col justify-between gap-2 bg-paper px-4 py-4 sm:px-5">
      {/* Two lines reserved for the label, so a long one does not push its value below the others'. */}
      <p className="cap-label min-h-[2.4em] leading-tight">{label}</p>
      <p className="tnum font-sans text-[1.75rem] font-bold leading-none tracking-tight text-espresso">{value}</p>
      <p className="tnum text-[12px] leading-none text-taupe">{note ?? ' '}</p>
    </div>
  )
}

/* --------------------------------- charts -------------------------------- */

export function DayChart({
  points,
  labelFor,
  viewsLabel,
  emptyLabel,
}: {
  points: DayPoint[]
  labelFor: (ts: number) => string
  viewsLabel: string
  emptyLabel: string
}) {
  const max = Math.max(1, ...points.map((p) => p.views))
  const total = points.reduce((sum, p) => sum + p.views, 0)

  if (!total) {
    return <p className="py-10 text-center text-[15px] text-taupe">{emptyLabel}</p>
  }

  return (
    <div>
      <div className="flex items-baseline justify-between pb-3">
        <span className="cap-label">{viewsLabel}</span>
        <span className="tnum cap-label">{formatNumber(max)}</span>
      </div>

      <div className="relative">
        <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dashed border-line" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        <ul className="relative flex h-44 items-end gap-[2px]">
          {points.map((point) => {
            const height = (point.views / max) * 100
            return (
              <li key={point.key} className="group relative flex h-full flex-1 items-end">
                <div
                  className={cn(
                    'w-full rounded-t-[3px] transition-colors',
                    point.views ? 'bg-gold group-hover:bg-espresso' : 'bg-line',
                  )}
                  style={{ height: point.views ? `${Math.max(height, 3)}%` : '2px' }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-espresso px-2.5 py-1.5 text-[12px] font-medium text-cream group-hover:block">
                  <span className="tnum">{labelFor(point.ts)}</span>
                  <span className="tnum pl-2 text-gold-bright">{formatNumber(point.views)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex justify-between pt-2.5">
        <span className="cap-label tnum">{labelFor(points[0].ts)}</span>
        <span className="cap-label tnum">{labelFor(points[points.length - 1].ts)}</span>
      </div>
    </div>
  )
}

export function BarList({
  slices,
  emptyLabel,
  max = 6,
  suffix,
}: {
  slices: Slice[]
  emptyLabel: string
  max?: number
  suffix?: string
}) {
  if (!slices.length) return <p className="py-6 text-[15px] text-taupe">{emptyLabel}</p>

  const total = slices.reduce((sum, s) => sum + s.count, 0)
  const top = slices.slice(0, max)
  const peak = Math.max(...top.map((s) => s.count))

  return (
    <ul className="space-y-1.5">
      {top.map((slice) => (
        <li key={slice.key} className="relative overflow-hidden rounded-md">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 bg-gold/20"
            style={{ width: `${(slice.count / peak) * 100}%` }}
          />
          <div className="relative flex items-baseline justify-between gap-4 px-3 py-2">
            <span className="truncate text-sm text-ink" title={slice.label}>
              {slice.label}
            </span>
            <span className="tnum shrink-0 text-sm font-semibold text-espresso">
              {formatNumber(slice.count)}
              {suffix ? <span className="pl-1 font-normal text-taupe">{suffix}</span> : null}
              <span className="pl-2 text-[12px] font-normal text-taupe">{percent(slice.count, total)}</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Percentage change against the previous window.
 *
 * `null` means the comparison is not meaningful: the earlier window had no
 * data at all, and "up 100%" from zero tells the client nothing.
 */
export function changePercent(current: number, previous: number): number | null {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}
