import { site } from '@/data/site'
import { HTML_LANG, SITE_URL, blogPostPath, pathFor } from '@/i18n/config'
import type { Lang } from '@/i18n/config'
import { ui } from '@/i18n/ui'
import type { Post } from '@/lib/db/types'

/** Rendered inside the article, so it stays correct after client-side navigation too. */
export function articleSchema(post: Post, lang: Lang) {
  const tr = post.translations[lang]
  const url = SITE_URL + blogPostPath(lang, tr.slug)
  const organisation = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#business`,
    name: site.legalName,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.webp` },
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: tr.title,
        description: tr.excerpt,
        inLanguage: HTML_LANG[lang],
        datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
        dateModified: new Date(post.updatedAt).toISOString(),
        author: organisation,
        publisher: organisation,
        image: new URL(post.cover || '/og-card.jpg', SITE_URL).href,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ui[lang].nav.home, item: SITE_URL + pathFor('home', lang) },
          { '@type': 'ListItem', position: 2, name: ui[lang].nav.blog, item: SITE_URL + pathFor('blog', lang) },
          { '@type': 'ListItem', position: 3, name: tr.title, item: url },
        ],
      },
    ],
  }
}
