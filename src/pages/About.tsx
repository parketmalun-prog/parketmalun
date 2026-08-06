import { about as aboutByLang, aboutSeo as aboutSeoByLang } from '@/data/about'
import { useContent } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { SectionIndex } from '@/components/SectionIndex'
import { PhotoSlot } from '@/components/PhotoSlot'
import { Stamp } from '@/components/Stamp'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe, DrawRule } from '@/components/motionPrimitives'

export default function About() {
  const a = useContent(aboutByLang)
  const seo = useContent(aboutSeoByLang)

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* ============ ARTICLE OPENER ============ */}
      <section className="container-x pt-10 md:pt-16">
        <LineReveal
          as="h1"
          lines={a.titleLines}
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
        />
        <div className="grid grid-cols-12 gap-x-4 pb-12 pt-6 md:gap-x-6">
          <p className="col-span-12 max-w-[52ch] text-lg leading-relaxed text-espresso-700 md:col-span-7 lg:col-span-6 lg:col-start-2">
            {a.lead}
          </p>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="container-x relative py-4 lg:py-8">
        <div className="relative">
          <SectionIndex n="01" label={a.story.label} />
          {/* experience stamp overlapping the rule, desktop only */}
          <div className="absolute -top-14 right-8 hidden lg:block">
            <Stamp value="25+" ringText="ÁR Í FAGINU · EXPERT PARKET · " size={140} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-4 gap-y-10 pt-10 md:gap-x-6">
          <div className="col-span-12 space-y-5 lg:col-span-6 lg:col-start-2">
            {a.story.paragraphs.map((p, i) => (
              <p key={i} className="max-w-[62ch] leading-relaxed text-ink/80">
                {p}
              </p>
            ))}
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Wipe from="right">
              <PhotoSlot aspect="4/5" tone="espresso" caption={a.story.photoCaption} />
            </Wipe>
          </div>
        </div>
      </section>

      {/* ============ VALUES LEDGER ============ */}
      <section className="container-x py-14 lg:py-20">
        <SectionIndex n="02" label={a.values.label} />
        <div className="mt-10">
          {a.values.items.map((v, i) => (
            <div
              key={v.title}
              className="grid grid-cols-12 gap-x-4 border-t border-espresso/15 py-6 last:border-b last:border-espresso/15 md:gap-x-6"
            >
              <span className="tnum col-span-3 font-display text-sm font-bold text-gold-deep sm:col-span-2">
                {String(i + 1).padStart(2, '0')} / {String(a.values.items.length).padStart(2, '0')}
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

      {/* ============ WHY US: espresso band ============ */}
      <section className="bg-espresso text-cream">
        <div className="container-x py-16 lg:py-24">
          <SectionIndex n="03" label={a.why.label} dark />
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
                <span className="num-outline-dark tnum col-span-3 font-display text-4xl font-bold sm:col-span-2" aria-hidden>
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

      {/* ============ WORK PLATE: light counterweight to the espresso band ============ */}
      <section className="container-x pt-14 lg:pt-20">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 lg:col-span-8">
            <Wipe from="left">
              <PhotoSlot aspect="16/9" tone="sand" caption={a.why.photoCaption} className="lg:bleed-left" />
            </Wipe>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="container-x py-14 lg:py-20">
        <SectionIndex n="04" label={a.faq.label} right={<span className="cap-label tnum">{a.faq.support}</span>} />
        <div className="pt-10">
          <FaqAccordion items={a.faq.items} />
        </div>
        <div className="pt-14">
          <DrawRule />
        </div>
      </section>

      <Closer n="05" />
    </>
  )
}
