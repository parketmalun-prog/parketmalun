import { Fragment } from 'react'
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
import { SectionIndex } from '@/components/SectionIndex'
import { photos } from '@/data/photos'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe } from '@/components/motionPrimitives'

/**
 * The wall is hung by TRADE (client's call, 24.08): one chapter per service,
 * real photographs from that service's own jobs under each. Within a chapter
 * the two project plates share the row, then a wide mood plate closes it.
 */
const GROUP_ORDER: ServiceKey[] = ['parket', 'slipun', 'malun']

const FRAME_LAYOUT = [
  { span: 'lg:col-span-7', offset: '', aspect: '4/3', tone: 'espresso' },
  { span: 'lg:col-span-5', offset: 'lg:mt-16', aspect: '3/4', tone: 'sand' },
] as const

export default function Portfolio() {
  const projects = useContent(projectsByLang)
  const intro = useContent(introByLang)
  const brk = useContent(breakByLang)
  const seo = useContent(seoByLang)
  const t = useUi()

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

      {/* ============ ONE CHAPTER PER TRADE ============ */}
      {GROUP_ORDER.map((key, gi) => {
        const group = projects.filter((p) => p.service === key)
        const pool = photos.work[key]
        return (
          <Fragment key={key}>
            <section className="container-x pb-14 pt-4 lg:pb-20">
              <SectionIndex
                right={
                  <p className="cap-label tnum">
                    {String(group.length).padStart(2, '0')} {t.nav.portfolio}
                  </p>
                }
              />
              <div className="grid grid-cols-12 gap-x-4 gap-y-12 pt-10 md:gap-x-6">
                {group.map((p, i) => {
                  const layout = FRAME_LAYOUT[i % FRAME_LAYOUT.length]
                  return (
                    <article key={`${p.title}-${p.year}`} className={cn('col-span-12 md:col-span-6', layout.span, layout.offset)}>
                      <Wipe>
                        {/* framed print with cream mat */}
                        <div className="border border-espresso/20 p-3 sm:p-3.5">
                          <PhotoSlot
                            aspect={layout.aspect}
                            tone={layout.tone}
                            src={pool[i % pool.length]}
                            alt={`${p.title} · ${p.wood}`}
                            sizes={layout.span === 'lg:col-span-7' ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 41vw, 100vw'}
                          />
                        </div>
                      </Wipe>
                      {/* title plate under the frame, no rule (client, 2026-08-30) */}
                      <div className="pb-3.5 pt-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h2 className="font-display text-xl font-bold leading-tight text-espresso">{p.title}</h2>
                          <span className="cap-label">{t.serviceNames[p.service]}</span>
                        </div>
                        <p className="cap-label tnum pt-1.5">
                          {p.location} · {p.year} · {p.wood}
                        </p>
                        <p className="max-w-[58ch] pt-5 text-[15px] leading-relaxed text-taupe">{p.description}</p>
                      </div>
                    </article>
                  )
                })}

                {/* wide mood plate closes the chapter's row */}
                {pool.length > group.length ? (
                  <div className="col-span-12">
                    <Wipe>
                      <div className="border border-espresso/20 p-3 sm:p-3.5">
                        <PhotoSlot
                          aspect="21/9"
                          tone="cream"
                          src={pool[group.length % pool.length]}
                          alt={t.serviceNames[key]}
                          sizes="(min-width: 1280px) 1200px, 100vw"
                        />
                      </div>
                    </Wipe>
                  </div>
                ) : null}
              </div>
            </section>

            {/* full-bleed break between the first and second chapter */}
            {gi === 0 ? (
              <section className="container-x pb-14 lg:pb-20">
                <Wipe className="bleed-left bleed-right">
                  <PhotoSlot aspect="21/9" tone="espresso" src={photos.portfolioBreak} alt={brk.caption} sizes="100vw" />
                </Wipe>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3.5 pt-4">
                  <p className="cap-label tnum">{brk.caption}</p>
                  <p className="cap-label">{brk.note}</p>
                </div>
              </section>
            ) : null}
          </Fragment>
        )
      })}

      {/* honest note about photography */}
      <section className="container-x pb-16">
        <p className="cap-label mx-auto max-w-2xl text-center leading-relaxed">{t.portfolio.note}</p>
      </section>

      <Closer />
    </>
  )
}
