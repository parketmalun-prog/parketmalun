import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { LANG_NAME } from '@/i18n/config'
import { db } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { formatNumber, formatShortDate, percent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button, Card } from '../components/kit'
import {
  BarList,
  DayChart,
  Figure,
  FigureStrip,
  HeadlineBand,
  HeadlineFigure,
  changePercent,
} from '../components/charts'
import { buildStats } from '../lib/stats'
import type { StatsInput } from '../lib/stats'
import { useAdmin } from '../context'

const RANGES = [7, 30, 90] as const
type Range = (typeof RANGES)[number]

/**
 * The overview. Three numbers the client actually runs the business on sit
 * in the dark band up top: how many people came, how many wrote in, and the
 * ratio between the two. Everything else is a supporting figure in the flat
 * strip below, then the trend and the breakdowns.
 */
export default function Dashboard() {
  const { t } = useAdmin()
  const [days, setDays] = useState<Range>(30)

  const { data, loading } = useAsync(
    async () => {
      // Two windows are pulled at once so the figures can compare this period
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

  const ranges = (
    <div className="flex rounded-full border border-cream/20 p-1" role="group">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setDays(r)}
          aria-pressed={days === r}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors',
            days === r ? 'bg-cream text-espresso' : 'text-cream/60 hover:text-cream',
          )}
        >
          {rangeLabel[r]}
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-5">
      <HeadlineBand period={rangeLabel[days]} title={t.dashboard.title} lead={t.dashboard.lead} controls={ranges}>
        <HeadlineFigure
          label={t.dashboard.visitors}
          value={stats ? formatNumber(stats.visits) : '0'}
          delta={stats && previous ? changePercent(stats.visits, previous.visits) : null}
          deltaNote={t.dashboard.vsPrevious}
        />
        <HeadlineFigure
          label={t.dashboard.enquiries}
          value={stats ? formatNumber(stats.enquiries) : '0'}
          delta={stats && previous ? changePercent(stats.enquiries, previous.enquiries) : null}
          deltaNote={t.dashboard.vsPrevious}
        />
        <HeadlineFigure
          label={t.dashboard.conversion}
          value={stats && stats.visits ? percent(stats.enquiries, stats.visits) : '0%'}
          note={stats ? `${formatNumber(stats.enquiries)} / ${formatNumber(stats.visits)}` : undefined}
        />
      </HeadlineBand>

      {loading || !stats || !previous ? (
        <p className="cap-label animate-pulse">{t.common.loading}</p>
      ) : (
        <>
          <FigureStrip>
            <Figure label={t.dashboard.visits} value={formatNumber(stats.views)} note={rangeLabel[days]} />
            <Figure label={t.dashboard.today} value={formatNumber(stats.today)} />
            <Figure label={t.dashboard.perDay} value={formatNumber(stats.perDay)} />
            <Figure
              label={t.dashboard.campaignShare}
              value={percent(stats.campaignViews, stats.views)}
              note={`${formatNumber(stats.campaignViews)} / ${formatNumber(stats.views)}`}
            />
            <Figure label={t.dashboard.links} value={formatNumber(activeLinks)} />
            <Figure label={t.dashboard.posts} value={formatNumber(publishedCount)} />
          </FigureStrip>

          <Card
            title={t.dashboard.chart}
            right={
              <Button size="sm" onClick={exportCsv}>
                <Download className="h-4 w-4" />
                {t.dashboard.exportCsv}
              </Button>
            }
          >
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Card title={t.dashboard.languages}>
              <BarList slices={stats.languages} emptyLabel={t.dashboard.empty} max={3} />
            </Card>
            <Card title={t.dashboard.devices}>
              <BarList slices={stats.devices} emptyLabel={t.dashboard.empty} max={3} />
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
