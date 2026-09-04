import { LANGS, HTML_LANG, OG_LOCALE, SITE_URL, blogPostPath, pathFor } from '@/i18n/config'
import type { Lang, RouteKey } from '@/i18n/config'
import type { PageKey } from '@/routes'
import { ui } from '@/i18n/ui'
import { site } from '@/data/site'
import { home } from '@/data/home'
import { servicesSeo } from '@/data/services'
import { portfolioSeo } from '@/data/portfolio'
import { catalogSeo } from '@/data/catalog'
import { about, aboutSeo } from '@/data/about'
import { contactSeo } from '@/data/contact'
import { privacy } from '@/data/privacy'
import { blogSeed } from '@/data/blogSeed'
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
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: site.legalName,
    telephone: `+354 ${site.phone}`,
    email: site.email,
    url: SITE_URL,
    logo: LOGO,
    image: SHARE_CARD,
    areaServed: 'Höfuðborgarsvæðið',
    address: {
      '@type': 'PostalAddress',
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
    sameAs: [site.facebook],
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
  return (['parket', 'slipun', 'malun'] as const).map((key) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: names[key],
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: 'Höfuðborgarsvæðið',
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

/** Head data for the seven fixed pages, per language. */
function seoFor(key: RouteKey, lang: Lang): { title: string; description: string } {
  switch (key) {
    case 'home':
      return home[lang].seo
    case 'services':
      return servicesSeo[lang]
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
    case 'blog':
      return { title: ui[lang].blog.seoTitle, description: ui[lang].blog.seoDescription }
  }
}

const FIXED_KEYS: RouteKey[] = [
  'home',
  'services',
  'portfolio',
  'catalog',
  'blog',
  'about',
  'contact',
  'privacy',
]

function extraSchema(key: RouteKey, lang: Lang, path: string): object[] {
  const label = key === 'home' ? null : ui[lang].nav[key as 'services'] ?? seoFor(key, lang).title
  const crumbs = label ? [breadcrumb(lang, label, path)] : []
  switch (key) {
    case 'home':
      return [organisation()]
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
  ...blogSeed
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
          alternates: Object.fromEntries(
            LANGS.map((l) => [
              l,
              isTranslated(post, l) ? blogPostPath(l, post.translations[l].slug) : pathFor('blog', l),
            ]),
          ),
          jsonLd: [
            breadcrumb(lang, tr.title, path),
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: tr.title,
              description: tr.excerpt,
              inLanguage: HTML_LANG[lang],
              datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
              dateModified: new Date(post.updatedAt).toISOString(),
              author: { '@id': `${SITE_URL}/#business` },
              publisher: { '@id': `${SITE_URL}/#business` },
              image: post.cover ?? LOGO,
              mainEntityOfPage: abs(path),
            },
          ],
        }
      }),
    ),
]

/** The `<head>` markup for one route, shared by the prerender script. */
export function headTags(route: PrerenderRoute): string {
  const canonical = abs(route.path)
  const esc = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const alternates = LANGS.map(
    (l) =>
      `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${abs(route.alternates[l] ?? pathFor('home', l))}">`,
  )
  alternates.push(
    `<link rel="alternate" hreflang="x-default" href="${abs(route.alternates.is ?? '/')}">`,
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
    `<meta property="og:image" content="${SHARE_CARD}">`,
    `<meta name="twitter:image" content="${SHARE_CARD}">`,
    `<meta name="twitter:title" content="${esc(route.title)}">`,
    `<meta name="twitter:description" content="${esc(route.description)}">`,
    ...route.jsonLd.map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    ),
  ].join('\n    ')
}
