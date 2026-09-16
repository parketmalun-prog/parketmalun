import { blogSeed } from '@/data/blogSeed'
import { publishedPosts } from '@/data/publishedPosts'
import { db } from '@/lib/db'
import type { Post } from '@/lib/db/types'

/** Deploy-published articles stay visible to returning visitors and with either backend. */
export function withPublishedPosts(stored: Post[]): Post[] {
  const ids = new Set(publishedPosts.map((post) => post.id))
  return [...publishedPosts, ...stored.filter((post) => !ids.has(post.id))]
}

export const publicPostSeed = withPublishedPosts(blogSeed)

export async function listPublicPosts(): Promise<Post[]> {
  try {
    return withPublishedPosts(await db.listPosts())
  } catch {
    return publicPostSeed
  }
}
