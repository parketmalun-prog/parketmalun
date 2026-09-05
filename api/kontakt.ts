/**
 * Enquiry endpoint for every form on the site: POST /api/kontakt
 *
 * Runs as a Vercel function so the Resend key stays on the server. The message
 * leaves from the company's own domain and carries the visitor's address as
 * Reply-To, so the client answers straight from the inbox and the reply lands
 * where the visitor expects it.
 *
 * Fails soft on purpose. Without RESEND_API_KEY the endpoint answers 503 and
 * the browser falls back to the old behaviour, a prefilled mail client, which
 * is what keeps a plain `npm run dev` usable with nothing configured.
 *
 * This endpoint is public by nature: a stranger visiting the site must be able
 * to call it. It is not protected by a token, so four cheap layers stand in
 * for one: a honeypot field, a minimum fill time, a same-origin check and a
 * per-address rate limit. Field ceilings bound the size of anything that does
 * get through. None of this is authentication and none of it pretends to be.
 *
 * Environment:
 *   RESEND_API_KEY  required, from resend.com. Missing means 503, not 500.
 *   CONTACT_TO      optional, the inbox that receives enquiries. Defaults to
 *                   the address printed on the site.
 *   CONTACT_FROM    optional sender, must sit on a domain verified in Resend.
 *                   Defaults to a send subdomain so the company's own MX
 *                   records at the registry stay untouched.
 *   ALLOWED_ORIGIN  optional extra origin allowed to call this endpoint, on
 *                   top of the deployment's own host.
 */

/**
 * Where enquiries land when CONTACT_TO is not set.
 *
 * Deliberately not the address printed on the site. That one is published for
 * anyone to write to; this is the box the company actually works out of, so
 * enquiries from the form land where they get answered.
 */
const DEFAULT_TO = 'parketmalun@gmail.com'

/**
 * Default sender. A send subdomain is deliberate: verifying the apex in Resend
 * would mean touching the MX records that carry the company mailboxes, and a
 * marketing tool has no business owning those.
 */
const DEFAULT_FROM = 'Expert Parket vefur <vefur@send.expertparket.is>'

/** Field ceilings, mirroring the ones the browser applies before posting. */
const LIMITS: Record<string, number> = {
  name: 120,
  contact: 160,
  service: 80,
  message: 4000,
  path: 200,
  ref: 80,
  lang: 8,
}

/**
 * Nobody reads a page and fills a form in under this. The browser drops such a
 * submission silently; the server repeats the check because the browser is not
 * the only thing that can post here.
 */
const MIN_FILL_MS = 2500

/**
 * Rate limit, per calling address. Serverless instances are recycled, so this
 * holds only for as long as one instance stays warm. That is enough to stop a
 * script hammering the inbox, and it is not a substitute for a real limiter if
 * the site ever needs one.
 */
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
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
 * site or from something that is not a browser at all; the rate limit and the
 * timing check cover that case.
 */
function foreignOrigin(req: Req): boolean {
  const origin = header(req, 'origin')
  if (!origin) return false
  const host = header(req, 'host')
  const allowed = [host && `https://${host}`, host && `http://${host}`, process.env.ALLOWED_ORIGIN]
  return !allowed.filter(Boolean).includes(origin)
}

/* -------------------------------- composing -------------------------------- */

/** Trims a field to its ceiling and strips the control characters a header injection would need. */
function clean(value: unknown, field: string): string {
  const text = typeof value === 'string' ? value : ''
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, LIMITS[field] ?? 200)
}

/** The message body keeps its line breaks; only the ceiling applies. */
function cleanMessage(value: unknown): string {
  const text = typeof value === 'string' ? value : ''
  return text.replace(/\r\n/g, '\n').trim().slice(0, LIMITS.message)
}

/** A contact that looks like an address becomes Reply-To; a phone number cannot. */
function replyTo(contact: string): string | undefined {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) ? contact : undefined
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* --------------------------------- handler -------------------------------- */

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'method_not_allowed' })
  }

  // Trimmed on purpose. A key pasted into a hosting dashboard picks up a
  // trailing space or newline more often than anyone admits, and Resend
  // answers that with a flat "API key is invalid" that looks like a wrong key
  // rather than a stray character.
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    // Not an error the visitor caused. The browser reads this and falls back
    // to opening a mail client instead of showing a failure.
    return send(res, 503, {
      error: 'not_configured',
      message: 'RESEND_API_KEY is not set on the server.',
    })
  }

  if (foreignOrigin(req)) {
    return send(res, 403, { error: 'forbidden_origin' })
  }

  const caller = header(req, 'x-forwarded-for').split(',')[0].trim() || 'unknown'
  if (rateLimited(caller)) {
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)))
    return send(res, 429, { error: 'rate_limited' })
  }

  let payload: Record<string, unknown>
  try {
    payload = (await readBody(req)) as Record<string, unknown>
  } catch {
    return send(res, 400, { error: 'invalid_json' })
  }

  // Honeypot and timing, repeated server side. Both answer 200: a script that
  // trips them learns nothing, and a person can never see this path.
  const elapsed = Number(payload.elapsed)
  if (clean(payload._gotcha, 'name') || (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS)) {
    return send(res, 200, { ok: true })
  }

  const name = clean(payload.name, 'name')
  const contact = clean(payload.contact, 'contact')
  const service = clean(payload.service, 'service')
  const message = cleanMessage(payload.message)
  const path = clean(payload.path, 'path')
  const ref = clean(payload.ref, 'ref')
  const lang = clean(payload.lang, 'lang')

  if (!name || !contact || !message) {
    return send(res, 400, { error: 'missing_fields' })
  }

  const lines = [
    `Nafn: ${name}`,
    `Samskipti: ${contact}`,
    service ? `Þjónusta: ${service}` : '',
    '',
    message,
    '',
    '---',
    path ? `Síða: ${path}` : '',
    lang ? `Tungumál: ${lang}` : '',
    ref ? `Herferð: ${ref}` : '',
  ].filter(Boolean)

  const html = lines
    .map((line) => (line === '---' ? '<hr>' : `<p>${escapeHtml(line) || '&nbsp;'}</p>`))
    .join('\n')

  let response: Response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: replyTo(contact),
        subject: `Ný fyrirspurn frá ${name}`,
        text: lines.join('\n'),
        html,
      }),
    })
  } catch {
    return send(res, 502, { error: 'send_failed' })
  }

  if (!response.ok) {
    // The body carries Resend's own reason, which is the only useful thing in
    // the function log when a domain is not verified yet.
    const detail = await response.text().catch(() => '')
    console.error('resend rejected the enquiry', response.status, detail.slice(0, 500))
    // Worth naming, because the two look identical from the visitor's side and
    // are fixed in completely different places.
    if (response.status === 401 || detail.includes('API key is invalid')) {
      console.error('RESEND_API_KEY is set but rejected. Check for a stray space in the hosting environment, or issue a new key.')
    }
    return send(res, 502, { error: 'send_failed' })
  }

  return send(res, 200, { ok: true })
}
