import { Link, useLocation } from 'react-router-dom'
import { useLang, useUi } from '@/i18n/context'
import { blogPostPath, parsePath, SITE_URL } from '@/i18n/config'
import { serviceDetails, serviceLabels } from '@/data/serviceDetails'
import type { ServiceRoute } from '@/data/serviceDetails'
import { services } from '@/data/services'
import { site, serviceKeys, serviceRoute } from '@/data/site'
import { photos } from '@/data/photos'
import { Seo } from '@/components/Seo'
import { PhotoSlot } from '@/components/PhotoSlot'
import { Button } from '@/components/Button'
import { TextLink } from '@/components/TextLink'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Closer } from '@/components/Closer'

const sandingGuideSlug = {
  is: 'parketslipun-verd-timi-undirbuningur',
  en: 'floor-sanding-iceland-cost-time-preparation',
  pl: 'cyklinowanie-parkietu-islandia-cena-czas-przygotowanie',
}

export default function ServiceDetail() {
  const { lang, path } = useLang()
  const t = useUi()
  const { pathname } = useLocation()
  const route = parsePath(pathname).key as ServiceRoute
  const detail = serviceDetails[lang][route]
  const key = serviceKeys.find((key) => serviceRoute[key] === route)!
  const service = services[lang].find((service) => service.key === key)!
  const labels = serviceLabels[lang]
  const url = SITE_URL + path(route)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', '@id': `${url}#service`, url,
        name: detail.heading, description: detail.description, serviceType: service.title,
        areaServed: { '@type': 'Country', name: 'Iceland' },
        provider: {
          '@type': 'HomeAndConstructionBusiness', '@id': `${SITE_URL}/#business`,
          name: site.legalName, url: SITE_URL, telephone: site.phoneRaw,
          image: `${SITE_URL}/og-card.jpg`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.nav.home, item: SITE_URL + path('home') },
          { '@type': 'ListItem', position: 2, name: t.nav.services, item: SITE_URL + path('services') },
          { '@type': 'ListItem', position: 3, name: service.title, item: url },
        ],
      },
    ],
  }

  return (
    <>
      <Seo title={detail.title} description={detail.description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <section className="container-x py-10 md:py-16">
        <nav aria-label={lang === 'is' ? 'Staðsetning á vef' : lang === 'pl' ? 'Ścieżka nawigacji' : 'Breadcrumb'} className="mb-10 flex flex-wrap gap-2 text-sm text-walnut">
          <Link to={path('home')} className="underline underline-offset-4">{t.nav.home}</Link>
          <span aria-hidden>/</span>
          <Link to={path('services')} className="underline underline-offset-4">{t.nav.services}</Link>
          <span aria-hidden>/</span><span aria-current="page">{service.title}</span>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="break-words font-display text-[clamp(2.5rem,5vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.02em] text-espresso">{detail.heading}</h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink/80">{detail.lead}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to={path('contact')}>{service.cta}</Button>
              <Button href={`tel:${site.phoneRaw}`} variant="outline">{site.phone}</Button>
            </div>
          </div>
          <PhotoSlot src={photos.craft[key]} alt={service.title} aspect="4/3" tone="sand" priority sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
      </section>

      <section className="container-x grid gap-12 py-12 lg:grid-cols-3 lg:py-20">
        <div className="space-y-10 lg:col-span-2">
          {detail.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold text-espresso md:text-3xl">{section.title}</h2>
              <p className="mt-4 max-w-[68ch] leading-relaxed text-ink/80">{section.body}</p>
            </section>
          ))}
        </div>
        <aside className="self-start bg-sand p-7 md:p-9">
          <h2 className="font-display text-2xl font-semibold text-espresso">{labels.included}</h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-ink/80">
            {service.includes.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <TextLink to={path('portfolio')} className="mt-8 inline-block">{labels.work}</TextLink>
          {key === 'parket' && <TextLink to={path('catalog')} className="mt-5 inline-block">{t.footer.linkCatalog}</TextLink>}
          {key === 'slipun' && <TextLink to={blogPostPath(lang, sandingGuideSlug[lang])} className="mt-5 inline-block">{labels.guide}</TextLink>}
        </aside>
      </section>

      <section className="bg-espresso py-14 text-cream md:py-20">
        <div className="container-x">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{labels.area}</h2>
          <p className="mt-5 max-w-[72ch] leading-relaxed text-cream/85">{labels.areaBody}</p>
          <TextLink to={path('contact')} dark className="mt-7 inline-block">{service.cta}</TextLink>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <h2 className="mb-10 text-center font-display text-3xl font-semibold text-espresso">{labels.faq}</h2>
        <FaqAccordion items={detail.faq} />
        <nav aria-label={labels.related} className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-espresso">{labels.related}</h2>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5">
            {serviceKeys.filter((other) => other !== key).map((other) => (
              <TextLink key={other} to={path(serviceRoute[other])}>{t.serviceFull[other]}</TextLink>
            ))}
          </div>
        </nav>
      </section>
      <Closer />
    </>
  )
}
