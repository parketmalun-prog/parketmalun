import { useState } from 'react'
import { cn, formatIsk } from '@/lib/utils'
import { catalog as catalogByLang, catalogSeo as seoByLang } from '@/data/catalog'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/Button'
import { PhotoSlot } from '@/components/PhotoSlot'
import { photos } from '@/data/photos'
import { ParquetSwatch } from '@/components/ParquetSwatch'
import { QuickRequestDialog } from '@/components/QuickRequestDialog'
import { Closer } from '@/components/Closer'
import { LineReveal } from '@/components/motionPrimitives'

/**
 * Material bench: four plank samples laid side by side. Tone follows the wood,
 * darkest first, so the row reads as physical offcuts rather than a grid.
 */
const SAMPLES = [
  { key: 'Hnota', tone: 'espresso' },
  { key: 'Eik', tone: 'walnut' },
  { key: 'Askur', tone: 'sand' },
  { key: 'Fura', tone: 'cream' },
] as const

/** Display names per language; the Icelandic word stays the photo key. */
const WOOD_LABELS: Record<string, Record<(typeof SAMPLES)[number]['key'], string>> = {
  is: { Hnota: 'Hnota', Eik: 'Eik', Askur: 'Askur', Fura: 'Fura' },
  en: { Hnota: 'Walnut', Eik: 'Oak', Askur: 'Ash', Fura: 'Pine' },
  pl: { Hnota: 'Orzech', Eik: 'Dąb', Askur: 'Jesion', Fura: 'Sosna' },
}

export default function Catalog() {
  const content = useContent(catalogByLang)
  const seo = useContent(seoByLang)
  const t = useUi()
  const { lang, path } = useLang()
  const [filter, setFilter] = useState<string>('all')
  /** Product name the visitor is requesting a quote for; null = dialog closed. */
  const [requestFor, setRequestFor] = useState<string | null>(null)

  const visible = content.products.filter((p) => filter === 'all' || p.category === filter)

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
        <p className="max-w-[52ch] pt-6 text-lg leading-relaxed text-espresso-700">{content.intro.subtitle}</p>
      </section>

      {/* ============ MATERIAL SAMPLE STRIP ============ */}
      <section className="container-x pt-16 lg:pt-20">
        <div className="flex gap-4 overflow-x-auto py-6 md:gap-6">
          {SAMPLES.map((sample, i) => {
            const label = WOOD_LABELS[lang][sample.key]
            return (
              <div key={sample.key} className="w-28 shrink-0 sm:w-32 md:w-36">
                <PhotoSlot
                  aspect="1/3"
                  tone={sample.tone}
                  label={label}
                  src={photos.grain[sample.key]}
                  alt={label}
                  sizes="144px"
                  caption={`${String(i + 1).padStart(2, '0')} · ${label}`}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* ============ FILTER TABS ============ */}
      <section className="container-x pt-14 lg:pt-16">
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
      {/* Shop shelf (client, 2026-08-29, reference the big fashion shops):
          every card identical in shape and rhythm, image, name, tone, price,
          one button, all bottoms on the same line. The description and the
          spec ledger with its hairlines left the card; the quote dialog and
          the service pages carry the detail. */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
          {visible.map((p) => (
            <article key={p.name} className="col-span-12 flex flex-col sm:col-span-6 lg:col-span-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <ParquetSwatch tone={p.tone} pattern={p.pattern} className="absolute inset-0 h-full w-full" />
                {p.badge ? <span className="tape absolute left-3 top-3">{p.badge}</span> : null}
              </div>
              <div className="flex items-baseline justify-between gap-x-4 pt-4">
                <h2 className="font-display text-lg font-bold leading-tight text-espresso">{p.name}</h2>
                <span className="cap-label shrink-0">{p.woodTone}</span>
              </div>
              <p className="tnum pt-1.5 text-[15px] font-semibold text-espresso">
                {formatIsk(p.pricePerM2)} {t.common.perM2}
              </p>
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => setRequestFor(p.name)}
                  className="btn btn-md btn-primary w-full"
                  aria-label={`${t.common.getQuote}: ${p.name}`}
                >
                  {t.common.getQuote}
                </button>
              </div>
            </article>
          ))}
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
          <p className="tnum max-w-[62ch] text-base leading-relaxed text-espresso-700">{content.intro.priceNote}</p>
        </div>
      </section>

      <Closer />
    </>
  )
}

