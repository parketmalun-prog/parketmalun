import { privacy as privacyByLang } from '@/data/privacy'
import { useContent } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { LineReveal, FadeIn } from '@/components/motionPrimitives'

/**
 * Privacy policy: quiet legal page in the print-masthead grammar. Article
 * opener (huge Fraunces title + one lead sentence), then a single reading
 * column where every clause opens with a numbered Fraunces h2 sitting on a
 * hairline rule. No Closer: the page ends quietly before the Footer.
 */
export default function Privacy() {
  const p = useContent(privacyByLang)

  return (
    <>
      <Seo title={p.seo.title} description={p.seo.description} />

      {/* Article opener */}
      <section className="container-x pt-14 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <LineReveal
              as="h1"
              lines={p.titleLines}
              className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
            />
            <FadeIn delay={0.25} className="mt-7">
              <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{p.lead}</p>
            </FadeIn>
            <p className="cap-label tnum mt-10">{p.updated}</p>
          </div>
        </div>
      </section>

      {/* Legal clauses: one reading column, numbered h2 on a hairline rule */}
      <section className="container-x pb-28 pt-16 sm:pb-40">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 max-w-[68ch] lg:col-span-9 lg:col-start-2">
            {p.sections.map((s, i) => (
              <section key={s.heading} className={i === 0 ? undefined : 'mt-14 sm:mt-16'}>
                <div className="rule" aria-hidden />
                <div className="flex items-baseline gap-3 pt-4">
                  <span className="tnum font-display text-base font-bold text-gold-deep">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-xl font-semibold leading-snug text-espresso sm:text-2xl">
                    {s.heading}
                  </h2>
                </div>
                {s.paragraphs?.map((par, j) => (
                  <p key={j} className="mt-4 leading-relaxed text-ink/80">
                    {par}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-4 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/80">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
