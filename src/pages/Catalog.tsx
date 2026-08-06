import { useState } from 'react'
import { cn, formatIsk } from '@/lib/utils'
import { catalog as catalogByLang, catalogSeo as seoByLang } from '@/data/catalog'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/Button'
import { PhotoSlot } from '@/components/PhotoSlot'
import { ParquetSwatch } from '@/components/ParquetSwatch'
import { QuickRequestDialog } from '@/components/QuickRequestDialog'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe, DrawRule } from '@/components/motionPrimitives'

/**
 * Material bench: four plank samples laid side by side. Tone follows the wood,
 * darkest first, so the row reads as physical offcuts rather than a grid.
 */
const SAMPLES = [
  { wood: 'Hnota', tone: 'espresso' },
  { wood: 'Eik', tone: 'walnut' },
  { wood: 'Askur', tone: 'sand' },
  { wood: 'Fura', tone: 'cream' },
] as const

export default function Catalog() {
  const content = useContent(catalogByLang)
  const seo = useContent(seoByLang)
  const t = useUi()
  const { path } = useLang()
  const [filter, setFilter] = useState<string>('all')
  /** Product name the visitor is requesting a quote for; null = dialog closed. */
  const [requestFor, setRequestFor] = useState<string | null>(null)

  const visible = content.products.filter((p) => filter === 'all' || p.category === filter)

  // Uneven specimen rhythm: the first product of the full list renders
  // double-width as the feature plank.
  const featureName = content.products[0]?.name

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* ============ ARTICLE OPENER ============ */}
      <section className="container-x pt-10 md:pt-16">
        <LineReveal
          as="h1"
          lines={[content.intro.title]}
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
        />
        <div className="grid grid-cols-12 gap-x-4 pt-6 md:gap-x-6">
          <p className="col-span-12 max-w-[52ch] text-lg leading-relaxed text-espresso-700 md:col-span-7 lg:col-span-6 lg:col-start-2">
            {content.intro.subtitle}
          </p>
        </div>
      </section>

      {/* ============ MATERIAL SAMPLE STRIP ============ */}
      <section className="container-x pt-12">
        <DrawRule />
        <div className="flex gap-4 overflow-x-auto py-6 md:gap-6">
          {SAMPLES.map((sample, i) => (
            <div key={sample.wood} className="w-28 shrink-0 sm:w-32 md:w-36">
              <PhotoSlot
                aspect="1/3"
                tone={sample.tone}
                label={sample.wood}
                caption={`${String(i + 1).padStart(2, '0')} · ${sample.wood}`}
              />
            </div>
          ))}
        </div>
        <DrawRule delay={0.1} />
      </section>

      {/* ============ FILTER TABS ============ */}
      <section className="container-x pt-10">
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2" role="group" aria-label={t.common.filterAll}>
          {[{ key: 'all', label: t.common.filterAll }, ...content.categories.map((c) => ({ key: c.key, label: c.label }))].map(
            (f) => (
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
            ),
          )}
        </div>
      </section>

      {/* ============ SPECIMEN SHEETS ============ */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
          {visible.map((p) => {
            const isFeature = p.name === featureName && filter === 'all'
            return (
              <article
                key={p.name}
                className={cn('col-span-12 sm:col-span-6', isFeature ? 'lg:col-span-8' : 'lg:col-span-4')}
              >
                <Wipe>
                  <div className="rounded-xl border border-espresso/15 bg-sand-light p-3.5">
                    <div className={cn('relative overflow-hidden rounded-lg', isFeature ? 'aspect-[21/9]' : 'aspect-[4/3]')}>
                      <ParquetSwatch tone={p.tone} pattern={p.pattern} className="absolute inset-0 h-full w-full" />
                      {p.badge ? <span className="tape absolute left-3 top-3">{p.badge}</span> : null}
                    </div>
                  </div>
                </Wipe>

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 pt-4">
                  <h2 className="font-display text-xl font-bold leading-tight text-espresso">{p.name}</h2>
                  <span className="cap-label">{p.woodTone}</span>
                </div>
                <p className="max-w-[52ch] pt-2 text-[14.5px] leading-relaxed text-taupe">{p.description}</p>

                {/* spec table */}
                <dl className="mt-4">
                  <SpecRow label={t.catalog.spec.thickness} value={p.thickness} />
                  <SpecRow label={t.catalog.spec.finish} value={p.finish} />
                  <SpecRow label={t.catalog.spec.bestFor} value={p.bestFor} />
                  <SpecRow label={t.catalog.spec.price} value={`${formatIsk(p.pricePerM2)} ${t.common.perM2}`} strong />
                </dl>

                {/* per-product quick request */}
                <button
                  type="button"
                  onClick={() => setRequestFor(p.name)}
                  className="btn btn-md btn-primary mt-5 w-full"
                  aria-label={`${t.common.getQuote}: ${p.name}`}
                >
                  {t.common.getQuote}
                </button>
              </article>
            )
          })}
        </div>

        {/* we can source more than shown */}
        <div className="mx-auto max-w-2xl pt-14 text-center">
          <p className="font-display text-lg font-semibold text-espresso">{t.catalog.ctaTitle}</p>
          <p className="pt-2 text-[15px] leading-relaxed text-taupe">{t.catalog.ctaSubtitle}</p>
          <div className="pt-6">
            <Button to={path('contact')} variant="outline">
              {t.nav.contact}
            </Button>
          </div>
        </div>
      </section>

      <QuickRequestDialog product={requestFor} onClose={() => setRequestFor(null)} />

      {/* ============ PRICE DISCLAIMER ============ */}
      <section className="bg-sand-light">
        <div className="container-x py-10">
          <DrawRule />
          <p className="tnum max-w-[62ch] pt-6 text-base leading-relaxed text-espresso-700">{content.intro.priceNote}</p>
          <div className="pt-6">
            <DrawRule delay={0.1} />
          </div>
        </div>
      </section>

      <Closer n="02" />
    </>
  )
}

function SpecRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-espresso/15 py-2 last:border-b last:border-espresso/15">
      <dt className="cap-label shrink-0">{label}</dt>
      <dd
        className={cn(
          'tnum m-0 text-right text-[13.5px] leading-snug',
          strong ? 'font-display text-base font-bold text-espresso' : 'text-espresso-700',
        )}
      >
        {value}
      </dd>
    </div>
  )
}
