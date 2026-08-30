import type { Lang } from '@/i18n/config'

const LOCALE: Record<Lang, string> = { is: 'is-IS', en: 'en-GB', pl: 'pl-PL' }

/**
 * Icelandic month names. Not every browser build ships Icelandic locale data,
 * and the ones that miss it fall back to American English, which would print
 * "August 11, 2026" on an Icelandic page. Twelve words remove the gamble.
 */
const IS_MONTHS = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

/** Long date, e.g. "28. júlí 2026". */
export function formatDate(ts: number, lang: Lang): string {
  if (lang === 'is') {
    const d = new Date(ts)
    return `${d.getDate()}. ${IS_MONTHS[d.getMonth()]} ${d.getFullYear()}`
  }
  return new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(ts)
}

/**
 * Compact date for admin tables and chart ticks, e.g. "28.07.2026".
 * Fixed day-month-year order on purpose: an admin table must never be read as
 * an American month-first date because a locale resolved differently.
 */
export function formatShortDate(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

/** Thousands-separated integer with tabular figures in mind. */
export function formatNumber(value: number, lang: Lang = 'is'): string {
  return new Intl.NumberFormat(LOCALE[lang]).format(value)
}

/** Whole-percent string, guarding against a zero denominator. */
export function percent(part: number, total: number): string {
  if (!total) return '0%'
  return `${Math.round((part / total) * 100)}%`
}
