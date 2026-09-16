import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Closer } from '@/components/Closer'
import { LineReveal } from '@/components/motionPrimitives'
import { useLang, useUi } from '@/i18n/context'
import { LANGS, blogPostPath, pathFor } from '@/i18n/config'
import type { Lang } from '@/i18n/config'
import { isTranslated, publishedIn } from '@/lib/db'
import { listPublicPosts, publicPostSeed } from '@/lib/publicPosts'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import { Markdown, articleHeadings, plainText, readingMinutes } from '@/lib/markdown'
import { imgSources } from '@/lib/img'
import { articleSchema } from '@/lib/articleSchema'
import { site } from '@/data/site'

/** One article. The slug in the URL is the slug of the language being read. */
export default function BlogPost() {
  const { slug = '' } = useParams()
  const { lang, path } = useLang()
  const t = useUi()
  // Seeded so the page prerenders with real articles instead of a spinner.
  const { data, loading } = useAsync(listPublicPosts, [], 'posts', publicPostSeed)

  const posts = publishedIn(data ?? [], lang)
  const post = posts.find((p) => p.translations[lang].slug === slug)
  const others = posts.filter((p) => p.id !== post?.id).slice(0, 3)

  const alternates = useMemo(() => {
    if (!post) return undefined
    const map: Partial<Record<Lang, string>> = {}
    for (const l of LANGS) {
      map[l] = isTranslated(post, l) ? blogPostPath(l, post.translations[l].slug) : pathFor('blog', l)
    }
    return map
  }, [post])

  if (loading) {
    return (
      <section className="container-x flex min-h-[60vh] items-center">
        <p className="cap-label animate-pulse">···</p>
      </section>
    )
  }

  if (!post) {
    return (
      <>
        <Seo title={t.blog.notFound} noindex />
        <section className="container-x flex min-h-[60vh] flex-col justify-center py-20">
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-espresso">
            {t.blog.notFound}
          </h1>
          <Link to={path('blog')} className="u-link mt-6 self-start">
            {t.blog.back}
          </Link>
        </section>
      </>
    )
  }

  const tr = post.translations[lang]
  const minutes = readingMinutes(tr.body)
  const cover = imgSources(post.cover ?? undefined)
  const headings = articleHeadings(tr.body)
  const contentsLabel = { is: 'Í þessari grein', en: 'In this guide', pl: 'W tym poradniku' }[lang]

  return (
    <>
      <Seo
        title={tr.seoTitle || `${tr.title} | Expert Parket og Mál`}
        description={tr.seoDescription || tr.excerpt || plainText(tr.body)}
        canonicalPath={blogPostPath(lang, tr.slug)}
        alternates={alternates}
        image={post.cover ?? undefined}
        imageAlt={tr.coverAlt}
        type="article"
      />

      <article className="container-x pt-10 md:pt-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post, lang)).replace(/</g, '\\u003c') }} />
        <Link to={path('blog')} className="cap-label transition-colors hover:text-espresso">
          {t.blog.back}
        </Link>

        <LineReveal
          as="h1"
          lines={[tr.title]}
          className="pt-5 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.02em] text-espresso"
        />

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-7">
          <Link to={path('about')} className="cap-label u-link">{site.name}</Link>
          <p className="cap-label tnum">
            {t.blog.published} <time dateTime={new Date(post.publishedAt ?? post.updatedAt).toISOString()}>{formatDate(post.publishedAt ?? post.updatedAt, lang)}</time>
          </p>
          <p className="cap-label tnum">{t.blog.minutes.replace('{n}', String(minutes))}</p>
          {post.tags.length ? (
            <p className="cap-label">{post.tags.join(' · ')}</p>
          ) : null}
        </div>

        {post.cover ? (
          <figure className="mt-10">
            <img
              src={cover.src}
              srcSet={cover.srcSet || undefined}
              sizes="(min-width: 1440px) 1320px, 100vw"
              width={cover.width}
              height={cover.height}
              alt={tr.coverAlt || tr.title}
              fetchpriority="high"
              decoding="async"
              className="aspect-[16/9] w-full rounded-lg border border-line object-cover"
            />
            {tr.coverAlt ? <figcaption className="cap-label pt-3">{tr.coverAlt}</figcaption> : null}
          </figure>
        ) : null}

        <div className="grid grid-cols-12 gap-x-4 pb-16 pt-12 md:gap-x-6">
          {headings.length >= 4 ? (
            <aside className="col-span-12 pb-10 lg:col-span-3 lg:col-start-10 lg:row-start-1">
              <nav aria-label={contentsLabel} className="rounded-lg border border-line bg-sand-light p-5 lg:sticky lg:top-28">
                <p className="cap-label pb-4 text-espresso">{contentsLabel}</p>
                <ol className="space-y-3">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <Link to={`#${heading.id}`} className="text-sm leading-snug text-walnut underline-offset-4 hover:underline">{heading.text}</Link>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex gap-4 border-t border-line pt-4">
                  {LANGS.filter((l) => l !== lang && isTranslated(post, l)).map((l) => (
                    <Link key={l} to={blogPostPath(l, post.translations[l].slug)} lang={l} hrefLang={l} className="u-link text-sm">
                      {{ is: 'Íslenska', en: 'English', pl: 'Polski' }[l]}
                    </Link>
                  ))}
                </div>
              </nav>
            </aside>
          ) : null}
          <div className="col-span-12 max-w-[68ch] md:col-span-10 lg:col-span-8 lg:col-start-1 lg:row-start-1">
            {tr.excerpt ? (
              <p className="pb-10 font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug text-walnut">
                {tr.excerpt}
              </p>
            ) : null}
            <Markdown body={tr.body} />
          </div>
        </div>
      </article>

      {others.length ? (
        <section className="container-x pb-16">
          <ul className="pt-2">
            {others.map((other) => {
              const otr = other.translations[lang]
              return (
                <li key={other.id}>
                  <Link
                    to={blogPostPath(lang, otr.slug)}
                    className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-espresso/15 py-6 transition-colors hover:bg-sand-light"
                  >
                    <h2 className="font-display text-xl font-bold leading-tight text-espresso md:text-2xl">
                      {otr.title}
                    </h2>
                    <span className="cap-label tnum transition-colors group-hover:text-gold-deep">
                      {formatDate(other.publishedAt ?? other.updatedAt, lang)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <Closer />
    </>
  )
}
