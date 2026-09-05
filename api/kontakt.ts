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
 * to call it. It is not protected by a token, so cheap layers stand in for
 * one: a honeypot field, a minimum fill time, a mandatory matching Origin, a
 * JSON-only body, a per-address rate limit and a per-hour ceiling on sends.
 * Field ceilings bound the size of anything that does get through. None of
 * this is authentication and none of it pretends to be; Vercel's firewall in
 * front of the function is what handles volume.
 *
 * Environment:
 *   RESEND_API_KEY  required, from resend.com. Missing means 503, not 500.
 *   CONTACT_TO      optional, the inbox that receives enquiries. Defaults to
 *                   expertparket2024@gmail.com, the box the client reads.
 *   CONTACT_FROM    optional sender, must sit on a domain verified in Resend.
 *                   Defaults to a send subdomain so the company's own MX
 *                   records at the registry stay untouched.
 *   ALLOWED_ORIGIN  optional extra origin allowed to call this endpoint, on
 *                   top of the deployment's own host.
 */

/**
 * Where enquiries land when CONTACT_TO is not set. Confirmed with the client:
 * this is the box they read, and it is the same address printed on the site.
 * CONTACT_TO overrides it without a code change if that ever moves.
 */
const DEFAULT_TO = 'expertparket2024@gmail.com'

/**
 * Default sender. A send subdomain is deliberate: verifying the apex in Resend
 * would mean touching the MX records that carry the company mailboxes, and a
 * marketing tool has no business owning those.
 */
const DEFAULT_FROM = 'Expert Parket og Mál <vefur@send.expertparket.is>'

/** Printed in the footer of the message, so the client sees their own number. */
const COMPANY_PHONE = '785 7079'

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
 * Rejects calls that did not come from a page on this site.
 *
 * Every current browser sends Origin on a POST, same-origin included, so a
 * request with no Origin at all did not come from a browser: it came from
 * curl, a script or a scanner. Those used to be let through on the theory
 * that the rate limit would catch them; they are refused outright now, with
 * Referer accepted as the fallback for the odd privacy browser that strips
 * Origin but keeps Referer. A determined attacker can forge either header,
 * so this is a fence, not a lock, but it is the fence that stops the
 * thousand cheapest scripts that never bother.
 */
function foreignOrigin(req: Req): boolean {
  const host = header(req, 'host')
  const allowed = [host && `https://${host}`, host && `http://${host}`, process.env.ALLOWED_ORIGIN]
    .filter(Boolean)
    .map((o) => String(o).replace(/\/$/, ''))
  const origin = header(req, 'origin')
  if (origin) return !allowed.includes(origin.replace(/\/$/, ''))
  const referer = header(req, 'referer')
  if (referer) return !allowed.some((o) => referer.startsWith(o + '/'))
  return true
}

/**
 * A ceiling on sends per instance-hour, on top of the per-address limit. The
 * per-address limit stops one visitor; this stops a botnet from burning
 * through the mail provider's daily quota with a hundred addresses, after
 * which the real enquiries of the day would bounce. Fifty an hour is more
 * than a parquet firm will ever legitimately receive; if it is ever hit, the
 * log says so and the visitor gets the retry message rather than silence.
 */
const HOURLY_CAP = 50
let hourStart = Date.now()
let hourCount = 0

function overHourlyCap(): boolean {
  const now = Date.now()
  if (now - hourStart > 3_600_000) {
    hourStart = now
    hourCount = 0
  }
  hourCount += 1
  return hourCount > HOURLY_CAP
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

/**
 * A phone number the client can tap. Icelandic numbers arrive as "785 7079",
 * sometimes with a country code or a dash, and a tel: link wants none of that.
 * Returns undefined when the field is clearly not a number, so the template
 * can fall back to the mail button instead of offering a dead call.
 */
function telHref(contact: string): string | undefined {
  const digits = contact.replace(/[^\d+]/g, '')
  if (contact.includes('@') || digits.replace(/\D/g, '').length < 7) return undefined
  return digits.startsWith('+') ? digits : `+354${digits}`
}

/* --------------------------------- template -------------------------------- */

/**
 * The enquiry as it lands in the company inbox.
 *
 * Written as tables with inline styles because that is what mail clients
 * actually render: Gmail strips <style> blocks in some views, Outlook renders
 * through Word, and neither can be trusted with flexbox or a class attribute.
 * The palette is the site's own, so the message reads as a document from the
 * company rather than a raw form dump.
 *
 * The one job of this layout is speed of reply. The visitor's name and how to
 * reach them sit above everything else, and the first thing under them is a
 * button that dials or opens a reply. Everything the client does not need in
 * the first two seconds, the page, the language, the campaign, sits at the
 * bottom in small type.
 */
const BRAND = {
  espresso: '#3A3127',
  espressoDeep: '#241D15',
  cream: '#E9E1D3',
  paper: '#F4EEE4',
  gold: '#C08E5C',
  goldDeep: '#7A5329',
  ink: '#221C15',
  taupe: '#6E6150',
  line: '#D2C6B2',
}

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const SERIF = "Georgia,'Times New Roman',Times,serif"

type Enquiry = {
  name: string
  contact: string
  service: string
  message: string
  path: string
  ref: string
  lang: string
}

/** One bulletproof button. Nested tables, because a padded <a> alone collapses in Outlook. */
function button(href: string, label: string, filled: boolean): string {
  const bg = filled ? BRAND.espresso : BRAND.paper
  const fg = filled ? BRAND.paper : BRAND.espresso
  const border = filled ? BRAND.espresso : BRAND.line
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;margin:0 8px 8px 0;">
      <tr><td align="center" bgcolor="${bg}" style="border-radius:4px;border:1px solid ${border};">
        <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${SANS};font-size:15px;line-height:1;font-weight:600;letter-spacing:.01em;color:${fg};text-decoration:none;">${escapeHtml(label)}</a>
      </td></tr>
    </table>`
}

/** A small label over a value, the pattern used for every detail row. */
function row(label: string, value: string): string {
  return `<tr><td style="padding:0 0 14px;">
      <div style="font-family:${SANS};font-size:11px;line-height:1.2;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.taupe};padding-bottom:4px;">${escapeHtml(label)}</div>
      <div style="font-family:${SANS};font-size:16px;line-height:1.45;color:${BRAND.ink};">${value}</div>
    </td></tr>`
}

export function renderEmail(e: Enquiry, phone: string): { subject: string; text: string; html: string } {
  const subject = e.service
    ? `Ný fyrirspurn frá ${e.name} · ${e.service}`
    : `Ný fyrirspurn frá ${e.name}`

  const tel = telHref(e.contact)
  const mail = e.contact.includes('@') ? e.contact : undefined
  const contactHtml = tel
    ? `<a href="tel:${escapeHtml(tel)}" style="color:${BRAND.goldDeep};text-decoration:none;font-weight:600;">${escapeHtml(e.contact)}</a>`
    : mail
      ? `<a href="mailto:${escapeHtml(mail)}" style="color:${BRAND.goldDeep};text-decoration:none;font-weight:600;">${escapeHtml(e.contact)}</a>`
      : escapeHtml(e.contact)

  const actions = [
    tel ? button(`tel:${tel}`, `Hringja í ${e.contact}`, true) : '',
    mail
      ? button(
          `mailto:${mail}?subject=${encodeURIComponent('Re: fyrirspurn til Expert Parket og Mál')}`,
          'Svara í tölvupósti',
          true,
        )
      : '',
  ]
    .filter(Boolean)
    .join('')

  // Reply-To only exists when the visitor left an address. Telling the client
  // to hit reply when it does not would send the answer to a send-only
  // mailbox, so the closing line follows what the message can actually do.
  const closing = mail
    ? 'Svaraðu þessum pósti og svarið fer beint til viðskiptavinarins.'
    : 'Viðskiptavinurinn skildi eftir símanúmer, svo hringdu til að svara.'

  const footNotes = [
    e.path ? `Síða: ${e.path}` : '',
    e.lang ? `Tungumál: ${e.lang}` : '',
    e.ref ? `Herferð: ${e.ref}` : '',
  ].filter(Boolean)

  // Sits in the inbox preview line, next to the subject, and never renders.
  const preheader = [e.contact, e.service, e.message.slice(0, 90)].filter(Boolean).join(' · ')

  const html = `<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};">
<div style="display:none;font-size:1px;color:${BRAND.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.cream};">
  <tr><td align="center" style="padding:28px 16px 40px;">

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${BRAND.paper};border:1px solid ${BRAND.line};border-radius:6px;overflow:hidden;">

      <tr><td bgcolor="${BRAND.espresso}" style="background:${BRAND.espresso};padding:26px 32px 24px;">
        <div style="font-family:${SANS};font-size:11px;line-height:1.2;letter-spacing:.22em;text-transform:uppercase;color:${BRAND.gold};padding-bottom:8px;">Expert Parket og Mál</div>
        <div style="font-family:${SERIF};font-size:25px;line-height:1.2;color:${BRAND.paper};">Ný fyrirspurn af vefnum</div>
      </td></tr>

      <tr><td style="padding:0;"><div style="height:3px;background:${BRAND.gold};line-height:3px;font-size:0;">&nbsp;</div></td></tr>

      <tr><td style="padding:30px 32px 6px;">
        <div style="font-family:${SERIF};font-size:27px;line-height:1.25;color:${BRAND.ink};padding-bottom:6px;">${escapeHtml(e.name)}</div>
        ${
          e.service
            ? `<div style="font-family:${SANS};font-size:12px;line-height:1;letter-spacing:.1em;text-transform:uppercase;color:${BRAND.goldDeep};background:${BRAND.cream};border:1px solid ${BRAND.line};border-radius:999px;padding:7px 13px;display:inline-block;">${escapeHtml(e.service)}</div>`
            : ''
        }
      </td></tr>

      <tr><td style="padding:22px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row('Samskipti', contactHtml)}
        </table>
      </td></tr>

      <tr><td style="padding:2px 32px 4px;">${actions}</td></tr>

      <tr><td style="padding:18px 32px 0;">
        <div style="font-family:${SANS};font-size:11px;line-height:1.2;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.taupe};padding-bottom:8px;">Skilaboð</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-left:3px solid ${BRAND.gold};background:${BRAND.cream};padding:16px 18px;border-radius:0 4px 4px 0;">
            <div style="font-family:${SANS};font-size:16px;line-height:1.6;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(e.message)}</div>
          </td></tr>
        </table>
      </td></tr>

      ${
        footNotes.length
          ? `<tr><td style="padding:22px 32px 0;">
              <div style="border-top:1px solid ${BRAND.line};padding-top:14px;font-family:${SANS};font-size:12px;line-height:1.7;color:${BRAND.taupe};">${footNotes.map(escapeHtml).join('<br>')}</div>
            </td></tr>`
          : ''
      }

      <tr><td style="padding:22px 32px 28px;">
        <div style="font-family:${SANS};font-size:12px;line-height:1.6;color:${BRAND.taupe};">
          Sent sjálfvirkt af fyrirspurnarforminu á <a href="https://expertparket.is" style="color:${BRAND.goldDeep};text-decoration:none;">expertparket.is</a>. ${escapeHtml(closing)}
        </div>
      </td></tr>

    </table>

    <div style="font-family:${SANS};font-size:11px;line-height:1.6;color:${BRAND.taupe};padding-top:16px;">Expert Parket og Mál ehf · ${escapeHtml(phone)}</div>

  </td></tr>
</table>
</body>
</html>`

  // Built by pushing rather than filtering, so the blank lines that shape the
  // plain text survive while the optional fields still drop out.
  const textLines: string[] = ['NÝ FYRIRSPURN AF VEFNUM', '', `Nafn: ${e.name}`, `Samskipti: ${e.contact}`]
  if (e.service) textLines.push(`Þjónusta: ${e.service}`)
  textLines.push('', 'Skilaboð:', e.message, '')
  if (footNotes.length) textLines.push('---', ...footNotes, '')
  textLines.push(closing)
  const text = textLines.join('\n')

  return { subject, text, html }
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

  if (overHourlyCap()) {
    console.error('enquiry hourly cap reached; a flood is in progress or the cap is too low')
    res.setHeader('Retry-After', '900')
    return send(res, 429, { error: 'rate_limited' })
  }

  // The form posts JSON and nothing else does. A plain form POST or a
  // scanner's multipart body is refused before it is read.
  if (!header(req, 'content-type').toLowerCase().startsWith('application/json')) {
    return send(res, 415, { error: 'unsupported_media_type' })
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

  const { subject, text, html } = renderEmail(
    { name, contact, service, message, path, ref, lang },
    COMPANY_PHONE,
  )

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
        subject,
        text,
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
