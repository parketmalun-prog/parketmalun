import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Closer } from '@/components/Closer'
import { LineReveal } from '@/components/motionPrimitives'
import { useLang, useUi } from '@/i18n/context'
import { blogPostPath } from '@/i18n/config'
import { db, publishedIn } from '@/lib/db'
import { blogSeed } from '@/data/blogSeed'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import { readingMinutes } from '@/lib/markdown'
import { imgSources } from '@/lib/img'
import { photos } from '@/data/photos'
import { hashCode } from '@/lib/ids'

/** Posts per page; page controls appear once the archive outgrows this. */
const PAGE_SIZE = 6

/**
 * A post without its own cover borrows one from the stock panorama pool,
 * picked by post-id hash: the id never changes, so one article keeps one
 * picture across all three languages and across slug or title edits. The
 * admin can override any of it by setting a real cover in the editor.
 */
function coverFor(key: string, cover: string | null) {
  if (cover) return { src: cover, srcSet: undefined as string | undefined }
  const pick = photos.pano[Math.abs(hashCode(key)) % photos.pano.length]
  const img = imgSources(pick)
  return { src: img.src, srcSet: img.srcSet || undefined }
}

/**
 * Blog index, the magazine grid (client, 2026-08-29): every article is a
 * card with its picture, the date, the title and the excerpt, three to a
 * row, everything on the same baseline. Grows a pager instead of an endless
 * column once the client has published more than a pageful.
 */
export default function Blog() {
  const { lang } = useLang()
  const t = useUi()
  const [page, setPage] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  // Seeded so the page prerenders with real articles instead of a spinner.
  const { data, loading } = useAsync(() => db.listPosts(), [], 'posts', blogSeed)
  const posts = publishedIn(data ?? [], lang)

  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const pagePosts = posts.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  // A language switch re-filters the archive; land back on the first page.
  useEffect(() => setPage(0), [lang])

  return (
    <>
      <Seo title={t.blog.seoTitle} description={t.blog.seoDescription} />

      <section className="container-x pt-10 md:pt-16">
        <LineReveal
          as="h1"
          lines={[t.blog.title]}
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
        />
        <p className="max-w-[52ch] pt-6 text-lg leading-relaxed text-espresso-700">{t.blog.lead}</p>
      </section>

      <section className="container-x pb-16 pt-12 md:pt-16">
        {loading ? (
          <p className="cap-label animate-pulse">···</p>
        ) : posts.length === 0 ? (
          <p className="max-w-[46ch] text-lg leading-relaxed text-taupe">{t.blog.empty}</p>
        ) : (
          <>
            <ul ref={listRef} className="grid list-none grid-cols-12 gap-x-4 gap-y-12 p-0 md:gap-x-6">
              {pagePosts.map((post) => {
                const tr = post.translations[lang]
                const minutes = readingMinutes(tr.body)
                const cover = coverFor(post.id, post.cover)
                return (
                  <li key={post.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <Link to={blogPostPath(lang, tr.slug)} className="group flex h-full flex-col">
                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={cover.src}
                          srcSet={cover.srcSet}
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="cap-label tnum pt-4">
                        {formatDate(post.publishedAt ?? post.updatedAt, lang)} · {t.blog.minutes.replace('{n}', String(minutes))}
                      </p>
                      <h2 className="pt-2 font-display text-[clamp(1.35rem,2vw,1.7rem)] font-bold leading-tight text-espresso transition-colors group-hover:text-gold-deep">
                        {tr.title}
                      </h2>
                      <p className="line-clamp-2 pt-2 text-[15px] leading-relaxed text-taupe">{tr.excerpt}</p>
                      <p className="u-link mt-auto w-fit pt-4">{t.blog.readMore}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {pageCount > 1 ? (
              <nav className="flex flex-wrap items-center justify-center gap-3 pt-14" aria-label={t.a11y.pagination}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPage(i)
                      listRef.current?.scrollIntoView({ block: 'start' })
                    }}
                    aria-label={t.a11y.pageN.replace('{n}', String(i + 1))}
                    aria-current={i === current ? 'page' : undefined}
                    className={
                      i === current
                        ? 'tnum flex h-11 w-11 items-center justify-center rounded-full bg-espresso font-display text-sm font-bold text-cream'
                        : 'tnum flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold text-taupe transition-colors hover:text-espresso'
                    }
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            ) : null}
          </>
        )}
      </section>

      <Closer />
    </>
  )
}
