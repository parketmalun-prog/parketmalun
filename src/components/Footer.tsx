import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { useLang, useUi } from '@/i18n/context'
import { Logo } from './Logo'

/**
 * PLANKI footer: continues the espresso closer band. Editorial link rows in
 * thin columns above a giant Fraunces wordmark set at viewport width, cropped
 * by the page baseline like a print masthead. No badges, no icon chips.
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
    { to: path('services'), label: t.nav.services },
    { to: path('contact'), label: t.nav.contact },
  ]

  return (
    <footer className="overflow-hidden bg-espresso text-cream">
      <div className="container-x">
        {/* brand row: the real logo plus the company line and the phone */}
        <div className="flex flex-col gap-8 py-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Logo tone="dark" className="w-fit" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/70">{t.footer.tagline}</p>
          </div>
          <div className="lg:text-right">
            <span className="cap-label-dark">{t.common.callNow}</span>
            <a
              href={`tel:${site.phoneRaw}`}
              className="tnum mt-1 block font-display text-4xl font-bold leading-none text-gold-bright transition-colors hover:text-cream"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 block text-sm text-cream/70 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* link columns */}
        <div className="rule-dark grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4">
          <div>
            <h3 className="cap-label-dark">{t.footer.hoursTitle}</h3>
            <ul className="tnum mt-4 space-y-2 text-sm text-cream/70">
              <li>{t.footer.hoursWeek}</li>
              <li>{t.footer.hoursWeekend}</li>
            </ul>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-sm text-cream/70 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright"
            >
              Facebook
            </a>
          </div>

          <FooterCol title={t.nav.services} links={serviceLinks} />
          <FooterCol title={t.footer.colCompany} links={companyLinks} />

          <div>
            <h3 className="cap-label-dark">{t.footer.colContact}</h3>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>
                <a href={`tel:${site.phoneRaw}`} className="tnum transition-colors hover:text-gold-bright">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-gold-bright">
                  {site.email}
                </a>
              </li>
              <li className="text-cream/55">{t.footer.areaLine}</li>
            </ul>
          </div>
        </div>

        {/* legal row */}
        <div className="rule-dark flex flex-col items-start justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row sm:items-center">
          <p className="tnum">
            © {year} {site.legalName} · {t.footer.rights}
          </p>
          <Link to={path('privacy')} className="underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright">
            {t.footer.privacyLabel}
          </Link>
        </div>
      </div>

      {/* giant wordmark, baseline-cropped. Sized so the whole line always
          fits inside the viewport (measured: ~10.2 glyph-widths per font-size
          unit for this string in Fraunces bold). */}
      <div className="relative select-none overflow-hidden" aria-hidden>
        <p className="-mb-[1.2vw] whitespace-nowrap text-center font-display text-[8.5vw] font-bold leading-[0.82] tracking-[-0.02em] text-cream/95">
          EXPERT <span className="italic text-gold-bright">PARKET</span>
        </p>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: Array<{ to: string; label: string }> }) {
  return (
    <div>
      <h3 className="cap-label-dark">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-cream/70 transition-colors hover:text-gold-bright">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
