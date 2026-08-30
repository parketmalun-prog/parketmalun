import { LANGS } from '@/i18n/config'
import type { Lang } from '@/i18n/config'
import { newId } from '@/lib/ids'
import { createLocalBackend } from './localBackend'
import { createSupabaseBackend } from './supabaseBackend'
import type { Backend, Enquiry, Post, PostTranslation } from './types'

export type * from './types'

/**
 * The single storage entry point for the admin, the tracker and the blog.
 *
 * Supabase takes over automatically the moment both env vars exist, so nothing
 * in the UI has to know which backend is live. Until then everything runs on
 * browser storage (see the note at the top of `localBackend.ts`).
 */
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const db: Backend = url && key ? createSupabaseBackend(url, key) : createLocalBackend()

/** True when data is shared across devices rather than kept in this browser. */
export const isShared = db.kind === 'supabase'

/* ------------------------------- change bus ------------------------------- */

export type Topic = 'posts' | 'links' | 'stats' | 'enquiries'
type Listener = (topic: Topic) => void

const listeners = new Set<Listener>()

/** Subscribe to writes so open admin screens refresh themselves. */
export function onChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function emitChange(topic: Topic): void {
  for (const fn of listeners) fn(topic)
}

/* ------------------------------- enquiries -------------------------------- */

/** Newest first, and unanswered ones are what the client actually needs. */
export function sortEnquiries(list: Enquiry[]): Enquiry[] {
  return list.slice().sort((a, b) => b.ts - a.ts)
}

export function countNew(list: Enquiry[]): number {
  return list.filter((e) => e.status === 'new').length
}

/* --------------------------------- posts ---------------------------------- */

export function emptyTranslation(): PostTranslation {
  return { title: '', slug: '', excerpt: '', body: '', seoTitle: '', seoDescription: '' }
}

export function emptyPost(sourceLang: Lang): Post {
  const now = Date.now()
  const translations = Object.fromEntries(LANGS.map((l) => [l, emptyTranslation()])) as Post['translations']
  return {
    id: newId(),
    status: 'draft',
    sourceLang,
    cover: null,
    tags: [],
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    translations,
  }
}

/** A translation counts as filled in only when it has both a title and a body. */
export function isTranslated(post: Post, lang: Lang): boolean {
  const t = post.translations[lang]
  return Boolean(t && t.title.trim() && t.body.trim())
}

/** Published posts that actually have content in this language, newest first. */
export function publishedIn(posts: Post[], lang: Lang): Post[] {
  return posts
    .filter((p) => p.status === 'published' && isTranslated(p, lang))
    .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt))
}
