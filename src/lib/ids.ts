/** Small id / slug helpers shared by the admin, the tracker and the blog. */

/** Random id. Uses crypto.randomUUID when available, falls back for old Safari. */
export function newId(): string {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

const CODE_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'

/** Short, unambiguous code for a campaign link (no l/1/o/0 lookalikes). */
export function newCode(length = 6): string {
  const bytes = new Uint8Array(length)
  const c = globalThis.crypto
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(bytes)
  else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

/**
 * Transliterations the Unicode NFD pass cannot handle on its own: Icelandic
 * eth/thorn and the Polish crossed l have no combining-mark decomposition.
 */
const TRANSLITERATE: Record<string, string> = {
  'ð': 'd', // ð
  'Ð': 'd', // Ð
  'þ': 'th', // þ
  'Þ': 'th', // Þ
  'æ': 'ae', // æ
  'Æ': 'ae', // Æ
  'ø': 'o', // ø
  'Ø': 'o', // Ø
  'ł': 'l', // ł
  'Ł': 'l', // Ł
  'ß': 'ss', // ß
}

/** URL-safe slug that survives Icelandic and Polish letters. */
export function slugify(input: string): string {
  return input
    .trim()
    .replace(/[ðÐþÞæÆøØłŁß]/g, (ch) => TRANSLITERATE[ch] ?? ch)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Tiny deterministic string hash (djb2). The blog uses it to give a post a
 * stable stock cover when the editor never set one; NOT for anything
 * security-shaped.
 */
export function hashCode(input: string): number {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i)
  return h | 0
}
