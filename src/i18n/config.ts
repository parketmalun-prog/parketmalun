/**
 * Language + routing configuration for the trilingual site.
 *
 * Icelandic (is) is the default/primary language and lives at the root with no
 * URL prefix. English (en) and Polish (pl) live under /en and /pl and use their
 * own translated slugs so each language has its own indexable URLs (good SEO).
 *
 *   is  →  /            /thjonusta        /parket
 *   en  →  /en          /en/services      /en/flooring
 *   pl  →  /pl          /pl/uslugi        /pl/parkiety
 */

export const LANGS = ['is', 'en', 'pl'] as const
export type Lang = (typeof LANGS)[number]

/** The primary language, served at the root without a URL prefix. */
export const DEFAULT_LANG: Lang = 'is'

/** Short code shown in the language switcher. */
export const LANG_LABEL: Record<Lang, string> = { is: 'IS', en: 'EN', pl: 'PL' }
/** Native language name shown in the switcher menu. */
export const LANG_NAME: Record<Lang, string> = { is: 'Íslenska', en: 'English', pl: 'Polski' }
/** Value for the <html lang> attribute. */
export const HTML_LANG: Record<Lang, string> = { is: 'is', en: 'en', pl: 'pl' }
/** Open Graph locale code. */
export const OG_LOCALE: Record<Lang, string> = { is: 'is_IS', en: 'en_US', pl: 'pl_PL' }

/** Stable page identifiers, decoupled from the (per-language) URL slug. */
export type RouteKey = 'home' | 'services' | 'portfolio' | 'catalog' | 'about' | 'contact' | 'privacy'
export const ROUTE_KEYS: RouteKey[] = ['home', 'services', 'portfolio', 'catalog', 'about', 'contact', 'privacy']

/** Pages shown in the main navigation (privacy lives only in the footer). */
export const NAV_KEYS = ['home', 'services', 'portfolio', 'catalog', 'about', 'contact'] as const
export type NavKey = (typeof NAV_KEYS)[number]

/** The URL slug for each page in each language. Home is the empty slug (index). */
export const SLUGS: Record<RouteKey, Record<Lang, string>> = {
  home: { is: '', en: '', pl: '' },
  services: { is: 'thjonusta', en: 'services', pl: 'uslugi' },
  portfolio: { is: 'verkefni', en: 'projects', pl: 'realizacje' },
  catalog: { is: 'parket', en: 'flooring', pl: 'parkiety' },
  about: { is: 'um-okkur', en: 'about', pl: 'o-nas' },
  contact: { is: 'hafdu-samband', en: 'contact', pl: 'kontakt' },
  privacy: { is: 'personuvernd', en: 'privacy', pl: 'polityka-prywatnosci' },
}

/** Canonical production origin (no trailing slash): used for hreflang/canonical. */
export const SITE_URL = 'https://expertparketogmal.is'

/** URL prefix for a language: '' for the default (is), otherwise '/en', '/pl'. */
export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`
}

/** Build an in-app path for a route key in a given language, with an optional hash. */
export function pathFor(key: RouteKey, lang: Lang, hash?: string): string {
  const prefix = langPrefix(lang)
  const slug = SLUGS[key][lang]
  const base = slug ? `${prefix}/${slug}` : prefix || '/'
  return hash ? `${base}#${hash}` : base
}

/**
 * Parse a pathname into its language + page. Unknown slugs resolve to `home`
 * (the caller's route table handles genuine 404s); this is used by the language
 * switcher and SEO to find the equivalent page across languages.
 */
export function parsePath(pathname: string): { lang: Lang; key: RouteKey } {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  let lang: Lang = DEFAULT_LANG
  let rest = parts
  if (parts[0] === 'en' || parts[0] === 'pl') {
    lang = parts[0] as Lang
    rest = parts.slice(1)
  }
  const slug = rest[0] ?? ''
  const key = ROUTE_KEYS.find((k) => SLUGS[k][lang] === slug) ?? 'home'
  return { lang, key }
}
