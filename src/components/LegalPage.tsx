import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { LegalContent } from '@/data/legal'
import { useLang, useUi } from '@/i18n/context'
import { isOptedOut, setOptedOut } from '@/lib/analytics'
import { Seo } from '@/components/Seo'
import { LineReveal, FadeIn } from '@/components/motionPrimitives'

/**
 * The one layout for every legal page: privacy, terms, cookies and the right
 * of withdrawal. Article opener (huge Fraunces title and one lead sentence),
 * then a single reading column where every clause opens with a numbered
 * Fraunces h2 on a hairline rule. No Closer: the page ends quietly before
 * the Footer.
 *
 * Extracted from Privacy.tsx on 8 September 2026 when the other three pages
 * arrived, so the four never drift apart. Two things were added for them: a
 * boxed block (the standard withdrawal form) and a named control (the
 * visit-count opt-out on the cookies page).
 */
export function LegalPage({ content: p }: { content: LegalContent }) {
  const { path } = useLang()

  return (
    <>
      <Seo title={p.seo.title} description={p.seo.description} />

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
                {s.block ? (
                  <div className="mt-5 border border-espresso/25 bg-sand/60 px-5 py-4">
                    {s.block.map((line) => (
                      <p key={line} className="py-1 text-[15px] leading-relaxed text-espresso">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
                {s.control === 'optout' ? <OptOutControl /> : null}
                {s.link ? (
                  <p className="mt-4">
                    <Link
                      to={path(s.link.key)}
                      className="font-semibold text-espresso underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-deep"
                    >
                      {s.link.label}
                    </Link>
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * The visit-count switch. It reads localStorage, which the prerender step
 * does not have, so the first render assumes counting is on and the real
 * value arrives after mount; that keeps the prerendered markup and the first
 * client render identical.
 */
function OptOutControl() {
  const t = useUi()
  const [off, setOff] = useState(false)

  useEffect(() => {
    setOff(isOptedOut())
  }, [])

  function toggle() {
    const next = !off
    setOptedOut(next)
    setOff(next)
  }

  return (
    <div className="mt-5 flex flex-col items-start gap-3 border border-espresso/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p role="status" aria-live="polite" className="text-[15px] leading-relaxed text-espresso">
        {off ? t.legal.countingOff : t.legal.countingOn}
      </p>
      <button type="button" onClick={toggle} className="btn btn-outline shrink-0">
        {off ? t.legal.turnCountingOn : t.legal.turnCountingOff}
      </button>
    </div>
  )
}
