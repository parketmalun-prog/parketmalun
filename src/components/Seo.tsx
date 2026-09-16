import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import type { Lang } from '@/i18n/config'
import { LANGS, DEFAULT_LANG, HTML_LANG, OG_LOCALE, SITE_URL, parsePath, pathFor } from '@/i18n/config'
import { photoManifest } from '@/data/photoManifest'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

type Props = {
  title: string
  description?: string
  noindex?: boolean
  /**
   * Overrides the canonical path. Needed by pages whose URL carries a segment
   * the route table does not know about, such as a blog post slug.
   */
  canonicalPath?: string
  /** Per-language paths for the hreflang alternates, same reason. */
  alternates?: Partial<Record<Lang, string>>
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
}

/**
 * Sets per-page metadata: document title, description, <html lang>, canonical,
 * Open Graph locale/url, and hreflang alternates for every language so each
 * language version is discoverable and correctly linked for search engines.
 */
export function Seo({ title, description, noindex, canonicalPath, alternates, image = '/og-card.jpg', imageAlt = 'Expert Parket og Mál ehf', type = 'website' }: Props) {
  const { lang } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
    document.documentElement.lang = HTML_LANG[lang]
    if (description) upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    upsertMeta('property', 'og:locale', OG_LOCALE[lang])
    upsertMeta('property', 'og:title', title)
    if (description) upsertMeta('property', 'og:description', description)
    const imageUrl = new URL(image, SITE_URL).href
    const dimensions = photoManifest[image]
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:alt', imageAlt)
    upsertMeta('name', 'twitter:image', imageUrl)
    upsertMeta('name', 'twitter:image:alt', imageAlt)
    upsertMeta('name', 'twitter:title', title)
    if (description) upsertMeta('name', 'twitter:description', description)
    for (const [key, value] of Object.entries({
      'og:image:width': dimensions?.w ?? (image === '/og-card.jpg' ? 1200 : undefined),
      'og:image:height': dimensions?.h ?? (image === '/og-card.jpg' ? 630 : undefined),
      'og:image:type': /\.jpe?g$/i.test(image) ? 'image/jpeg' : undefined,
    })) {
      if (value !== undefined) upsertMeta('property', key, String(value))
      else document.head.querySelector(`meta[property="${key}"]`)?.remove()
    }

    const { key } = parsePath(pathname)
    const pathIn = (l: Lang) => alternates?.[l] ?? pathFor(key, l)
    const canonical = SITE_URL + (canonicalPath ?? pathIn(lang))
    upsertCanonical(canonical)
    upsertMeta('property', 'og:url', canonical)

    // Rebuild hreflang alternates for the current page across all languages.
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
    if (!noindex) {
      for (const l of LANGS) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', HTML_LANG[l])
        link.setAttribute('href', SITE_URL + pathIn(l))
        document.head.appendChild(link)
      }
      const xDefault = document.createElement('link')
      xDefault.setAttribute('rel', 'alternate')
      xDefault.setAttribute('hreflang', 'x-default')
      xDefault.setAttribute('href', SITE_URL + pathIn(DEFAULT_LANG))
      document.head.appendChild(xDefault)
    }
  }, [title, description, lang, pathname, noindex, canonicalPath, alternates, image, imageAlt, type])

  return null
}
