import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { home as homeByLang } from '@/data/home'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { SectionIndex } from '@/components/SectionIndex'
import { PhotoSlot } from '@/components/PhotoSlot'
import { TextLink } from '@/components/TextLink'
import { BeforeAfter } from '@/components/BeforeAfter'
import { Closer } from '@/components/Closer'
import { FaqAccordion } from '@/components/FaqAccordion'
import { LineReveal, Wipe, DrawRule, FadeIn } from '@/components/motionPrimitives'

/** Tonal rhythm for the portfolio strip so the row reads as a composition. */
const STRIP_TONES = ['espresso', 'sand', 'walnut', 'cream', 'espresso'] as const

export default function Home() {
  const content = useContent(homeByLang)
  const { path } = useLang()
  const t = useUi()

  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} />

      {/* ============ HERO ============ */}
      <section className="relative">
        {/* spine annotation, desktop only */}
        <p
          className="cap-label tnum absolute left-2 top-1/3 hidden origin-left rotate-90 whitespace-nowrap text-espresso/50 xl:block"
          aria-hidden
        >
          SÍMI · {site.phone}
        </p>

        <div className="container-x pt-10 md:pt-16">
          {/* Mobile stacks headline first, then the photo. On desktop the photo
              is absolutely placed at the right and the headline overlaps it. */}
          <div className="relative flex flex-col lg:block">
            {/* photo block: right side, sits under the headline's z */}
            <div className="relative z-0 order-2 mt-10 lg:absolute lg:right-0 lg:top-4 lg:order-none lg:mt-0 lg:w-[34%]">
              <Wipe from="right">
                <PhotoSlot aspect="4/5" tone="espresso" caption={content.hero.photoCaption} />
              </Wipe>
            </div>

            {/* three-word masthead */}
            <div className="relative z-10 order-1 lg:order-none">
              <LineReveal
                as="h1"
                lines={[
                  content.hero.lines[0],
                  content.hero.lines[1],
                  <span
                    key="malun"
                    // pb keeps the espresso block under the descender of "Málun."
                    className="block w-fit bg-espresso pb-[0.14em] pl-[0.35em] pr-[0.5em] pt-[0.04em] text-cream lg:min-w-[58%]"
                  >
                    {content.hero.lines[2]}
                  </span>,
                ]}
                className="font-display text-[clamp(3.25rem,10vw,8.5rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
              />
            </div>

            {/* lead + CTA */}
            <div className="order-3 grid grid-cols-12 gap-x-4 pt-10 md:gap-x-6 lg:order-none lg:pt-14">
              <div className="col-span-12 md:col-span-7 lg:col-span-5 lg:col-start-2">
                <FadeIn delay={0.35}>
                  <p className="max-w-[44ch] text-lg leading-relaxed text-espresso-700">{content.hero.lead}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <TextLink to={path('contact')}>{content.hero.cta}</TextLink>
                    <a
                      href={`tel:${site.phoneRaw}`}
                      className="tnum font-display text-3xl font-bold text-espresso transition-colors hover:text-gold-deep"
                      aria-label={`${t.common.callPrefix} ${site.phone}`}
                    >
                      {site.phone}
                    </a>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* data strip */}
          <div className="mt-14 lg:mt-20">
            <DrawRule />
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {content.hero.strip.map((cell, i) => (
                <div
                  key={cell.label}
                  className={`border-espresso/10 px-1 py-5 lg:px-5 ${i > 0 ? 'lg:border-l' : ''} ${i % 2 === 1 ? 'border-l' : ''}`}
                >
                  <dt className="cap-label">{cell.label}</dt>
                  <dd className="tnum m-0 pt-1 font-display text-base font-semibold text-espresso lg:text-lg">
                    {cell.value}
                  </dd>
                </div>
              ))}
            </dl>
            <DrawRule delay={0.15} />
          </div>
        </div>
      </section>

      {/* ============ 01 SERVICES LEDGER ============ */}
      <section className="container-x py-16 lg:py-24">
        <SectionIndex
          n="01"
          label={content.services.label}
          right={<TextLink to={path('services')}>{t.common.viewAllServices}</TextLink>}
        />
        <h2 className="pt-8 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-espresso">
          {content.services.title}
        </h2>

        <div className="mt-10">
          {content.services.items.map((s, i) => (
            <Link
              key={s.key}
              to={path('services', s.key)}
              className="group grid grid-cols-12 items-center gap-x-4 border-t border-espresso/15 py-7 transition-colors last:border-b last:border-espresso/15 hover:bg-sand-light md:gap-x-6"
            >
              <span className="num-outline tnum col-span-2 font-display text-5xl font-bold md:col-span-1 lg:text-6xl" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="col-span-10 md:col-span-4">
                <span className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-tight text-espresso">
                  {s.name}
                </span>
              </span>
              <span className="col-span-10 col-start-3 pt-2 text-[15px] leading-relaxed text-taupe md:col-span-5 md:col-start-6 md:pt-0">
                {s.line}
              </span>
              <span className="col-span-2 col-start-11 hidden justify-end md:flex">
                <span className="u-link" aria-hidden>
                  {t.common.readMore}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 02 WHY US ============ */}
      <section className="bg-sand-light">
        <div className="container-x py-14 lg:py-20">
          <SectionIndex n="02" label={content.why.label} />
          <h2 className="pt-8 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
            {content.why.title}
          </h2>
          <div className="mt-10 grid grid-cols-12 gap-x-4 md:gap-x-6">
            {content.why.items.map((item, i) => (
              <div
                key={item.title}
                className={`col-span-12 border-t border-espresso/20 py-6 md:col-span-4 ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <span className="tnum font-display text-sm font-bold text-gold-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="pt-2 font-display text-xl font-bold text-espresso">{item.title}</h3>
                <p className="max-w-[42ch] pt-2 text-[15px] leading-relaxed text-taupe">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 03 BEFORE / AFTER ============ */}
      <section className="container-x py-14 lg:py-20">
        <SectionIndex n="03" label={content.beforeAfter.label} />
        <div className="grid grid-cols-12 gap-x-4 gap-y-10 pt-10 md:gap-x-6">
          <div className="col-span-12 lg:col-span-8">
            <Wipe from="left">
              <BeforeAfter />
            </Wipe>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pl-4">
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-tight text-espresso">
              {content.beforeAfter.title}
            </h2>
            <ul className="mt-6 list-none p-0">
              {content.beforeAfter.lines.map((line, i) => (
                <li
                  key={i}
                  className="tnum border-t border-espresso/15 py-3.5 text-[15px] leading-relaxed text-espresso-700 last:border-b last:border-espresso/15"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ INTERLUDE BAND ============ */}
      <section className="bg-espresso">
        <div className="container-x flex min-h-[46vh] items-center py-20 lg:py-28">
          <LineReveal
            as="p"
            lines={[
              <span key="l">
                {content.interlude.before}
                <em className="font-medium italic text-gold-bright">{content.interlude.italic}</em>
              </span>,
            ]}
            className="font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-cream"
          />
        </div>
      </section>

      {/* ============ 04 PROCESS ============ */}
      <section className="container-x py-16 lg:py-24">
        <SectionIndex n="04" label={content.process.label} />
        <div className="grid grid-cols-12 gap-x-4 pt-8 md:gap-x-6">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-espresso">
              {content.process.title}
            </h2>
            <ol className="mt-10 max-w-3xl list-none p-0">
              {content.process.steps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-x-4 border-t border-espresso/15 py-6 last:border-b last:border-espresso/15"
                >
                  <span className="tnum col-span-3 font-display text-sm font-bold text-gold-deep sm:col-span-2">
                    {String(i + 1).padStart(2, '0')} / {String(content.process.steps.length).padStart(2, '0')}
                  </span>
                  <span className="col-span-9 sm:col-span-4">
                    <span className="font-display text-xl font-bold text-espresso">{step.title}</span>
                  </span>
                  <span className="col-span-9 col-start-4 pt-1.5 text-[15px] leading-relaxed text-taupe sm:col-span-6 sm:col-start-7 sm:pt-0.5">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ 05 PORTFOLIO STRIP ============ */}
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <SectionIndex
            n="05"
            label={content.portfolioStrip.label}
            right={<TextLink to={path('portfolio')}>{t.common.viewMoreProjects}</TextLink>}
          />
          <h2 className="pt-8 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-espresso">
            {content.portfolioStrip.title}
          </h2>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 md:gap-6">
          {content.portfolioStrip.captions.map((caption, i) => (
            <div
              key={caption}
              className={`shrink-0 snap-start ${i % 2 === 0 ? 'w-[72vw] sm:w-[44vw] lg:w-[32vw]' : 'w-[52vw] sm:w-[32vw] lg:w-[22vw]'}`}
            >
              <PhotoSlot aspect={i % 2 === 0 ? '4/3' : '3/4'} tone={STRIP_TONES[i % STRIP_TONES.length]} caption={caption} />
            </div>
          ))}
        </div>
      </section>

      {/* ============ 06 TESTIMONIALS ============ */}
      <section className="container-x py-14 lg:py-20">
        <SectionIndex n="06" label={content.testimonials.label} />
        <h2 className="pt-8 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {content.testimonials.title}
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-4 md:gap-x-6">
          {content.testimonials.items.map((item, i) => (
            <figure
              key={item.name}
              className={`col-span-12 m-0 border-t border-espresso/15 py-7 md:col-span-6 ${i % 2 === 1 ? 'md:border-l md:pl-6' : ''}`}
            >
              <blockquote className="m-0">
                <p className="max-w-[46ch] font-display text-lg italic leading-[1.5] text-espresso lg:text-xl">
                  {item.quote}
                </p>
              </blockquote>
              <figcaption className="cap-label pt-4">
                {item.name} · {item.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ 07 SERVICE AREA ============ */}
      <section className="bg-espresso text-cream">
        <div className="container-x py-16 lg:py-20">
          <SectionIndex n="07" label={content.area.label} dark />
          <div className="grid grid-cols-12 gap-x-4 gap-y-8 pt-8 md:gap-x-6">
            <div className="col-span-12 lg:col-span-5">
              <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.04] tracking-[-0.015em] text-cream">
                {content.area.title}
              </h2>
              <p className="max-w-[42ch] pt-4 text-[15px] leading-relaxed text-cream/70">{content.area.lead}</p>
            </div>
            <ul className="col-span-12 grid list-none grid-cols-2 gap-x-6 p-0 sm:grid-cols-3 lg:col-span-6 lg:col-start-7 lg:grid-cols-2">
              {content.area.places.map((place, i) => (
                <li key={place} className="border-t border-cream/15 py-3">
                  <span className="tnum cap-label-dark mr-2.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-base font-semibold text-cream">{place}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 08 FAQ ============ */}
      <section className="container-x py-16 lg:py-20">
        <SectionIndex n="08" label={content.faq.label} right={<TextLink to={path('about')}>{t.common.readMore}</TextLink>} />
        <h2 className="pb-10 pt-8 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {content.faq.title}
        </h2>
        <FaqAccordion items={content.faq.items} />
      </section>

      {/* ============ CLOSER ============ */}
      <Closer n="09" />
    </>
  )
}
