import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ExternalLink, FileText, Inbox, LayoutDashboard, Link2, LogOut, Menu, Settings, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { countNew, db, isShared } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { ADMIN_LANGS, ADMIN_LANG_NAME } from '../copy'
import { useAdmin } from '../context'

/**
 * Admin chrome: an espresso rail on the left from lg up, a compact bar with a
 * slide-down menu below that. The rail carries navigation and the two facts
 * worth seeing from every screen, which storage is live and how to leave.
 */
export function AdminShell({ children, onSignOut }: { children: ReactNode; onSignOut: () => void }) {
  const { t, lang, setLang } = useAdmin()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // The unanswered count rides on the navigation, so a new enquiry is visible
  // from every screen rather than only on the one nobody has open.
  const { data: enquiries } = useAsync(() => db.listEnquiries(), [], 'enquiries')
  const unanswered = countNew(enquiries ?? [])

  const items = [
    { to: '/admin', end: true, label: t.nav.dashboard, Icon: LayoutDashboard, badge: 0 },
    { to: '/admin/enquiries', end: false, label: t.nav.enquiries, Icon: Inbox, badge: unanswered },
    { to: '/admin/links', end: false, label: t.nav.links, Icon: Link2, badge: 0 },
    { to: '/admin/posts', end: false, label: t.nav.posts, Icon: FileText, badge: 0 },
    { to: '/admin/settings', end: false, label: t.nav.settings, Icon: Settings, badge: 0 },
  ]

  const nav = (
    <nav className="flex flex-col gap-1" aria-label={t.nav.menu}>
      {items.map(({ to, end, label, Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-cream/10 text-cream' : 'text-cream/60 hover:bg-cream/[0.06] hover:text-cream',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-gold-bright' : 'text-cream/45')} />
              <span className="flex-1">{label}</span>
              {badge > 0 ? (
                <span className="tnum rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-espresso-950">
                  {badge}
                </span>
              ) : null}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )

  const footer = (
    <div className="space-y-4">
      <div className="rounded-lg border border-cream/15 px-3.5 py-3">
        <p className="cap-label-dark">{isShared ? t.storage.cloud : t.storage.local}</p>
        <p className="pt-1 text-[12px] leading-snug text-cream/50">
          {isShared ? t.storage.cloudNote : t.storage.localNote}
        </p>
        <p className="tnum pt-1 text-[12px] text-cream/35">{db.label}</p>
      </div>

      <div className="flex items-center gap-1" role="group" aria-label={t.settings.language}>
        {ADMIN_LANGS.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            title={ADMIN_LANG_NAME[code]}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors',
              lang === code ? 'bg-cream/15 text-cream' : 'text-cream/45 hover:text-cream',
            )}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-cream/[0.06] hover:text-cream"
        >
          <ExternalLink className="h-[18px] w-[18px] text-cream/45" />
          {t.nav.viewSite}
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-cream/60 transition-colors hover:bg-cream/[0.06] hover:text-cream"
        >
          <LogOut className="h-[18px] w-[18px] text-cream/45" />
          {t.nav.signOut}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh bg-cream">
      {/* rail, desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-espresso-950 bg-espresso px-4 py-6 lg:flex">
        <div className="space-y-8">
          <div className="px-3.5">
            <p className="font-display text-xl font-bold leading-none text-cream">Expert Parket</p>
            <p className="cap-label-dark pt-2">{t.login.title}</p>
          </div>
          {nav}
        </div>
        {footer}
      </aside>

      {/* bar, mobile and tablet */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-4 px-4">
          <p className="font-display text-lg font-bold leading-none text-espresso">Expert Parket</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-menu"
            aria-label={t.nav.menu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-espresso/20 text-espresso"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <div id="admin-menu" className="space-y-5 border-t border-espresso-950 bg-espresso px-4 py-5">
            {nav}
            {footer}
          </div>
        ) : null}
      </header>

      <main className="px-4 py-7 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1100px]">{children}</div>
      </main>
    </div>
  )
}
