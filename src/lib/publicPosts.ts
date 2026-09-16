import { publishedPosts } from '@/data/publishedPosts'
import { db } from '@/lib/db'
import type { Post } from '@/lib/db/types'

/** Deploy-published articles stay visible to returning visitors and with either backend. */
export function withPublishedPosts(stored: Post[]): Post[] {
  const ids = new Set(publishedPosts.map((post) => post.id))
  return [...publishedPosts, ...stored.filter((post) => !ids.has(post.id))]
}

/** Browser-local starter posts belong to the admin, not the public website. */
export const publicPostSeed = withPublishedPosts([])

export async function listPublicPosts(): Promise<Post[]> {
  // Without shared storage, keep the hydrated page identical to its
  // prerendered HTML instead of exposing browser-specific starter posts.
  if (db.kind === 'local') return publicPostSeed

  try {
    return withPublishedPosts(await db.listPosts())
  } catch {
    return publicPostSeed
  }
}
