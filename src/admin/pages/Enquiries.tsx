import { useMemo, useState } from 'react'
import { Check, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react'
import { LANG_NAME } from '@/i18n/config'
import { db, emitChange, sortEnquiries } from '@/lib/db'
import type { Enquiry, EnquiryStatus, TrackedLink } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge, Button, Card, ConfirmDialog, EmptyState, PageHeader, Textarea } from '../components/kit'
import { useAdmin } from '../context'

type Filter = 'all' | EnquiryStatus

/**
 * The inbox. Every form on the site writes here, so this is the one screen the
 * client opens daily: who asked, how to reach them, and which advert brought
 * them in.
 */
export default function Enquiries() {
  const { t, toast } = useAdmin()
  const [filter, setFilter] = useState<Filter>('all')
  const [deleting, setDeleting] = useState<Enquiry | null>(null)

  const { data, loading } = useAsync(
    async () => {
      const [enquiries, links] = await Promise.all([db.listEnquiries(), db.listLinks()])
      return { enquiries: sortEnquiries(enquiries), links }
    },
    [],
    'enquiries',
  )

  const all = data?.enquiries ?? []
  const counts: Record<Filter, number> = {
    all: all.length,
    new: all.filter((e) => e.status === 'new').length,
    open: all.filter((e) => e.status === 'open').length,
    done: all.filter((e) => e.status === 'done').length,
  }
  const visible = useMemo(
    () => (filter === 'all' ? all : all.filter((e) => e.status === filter)),
    [all, filter],
  )

  const label: Record<EnquiryStatus, string> = {
    new: t.enquiries.statusNew,
    open: t.enquiries.statusOpen,
    done: t.enquiries.statusDone,
  }

  async function patch(enquiry: Enquiry, next: Partial<Enquiry>) {
    await db.saveEnquiry({ ...enquiry, ...next })
    emitChange('enquiries')
  }

  async function remove(enquiry: Enquiry) {
    await db.deleteEnquiry(enquiry.id)
    emitChange('enquiries')
    toast(t.common.saved)
  }

  const filters: Filter[] = ['all', 'new', 'open', 'done']

  return (
    <>
      <PageHeader title={t.enquiries.title} lead={t.enquiries.lead} />

      <div className="flex flex-wrap gap-1.5 pb-5" role="group">
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors',
              filter === key
                ? 'border-espresso bg-espresso text-cream'
                : 'border-line bg-paper text-taupe hover:border-espresso/35 hover:text-espresso',
            )}
          >
            {key === 'all' ? t.common.all : label[key]}
            <span className={cn('tnum text-[12px]', filter === key ? 'text-gold-bright' : 'text-taupe/70')}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="cap-label animate-pulse">{t.common.loading}</p>
      ) : visible.length === 0 ? (
        <EmptyState>{t.enquiries.empty}</EmptyState>
      ) : (
        <div className="space-y-3">
          {visible.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              links={data?.links ?? []}
              statusLabel={label}
              onPatch={patch}
              onDelete={() => setDeleting(enquiry)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title={t.common.delete}
        message={t.enquiries.deleteConfirm}
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

function EnquiryCard({
  enquiry,
  links,
  statusLabel,
  onPatch,
  onDelete,
}: {
  enquiry: Enquiry
  links: TrackedLink[]
  statusLabel: Record<EnquiryStatus, string>
  onPatch: (enquiry: Enquiry, next: Partial<Enquiry>) => Promise<void>
  onDelete: () => void
}) {
  const { t } = useAdmin()
  const [note, setNote] = useState(enquiry.note)

  const isEmail = enquiry.contact.includes('@')
  const href = isEmail
    ? `mailto:${enquiry.contact}`
    : `tel:${enquiry.contact.replace(/[^\d+]/g, '')}`
  const campaign = enquiry.ref ? (links.find((l) => l.code === enquiry.ref)?.label ?? enquiry.ref) : null

  const tone = enquiry.status === 'new' ? 'warn' : enquiry.status === 'open' ? 'neutral' : 'ok'

  return (
    <Card bodyClassName="px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="font-display text-lg font-bold leading-tight text-espresso">
              {enquiry.name || t.enquiries.from}
            </h2>
            <Badge tone={tone}>{statusLabel[enquiry.status]}</Badge>
          </div>
          <a href={href} className="u-link mt-1.5 inline-flex text-[15px]">
            {enquiry.contact}
          </a>
        </div>
        <p className="cap-label tnum">{formatShortDate(enquiry.ts)}</p>
      </div>

      {enquiry.message ? (
        <p className="mt-4 whitespace-pre-wrap rounded-lg border border-line bg-sand-light px-4 py-3 text-[15px] leading-relaxed text-ink">
          {enquiry.message}
        </p>
      ) : null}

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
        {enquiry.service ? (
          <div className="flex gap-2">
            <dt className="cap-label">{t.enquiries.service}</dt>
            <dd className="text-ink">{enquiry.service}</dd>
          </div>
        ) : null}
        <div className="flex gap-2">
          <dt className="cap-label">{t.enquiries.source}</dt>
          <dd className={campaign ? 'font-semibold text-gold-deep' : 'text-taupe'}>
            {campaign ?? t.dashboard.direct}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="cap-label">{t.enquiries.page}</dt>
          <dd className="tnum truncate text-taupe">{enquiry.path}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="cap-label">{LANG_NAME[enquiry.lang]}</dt>
          <dd className="text-taupe">
            {enquiry.delivery === 'mailto'
              ? t.enquiries.viaMailto
              : enquiry.delivery === 'email'
                ? t.enquiries.viaEmail
                : t.enquiries.viaFormspree}
          </dd>
        </div>
      </dl>

      {enquiry.delivery === 'mailto' ? (
        <p className="mt-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-[13px] leading-relaxed text-espresso-700">
          {t.enquiries.mailtoNote}
        </p>
      ) : null}

      <div className="mt-4">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => {
            if (note !== enquiry.note) void onPatch(enquiry, { note })
          }}
          placeholder={t.enquiries.notePlaceholder}
          aria-label={t.enquiries.note}
          className="min-h-[64px] text-[14px]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <a
          href={href}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-espresso px-3 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-walnut"
        >
          {isEmail ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
          {isEmail ? t.enquiries.email : t.enquiries.call}
        </a>
        {enquiry.status !== 'open' ? (
          <Button size="sm" onClick={() => void onPatch(enquiry, { status: 'open' })}>
            {t.enquiries.markOpen}
          </Button>
        ) : null}
        {enquiry.status !== 'done' ? (
          <Button size="sm" onClick={() => void onPatch(enquiry, { status: 'done' })}>
            <Check className="h-3.5 w-3.5" />
            {t.enquiries.markDone}
          </Button>
        ) : (
          <Button size="sm" onClick={() => void onPatch(enquiry, { status: 'new' })}>
            <RotateCcw className="h-3.5 w-3.5" />
            {t.enquiries.reopen}
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          {t.common.delete}
        </Button>
      </div>
    </Card>
  )
}
