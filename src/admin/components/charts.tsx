import { cn } from '@/lib/utils'
import { formatNumber, percent } from '@/lib/format'
import type { DayPoint, Slice } from '../lib/stats'

/**
 * Two chart shapes cover everything the dashboard needs: a day column chart
 * for the trend and a ranked bar list for every breakdown. Both are plain
 * elements, so they reflow at any width and carry no charting dependency.
 */

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
                    point.views ? 'bg-espresso/85 group-hover:bg-gold-deep' : 'bg-line',
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
            className="absolute inset-y-0 left-0 bg-sand-light"
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

/** Headline number with a caption, used in the row of tiles up top. */
export function StatTile({
  label,
  value,
  note,
  delta,
  deltaNote,
}: {
  label: string
  value: string
  note?: string
  delta?: number | null
  deltaNote?: string
}) {
  return (
    <div className="rounded-xl border border-line bg-paper px-5 py-4">
      <p className="cap-label">{label}</p>
      <p className="tnum pt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-none text-espresso">
        {value}
      </p>
      {delta !== undefined && delta !== null ? (
        <p className="flex items-baseline gap-1.5 pt-2">
          <span
            className={cn(
              'tnum text-[13px] font-bold',
              delta > 0 ? 'text-positive' : delta < 0 ? 'text-danger' : 'text-taupe',
            )}
          >
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
          {deltaNote ? <span className="text-[12px] text-taupe">{deltaNote}</span> : null}
        </p>
      ) : note ? (
        <p className="pt-1.5 text-[13px] text-taupe">{note}</p>
      ) : null}
    </div>
  )
}
