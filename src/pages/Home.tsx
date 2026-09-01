import { home as homeByLang } from '@/data/home'
import { photos } from '@/data/photos'
import { imgSources } from '@/lib/img'
import { useContent, useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { PhotoSlot } from '@/components/PhotoSlot'
import { TextLink } from '@/components/TextLink'
import { BeforeAfter } from '@/components/BeforeAfter'
import { Closer } from '@/components/Closer'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Panorama } from '@/components/Panorama'
import { LineReveal, Wipe } from '@/components/motionPrimitives'
import { TradesShowcase } from '@/components/TradesShowcase'
import { ParallaxPhoto } from '@/components/ParallaxPhoto'

/** Tonal rhythm for the portfolio panorama so the row reads as a composition. */
const STRIP_TONES = ['espresso', 'sand', 'walnut', 'cream', 'espresso'] as const

export default function Home() {
  const content = useContent(homeByLang)
  const { path } = useLang()
  const t = useUi()
  const heroTall = imgSources(photos.hero)
  const heroWide = imgSources(photos.heroWide)

  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} />

      {/* ============ HERO: the photograph, full viewport ============
          It starts below the cream masthead rather than under it: the bar is
          the same cream row on every page now, so there is nothing to see
          through, and the picture keeps the whole screen that is left. */}
      <section className="relative flex min-h-[calc(100svh-64px)] flex-col justify-end overflow-hidden md:min-h-[calc(100svh-72px)]">
        {/* Art direction needs <picture>: a landscape crop from md up, the
            portrait file below. Every candidate is WebP, including the img's
            own src, so hydration cannot fall back to a second JPEG request.
            This image is the page's largest contentful paint. */}
        <picture className="pointer-events-none absolute inset-0 block">
          <source media="(min-width: 768px)" srcSet={heroWide.srcSet || heroWide.src} sizes="100vw" />
          <img
            src={heroTall.src}
            srcSet={heroTall.srcSet || undefined}
            sizes={heroTall.srcSet ? '100vw' : undefined}
            alt=""
            width={heroTall.width}
            height={heroTall.height}
            className="h-full w-full object-cover"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        {/* Scrim, weighted to the foot so the type always lands on ground
            rather than on a bright plank, but light enough that the floor
            itself stays the subject. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/45 to-espresso/15"
          aria-hidden
        />
        {/* Three words only, set on a diagonal across the picture: top left,
            dead centre, bottom right. Everything else (lead, buttons, phone)
            left the hero on 2026-08-26; the masthead already carries the
            number and the quote button, so the picture keeps the stage. */}
        {/* Each word makes its own entrance (client, 2026-08-26): the first
            slides in from the left, the second surfaces in place out of a
            blur, the third arrives from the right. The entrance transform
            lives on an INNER span so it never fights the outer span's
            positioning transforms; keyframes in index.css, stilled under
            prefers-reduced-motion. */}
        <h1 className="absolute inset-0 z-10 overflow-hidden font-display text-[length:calc(var(--masthead)*1.1)] font-semibold leading-none tracking-[-0.015em] text-cream">
          <span className="absolute left-[6vw] top-[13%] block">
            <span className="hero-w1 block">{content.hero.lines[0]}</span>
          </span>
          <span className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2">
            <span className="hero-w2 block">{content.hero.lines[1]}</span>
          </span>
          <span className="absolute bottom-[11%] right-[6vw] block italic text-gold-bright">
            <span className="hero-w3 block">{content.hero.lines[2]}</span>
          </span>
        </h1>
      </section>

      {/* ============ INTERLUDE: the gallery's introduction ============
          A quiet cream landing between the hero photograph and the pinned
          gallery (reference: elicyon.com's OUR PROJECTS plate): the title
          staggered across two lines in light capitals, one line of copy,
          the link. Without it the two photographs collided edge to edge. */}
      <section className="bg-cream">
        <div className="container-x py-24 text-center lg:py-32">
          <h2 className="mx-auto w-fit text-left font-display text-[clamp(2.2rem,5vw,4rem)] font-light uppercase leading-[1.12] tracking-[0.05em] text-espresso">
            {content.services.title.split(' ').length > 1 ? (
              <>
                <span className="block">{content.services.title.split(' ')[0]}</span>
                <span className="block pl-[1.6em]">
                  {content.services.title.split(' ').slice(1).join(' ')}
                </span>
              </>
            ) : (
              content.services.title
            )}
          </h2>
          <p className="mx-auto mt-8 max-w-[40ch] text-[15px] leading-relaxed text-taupe">
            {content.services.lead}
          </p>
          <div className="mt-8">
            <TextLink to={path('services')}>{t.common.viewAllServices}</TextLink>
          </div>
        </div>
      </section>

      {/* ============ SERVICES: the pinned trades gallery ============
          The gallery IS the section heading: each slide announces its trade
          in giant letters, so no title band sits above it (it read as a
          duplicate; removed 2026-08-26 at the client's request). */}
      <section id="thjonusta" className="bg-espresso text-cream">
        <TradesShowcase
          items={content.services.items}
          photosByKey={photos.services}
          cutoutsByKey={photos.servicesFg}
        />
      </section>

      {/* ============ 02 BEFORE / AFTER ============ */}
      <section className="container-x py-24 lg:py-36">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10 pt-10 md:gap-x-6">
          <div className="col-span-12 lg:col-span-8">
            <Wipe from="left">
              <BeforeAfter beforeSrc={photos.before} afterSrc={photos.after} />
            </Wipe>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pl-4">
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-tight text-espresso">
              {content.beforeAfter.title}
            </h2>
            {/* one search-friendly line naming the service and the region */}
            <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-taupe">{content.beforeAfter.lead}</p>
            <ul className="mt-9 list-none space-y-6 p-0">
              {content.beforeAfter.facts.map((f) => (
                <li key={f.k}>
                  <p className="font-display text-lg font-semibold leading-tight text-espresso">{f.k}</p>
                  <p className="tnum mt-1.5 max-w-[38ch] text-[15px] leading-relaxed text-taupe">{f.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ INTERLUDE: the statement over a photograph ============
          The flat espresso band read as a hole in the page (client,
          2026-08-29): now the words sit on the herringbone picture behind a
          heavy scrim, so the line keeps its contrast and the band its glow. */}
      <section className="relative overflow-hidden bg-espresso">
        <img
          src={imgSources(photos.pano[1]).src}
          srcSet={imgSources(photos.pano[1]).srcSet || undefined}
          sizes="100vw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-espresso/70" aria-hidden />
        <div className="container-x relative z-10 flex min-h-[46vh] items-center justify-center py-24 text-center lg:py-28">
          <LineReveal
            as="p"
            lines={[
              <span key="l">
                {content.interlude.before}
                <em className="italic text-gold-bright">{content.interlude.italic}</em>
              </span>,
            ]}
            className="mx-auto max-w-[16ch] font-display text-[clamp(2rem,5.4vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.015em] text-cream"
          />
        </div>
      </section>

      {/* ============ 03 PROCESS ============ */}
      <section className="container-x py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10 pt-8 md:gap-x-6">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-espresso">
              {content.process.title}
            </h2>
            <ol className="mt-10 list-none p-0">
              {content.process.steps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-x-4 border-t border-espresso/15 py-7 last:border-b last:border-espresso/15"
                >
                  <span className="col-span-12 sm:col-span-4">
                    <span className="font-display text-xl font-bold text-espresso">{step.title}</span>
                  </span>
                  <span className="col-span-12 pt-1.5 text-[15px] leading-relaxed text-taupe sm:col-span-8 sm:pt-0.5">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {/* the work itself, riding along the steps */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-[104px]">
              <Wipe from="right">
                <PhotoSlot
                aspect="3/4"
                tone="walnut"
                src={photos.services.slipun}
                alt={content.process.title}
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              </Wipe>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 PROJECTS PANORAMA: dark, scroll-driven ============ */}
      <Panorama
        className="bg-espresso text-cream"
        heading={
          <div className="container-x">
            {/* one link is enough: the strip already ends in its own
                view-more plate, and the floating duplicate read as clutter */}
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-cream">
              {content.portfolioStrip.title}
            </h2>
          </div>
        }
      >
        {content.portfolioStrip.captions.map((caption, i) => (
          <div
            key={caption}
            className={`shrink-0 snap-start ${i % 2 === 0 ? 'w-[78vw] sm:w-[54vw] lg:w-[44vw]' : 'w-[58vw] sm:w-[40vw] lg:w-[30vw]'}`}
          >
            <PhotoSlot
              aspect={i % 2 === 0 ? '4/3' : '3/4'}
              tone={STRIP_TONES[i % STRIP_TONES.length]}
              src={photos.pano[i % photos.pano.length]}
              alt={caption}
              caption={caption}
              captionDark
              sizes={i % 2 === 0 ? '(min-width: 1024px) 44vw, 78vw' : '(min-width: 1024px) 30vw, 58vw'}
            />
          </div>
        ))}
        <div className="flex w-[70vw] shrink-0 snap-start items-center justify-center lg:w-[30vw]">
          <TextLink to={path('portfolio')} dark>
            {t.common.viewMoreProjects}
          </TextLink>
        </div>
      </Panorama>

      {/* ============ 05 TESTIMONIALS ============ */}
      <section className="container-x py-20 lg:py-28">
        <h2 className="pt-8 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {content.testimonials.title}
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-4 md:gap-x-6">
          {content.testimonials.items.slice(0, 2).map((item) => (
            <figure key={item.name} className="col-span-12 m-0 border-t border-espresso/15 py-7 md:col-span-6">
              <blockquote className="m-0">
                <p className="max-w-[46ch] font-display text-lg font-medium leading-[1.45] text-espresso lg:text-xl">
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

      {/* ============ SERVICE AREA: on the photograph ============
          The break picture and the area block were merged (client,
          2026-08-29: the standalone text read as too much). One full-bleed
          band: the short title and the towns, over the picture, which now
          drifts against the scroll. On a phone the wide empty-room shot
          kept nothing recognisable in its narrow crop (client, 2026-09-01),
          so below md the band shows our own geometric parquet hallway
          instead, under a lighter scrim since the floor carries its own
          contrast. */}
      <section className="relative flex min-h-[48vh] items-center overflow-hidden md:min-h-[60vh]">
        <ParallaxPhoto src={photos.homeBreak} mobileSrc={photos.work.parket[1]} />
        <div className="absolute inset-0 bg-espresso/45 md:bg-espresso/60" aria-hidden />
        <div className="container-x relative z-10 py-20 text-center">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.04] tracking-[-0.015em] text-cream">
            {content.area.title}
          </h2>
          <p className="tnum mx-auto mt-6 max-w-[54ch] font-display text-lg font-semibold leading-relaxed text-cream/90">
            {content.area.places.join(' · ')}
          </p>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="container-x py-16 lg:py-24">
        <h2 className="pb-10 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {content.faq.title}
        </h2>
        <FaqAccordion items={content.faq.items} />
      </section>

      {/* ============ CLOSER ============ */}
      <Closer />
    </>
  )
}
