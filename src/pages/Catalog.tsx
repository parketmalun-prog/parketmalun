import { useState } from 'react'
import { cn } from '@/lib/utils'
import { catalog as catalogByLang, catalogSeo as seoByLang } from '@/data/catalog'
import type { Product } from '@/data/catalog'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/Button'
import { ParquetSwatch } from '@/components/ParquetSwatch'
import { QuickRequestDialog } from '@/components/QuickRequestDialog'
import { Closer } from '@/components/Closer'
import { LineReveal } from '@/components/motionPrimitives'

/**
 * Material bench: four plank samples laid side by side, darkest first, so the
 * row reads as physical offcuts rather than a grid. Drawn from a tone per
 * species: the four grain photographs that used to sit here had no traceable
 * licence and left with the legal pass of 8 September 2026.
 */
const SAMPLES = [
  { key: 'Hnota', tone: '#6B4A32' },
  { key: 'Eik', tone: '#C09461' },
  { key: 'Askur', tone: '#D6C3A5' },
  { key: 'Fura', tone: '#E0C79A' },
] as const

/** Display names per language; the Icelandic word stays the photo key. */
const WOOD_LABELS: Record<string, Record<(typeof SAMPLES)[number]['key'], string>> = {
  is: { Hnota: 'Hnota', Eik: 'Eik', Askur: 'Askur', Fura: 'Fura' },
  en: { Hnota: 'Walnut', Eik: 'Oak', Askur: 'Ash', Fura: 'Pine' },
  pl: { Hnota: 'Orzech', Eik: 'Dąb', Askur: 'Jesion', Fura: 'Sosna' },
}

/**
 * The board, drawn in the pattern the product is sold in. See the note at the
 * top of ParquetSwatch for why this is a drawing and not the manufacturer's
 * photograph.
 */
function ProductSwatch({ product }: { product: Product }) {
  return (
    <ParquetSwatch
      tone={product.tone}
      pattern={product.pattern}
      className="absolute inset-0 h-full w-full"
    />
  )
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
              <figure key={sample.key} className="m-0 w-28 shrink-0 sm:w-32 md:w-36">
                <div className="relative aspect-[1/3] w-full overflow-hidden rounded-lg border border-espresso/10">
                  <ParquetSwatch tone={sample.tone} pattern="plank" className="absolute inset-0 h-full w-full" />
                </div>
                <figcaption className="tnum cap-label pt-2">{`${String(i + 1).padStart(2, '0')} · ${label}`}</figcaption>
              </figure>
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
          every card identical in shape and rhythm, image, name, tone, one
          button, all bottoms on the same line. The description and the spec
          ledger with its hairlines left the card; the quote dialog and the
          service pages carry the detail. The per-m2 figure left too (client,
          2026-09-04): the price comes from the visit, not the shelf. */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
          {visible.map((p) => (
            <article key={p.name} className="col-span-12 flex flex-col sm:col-span-6 lg:col-span-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                <ProductSwatch product={p} />
                {p.badge ? <span className="tape absolute left-3 top-3">{p.badge}</span> : null}
              </div>
              <div className="flex items-baseline justify-between gap-x-4 pt-4">
                <h2 className="font-display text-lg font-bold leading-tight text-espresso">{p.name}</h2>
                <span className="cap-label shrink-0">{p.woodTone}</span>
              </div>
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

      <Closer />
    </>
  )
}

