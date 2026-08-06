import { Fragment, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ServiceKey } from '@/data/site'
import {
  projects as projectsByLang,
  portfolioIntro as introByLang,
  portfolioBreak as breakByLang,
  portfolioSeo as seoByLang,
} from '@/data/portfolio'
import { useContent, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { PhotoSlot } from '@/components/PhotoSlot'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe, DrawRule } from '@/components/motionPrimitives'

type Filter = 'all' | ServiceKey

/**
 * Column span, top-offset and surface tone per frame, so the wall of prints
 * reads as a hung composition. The tone sequence never repeats back to back,
 * including across the wrap and across the espresso break after frame three:
 * espresso, sand, cream, [break], sand, walnut, cream.
 */
const FRAME_LAYOUT = [
  { span: 'lg:col-span-7', offset: '', aspect: '4/3', tone: 'espresso' },
  { span: 'lg:col-span-5', offset: 'lg:mt-16', aspect: '3/4', tone: 'sand' },
  // wide plate closes the first row instead of leaving half of it empty
  { span: 'lg:col-span-12', offset: '', aspect: '21/9', tone: 'cream' },
  { span: 'lg:col-span-5', offset: '', aspect: '3/4', tone: 'sand' },
  { span: 'lg:col-span-7', offset: 'lg:mt-16', aspect: '4/3', tone: 'walnut' },
  { span: 'lg:col-span-12', offset: '', aspect: '21/9', tone: 'cream' },
] as const

/** The full-bleed break sits after this many frames, when there are more to come. */
const BREAK_AFTER = 3

export default function Portfolio() {
  const projects = useContent(projectsByLang)
  const intro = useContent(introByLang)
  const brk = useContent(breakByLang)
  const seo = useContent(seoByLang)
  const t = useUi()
  const [filter, setFilter] = useState<Filter>('all')

  const filters: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: t.common.filterAll },
    { key: 'parket', label: t.serviceNames.parket },
    { key: 'slipun', label: t.serviceNames.slipun },
    { key: 'malun', label: t.serviceNames.malun },
  ]

  const visible = projects.filter((p) => filter === 'all' || p.service === filter)

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* ============ ARTICLE OPENER ============ */}
      <section className="container-x pt-10 md:pt-16">
        <LineReveal
          as="h1"
          lines={[intro.title]}
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
        />
        <div className="grid grid-cols-12 gap-x-4 pt-6 md:gap-x-6">
          <p className="col-span-12 max-w-[52ch] text-lg leading-relaxed text-espresso-700 md:col-span-7 lg:col-span-6 lg:col-start-2">
            {intro.lead}
          </p>
        </div>

        {/* filters as underlined text tabs, with a live tally on the right */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 pb-8 pt-10">
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2" role="group" aria-label={t.common.filterAll}>
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'text-sm font-semibold uppercase tracking-[0.1em] transition-colors',
                  filter === f.key
                    ? 'text-espresso underline decoration-gold decoration-2 underline-offset-8'
                    : 'text-taupe hover:text-espresso',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="cap-label tnum" aria-live="polite">
            {String(visible.length).padStart(2, '0')} {t.nav.portfolio}
          </p>
        </div>
        <DrawRule />
      </section>

      {/* ============ PASSE-PARTOUT GRID ============ */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
          {visible.map((p, i) => {
            const layout = FRAME_LAYOUT[i % FRAME_LAYOUT.length]
            return (
              <Fragment key={`${p.title}-${p.year}`}>
                <article className={cn('col-span-12 md:col-span-6', layout.span, layout.offset)}>
                  <Wipe>
                    {/* framed print with cream mat */}
                    <div className="border border-espresso/20 p-3 sm:p-3.5">
                      <PhotoSlot aspect={layout.aspect} tone={layout.tone} />
                    </div>
                  </Wipe>
                  {/* title plate under the frame */}
                  <div className="border-b border-espresso/15 pb-3.5 pt-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className="font-display text-xl font-bold leading-tight text-espresso">{p.title}</h2>
                      <span className="cap-label">{t.serviceNames[p.service]}</span>
                    </div>
                    <p className="cap-label tnum pt-1.5">
                      {p.location} · {p.year} · {p.wood}
                    </p>
                    <p className="max-w-[58ch] pt-3 text-[15px] leading-relaxed text-taupe">{p.description}</p>
                  </div>
                </article>

                {/* full-bleed espresso break: one wide plate mid-wall, then the grid resumes */}
                {i === BREAK_AFTER - 1 && visible.length > BREAK_AFTER ? (
                  <div className="col-span-12">
                    <Wipe className="bleed-left bleed-right">
                      <PhotoSlot aspect="21/9" tone="espresso" />
                    </Wipe>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-espresso/15 pb-3.5 pt-4">
                      <p className="cap-label tnum">{brk.caption}</p>
                      <p className="cap-label">{brk.note}</p>
                    </div>
                  </div>
                ) : null}
              </Fragment>
            )
          })}
        </div>

        {/* honest note about photography */}
        <p className="cap-label mx-auto max-w-2xl pt-14 text-center leading-relaxed">{t.portfolio.note}</p>
      </section>

      <Closer n="02" />
    </>
  )
}
