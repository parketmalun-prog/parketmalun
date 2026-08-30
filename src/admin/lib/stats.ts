import type { Lang } from '@/i18n/config'
import type { Device, Enquiry, LinkClick, TrackedLink, VisitEvent } from '@/lib/db'

/** Aggregations behind the dashboard. Pure functions, easy to reason about. */

export type DayPoint = { key: string; ts: number; views: number; visits: number }
export type Slice = { key: string; label: string; count: number }

export type Stats = {
  views: number
  visits: number
  perDay: number
  campaignViews: number
  enquiries: number
  /** Views recorded since local midnight, so "today" is the client's today. */
  today: number
  days: DayPoint[]
  pages: Slice[]
  sources: Slice[]
  languages: Slice[]
  devices: Slice[]
  campaigns: Array<{ code: string; label: string; clicks: number; views: number; archived: boolean }>
}

/** Local-midnight timestamp for a date, so buckets follow the client's day. */
function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function tally<T>(items: T[], pick: (item: T) => string | null): Map<string, number> {
  const counts = new Map<string, number>()
  for (const item of items) {
    const key = pick(item)
    if (key === null) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function toSlices(counts: Map<string, number>, label: (key: string) => string = (k) => k): Slice[] {
  return [...counts.entries()]
    .map(([key, count]) => ({ key, label: label(key), count }))
    .sort((a, b) => b.count - a.count)
}

export type StatsInput = {
  visits: VisitEvent[]
  clicks: LinkClick[]
  links: TrackedLink[]
  enquiries: Enquiry[]
  days: number
  /**
   * Shifts the window back by this many days. The dashboard builds the same
   * stats twice, once for now and once one window earlier, which is where the
   * up and down arrows on the tiles come from.
   */
  offsetDays?: number
  /** Labels for the language and device slices, supplied by the admin copy. */
  labels: { direct: string; devices: Record<Device, string>; languages: Record<Lang, string> }
}

export function buildStats({
  visits,
  clicks,
  links,
  enquiries,
  days,
  offsetDays = 0,
  labels,
}: StatsInput): Stats {
  const today = startOfDay(Date.now())
  const from = today - (days - 1 + offsetDays) * 86_400_000
  // Exclusive upper bound: without it the previous window would swallow the
  // current one and every comparison would read as flat.
  const until = offsetDays ? today - (offsetDays - 1) * 86_400_000 : Number.POSITIVE_INFINITY
  const within = (ts: number) => ts >= from && ts < until
  const inRange = visits.filter((v) => within(v.ts))
  const clicksInRange = clicks.filter((c) => within(c.ts))

  const buckets = new Map<string, DayPoint>()
  for (let i = 0; i < days; i++) {
    const ts = from + i * 86_400_000
    buckets.set(dayKey(ts), { key: dayKey(ts), ts, views: 0, visits: 0 })
  }
  for (const v of inRange) {
    const bucket = buckets.get(dayKey(v.ts))
    if (!bucket) continue
    bucket.views++
    if (v.entry) bucket.visits++
  }

  const views = inRange.length
  const entries = inRange.filter((v) => v.entry).length
  const campaignViews = inRange.filter((v) => v.ref).length

  const clicksByCode = tally(clicksInRange, (c) => c.code)
  const viewsByCode = tally(inRange, (v) => v.ref)
  const knownCodes = new Set([...clicksByCode.keys(), ...viewsByCode.keys(), ...links.map((l) => l.code)])

  return {
    views,
    visits: entries,
    perDay: days ? Math.round((views / days) * 10) / 10 : 0,
    campaignViews,
    enquiries: enquiries.filter((e) => within(e.ts)).length,
    today: visits.filter((v) => v.ts >= today).length,
    days: [...buckets.values()],
    pages: toSlices(tally(inRange, (v) => v.path)),
    sources: toSlices(tally(inRange, (v) => v.referrer ?? '__direct'), (key) =>
      key === '__direct' ? labels.direct : key,
    ),
    languages: toSlices(tally(inRange, (v) => v.lang), (key) => labels.languages[key as Lang] ?? key),
    devices: toSlices(tally(inRange, (v) => v.device), (key) => labels.devices[key as Device] ?? key),
    campaigns: [...knownCodes]
      .map((code) => {
        const link = links.find((l) => l.code === code)
        return {
          code,
          label: link?.label ?? code,
          clicks: clicksByCode.get(code) ?? 0,
          views: viewsByCode.get(code) ?? 0,
          archived: link?.archived ?? false,
        }
      })
      .sort((a, b) => b.clicks + b.views - (a.clicks + a.views)),
  }
}
