import { useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'
import {
  services as servicesByLang,
  servicesIntro as servicesIntroByLang,
  servicesSeo as servicesSeoByLang,
  servicesPriceNote as priceNoteByLang,
  servicesBand as servicesBandByLang,
} from '@/data/services'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { SectionIndex } from '@/components/SectionIndex'
import { PhotoSlot } from '@/components/PhotoSlot'
import { TextLink } from '@/components/TextLink'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe, DrawRule } from '@/components/motionPrimitives'

/**
 * One tone per trade so the sticky column changes surface as you scroll:
 * parket is the dark anchor, slípun the mid brown, málun the light beige.
 * Index-mapped, so it survives a reordered services array.
 */
const SERVICE_TONES = ['espresso', 'walnut', 'sand'] as const

export default function Services() {
  const services = useContent(servicesByLang)
  const intro = useContent(servicesIntroByLang)
  const seo = useContent(servicesSeoByLang)
  const priceNote = useContent(priceNoteByLang)
  const band = useContent(servicesBandByLang)
  const { path } = useLang()
  const t = useUi()

  // Sticky-column scrollytelling: track which service block is on screen so
  // the left photo slot caption follows along. Falls back to the first
  // service when IntersectionObserver is unavailable.
  const [active, setActive] = useState(0)
  const blockRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = blockRefs.current.indexOf(entry.target as HTMLElement)
            if (idx >= 0) setActive(idx)
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    blockRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const folio = `${String(active + 1).padStart(2, '0')} / ${String(services.length).padStart(2, '0')}`

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
        <div className="grid grid-cols-12 gap-x-4 pb-14 pt-6 md:gap-x-6">
          <p className="col-span-12 max-w-[52ch] text-lg leading-relaxed text-espresso-700 md:col-span-7 lg:col-span-6 lg:col-start-2">
            {intro.lead}
          </p>
        </div>
      </section>

      {/* ============ 01 STICKY SERVICE LEDGER ============ */}
      <section className="container-x pb-16 lg:pb-24">
        <SectionIndex n="01" label={intro.label} />
        <div className="grid grid-cols-12 gap-x-4 pt-10 md:gap-x-6 lg:pt-14">
          {/* sticky tonal column: the surface changes with the active trade */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-[130px]">
              <Wipe from="left">
                <PhotoSlot
                  aspect="3/4"
                  tone={SERVICE_TONES[active % SERVICE_TONES.length]}
                  caption={services[active]?.photoCaption}
                />
              </Wipe>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-espresso/15 pt-3">
                <span className="cap-label truncate">{services[active]?.title}</span>
                <span className="cap-label tnum shrink-0">{folio}</span>
              </div>
            </div>
          </div>

          {/* scrolling service blocks */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            {services.map((s, i) => (
              <article
                key={s.key}
                id={s.key}
                ref={(el) => {
                  blockRefs.current[i] = el
                }}
                className="border-b border-espresso/15 py-14 first:pt-0 lg:py-20"
              >
                <span
                  className="num-outline tnum block font-display text-[3.75rem] font-bold leading-[0.85] lg:text-[5rem]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="pt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.015em] text-espresso">
                  {s.title}
                </h2>
                <p className="max-w-[46ch] pt-3 text-base font-medium leading-relaxed text-walnut">{s.intro}</p>

                {/* tonal block inline on mobile where the sticky column is hidden */}
                <div className="pt-8 lg:hidden">
                  <Wipe>
                    <PhotoSlot aspect="4/3" tone={SERVICE_TONES[i % SERVICE_TONES.length]} caption={s.photoCaption} />
                  </Wipe>
                </div>

                <div className="space-y-4 pt-8">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="max-w-[62ch] leading-relaxed text-ink/80">
                      {p}
                    </p>
                  ))}
                </div>

                {/* hairline includes-ledger */}
                <ul className="mt-10 list-none p-0">
                  {s.includes.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-baseline gap-4 border-t border-espresso/15 py-3.5 transition-colors last:border-b last:border-espresso/15 hover:bg-sand-light"
                    >
                      <span className="cap-label tnum shrink-0">{String(j + 1).padStart(2, '0')}</span>
                      <span className="text-[15px] leading-relaxed text-espresso-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-9">
                  <TextLink to={path('contact')}>{s.cta}</TextLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT BAND ============ */}
      <section className="bg-espresso text-cream">
        <div className="container-x py-16 lg:py-24">
          <DrawRule dark />
          <div className="grid grid-cols-12 items-end gap-x-4 gap-y-10 pt-12 md:gap-x-6 lg:pt-16">
            <div className="col-span-12 lg:col-span-7">
              <LineReveal
                as="p"
                lines={[
                  <span key="band">
                    {band.line}
                    <em className="font-medium italic text-gold-bright">{band.italic}</em>
                  </span>,
                ]}
                className="font-display text-[clamp(1.9rem,4.2vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-cream"
              />
            </div>
            <div className="col-span-12 flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9 lg:items-end">
              <a
                href={`tel:${site.phoneRaw}`}
                className="tnum font-display text-[clamp(2.5rem,4.6vw,3.5rem)] font-bold leading-none text-cream transition-colors hover:text-gold-bright"
                aria-label={`${t.common.callPrefix} ${site.phone}`}
              >
                {site.phone}
              </a>
              <p className="cap-label-dark lg:text-right">{t.topbar.hours}</p>
            </div>
          </div>
          <div className="pt-12 lg:pt-16">
            <DrawRule dark delay={0.1} />
          </div>
        </div>
      </section>

      {/* ============ PRICE NOTE ============ */}
      <section className="bg-sand-light">
        <div className="container-x py-14 lg:py-16">
          <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
            <p className="tnum col-span-12 max-w-[62ch] text-base leading-relaxed text-espresso-700 lg:col-span-8 lg:col-start-2">
              {priceNote}
            </p>
          </div>
        </div>
      </section>

      <Closer n="02" />
    </>
  )
}
