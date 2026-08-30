import { useEffect, useRef, useState } from 'react'
import {
  services as servicesByLang,
  servicesIntro as servicesIntroByLang,
  servicesSeo as servicesSeoByLang,
} from '@/data/services'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { PhotoSlot } from '@/components/PhotoSlot'
import { photos } from '@/data/photos'
import { imgSources } from '@/lib/img'
import { TextLink } from '@/components/TextLink'
import { Closer } from '@/components/Closer'
import { Wipe } from '@/components/motionPrimitives'

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


  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* ============ OPENER: the photograph band ============
          Big centred title on the craft photograph under a dark filter, one
          short line beneath it, nothing else: you see at once which section
          you are in (client, 2026-08-30). */}
      <section className="relative flex min-h-[46vh] items-center overflow-hidden bg-espresso text-cream md:min-h-[54vh]">
        <img
          src={imgSources(photos.services.parket).src}
          srcSet={imgSources(photos.services.parket).srcSet || undefined}
          sizes="100vw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-espresso/60" aria-hidden />
        <div className="container-x relative z-10 py-20 text-center">
          <h1 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] font-bold leading-[0.94] tracking-[-0.02em] text-cream">
            {intro.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-cream/85">{intro.lead}</p>
        </div>
      </section>

      {/* ============ 01 STICKY SERVICE LEDGER ============ */}
      <section className="container-x pb-16 lg:pb-24">
        <div className="grid grid-cols-12 gap-x-4 pt-10 md:gap-x-6 lg:pt-14">
          {/* sticky tonal column: the surface changes with the active trade.
              Just the photograph, larger, no caption and no counter row
              (client, 2026-08-30). */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[130px]">
              <Wipe from="left">
                <PhotoSlot
                  aspect="3/4"
                  tone={SERVICE_TONES[active % SERVICE_TONES.length]}
                  src={services[active] ? photos.craft[services[active].key] : undefined}
                  alt={services[active]?.title ?? ''}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Wipe>
            </div>
          </div>

          {/* scrolling service blocks */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {services.map((s, i) => (
              <article
                key={s.key}
                id={s.key}
                ref={(el) => {
                  blockRefs.current[i] = el
                }}
                className="border-b border-espresso/15 py-16 first:pt-0 lg:py-24"
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
                    <PhotoSlot
                    aspect="4/3"
                    tone={SERVICE_TONES[i % SERVICE_TONES.length]}
                    src={photos.craft[s.key]}
                    alt={s.title}
                    sizes="100vw"
                  />
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

      <Closer />
    </>
  )
}
