import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { LANGS, blogPostPath } from '@/i18n/config'
import { db, emitChange, emptyPost, isTranslated } from '@/lib/db'
import type { Post } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge, Button, Card, ConfirmDialog, EmptyState, Input, PageHeader } from '../components/kit'
import { useAdmin } from '../context'

export default function Posts() {
  const { t } = useAdmin()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState<Post | null>(null)

  const { data, loading } = useAsync(() => db.listPosts(), [], 'posts')

  const posts = useMemo(() => {
    const all = (data ?? []).slice().sort((a, b) => b.updatedAt - a.updatedAt)
    const needle = query.trim().toLowerCase()
    if (!needle) return all
    return all.filter((post) =>
      LANGS.some((l) => post.translations[l].title.toLowerCase().includes(needle)),
    )
  }, [data, query])

  async function remove(post: Post) {
    await db.deletePost(post.id)
    emitChange('posts')
  }

  function create() {
    const post = emptyPost('is')
    navigate(`/admin/posts/${post.id}`, { state: { post } })
  }

  return (
    <>
      <PageHeader
        title={t.posts.title}
        lead={t.posts.lead}
        actions={
          <Button variant="primary" onClick={create}>
            <Plus className="h-4 w-4" />
            {t.posts.create}
          </Button>
        }
      />

      <div className="max-w-sm pb-5">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.posts.searchPlaceholder}
          aria-label={t.common.search}
        />
      </div>

      {loading ? (
        <p className="cap-label animate-pulse">{t.common.loading}</p>
      ) : posts.length === 0 ? (
        <EmptyState action={<Button variant="primary" onClick={create}>{t.posts.create}</Button>}>
          {t.posts.empty}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const primary = post.translations[post.sourceLang]
            const publicPath = isTranslated(post, post.sourceLang)
              ? blogPostPath(post.sourceLang, primary.slug)
              : null
            return (
              <Card key={post.id} bodyClassName="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h2 className="font-display text-lg font-bold leading-tight text-espresso">
                        {primary.title || t.posts.create}
                      </h2>
                      {post.status === 'published' ? (
                        <Badge tone="ok">{t.posts.published}</Badge>
                      ) : (
                        <Badge tone="warn">{t.posts.draft}</Badge>
                      )}
                    </div>

                    {primary.excerpt ? (
                      <p className="max-w-[70ch] pt-2 text-[14px] leading-relaxed text-taupe">
                        {primary.excerpt}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3">
                      <span className="cap-label tnum">
                        {t.posts.updated} {formatShortDate(post.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="cap-label">{t.posts.languages}</span>
                        {LANGS.map((l) => (
                          <span
                            key={l}
                            title={isTranslated(post, l) ? l.toUpperCase() : t.editor.missing}
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase',
                              isTranslated(post, l)
                                ? 'bg-espresso text-cream'
                                : 'bg-sand-light text-taupe/70',
                            )}
                          >
                            {l}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => navigate(`/admin/posts/${post.id}`)}>
                      <Pencil className="h-3.5 w-3.5" />
                      {t.posts.edit}
                    </Button>
                    {publicPath && post.status === 'published' ? (
                      <Link
                        to={publicPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-espresso/20 bg-paper px-3 py-2 text-[13px] font-semibold text-espresso transition-colors hover:border-espresso/45 hover:bg-sand-light"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t.posts.openPublic}
                      </Link>
                    ) : null}
                    <Button size="sm" variant="danger" onClick={() => setDeleting(post)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      {t.common.delete}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title={t.common.delete}
        message={t.posts.deleteConfirm}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) void remove(deleting)
        }}
      />
    </>
  )
}
