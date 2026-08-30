import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { db, emitChange, isShared } from '@/lib/db'
import type { Enquiry, Post, TrackedLink } from '@/lib/db'
import { isOptedOut, setOptedOut } from '@/lib/analytics'
import { Badge, Button, Card, ConfirmDialog, Field, Input, PageHeader, Toggle } from '../components/kit'
import { sha256Hex } from '../auth'
import { ADMIN_LANGS, ADMIN_LANG_NAME } from '../copy'
import { useAdmin } from '../context'

type Backup = {
  version: 1
  exportedAt: string
  posts: Post[]
  links: TrackedLink[]
  /** Older backups predate the inbox, so this is read defensively on import. */
  enquiries?: Enquiry[]
}

export default function Settings() {
  const { t, lang, setLang, toast } = useAdmin()
  const [optOut, setOptOut] = useState(() => isOptedOut())
  const [password, setPassword] = useState('')
  const [hash, setHash] = useState('')
  const [clearing, setClearing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function makeHash(value: string) {
    setPassword(value)
    setHash(value ? await sha256Hex(value) : '')
  }

  async function exportData() {
    const [posts, links, enquiries] = await Promise.all([
      db.listPosts(),
      db.listLinks(),
      db.listEnquiries(),
    ])
    const backup: Backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      posts,
      links,
      enquiries,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `expert-parket-backup-${backup.exportedAt.slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function importData(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as Backup
      if (!Array.isArray(parsed.posts) || !Array.isArray(parsed.links)) throw new Error('shape')
      for (const post of parsed.posts) await db.savePost(post)
      for (const link of parsed.links) await db.saveLink(link)
      for (const enquiry of parsed.enquiries ?? []) await db.saveEnquiry(enquiry)
      emitChange('posts')
      emitChange('links')
      emitChange('enquiries')
      toast(t.settings.importDone)
    } catch {
      toast(t.settings.importFailed, 'bad')
    }
  }

  return (
    <>
      <PageHeader title={t.settings.title} lead={t.settings.lead} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title={t.settings.storage}
          right={isShared ? <Badge tone="ok">{t.storage.cloud}</Badge> : <Badge>{t.storage.local}</Badge>}
        >
          <p className="text-[15px] leading-relaxed text-ink">
            {isShared ? t.settings.storageCloudBody : t.settings.storageLocalBody}
          </p>
          {!isShared ? (
            <p className="mt-4 rounded-lg border border-line bg-sand-light px-4 py-3 text-[13px] leading-relaxed text-taupe">
              {t.settings.storageHow}
            </p>
          ) : null}
        </Card>

        <Card title={t.settings.tracking}>
          <p className="pb-4 text-[15px] leading-relaxed text-ink">{t.settings.trackingBody}</p>
          <Toggle
            id="opt-out"
            checked={optOut}
            label={t.settings.optOut}
            onChange={(next) => {
              setOptOut(next)
              setOptedOut(next)
            }}
          />
        </Card>

        <Card title={t.settings.access}>
          <p className="pb-5 text-[15px] leading-relaxed text-ink">{t.settings.accessBody}</p>
          <div className="space-y-4 border-t border-line pt-5">
            <p className="text-[13px] leading-relaxed text-taupe">{t.settings.changePasswordBody}</p>
            <Field label={t.settings.newPassword} htmlFor="new-password">
              <Input
                id="new-password"
                type="text"
                value={password}
                autoComplete="off"
                onChange={(e) => void makeHash(e.target.value)}
              />
            </Field>
            {hash ? (
              <Field label={t.settings.hashResult}>
                <Input readOnly value={`VITE_ADMIN_PASSWORD_HASH=${hash}`} className="tnum text-[12px]" />
              </Field>
            ) : null}
          </div>
        </Card>

        <Card title={t.settings.data}>
          <p className="pb-4 text-[15px] leading-relaxed text-ink">{t.settings.exportBody}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportData}>
              <Download className="h-4 w-4" />
              {t.settings.export}
            </Button>
            <Button onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
              {t.settings.import}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void importData(file)
                e.target.value = ''
              }}
            />
          </div>

          <div className="mt-5 border-t border-line pt-5">
            <p className="pb-4 text-[15px] leading-relaxed text-ink">{t.settings.clearStatsBody}</p>
            <Button variant="danger" onClick={() => setClearing(true)}>
              {t.settings.clearStats}
            </Button>
          </div>
        </Card>

        <Card title={t.settings.language}>
          <div className="flex gap-2">
            {ADMIN_LANGS.map((code) => (
              <Button
                key={code}
                variant={lang === code ? 'primary' : 'outline'}
                onClick={() => setLang(code)}
              >
                {ADMIN_LANG_NAME[code]}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={clearing}
        title={t.settings.clearStats}
        message={t.settings.clearConfirm}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onClose={() => setClearing(false)}
        onConfirm={() => {
          void db.clearStats().then(() => {
            emitChange('stats')
            toast(t.common.saved)
          })
        }}
      />
    </>
  )
}
