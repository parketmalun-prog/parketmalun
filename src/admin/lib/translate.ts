import type { Lang } from '@/i18n/config'
import type { PostTranslation } from '@/lib/db'

/**
 * Client side of the translation endpoint (see api/translate.ts).
 *
 * Every failure is reported, never swallowed: if the endpoint is missing or
 * unconfigured the editor says so and offers the manual path instead of
 * pretending a translation happened.
 */

const ENDPOINT = import.meta.env.VITE_TRANSLATE_ENDPOINT || '/api/translate'
const TOKEN = import.meta.env.VITE_ADMIN_API_TOKEN

/** The subset of a translation the service round-trips. */
export type TranslatableFields = Pick<
  PostTranslation,
  'title' | 'excerpt' | 'body' | 'seoTitle' | 'seoDescription'
>

export type TranslateOutcome =
  | { ok: true; fields: TranslatableFields }
  | { ok: false; offline: boolean; message: string }

const LANG_NAME: Record<Lang, string> = { is: 'Icelandic', en: 'English', pl: 'Polish' }

export async function translateFields(
  from: Lang,
  to: Lang,
  fields: TranslatableFields,
): Promise<TranslateOutcome> {
  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN ? { 'x-admin-token': TOKEN } : {}),
      },
      body: JSON.stringify({ from, to, fields }),
    })
  } catch (error) {
    return { ok: false, offline: true, message: error instanceof Error ? error.message : String(error) }
  }

  if (response.status === 404 || response.status === 503) {
    return { ok: false, offline: true, message: `${response.status}` }
  }

  let payload: { fields?: TranslatableFields; error?: string; message?: string }
  try {
    payload = await response.json()
  } catch {
    return { ok: false, offline: false, message: `${response.status}` }
  }

  if (!response.ok || !payload.fields) {
    return { ok: false, offline: false, message: payload.message || payload.error || `${response.status}` }
  }

  return { ok: true, fields: payload.fields }
}

/**
 * The manual path: a prompt the author can paste into any assistant when the
 * endpoint is not connected. Same rules the server sends, so the result comes
 * back in the house style.
 */
export function translationPrompt(from: Lang, to: Lang, fields: TranslatableFields): string {
  return [
    `Translate this article for a parquet and painting company in Reykjavík from ${LANG_NAME[from]} into ${LANG_NAME[to]}.`,
    '',
    'Rules:',
    '1. Translate meaning, not words. It must read as if a tradesperson from that country wrote it.',
    '2. Keep every Markdown mark exactly as it is: ## headings, - bullets, **bold**, links, line breaks.',
    '3. Keep numbers, measurements and Icelandic place names untouched.',
    '4. Never use an em dash or an en dash. Ranges use words: til, to, do.',
    '5. Use correct accents for the language.',
    '6. Return the five fields below, translated, in the same order and with the same labels.',
    '',
    `TITLE:\n${fields.title}`,
    '',
    `EXCERPT:\n${fields.excerpt}`,
    '',
    `BODY:\n${fields.body}`,
    '',
    `SEO TITLE:\n${fields.seoTitle}`,
    '',
    `SEO DESCRIPTION:\n${fields.seoDescription}`,
  ].join('\n')
}
