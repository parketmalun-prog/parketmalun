import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ClipboardCopy, Eye, Languages, Pencil, Trash2 } from 'lucide-react'
import { LANGS, LANG_NAME, blogPostPath } from '@/i18n/config'
import type { Lang } from '@/i18n/config'
import { db, emitChange, isTranslated } from '@/lib/db'
import type { Post } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { slugify } from '@/lib/ids'
import { Markdown, plainText } from '@/lib/markdown'
import { cn } from '@/lib/utils'
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '../components/kit'
import { translateFields, translationPrompt } from '../lib/translate'
import type { TranslatableFields } from '../lib/translate'
import { useAdmin } from '../context'

type TranslateState = 'idle' | 'running' | 'done' | 'failed'

export default function PostEditor() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, lang: adminLang } = useAdmin()

  const seeded = (location.state as { post?: Post } | null)?.post ?? null

  const { data, loading } = useAsync(() => db.listPosts(), [id])
  const [post, setPost] = useState<Post | null>(seeded)
  const [tab, setTab] = useState<Lang>(seeded?.sourceLang ?? 'is')
  const [preview, setPreview] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [translation, setTranslation] = useState<Record<Lang, TranslateState>>({
    is: 'idle',
    en: 'idle',
    pl: 'idle',
  })
  const [translateOffline, setTranslateOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Seed from storage for an existing post; a brand new post arrives via
  // navigation state, so it never waits on the list.
  useEffect(() => {
    if (post || !data) return
    const found = data.find((p) => p.id === id)
    if (found) {
      setPost(found)
      setTab(found.sourceLang)
    } else if (!loading) {
      navigate('/admin/posts', { replace: true })
    }
  }, [data, loading, id, post, navigate])

  const patch = useCallback((next: Partial<Post>) => {
    setPost((current) => (current ? { ...current, ...next } : current))
    setDirty(true)
  }, [])

  const patchField = useCallback(
    (target: Lang, field: keyof Post['translations'][Lang], value: string) => {
      setPost((current) => {
        if (!current) return current
        const translations = {
          ...current.translations,
          [target]: { ...current.translations[target], [field]: value },
        }
        return { ...current, translations }
      })
      setDirty(true)
    },
    [],
  )

  /** Keeps the slug following the title until the author edits it by hand. */
  const setTitle = useCallback(
    (target: Lang, value: string) => {
      setPost((current) => {
        if (!current) return current
        const existing = current.translations[target]
        const auto = !existing.slug || existing.slug === slugify(existing.title)
        const translations = {
          ...current.translations,
          [target]: { ...existing, title: value, slug: auto ? slugify(value) : existing.slug },
        }
        return { ...current, translations }
      })
      setDirty(true)
    },
    [],
  )

  const sourceFields = useMemo<TranslatableFields | null>(() => {
    if (!post) return null
    const tr = post.translations[post.sourceLang]
    return {
      title: tr.title,
      excerpt: tr.excerpt,
      body: tr.body,
      seoTitle: tr.seoTitle,
      seoDescription: tr.seoDescription,
    }
  }, [post])

  async function translateInto(targets: Lang[]) {
    if (!post || !sourceFields) return
    if (!sourceFields.title.trim() || !sourceFields.body.trim()) {
      setError(t.editor.publishBlocked)
      return
    }
    setError(null)
    setTranslateOffline(false)
    setTranslation((s) => ({ ...s, ...Object.fromEntries(targets.map((l) => [l, 'running'])) }))

    for (const target of targets) {
      const outcome = await translateFields(post.sourceLang, target, sourceFields)
      if (outcome.ok) {
        setPost((current) => {
          if (!current) return current
          const existing = current.translations[target]
          const fields = outcome.fields
          return {
            ...current,
            translations: {
              ...current.translations,
              [target]: {
                ...existing,
                ...fields,
                slug: existing.slug || slugify(fields.title),
              },
            },
          }
        })
        setDirty(true)
        setTranslation((s) => ({ ...s, [target]: 'done' }))
      } else {
        setTranslation((s) => ({ ...s, [target]: 'failed' }))
        if (outcome.offline) setTranslateOffline(true)
        else setError(`${t.editor.translateFailed}: ${outcome.message}`)
      }
    }
  }

  async function save(nextStatus?: Post['status']) {
    if (!post) return
    const status = nextStatus ?? post.status
    const source = post.translations[post.sourceLang]
    if (status === 'published' && (!source.title.trim() || !source.body.trim())) {
      setError(t.editor.publishBlocked)
      return
    }
    setError(null)
    setSaving(true)
    const now = Date.now()
    const next: Post = {
      ...post,
      status,
      updatedAt: now,
      publishedAt: status === 'published' ? (post.publishedAt ?? now) : post.publishedAt,
      translations: LANGS.reduce(
        (acc, l) => {
          const tr = post.translations[l]
          acc[l] = { ...tr, slug: tr.slug || slugify(tr.title) }
          return acc
        },
        { ...post.translations },
      ),
    }
    try {
      await db.savePost(next)
      emitChange('posts')
      setPost(next)
      setDirty(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!post) return
    await db.deletePost(post.id)
    emitChange('posts')
    navigate('/admin/posts', { replace: true })
  }

  async function copyPrompt(target: Lang) {
    if (!post || !sourceFields) return
    const text = translationPrompt(post.sourceLang, target, sourceFields)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.prompt(t.editor.copyPrompt, text)
    }
  }

  if (!post) {
    return <p className="cap-label animate-pulse">{t.common.loading}</p>
  }

  const tr = post.translations[tab]
  const isSource = tab === post.sourceLang
  const targets = LANGS.filter((l) => l !== post.sourceLang)

  return (
    <>
      <Link
        to="/admin/posts"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-taupe transition-colors hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.editor.back}
      </Link>

      <PageHeader
        title={post.translations[post.sourceLang].title || t.editor.createTitle}
        actions={
          <>
            {dirty ? <Badge tone="warn">{t.editor.unsaved}</Badge> : null}
            {/* Saving a published post keeps it published. Taking it down is a
                separate, clearly labelled button, never a side effect of Save. */}
            {post.status === 'published' ? (
              <>
                <Button variant="primary" onClick={() => save()} disabled={saving}>
                  {saving ? t.common.saving : t.common.save}
                </Button>
                <Button onClick={() => save('draft')} disabled={saving}>
                  {t.editor.unpublish}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => save('draft')} disabled={saving}>
                  {saving ? t.common.saving : t.editor.saveDraft}
                </Button>
                <Button variant="primary" onClick={() => save('published')} disabled={saving}>
                  {t.editor.publish}
                </Button>
              </>
            )}
            <Button variant="danger" onClick={() => setDeleting(true)} aria-label={t.common.delete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />

      {error ? (
        <p className="mb-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      {/* language tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5" role="tablist">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={tab === l}
            onClick={() => setTab(l)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors',
              tab === l
                ? 'border-espresso bg-espresso text-cream'
                : 'border-line bg-paper text-taupe hover:border-espresso/35 hover:text-espresso',
            )}
          >
            {LANG_NAME[l]}
            {l === post.sourceLang ? (
              <span className={cn('text-[11px] font-medium uppercase tracking-[0.08em]', tab === l ? 'text-gold-bright' : 'text-gold-deep')}>
                {t.editor.sourceLang}
              </span>
            ) : isTranslated(post, l) ? (
              <Check className={cn('h-3.5 w-3.5', tab === l ? 'text-gold-bright' : 'text-positive')} />
            ) : (
              <span className={cn('text-[11px] font-medium uppercase tracking-[0.08em]', tab === l ? 'text-cream/60' : 'text-taupe/70')}>
                {t.editor.missing}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------------------------- main column ---------------------------- */}
        <div className="space-y-5">
          <Card>
            <div className="space-y-5">
              <Field label={t.editor.postTitle} htmlFor={`title-${tab}`}>
                <Input
                  id={`title-${tab}`}
                  value={tr.title}
                  onChange={(e) => setTitle(tab, e.target.value)}
                  className="font-display text-lg font-bold"
                />
              </Field>

              <Field label={t.editor.slug} htmlFor={`slug-${tab}`}>
                <Input
                  id={`slug-${tab}`}
                  value={tr.slug}
                  onChange={(e) => patchField(tab, 'slug', slugify(e.target.value))}
                  className="tnum"
                />
              </Field>

              <Field label={t.editor.excerpt} hint={t.editor.excerptHelp} htmlFor={`excerpt-${tab}`}>
                <Textarea
                  id={`excerpt-${tab}`}
                  value={tr.excerpt}
                  onChange={(e) => patchField(tab, 'excerpt', e.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
            </div>
          </Card>

          <Card
            title={t.editor.body}
            hint={t.editor.bodyHelp}
            right={
              <div className="flex rounded-lg border border-line bg-paper p-1">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  aria-pressed={!preview}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
                    preview ? 'text-taupe hover:text-espresso' : 'bg-espresso text-cream',
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t.editor.write}
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  aria-pressed={preview}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
                    preview ? 'bg-espresso text-cream' : 'text-taupe hover:text-espresso',
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t.editor.preview}
                </button>
              </div>
            }
          >
            {preview ? (
              <div className="max-w-[68ch]">
                {tr.body.trim() ? (
                  <Markdown body={tr.body} />
                ) : (
                  <p className="text-[15px] text-taupe">{t.editor.needBody}</p>
                )}
              </div>
            ) : (
              <Textarea
                value={tr.body}
                onChange={(e) => patchField(tab, 'body', e.target.value)}
                className="min-h-[440px] font-mono text-[13.5px]"
                spellCheck
              />
            )}
          </Card>

          <Card title="SEO">
            <div className="space-y-5">
              <Field
                label={t.editor.seoTitle}
                htmlFor={`seotitle-${tab}`}
                right={<span className="cap-label tnum">{tr.seoTitle.length}/60</span>}
              >
                <Input
                  id={`seotitle-${tab}`}
                  value={tr.seoTitle}
                  onChange={(e) => patchField(tab, 'seoTitle', e.target.value)}
                  placeholder={tr.title ? `${tr.title} | Expert Parket og Mál` : ''}
                />
              </Field>
              <Field
                label={t.editor.seoDescription}
                htmlFor={`seodesc-${tab}`}
                right={<span className="cap-label tnum">{tr.seoDescription.length}/155</span>}
              >
                <Textarea
                  id={`seodesc-${tab}`}
                  value={tr.seoDescription}
                  onChange={(e) => patchField(tab, 'seoDescription', e.target.value)}
                  className="min-h-[80px]"
                  placeholder={tr.excerpt || plainText(tr.body, 150)}
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* ----------------------------- side column ---------------------------- */}
        <div className="space-y-5">
          <Card title={t.editor.translate}>
            <div className="space-y-4">
              <Field label={t.editor.sourceLang} htmlFor="source-lang">
                <Select
                  id="source-lang"
                  value={post.sourceLang}
                  onChange={(e) => patch({ sourceLang: e.target.value as Lang })}
                >
                  {LANGS.map((l) => (
                    <option key={l} value={l}>
                      {LANG_NAME[l]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => translateInto(targets)}
                disabled={targets.some((l) => translation[l] === 'running')}
              >
                <Languages className="h-4 w-4" />
                {targets.some((l) => translation[l] === 'running')
                  ? t.editor.translating
                  : t.editor.translate}
              </Button>

              <ul className="space-y-1.5">
                {targets.map((l) => (
                  <li key={l} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink">{LANG_NAME[l]}</span>
                    <span
                      className={cn(
                        'text-[13px] font-semibold',
                        translation[l] === 'done'
                          ? 'text-positive'
                          : translation[l] === 'failed'
                            ? 'text-danger'
                            : translation[l] === 'running'
                              ? 'text-gold-deep'
                              : 'text-taupe',
                      )}
                    >
                      {translation[l] === 'running'
                        ? t.editor.translating
                        : translation[l] === 'done'
                          ? t.editor.translated
                          : translation[l] === 'failed'
                            ? t.editor.translateFailed
                            : isTranslated(post, l)
                              ? t.editor.translated
                              : t.editor.missing}
                    </span>
                  </li>
                ))}
              </ul>

              {translateOffline ? (
                <div className="space-y-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
                  <p className="text-[13px] leading-relaxed text-espresso-700">
                    {t.editor.translateOffline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {targets.map((l) => (
                      <Button key={l} size="sm" onClick={() => copyPrompt(l)}>
                        <ClipboardCopy className="h-3.5 w-3.5" />
                        {LANG_NAME[l]}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}

              <p className="text-[13px] leading-snug text-taupe">{t.editor.untranslatedNote}</p>
            </div>
          </Card>

          <Card title={t.posts.title}>
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="cap-label">{t.posts.published}</span>
                {post.status === 'published' ? (
                  <Badge tone="ok">{t.posts.published}</Badge>
                ) : (
                  <Badge tone="warn">{t.posts.draft}</Badge>
                )}
              </div>

              <Field label={t.editor.cover} hint={t.editor.coverHelp} htmlFor="cover">
                <Input
                  id="cover"
                  value={post.cover ?? ''}
                  onChange={(e) => patch({ cover: e.target.value.trim() || null })}
                  placeholder="https://"
                />
              </Field>
              {post.cover ? (
                <img
                  src={post.cover}
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg border border-line object-cover"
                />
              ) : null}

              <Field label={t.editor.tags} hint={t.editor.tagsHelp} htmlFor="tags">
                <Input
                  id="tags"
                  value={post.tags.join(', ')}
                  onChange={(e) =>
                    patch({
                      tags: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>

              {post.status === 'published' && isTranslated(post, tab) ? (
                <Link
                  to={blogPostPath(tab, tr.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-link text-sm"
                >
                  {t.posts.openPublic}
                </Link>
              ) : null}
            </div>
          </Card>

          {!isSource ? (
            <p className="text-[13px] leading-relaxed text-taupe">
              {adminLang === 'is'
                ? 'Þú ert að breyta þýðingu. Upprunatextinn er á öðrum flipa.'
                : 'You are editing a translation. The source text lives on another tab.'}
            </p>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={deleting}
        title={t.common.delete}
        message={t.editor.deleteConfirm}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onClose={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </>
  )
}
