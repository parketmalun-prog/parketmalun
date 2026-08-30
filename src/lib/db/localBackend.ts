import type { Backend, Enquiry, LinkClick, Post, TrackedLink, VisitEvent } from './types'
import { blogSeed } from '@/data/blogSeed'

/**
 * Browser-storage backend. This is what runs until Supabase is connected.
 *
 * What it does well: the admin is fully usable, every screen shows real data,
 * and posts written here render on the public blog in the same browser.
 *
 * What it cannot do: share anything between devices. Statistics only count
 * visits made in this browser, and a post written on the laptop is not visible
 * to a visitor on their phone. Switching to Supabase (drop the two env vars in)
 * turns exactly the same screens into shared, multi-device storage.
 */

const KEY = {
  posts: 'epm.posts.v1',
  enquiries: 'epm.enquiries.v1',
  links: 'epm.links.v1',
  visits: 'epm.visits.v1',
  clicks: 'epm.clicks.v1',
} as const

/** Hard caps so a busy browser cannot fill its storage quota. */
const MAX_VISITS = 4000
const MAX_CLICKS = 2000

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage disabled (private mode). Losing a visit row is
    // acceptable; losing the admin session is not, so we fail quietly here.
  }
}

/** Seeds the post table once, so a fresh browser is not an empty blog. */
function seedPostsOnce(): Post[] {
  const existing = localStorage.getItem(KEY.posts)
  if (existing !== null) return read<Post[]>(KEY.posts, [])
  write(KEY.posts, blogSeed)
  return blogSeed
}

export function createLocalBackend(): Backend {
  return {
    kind: 'local',
    label: 'Vaframinni',

    async listPosts() {
      return seedPostsOnce()
    },
    async savePost(post) {
      const posts = seedPostsOnce()
      const next = posts.filter((p) => p.id !== post.id)
      next.unshift(post)
      write(KEY.posts, next)
    },
    async deletePost(id) {
      write(
        KEY.posts,
        seedPostsOnce().filter((p) => p.id !== id),
      )
    },

    async listEnquiries() {
      return read<Enquiry[]>(KEY.enquiries, [])
    },
    async saveEnquiry(enquiry) {
      const list = read<Enquiry[]>(KEY.enquiries, []).filter((e) => e.id !== enquiry.id)
      list.unshift(enquiry)
      write(KEY.enquiries, list)
    },
    async deleteEnquiry(id) {
      write(
        KEY.enquiries,
        read<Enquiry[]>(KEY.enquiries, []).filter((e) => e.id !== id),
      )
    },

    async listLinks() {
      return read<TrackedLink[]>(KEY.links, [])
    },
    async saveLink(link) {
      const links = read<TrackedLink[]>(KEY.links, []).filter((l) => l.id !== link.id)
      links.unshift(link)
      write(KEY.links, links)
    },
    async deleteLink(id) {
      write(
        KEY.links,
        read<TrackedLink[]>(KEY.links, []).filter((l) => l.id !== id),
      )
    },

    async recordVisit(visit) {
      const visits = read<VisitEvent[]>(KEY.visits, [])
      visits.push(visit)
      write(KEY.visits, visits.slice(-MAX_VISITS))
    },
    async recordClick(click) {
      const clicks = read<LinkClick[]>(KEY.clicks, [])
      clicks.push(click)
      write(KEY.clicks, clicks.slice(-MAX_CLICKS))
    },
    async listVisits(sinceTs) {
      return read<VisitEvent[]>(KEY.visits, []).filter((v) => v.ts >= sinceTs)
    },
    async listClicks(sinceTs) {
      return read<LinkClick[]>(KEY.clicks, []).filter((c) => c.ts >= sinceTs)
    },
    async clearStats() {
      write(KEY.visits, [])
      write(KEY.clicks, [])
    },
  }
}
