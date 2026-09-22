import { LANGS, HTML_LANG, OG_LOCALE, SITE_URL, blogPostPath, pathFor } from '@/i18n/config'
import type { Lang, RouteKey } from '@/i18n/config'
import type { PageKey } from '@/routes'
import { ui } from '@/i18n/ui'
import { site } from '@/data/site'
import { home } from '@/data/home'
import { servicesSeo } from '@/data/services'
import { serviceDetails } from '@/data/serviceDetails'
import { serviceKeys, serviceRoute } from '@/data/site'
import { portfolioSeo } from '@/data/portfolio'
import { catalogSeo } from '@/data/catalog'
import { about, aboutSeo } from '@/data/about'
import { contactSeo } from '@/data/contact'
import { privacy } from '@/data/privacy'
import { terms, cookies, withdrawal } from '@/data/legal'
import { publicPostSeed } from '@/lib/publicPosts'
import { photoManifest } from '@/data/photoManifest'
import { isTranslated } from '@/lib/db'
import { plainText } from '@/lib/markdown'

/**
 * Everything the prerender step needs to write a complete <head> for a page.
 *
 * The React `<Seo>` component does the same job for in-app navigation. This
 * module is the build-time half: it runs in Node, so it reads the page data
 * directly instead of going through a component.
 */
export type PrerenderRoute = {
  /** URL path, e.g. `/en/services` */
  path: string
  /**
   * Which page component renders this route. The prerender step uses it to
   * look the route's JavaScript chunk up in the build manifest, so the
   * finished HTML can preload its own code instead of leaving the browser to
   * discover it after the entry bundle has parsed.
   */
  page: PageKey
  lang: Lang
  title: string
  description: string
  /** Per-language equivalents of this page, for hreflang */
  alternates: Partial<Record<Lang, string>>
  /** Structured data blocks, serialised into script tags */
  jsonLd: object[]
  image?: string
  imageAlt?: string
  lastModified?: string
}

/** Absolute URL. The root keeps its slash so canonical and sitemap agree. */
const abs = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`
const LOGO = `${SITE_URL}/logo.webp`
/** Opaque 1200x630 card. schema.org `image` wants a picture, not a cutout. */
const SHARE_CARD = `${SITE_URL}/og-card.jpg`

/** The company itself. Referenced by id from the other blocks. */
function organisation(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#business`,
    name: site.legalName,
    telephone: `+354 ${site.phone}`,
    email: site.email,
    url: SITE_URL,
    logo: LOGO,
    image: SHARE_CARD,
    areaServed: { '@type': 'Country', name: 'Iceland' },
    // Registration details as entered in fyrirtaekjaskra, see site.ts.
    taxID: site.kennitala,
    vatID: site.vsk,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postal.split(' ')[0],
      addressLocality: site.postal.split(' ').slice(1).join(' '),
      addressRegion: 'Höfuðborgarsvæðið',
      addressCountry: 'IS',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    sameAs: [site.facebook, site.instagram],
  }
}

function breadcrumb(lang: Lang, name: string, path: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui[lang].nav.home, item: abs(pathFor('home', lang)) },
      { '@type': 'ListItem', position: 2, name, item: abs(path) },
    ],
  }
}

function servicesSchema(lang: Lang): object[] {
  const names = ui[lang].serviceFull
  return serviceKeys.map((key) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: names[key],
    url: abs(pathFor(serviceRoute[key], lang)),
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: { '@type': 'Country', name: 'Iceland' },
    serviceType: names[key],
  }))
}

function faqSchema(lang: Lang): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: about[lang].faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/** Head data for the fixed pages, per language. */
function seoFor(key: RouteKey, lang: Lang): { title: string; description: string } {
  switch (key) {
    case 'home':
      return home[lang].seo
    case 'services':
      return servicesSeo[lang]
    case 'installation':
    case 'sanding':
    case 'painting':
      return serviceDetails[lang][key]
    case 'portfolio':
      return portfolioSeo[lang]
    case 'catalog':
      return catalogSeo[lang]
    case 'about':
      return aboutSeo[lang]
    case 'contact':
      return contactSeo[lang]
    case 'privacy':
      return privacy[lang].seo
    case 'terms':
      return terms[lang].seo
    case 'cookies':
      return cookies[lang].seo
    case 'withdrawal':
      return withdrawal[lang].seo
    case 'blog':
      return { title: ui[lang].blog.seoTitle, description: ui[lang].blog.seoDescription }
  }
}

const FIXED_KEYS: RouteKey[] = [
  'home',
  'services',
  'installation',
  'sanding',
  'painting',
  'portfolio',
  'catalog',
  'blog',
  'about',
  'contact',
  'privacy',
  'terms',
  'cookies',
  'withdrawal',
]

function extraSchema(key: RouteKey, lang: Lang, path: string): object[] {
  // ServiceDetail renders its own schema in SSR and during browser navigation.
  if (key === 'installation' || key === 'sanding' || key === 'painting') return []
  const label = key === 'home' ? null : ui[lang].nav[key as 'services'] ?? seoFor(key, lang).title
  const crumbs = label ? [breadcrumb(lang, label, path)] : []
  switch (key) {
    case 'home':
      return [organisation(), {
        '@context': 'https://schema.org', '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`,
        name: site.name, alternateName: 'ExpertParket',
        inLanguage: LANGS.map((lang) => HTML_LANG[lang]),
        publisher: { '@id': `${SITE_URL}/#business` },
      }]
    case 'services':
      return [...crumbs, ...servicesSchema(lang)]
    case 'about':
      return [...crumbs, faqSchema(lang)]
    case 'contact':
      return [...crumbs, organisation()]
    default:
      return crumbs
  }
}

/** Every page the build writes to disk. */
export const PRERENDER_ROUTES: PrerenderRoute[] = [
  ...FIXED_KEYS.flatMap((key) =>
    LANGS.map((lang) => {
      const path = pathFor(key, lang)
      const seo = seoFor(key, lang)
      return {
        path,
        page: key as PageKey,
        lang,
        title: seo.title,
        description: seo.description,
        alternates: Object.fromEntries(LANGS.map((l) => [l, pathFor(key, l)])),
        jsonLd: extraSchema(key, lang, path),
      }
    }),
  ),
  // Published articles. Only the languages an article is actually translated
  // into get a file: a half-translated post must not exist as a URL.
  ...publicPostSeed
    .filter((post) => post.status === 'published')
    .flatMap((post) =>
      LANGS.filter((lang) => isTranslated(post, lang)).map((lang) => {
        const tr = post.translations[lang]
        const path = blogPostPath(lang, tr.slug)
        return {
          path,
          page: 'blogPost' as PageKey,
          lang,
          title: tr.seoTitle || `${tr.title} | ${site.name}`,
          description: tr.seoDescription || tr.excerpt || plainText(tr.body),
          image: post.cover ?? undefined,
          imageAlt: tr.coverAlt,
          lastModified: new Date(post.updatedAt).toISOString().slice(0, 10),
          alternates: Object.fromEntries(
            LANGS.filter((l) => isTranslated(post, l)).map((l) => [
              l,
              blogPostPath(l, post.translations[l].slug),
            ]),
          ),
          // BlogPost renders its schema in the article for SSR and in-app visits.
          jsonLd: [],
        }
      }),
    ),
]

/** The `<head>` markup for one route, shared by the prerender script. */
export function headTags(route: PrerenderRoute): string {
  const canonical = abs(route.path)
  const image = route.image ? new URL(route.image, SITE_URL).href : SHARE_CARD
  const dimensions = route.image ? photoManifest[route.image] : { w: 1200, h: 630 }
  const esc = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const alternates = LANGS.filter((l) => route.alternates[l]).map(
    (l) =>
      `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${abs(route.alternates[l] ?? pathFor('home', l))}">`,
  )
  alternates.push(
    `<link rel="alternate" hreflang="x-default" href="${abs(route.alternates.is ?? route.path)}">`,
  )

  const otherLocales = LANGS.filter((l) => l !== route.lang).map(
    (l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`,
  )

  return [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    ...alternates,
    `<meta property="og:title" content="${esc(route.title)}">`,
    `<meta property="og:description" content="${esc(route.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:locale" content="${OG_LOCALE[route.lang]}">`,
    ...otherLocales,
    `<meta property="og:type" content="${route.page === 'blogPost' ? 'article' : 'website'}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:alt" content="${esc(route.imageAlt || site.legalName)}">`,
    ...(dimensions ? [
      `<meta property="og:image:width" content="${dimensions.w}">`,
      `<meta property="og:image:height" content="${dimensions.h}">`,
    ] : []),
    ...(/\.jpe?g$/i.test(image) ? ['<meta property="og:image:type" content="image/jpeg">'] : []),
    `<meta name="twitter:image" content="${esc(image)}">`,
    `<meta name="twitter:image:alt" content="${esc(route.imageAlt || site.legalName)}">`,
    `<meta name="twitter:title" content="${esc(route.title)}">`,
    `<meta name="twitter:description" content="${esc(route.description)}">`,
    ...route.jsonLd.map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    ),
  ].join('\n    ')
}
