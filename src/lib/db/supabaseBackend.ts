import type { Backend, Enquiry, LinkClick, Post, TrackedLink, VisitEvent } from './types'

/**
 * Supabase backend, spoken over PostgREST with plain fetch.
 *
 * No SDK on purpose: the whole surface is six tables and a handful of upserts,
 * so this keeps the public bundle free of another dependency. Activate it by
 * setting VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then running
 * `supabase/schema.sql` in the Supabase SQL editor.
 */

/** Set once a real user session exists (Supabase Auth); falsy means anon key. */
let accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

type Ctx = { url: string; key: string }

function headers(ctx: Ctx, extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: ctx.key,
    Authorization: `Bearer ${accessToken ?? ctx.key}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function request(ctx: Ctx, path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${ctx.url}/rest/v1/${path}`, init)
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Supabase ${res.status}: ${detail.slice(0, 200) || res.statusText}`)
  }
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const iso = (ms: number) => new Date(ms).toISOString()
const ms = (value: string | null) => (value ? Date.parse(value) : 0)

/* ---------------------------------- rows ---------------------------------- */

type PostRow = {
  id: string
  status: Post['status']
  source_lang: Post['sourceLang']
  cover: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  published_at: string | null
  translations: Post['translations']
}

const toPost = (r: PostRow): Post => ({
  id: r.id,
  status: r.status,
  sourceLang: r.source_lang,
  cover: r.cover,
  tags: r.tags ?? [],
  createdAt: ms(r.created_at),
  updatedAt: ms(r.updated_at),
  publishedAt: r.published_at ? ms(r.published_at) : null,
  translations: r.translations,
})

const fromPost = (p: Post): PostRow => ({
  id: p.id,
  status: p.status,
  source_lang: p.sourceLang,
  cover: p.cover,
  tags: p.tags,
  created_at: iso(p.createdAt),
  updated_at: iso(p.updatedAt),
  published_at: p.publishedAt ? iso(p.publishedAt) : null,
  translations: p.translations,
})

type EnquiryRow = Omit<Enquiry, 'ts'> & { ts: string }

type LinkRow = {
  id: string
  code: string
  label: string
  target: string
  note: string
  created_at: string
  archived: boolean
}

const toLink = (r: LinkRow): TrackedLink => ({
  id: r.id,
  code: r.code,
  label: r.label,
  target: r.target,
  note: r.note ?? '',
  createdAt: ms(r.created_at),
  archived: r.archived,
})

const fromLink = (l: TrackedLink): LinkRow => ({
  id: l.id,
  code: l.code,
  label: l.label,
  target: l.target,
  note: l.note,
  created_at: iso(l.createdAt),
  archived: l.archived,
})

type VisitRow = Omit<VisitEvent, 'ts'> & { ts: string }
type ClickRow = Omit<LinkClick, 'ts'> & { ts: string }

/* -------------------------------- backend --------------------------------- */

export function createSupabaseBackend(url: string, key: string): Backend {
  const ctx: Ctx = { url: url.replace(/\/+$/, ''), key }
  const upsert = { Prefer: 'resolution=merge-duplicates,return=minimal' }

  return {
    kind: 'supabase',
    label: new URL(ctx.url).hostname,

    async listPosts() {
      const rows = (await request(ctx, 'posts?select=*&order=created_at.desc', {
        headers: headers(ctx),
      })) as PostRow[]
      return rows.map(toPost)
    },
    async savePost(post) {
      await request(ctx, 'posts', {
        method: 'POST',
        headers: headers(ctx, upsert),
        body: JSON.stringify(fromPost(post)),
      })
    },
    async deletePost(id) {
      await request(ctx, `posts?id=eq.${id}`, { method: 'DELETE', headers: headers(ctx) })
    },

    async listEnquiries() {
      const rows = (await request(ctx, 'enquiries?select=*&order=ts.desc&limit=5000', {
        headers: headers(ctx),
      })) as EnquiryRow[]
      return rows.map((r) => ({ ...r, ts: ms(r.ts) }))
    },
    async saveEnquiry(enquiry) {
      // Upsert only with a session behind it. PostgREST turns
      // resolution=merge-duplicates into INSERT ... ON CONFLICT DO UPDATE, and
      // Postgres then demands UPDATE rights on the table; the anonymous policy
      // grants insert and nothing else, so an upsert from a visitor is refused
      // outright. A visitor is always writing a brand new row anyway. The
      // admin, editing a status or a note on an existing one, still needs the
      // upsert and has the session that earns it.
      await request(ctx, 'enquiries', {
        method: 'POST',
        headers: headers(ctx, accessToken ? upsert : { Prefer: 'return=minimal' }),
        body: JSON.stringify({ ...enquiry, ts: iso(enquiry.ts) }),
      })
    },
    async deleteEnquiry(id) {
      await request(ctx, `enquiries?id=eq.${id}`, { method: 'DELETE', headers: headers(ctx) })
    },

    async listLinks() {
      const rows = (await request(ctx, 'tracked_links?select=*&order=created_at.desc', {
        headers: headers(ctx),
      })) as LinkRow[]
      return rows.map(toLink)
    },
    async saveLink(link) {
      await request(ctx, 'tracked_links', {
        method: 'POST',
        headers: headers(ctx, upsert),
        body: JSON.stringify(fromLink(link)),
      })
    },
    async deleteLink(id) {
      await request(ctx, `tracked_links?id=eq.${id}`, { method: 'DELETE', headers: headers(ctx) })
    },

    async recordVisit(visit) {
      await request(ctx, 'visit_events', {
        method: 'POST',
        headers: headers(ctx, { Prefer: 'return=minimal' }),
        body: JSON.stringify({ ...visit, ts: iso(visit.ts) }),
      })
    },
    async recordClick(click) {
      await request(ctx, 'link_clicks', {
        method: 'POST',
        headers: headers(ctx, { Prefer: 'return=minimal' }),
        body: JSON.stringify({ ...click, ts: iso(click.ts) }),
      })
    },
    async listVisits(sinceTs) {
      const rows = (await request(
        ctx,
        `visit_events?select=*&ts=gte.${iso(sinceTs)}&order=ts.asc&limit=50000`,
        { headers: headers(ctx) },
      )) as VisitRow[]
      return rows.map((r) => ({ ...r, ts: ms(r.ts) }))
    },
    async listClicks(sinceTs) {
      const rows = (await request(
        ctx,
        `link_clicks?select=*&ts=gte.${iso(sinceTs)}&order=ts.asc&limit=50000`,
        { headers: headers(ctx) },
      )) as ClickRow[]
      return rows.map((r) => ({ ...r, ts: ms(r.ts) }))
    },
    async clearStats() {
      // `id=not.is.null` is PostgREST's "match every row" filter; a DELETE with
      // no filter at all is rejected by the API on purpose.
      await request(ctx, 'visit_events?id=not.is.null', { method: 'DELETE', headers: headers(ctx) })
      await request(ctx, 'link_clicks?id=not.is.null', { method: 'DELETE', headers: headers(ctx) })
    },
  }
}
