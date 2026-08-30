import Anthropic from '@anthropic-ai/sdk'

/**
 * Translation endpoint for the blog editor: POST /api/translate
 *
 * Runs as a Vercel function, so the API key stays on the server and never
 * reaches the browser. Without ANTHROPIC_API_KEY the endpoint answers 503 and
 * the editor falls back to writing the translations by hand, which is why the
 * admin stays usable on a plain `npm run dev` with nothing configured.
 *
 * Three layers keep a stranger from spending the key: an optional shared
 * token, a same-origin check, and a per-address rate limit. None of them is
 * authentication, and the file says so where each one is defined.
 *
 * Environment:
 *   ANTHROPIC_API_KEY  required, from console.anthropic.com
 *   ADMIN_API_TOKEN    optional shared token; when set, requests must carry it
 *                      in the x-admin-token header. A speed bump against
 *                      strangers spending the key, not real authentication.
 *   ALLOWED_ORIGIN     optional extra origin allowed to call this endpoint,
 *                      on top of the deployment's own host.
 */

type Lang = 'is' | 'en' | 'pl'

const LANGS: Lang[] = ['is', 'en', 'pl']

const LANG_NAME: Record<Lang, string> = {
  is: 'Icelandic',
  en: 'English',
  pl: 'Polish',
}

/** Fields the editor sends and expects back, in the same shape. */
const FIELDS = ['title', 'excerpt', 'body', 'seoTitle', 'seoDescription'] as const
type Field = (typeof FIELDS)[number]

/** Guards the bill: a post longer than this is split by the author instead. */
const MAX_CHARS = 14000

/**
 * Rate limit, per calling address.
 *
 * Serverless instances are recycled, so this holds only for as long as one
 * instance stays warm. That is enough to stop a script hammering the endpoint,
 * and it is not a substitute for a real limiter if the site ever needs one.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8
const hits = new Map<string, number[]>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some((ts) => now - ts < WINDOW_MS)) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

const SCHEMA = {
  type: 'object',
  properties: Object.fromEntries(FIELDS.map((f) => [f, { type: 'string' }])),
  required: [...FIELDS],
  additionalProperties: false,
}

const SYSTEM = `You translate articles for Expert Parket og Mál, a parquet laying, floor sanding and painting company in the Reykjavík area.

Rules:
1. Translate meaning, not words. The result must read as if a tradesperson from that country wrote it, not as a translation.
2. Keep every Markdown mark exactly as it is: ## headings, - bullets, **bold**, [text](url), line breaks and blank lines.
3. Keep numbers, measurements, grits, phone numbers and place names untouched. Icelandic place names stay in Icelandic in every language.
4. Never use an em dash or an en dash. Write ranges with words: "til" in Icelandic, "to" in English, "do" in Polish. Use a middle dot or a comma to separate.
5. Use correct accented characters: á é í ó ú ý þ ð æ ö for Icelandic, ą ć ę ł ń ó ś ź ż for Polish.
6. seoTitle stays under 60 characters, seoDescription under 155 characters.
7. If a field arrives empty, return it empty.
8. Return the translation only, with no comment about it.`

/* ------------------------------ node plumbing ------------------------------ */

type Req = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
  on(event: string, listener: (chunk?: unknown) => void): void
}

type Res = {
  statusCode: number
  setHeader(name: string, value: string): void
  end(body?: string): void
}

function send(res: Res, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

/** Vercel parses JSON bodies; the local dev middleware hands over a raw stream. */
async function readBody(req: Req): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk as Uint8Array)))
    req.on('end', () => resolve())
    req.on('error', (error) => reject(error))
  })
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

const header = (req: Req, name: string): string => {
  const value = req.headers[name]
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
}

/**
 * Rejects calls made from another site. A browser always sends Origin on a
 * cross-origin POST, so a missing Origin means the request came from the same
 * site or from something that is not a browser at all; the token and the rate
 * limit cover that case.
 */
function foreignOrigin(req: Req): boolean {
  const origin = header(req, 'origin')
  if (!origin) return false
  const host = header(req, 'host')
  const allowed = [host && `https://${host}`, host && `http://${host}`, process.env.ALLOWED_ORIGIN]
  return !allowed.filter(Boolean).includes(origin)
}

/* --------------------------------- handler -------------------------------- */

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'method_not_allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return send(res, 503, {
      error: 'not_configured',
      message: 'ANTHROPIC_API_KEY is not set on the server.',
    })
  }

  const expectedToken = process.env.ADMIN_API_TOKEN
  if (expectedToken && header(req, 'x-admin-token') !== expectedToken) {
    return send(res, 401, { error: 'unauthorized' })
  }

  if (foreignOrigin(req)) {
    return send(res, 403, { error: 'forbidden_origin' })
  }

  const caller = header(req, 'x-forwarded-for').split(',')[0].trim() || 'unknown'
  if (rateLimited(caller)) {
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)))
    return send(res, 429, { error: 'rate_limited' })
  }

  let payload: {
    from?: string
    to?: string
    fields?: Partial<Record<Field, string>>
  }
  try {
    payload = (await readBody(req)) as typeof payload
  } catch {
    return send(res, 400, { error: 'invalid_json' })
  }

  const from = payload.from as Lang
  const to = payload.to as Lang
  if (!LANGS.includes(from) || !LANGS.includes(to) || from === to) {
    return send(res, 400, { error: 'invalid_languages' })
  }

  const source: Record<string, string> = {}
  let total = 0
  for (const field of FIELDS) {
    const value = payload.fields?.[field]
    const text = typeof value === 'string' ? value : ''
    total += text.length
    source[field] = text
  }
  if (!source.title.trim() && !source.body.trim()) {
    return send(res, 400, { error: 'nothing_to_translate' })
  }
  if (total > MAX_CHARS) {
    return send(res, 413, { error: 'too_long', limit: MAX_CHARS, length: total })
  }

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      system: SYSTEM,
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: `Translate these fields from ${LANG_NAME[from]} into ${LANG_NAME[to]}.\n\n${JSON.stringify(source, null, 2)}`,
        },
      ],
    })

    if (message.stop_reason === 'refusal') {
      return send(res, 502, { error: 'refused' })
    }

    const text = message.content.find((block) => block.type === 'text')
    if (!text || text.type !== 'text') {
      return send(res, 502, { error: 'empty_response' })
    }

    const parsed = JSON.parse(text.text) as Record<string, unknown>
    const fields: Record<string, string> = {}
    for (const field of FIELDS) {
      fields[field] = typeof parsed[field] === 'string' ? (parsed[field] as string) : source[field]
    }

    return send(res, 200, { lang: to, fields })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    // eslint-disable-next-line no-console
    console.error('translate failed:', detail)
    return send(res, 502, { error: 'translate_failed', message: detail })
  }
}
