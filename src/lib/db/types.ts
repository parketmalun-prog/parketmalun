import type { Lang } from '@/i18n/config'

/**
 * Shapes stored by the admin backend.
 *
 * Everything here is deliberately small and JSON-serialisable: the same records
 * round-trip through localStorage today and through Supabase tables later
 * (see `supabase/schema.sql`), with no translation layer in between.
 */

export type Device = 'mobile' | 'tablet' | 'desktop'

/**
 * One page view.
 *
 * Privacy: no IP address, no cross-site identifier, no cookie. `session` is a
 * random string held in sessionStorage that dies when the tab closes, and
 * `referrer` keeps only the hostname of the referring site.
 */
export interface VisitEvent {
  id: string
  /** epoch ms */
  ts: number
  /** pathname only, query string deliberately dropped */
  path: string
  lang: Lang
  /** campaign code this visit is attributed to, null when organic */
  ref: string | null
  /** referring hostname, e.g. 'facebook.com'; null for direct traffic */
  referrer: string | null
  device: Device
  session: string
  /** true for the first view of a session (used for visitor counts) */
  entry: boolean
}

/** A hit on a campaign link, recorded before the redirect fires. */
export interface LinkClick {
  id: string
  ts: number
  code: string
  referrer: string | null
  device: Device
}

/** A shareable tracking link: /l/<code> counts the click, then redirects. */
export interface TrackedLink {
  id: string
  /** short code that appears in the URL */
  code: string
  /** what the link is for, e.g. 'Facebook post, August' */
  label: string
  /** in-app destination path, e.g. '/en/services' */
  target: string
  note: string
  createdAt: number
  archived: boolean
}

/** One language version of a post. */
export interface PostTranslation {
  title: string
  slug: string
  excerpt: string
  body: string
  seoTitle: string
  seoDescription: string
}

/** Where an enquiry stands, so nothing sits unanswered by accident. */
export type EnquiryStatus = 'new' | 'open' | 'done'

/**
 * One submission from any form on the site.
 *
 * This is the only record that holds personal data, so it is treated
 * differently everywhere: no public read policy in Supabase, an explicit
 * delete in the admin, and a line about it in the privacy page.
 */
export interface Enquiry {
  id: string
  ts: number
  name: string
  /** phone or email exactly as the visitor typed it */
  contact: string
  service: string
  message: string
  /** campaign code the visitor arrived through, when there was one */
  ref: string | null
  /** page the form was sent from */
  path: string
  lang: Lang
  /** how the message left the site, so a mailto that never sent is visible */
  delivery: 'email' | 'formspree' | 'mailto'
  status: EnquiryStatus
  /** the client's own note, e.g. "called back, wants a quote for 60 m2" */
  note: string
}

export type PostStatus = 'draft' | 'published'

export interface Post {
  id: string
  status: PostStatus
  /** the language the post was written in; the others are translated from it */
  sourceLang: Lang
  /** cover image: an absolute URL or a data URL pasted in the editor */
  cover: string | null
  tags: string[]
  createdAt: number
  updatedAt: number
  publishedAt: number | null
  translations: Record<Lang, PostTranslation>
}

/** Everything the admin and the public blog need from storage. */
export interface Backend {
  readonly kind: 'local' | 'supabase'
  /** short human label shown in the admin footer */
  readonly label: string

  listPosts(): Promise<Post[]>
  savePost(post: Post): Promise<void>
  deletePost(id: string): Promise<void>

  listEnquiries(): Promise<Enquiry[]>
  saveEnquiry(enquiry: Enquiry): Promise<void>
  deleteEnquiry(id: string): Promise<void>

  listLinks(): Promise<TrackedLink[]>
  saveLink(link: TrackedLink): Promise<void>
  deleteLink(id: string): Promise<void>

  recordVisit(visit: VisitEvent): Promise<void>
  recordClick(click: LinkClick): Promise<void>
  listVisits(sinceTs: number): Promise<VisitEvent[]>
  listClicks(sinceTs: number): Promise<LinkClick[]>
  clearStats(): Promise<void>
}
