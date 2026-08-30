import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { useLang, useUi } from '@/i18n/context'
import { reducedMotion } from './motionPrimitives'
import { subscribeScroll } from '@/lib/smoothScroll'
import { LogoMark } from './Logo'

/**
 * Footer, the beige plate (client's sketch, 2026-08-29): sand ground after
 * the dark Closer, the logo plaque on the left, ONE vertical hairline, and
 * the three link columns beside it. The old tagline, area line and CALL NOW
 * phone block are gone: the masthead and the Closer already carry every way
 * to reach us, and here the email simply lives under the Facebook link.
 * No horizontal rules anywhere; the page ends in the signage line.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const { path } = useLang()
  const t = useUi()

  const serviceLinks = [
    { to: path('services', 'parket'), label: t.serviceFull.parket },
    { to: path('services', 'slipun'), label: t.serviceFull.slipun },
    { to: path('services', 'malun'), label: t.serviceFull.malun },
    { to: path('catalog'), label: t.footer.linkCatalog },
  ]

  const companyLinks = [
    { to: path('about'), label: t.nav.about },
    { to: path('portfolio'), label: t.nav.portfolio },
    { to: path('blog'), label: t.nav.blog },
    { to: path('contact'), label: t.nav.contact },
  ]

  return (
    <footer className="overflow-hidden bg-sand text-espresso">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 py-14">
          <div className="col-span-12 lg:col-span-4">
            {/* the artwork straight on the sand, no plaque (client, 2026-08-29) */}
            <LogoMark className="h-24 sm:h-28" sizes="(min-width: 640px) 194px, 166px" />
          </div>

          {/* the one beautiful line: vertical, running the height of the row */}
          <div className="col-span-12 lg:col-span-8 lg:border-l lg:border-espresso/20 lg:pl-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
              <div>
                <h3 className="cap-label">{t.footer.hoursTitle}</h3>
                <ul className="tnum mt-4 space-y-2 text-sm text-espresso/75">
                  <li>{t.footer.hoursWeek}</li>
                  <li>{t.footer.hoursWeekend}</li>
                </ul>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block text-sm text-espresso/75 transition-colors hover:text-gold-deep"
                >
                  Facebook
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 block break-all text-sm text-espresso/75 transition-colors hover:text-gold-deep"
                >
                  {site.email}
                </a>
              </div>

              <FooterCol title={t.nav.services} links={serviceLinks} />
              <FooterCol title={t.footer.colCompany} links={companyLinks} />
            </div>
          </div>
        </div>

        {/* legal row, no rule above it */}
        <div className="flex flex-col items-start justify-between gap-2 pb-6 text-xs text-espresso/60 sm:flex-row sm:items-center">
          <p className="tnum">
            © {year} {site.legalName} · {t.footer.rights}
          </p>
          <Link
            to={path('privacy')}
            className="underline decoration-espresso/30 underline-offset-4 transition-colors hover:text-gold-deep"
          >
            {t.footer.privacyLabel}
          </Link>
        </div>
      </div>

      <GiantWordmark />
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: Array<{ to: string; label: string }> }) {
  return (
    <div>
      <h3 className="cap-label">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-espresso/75 transition-colors hover:text-gold-deep">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The signage line: EXPERT PARKET at full viewport width, shown WHOLE (the
 * baseline crop read as a bug). On the sand plate it prints espresso with
 * the second word in deep gold. When it scrolls into view the letters rise
 * one after another, left to right, and they do it EVERY time (client,
 * 2026-08-30): the Footer lives in the persistent Layout, so a play-once
 * flag would fire on one page and never again. The letters re-arm whenever
 * the line drops fully below the viewport (scrolling back up, or the jump
 * to the top on a route change), where the reset is invisible. Trigger is
 * the shared scroll source, not IntersectionObserver, same as the
 * Panorama. Reduced motion renders it settled.
 */
function GiantWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      setInView(true)
      return
    }
    const check = () => {
      const top = el.getBoundingClientRect().top
      if (top < window.innerHeight * 0.95) setInView(true)
      else if (top >= window.innerHeight) setInView(false)
    }
    check()
    return subscribeScroll(check)
  }, [])

  let letterIndex = 0
  return (
    <div ref={ref} className="relative select-none overflow-hidden" aria-hidden>
      <p className="flex justify-center whitespace-nowrap pb-[2.5vw] pt-[1vw] font-display text-[10.5vw] font-semibold uppercase leading-[0.9] tracking-[0.01em]">
        {(['EXPERT', 'PARKET'] as const).map((word, w) => (
          <span key={word} className={w === 0 ? 'text-espresso' : 'ml-[0.28em] text-gold-deep'}>
            {[...word].map((c, k) => (
              <span key={k} className="inline-block overflow-hidden align-bottom">
                <span
                  className="block will-change-transform"
                  style={{
                    transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
                    transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: `${letterIndex++ * 55}ms`,
                  }}
                >
                  {c}
                </span>
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  )
}
