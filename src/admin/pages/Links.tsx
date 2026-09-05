import { useMemo, useState } from 'react'
import { Archive, Copy, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { LANGS, LANG_NAME, ROUTE_KEYS, pathFor } from '@/i18n/config'
import { db, emitChange } from '@/lib/db'
import type { TrackedLink } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { newCode, newId } from '@/lib/ids'
import { formatNumber, formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Toggle,
} from '../components/kit'
import { useAdmin } from '../context'

/** How far back the click and view counters look. */
const STATS_WINDOW_DAYS = 365

const CUSTOM = '__custom'

export default function Links() {
  const { t } = useAdmin()
  const [editing, setEditing] = useState<TrackedLink | null>(null)
  const [deleting, setDeleting] = useState<TrackedLink | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const { data, loading, reload } = useAsync(
    async () => {
      const from = Date.now() - STATS_WINDOW_DAYS * 86_400_000
      const [links, clicks, visits] = await Promise.all([db.listLinks(), db.listClicks(from), db.listVisits(from)])
      return { links, clicks, visits }
    },
    [],
    'links',
  )

  const rows = useMemo(() => {
    if (!data) return []
    return data.links
      .filter((l) => showArchived || !l.archived)
      .map((link) => ({
        link,
        clicks: data.clicks.filter((c) => c.code === link.code).length,
        views: data.visits.filter((v) => v.ref === link.code).length,
      }))
  }, [data, showArchived])

  const origin = typeof window === 'undefined' ? '' : window.location.origin

  async function copy(code: string) {
    const url = `${origin}/l/${code}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt(t.links.shareUrl, url)
      return
    }
    setCopied(code)
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800)
  }

  async function toggleArchive(link: TrackedLink) {
    await db.saveLink({ ...link, archived: !link.archived })
    emitChange('links')
  }

  async function remove(link: TrackedLink) {
    await db.deleteLink(link.id)
    emitChange('links')
  }

  return (
    <>
      <PageHeader
        title={t.links.title}
        lead={t.links.lead}
        actions={
          <Button
            variant="primary"
            onClick={() =>
              setEditing({
                id: newId(),
                code: newCode(),
                label: '',
                target: pathFor('home', 'is'),
                note: '',
                createdAt: Date.now(),
                archived: false,
              })
            }
          >
            <Plus className="h-4 w-4" />
            {t.links.create}
          </Button>
        }
      />

      <div className="pb-5">
        <Toggle id="show-archived" checked={showArchived} onChange={setShowArchived} label={t.links.showArchived} />
      </div>

      {loading ? (
        <p className="cap-label animate-pulse">{t.common.loading}</p>
      ) : rows.length === 0 ? (
        <EmptyState>{t.links.empty}</EmptyState>
      ) : (
        <div className="space-y-3">
          {rows.map(({ link, clicks, views }) => (
            <Card key={link.id} bodyClassName="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="font-display text-lg font-bold leading-tight text-espresso">{link.label}</h2>
                    {link.archived ? <Badge>{t.links.archived}</Badge> : <Badge tone="ok">{t.links.active}</Badge>}
                  </div>

                  <button
                    type="button"
                    onClick={() => copy(link.code)}
                    className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-lg border border-line bg-sand-light px-3 py-2 text-left transition-colors hover:border-espresso/30"
                  >
                    <span className="tnum truncate text-[13px] text-espresso">
                      {origin}/l/{link.code}
                    </span>
                    <Copy className="h-3.5 w-3.5 shrink-0 text-taupe" />
                    <span className={cn('cap-label shrink-0', copied === link.code ? 'text-positive' : 'text-taupe')}>
                      {copied === link.code ? t.common.copied : t.common.copy}
                    </span>
                  </button>

                  <p className="tnum pt-2.5 text-[13px] text-taupe">
                    {t.links.target}: {link.target} · {t.links.created} {formatShortDate(link.createdAt)}
                  </p>
                  {link.note ? <p className="pt-1.5 text-[13px] leading-snug text-taupe">{link.note}</p> : null}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="cap-label">{t.links.clicks}</p>
                    <p className="tnum font-sans text-2xl font-bold leading-none tracking-tight text-espresso">
                      {formatNumber(clicks)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="cap-label">{t.links.visits}</p>
                    <p className="tnum font-sans text-2xl font-bold leading-none tracking-tight text-taupe">
                      {formatNumber(views)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Button size="sm" onClick={() => setEditing(link)}>
                  <Pencil className="h-3.5 w-3.5" />
                  {t.posts.edit}
                </Button>
                <Button size="sm" onClick={() => toggleArchive(link)}>
                  {link.archived ? <RotateCcw className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                  {link.archived ? t.links.restore : t.links.archive}
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleting(link)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  {t.common.delete}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <LinkDialog
          key={editing.id}
          link={editing}
          existing={data?.links ?? []}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title={t.common.delete}
        message={t.links.deleteConfirm}
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

/* ------------------------------ create / edit ------------------------------ */

function LinkDialog({
  link,
  existing,
  onClose,
  onSaved,
}: {
  link: TrackedLink
  existing: TrackedLink[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t, toast } = useAdmin()
  // Mounted with key={link.id}, so a fresh dialog always starts from its link.
  const [draft, setDraft] = useState<TrackedLink>(link)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const targets = useMemo(
    () =>
      LANGS.map((l) => ({
        lang: l,
        options: ROUTE_KEYS.map((key) => ({ value: pathFor(key, l), label: pathFor(key, l) })),
      })),
    [],
  )

  const known = targets.some((group) => group.options.some((o) => o.value === draft.target))

  async function save() {
    const code = draft.code.trim().toLowerCase()
    if (!draft.label.trim()) return setError(t.common.required)
    if (!/^[a-z0-9-]{3,32}$/.test(code)) return setError(t.links.codeHelp)
    if (existing.some((l) => l.code === code && l.id !== draft.id)) return setError(t.links.codeTaken)
    if (!draft.target.startsWith('/')) return setError(t.links.codeHelp)

    setSaving(true)
    try {
      await db.saveLink({ ...draft, code, label: draft.label.trim(), note: draft.note.trim() })
      emitChange('links')
      toast(t.common.saved)
      onSaved()
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), 'bad')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={existing.some((l) => l.id === draft.id) ? t.links.edit : t.links.create}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t.common.cancel}</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? t.common.saving : t.common.save}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label={t.links.label} hint={t.links.labelHelp} htmlFor="link-label" error={error ?? undefined}>
          <Input
            id="link-label"
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            placeholder="Facebook"
          />
        </Field>

        <Field label={t.links.target} htmlFor="link-target">
          <Select
            id="link-target"
            value={known ? draft.target : CUSTOM}
            onChange={(e) =>
              setDraft({ ...draft, target: e.target.value === CUSTOM ? draft.target : e.target.value })
            }
          >
            {targets.map((group) => (
              <optgroup key={group.lang} label={LANG_NAME[group.lang]}>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={CUSTOM}>{t.links.customTarget}</option>
          </Select>
          {!known ? (
            <Input
              className="mt-2"
              value={draft.target}
              onChange={(e) => setDraft({ ...draft, target: e.target.value })}
              placeholder="/en/services"
            />
          ) : null}
        </Field>

        <Field label={t.links.code} hint={t.links.codeHelp} htmlFor="link-code">
          <Input
            id="link-code"
            value={draft.code}
            onChange={(e) => setDraft({ ...draft, code: e.target.value })}
            className="tnum"
          />
        </Field>

        <Field label={`${t.links.note} (${t.common.optional})`} htmlFor="link-note">
          <Input
            id="link-note"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
        </Field>
      </div>
    </Modal>
  )
}
