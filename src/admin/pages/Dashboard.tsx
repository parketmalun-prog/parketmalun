import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { LANG_NAME } from '@/i18n/config'
import { db } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { formatNumber, formatShortDate, percent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button, Card, PageHeader } from '../components/kit'
import { BarList, DayChart, StatTile, changePercent } from '../components/charts'
import { buildStats } from '../lib/stats'
import type { StatsInput } from '../lib/stats'
import { useAdmin } from '../context'

const RANGES = [7, 30, 90] as const
type Range = (typeof RANGES)[number]

export default function Dashboard() {
  const { t } = useAdmin()
  const [days, setDays] = useState<Range>(30)

  const { data, loading } = useAsync(
    async () => {
      // Two windows are pulled at once so the tiles can compare this period
      // with the one before it without a second round trip.
      const from = Date.now() - (days * 2 + 1) * 86_400_000
      const [visits, clicks, links, posts, enquiries] = await Promise.all([
        db.listVisits(from),
        db.listClicks(from),
        db.listLinks(),
        db.listPosts(),
        db.listEnquiries(),
      ])
      return { visits, clicks, links, posts, enquiries }
    },
    [days],
    'stats',
  )

  const labels = useMemo(
    () => ({
      direct: t.dashboard.direct,
      devices: { mobile: t.dashboard.mobile, tablet: t.dashboard.tablet, desktop: t.dashboard.desktop },
      languages: LANG_NAME,
    }),
    [t],
  )

  const { stats, previous } = useMemo(() => {
    if (!data) return { stats: null, previous: null }
    const base: Omit<StatsInput, 'offsetDays'> = {
      visits: data.visits,
      clicks: data.clicks,
      links: data.links,
      enquiries: data.enquiries,
      days,
      labels,
    }
    return { stats: buildStats(base), previous: buildStats({ ...base, offsetDays: days }) }
  }, [data, days, labels])

  const rangeLabel: Record<Range, string> = {
    7: t.dashboard.range7,
    30: t.dashboard.range30,
    90: t.dashboard.range90,
  }

  function exportCsv() {
    if (!stats) return
    const rows = [
      ['date', 'views', 'visits'],
      ...stats.days.map((d) => [d.key, String(d.views), String(d.visits)]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `expert-parket-stats-${days}d.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const publishedCount = data ? data.posts.filter((p) => p.status === 'published').length : 0
  const activeLinks = data ? data.links.filter((l) => !l.archived).length : 0

  return (
    <>
      <PageHeader
        title={t.dashboard.title}
        lead={t.dashboard.lead}
        actions={
          <>
            <div className="flex rounded-lg border border-line bg-paper p-1" role="group">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDays(r)}
                  aria-pressed={days === r}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
                    days === r ? 'bg-espresso text-cream' : 'text-taupe hover:text-espresso',
                  )}
                >
                  {rangeLabel[r]}
                </button>
              ))}
            </div>
            <Button onClick={exportCsv} disabled={!stats}>
              <Download className="h-4 w-4" />
              {t.dashboard.exportCsv}
            </Button>
          </>
        }
      />

      {loading || !stats || !previous ? (
        <p className="cap-label animate-pulse">{t.common.loading}</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile
              label={t.dashboard.visits}
              value={formatNumber(stats.views)}
              delta={changePercent(stats.views, previous.views)}
              deltaNote={t.dashboard.vsPrevious}
              note={rangeLabel[days]}
            />
            <StatTile
              label={t.dashboard.visitors}
              value={formatNumber(stats.visits)}
              delta={changePercent(stats.visits, previous.visits)}
              deltaNote={t.dashboard.vsPrevious}
            />
            <StatTile
              label={t.dashboard.enquiries}
              value={formatNumber(stats.enquiries)}
              delta={changePercent(stats.enquiries, previous.enquiries)}
              deltaNote={t.dashboard.vsPrevious}
            />
            <StatTile
              label={t.dashboard.conversion}
              value={stats.visits ? percent(stats.enquiries, stats.visits) : '0%'}
              note={`${formatNumber(stats.enquiries)} / ${formatNumber(stats.visits)}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile label={t.dashboard.today} value={formatNumber(stats.today)} />
            <StatTile label={t.dashboard.perDay} value={formatNumber(stats.perDay)} />
            <StatTile
              label={t.dashboard.campaignShare}
              value={percent(stats.campaignViews, stats.views)}
              note={`${formatNumber(stats.campaignViews)} / ${formatNumber(stats.views)}`}
            />
            <StatTile label={t.dashboard.links} value={formatNumber(activeLinks)} />
          </div>

          <Card title={t.dashboard.chart}>
            <DayChart
              points={stats.days}
              labelFor={(ts) => formatShortDate(ts)}
              viewsLabel={t.dashboard.visits}
              emptyLabel={t.dashboard.empty}
            />
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title={t.dashboard.topPages}>
              <BarList slices={stats.pages} emptyLabel={t.dashboard.empty} max={8} />
            </Card>
            <Card title={t.dashboard.sources}>
              <BarList slices={stats.sources} emptyLabel={t.dashboard.empty} max={8} />
            </Card>
          </div>

          <Card title={t.dashboard.campaigns}>
            {stats.campaigns.length === 0 ? (
              <p className="py-6 text-[15px] text-taupe">{t.links.empty}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="cap-label pb-2.5 font-medium">{t.links.label}</th>
                      <th className="cap-label pb-2.5 text-right font-medium">{t.links.clicks}</th>
                      <th className="cap-label pb-2.5 text-right font-medium">{t.links.visits}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.campaigns.map((c) => (
                      <tr key={c.code} className="border-b border-line last:border-0">
                        <td className="py-2.5 text-sm text-ink">
                          {c.label}
                          <span className="tnum pl-2 text-[12px] text-taupe">/l/{c.code}</span>
                        </td>
                        <td className="tnum py-2.5 text-right text-sm font-semibold text-espresso">
                          {formatNumber(c.clicks)}
                        </td>
                        <td className="tnum py-2.5 text-right text-sm text-taupe">{formatNumber(c.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title={t.dashboard.languages}>
              <BarList slices={stats.languages} emptyLabel={t.dashboard.empty} max={3} />
            </Card>
            <Card title={t.dashboard.devices}>
              <BarList slices={stats.devices} emptyLabel={t.dashboard.empty} max={3} />
            </Card>
            <Card title={t.dashboard.posts}>
              <p className="tnum font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-none text-espresso">
                {formatNumber(publishedCount)}
              </p>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
