import { about as aboutByLang, aboutSeo as aboutSeoByLang } from '@/data/about'
import { useContent } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { PhotoSlot } from '@/components/PhotoSlot'
import { photos } from '@/data/photos'
import { imgSources } from '@/lib/img'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe } from '@/components/motionPrimitives'

export default function About() {
  const a = useContent(aboutByLang)
  const seo = useContent(aboutSeoByLang)

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* ============ OPENER + STORY: one grid ============
          Title, lead and paragraphs run down the left; the photograph starts
          UP TOP, level with the title, so the right half never sits empty
          (client, 2026-08-30). */}
      <section className="container-x pb-14 pt-10 md:pt-16">
        <div className="grid grid-cols-12 items-start gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 lg:col-span-6">
            <LineReveal
              as="h1"
              lines={a.titleLines}
              className="font-display text-[clamp(2.5rem,4.6vw,4.25rem)] font-bold leading-[0.96] tracking-[-0.02em] text-espresso"
            />
            <p className="max-w-[52ch] pt-6 text-lg leading-relaxed text-espresso-700">{a.lead}</p>
            <div className="space-y-5 pt-10">
              {a.story.paragraphs.map((p, i) => (
                <p key={i} className="max-w-[62ch] leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Wipe from="right">
              <PhotoSlot
                aspect="4/5"
                tone="espresso"
                src={photos.aboutOwner}
                alt={a.story.photoCaption}
                caption={a.story.photoCaption}
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Wipe>
          </div>
        </div>
      </section>

      {/* ============ VALUES LEDGER ============ */}
      <section className="container-x py-14 lg:py-20">
        <h2 className="pb-10 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {a.values.label}
        </h2>
        <div>
          {a.values.items.map((v, i) => (
            <div
              key={v.title}
              className="grid grid-cols-12 gap-x-4 border-t border-espresso/15 py-6 last:border-b last:border-espresso/15 md:gap-x-6"
            >
              <span className="tnum col-span-3 pt-1 text-sm font-semibold tracking-[0.1em] text-gold-deep sm:col-span-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="col-span-9 sm:col-span-3">
                <span className="font-display text-xl font-bold text-espresso">{v.title}</span>
              </span>
              <span className="col-span-9 col-start-4 pt-1.5 text-[15px] leading-relaxed text-taupe sm:col-span-7 sm:col-start-6 sm:pt-0.5">
                {v.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHY US: the photograph band ============
          The flat espresso ground and the outlined numerals went 2026-08-29;
          the worksite shot read as unclear and became the calm stock oak
          hallway (client, 2026-08-30). Numerals are plain gold sans digits. */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <img
          src={imgSources(photos.pano[0]).src}
          srcSet={imgSources(photos.pano[0]).srcSet || undefined}
          sizes="100vw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-espresso/75" aria-hidden />
        <div className="container-x relative z-10 py-16 lg:py-24">
          <LineReveal
            as="h2"
            lines={a.why.titleLines}
            className="pt-8 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.015em] text-cream"
          />
          <div className="mt-10">
            {a.why.items.map((w, i) => (
              <div
                key={w.title}
                className="grid grid-cols-12 gap-x-4 border-t border-cream/15 py-6 last:border-b last:border-cream/15 md:gap-x-6"
              >
                <span className="tnum col-span-3 pt-1 text-sm font-semibold tracking-[0.1em] text-gold-bright sm:col-span-2" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="col-span-9 sm:col-span-3">
                  <span className="font-display text-xl font-bold text-cream">{w.title}</span>
                </span>
                <span className="col-span-9 col-start-4 pt-1.5 text-[15px] leading-relaxed text-cream/70 sm:col-span-7 sm:col-start-6 sm:pt-0.5">
                  {w.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="container-x py-14 lg:py-20">
        <h2 className="pb-10 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-espresso">
          {a.faq.label}
        </h2>
        <FaqAccordion items={a.faq.items} />
      </section>

      <Closer />
    </>
  )
}
