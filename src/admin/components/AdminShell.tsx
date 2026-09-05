import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ExternalLink, FileText, Inbox, LayoutDashboard, Link2, LogOut, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { countNew, db, isShared } from '@/lib/db'
import { useAsync } from '@/lib/useAsync'
import { lockScroll } from '@/lib/smoothScroll'
import { LogoMark } from '@/components/Logo'
import { ADMIN_LANGS, ADMIN_LANG_NAME } from '../copy'
import { useAdmin } from '../context'

/**
 * Admin chrome, cut the same way as the public site so the panel reads as a
 * back room of the same house rather than a different product.
 *
 * Phone and tablet get the public masthead's three-part bar: MENU on the
 * left, the real mark alone in the centre, the inbox with its unanswered
 * count on the right. The menu is the same espresso curtain that slides down
 * from behind the bar, links centred in the display serif, and it closes on
 * Escape, on the dimmed page behind it and on any navigation. From lg up the
 * curtain gives way to a fixed espresso rail with the mark on a cream plaque.
 */
export function AdminShell({ children, onSignOut }: { children: ReactNode; onSignOut: () => void }) {
  const { t, lang, setLang } = useAdmin()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.key, location.pathname])

  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Widening past the desktop cut takes the burger away; without this a
  // curtain opened at phone width stays open behind a rail that cannot close it.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  // The unanswered count rides on the chrome, so a new enquiry is visible
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

  const languages = (
    <div className="flex items-center gap-1" role="group" aria-label={t.settings.language}>
      {ADMIN_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={ADMIN_LANG_NAME[code]}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.13em] transition-colors',
            lang === code ? 'text-gold-bright' : 'text-cream/45 hover:text-cream',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )

  const storage = (
    <p className="text-[12px] leading-snug text-cream/45">
      <span className="font-semibold uppercase tracking-[0.13em] text-cream/60">
        {isShared ? t.storage.cloud : t.storage.local}
      </span>
      <span className="px-2 text-cream/25">·</span>
      {isShared ? t.storage.cloudNote : t.storage.localNote}
    </p>
  )

  return (
    <div className="min-h-dvh bg-cream">
      {/* ---------------------------------------------------------------- rail, desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between bg-espresso px-5 py-6 lg:flex">
        <div className="space-y-8">
          {/* White, not cream. The mark is the client's own artwork on a
              transparent ground, so the plaque behind it should read as paper
              and nothing else; a tinted one put a second colour around a logo
              that already carries three. Tight padding too, so the plaque is
              the mark rather than a slab with a mark somewhere inside it. */}
          <Link to="/admin" className="block rounded-xl bg-white px-3 py-3" aria-label={t.nav.dashboard}>
            <LogoMark className="mx-auto h-[72px]" sizes="150px" />
          </Link>

          <nav className="flex flex-col gap-0.5" aria-label={t.nav.menu}>
            {items.map(({ to, end, label, Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors',
                    isActive ? 'bg-cream/10 text-cream' : 'text-cream/55 hover:bg-cream/[0.06] hover:text-cream',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-gold-bright' : 'text-cream/40')} />
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
        </div>

        <div className="space-y-5">
          <div className="rule-dark pt-5">{storage}</div>
          {languages}
          <div className="flex flex-col gap-0.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream/55 transition-colors hover:bg-cream/[0.06] hover:text-cream"
            >
              <ExternalLink className="h-[18px] w-[18px] text-cream/40" />
              {t.nav.viewSite}
            </a>
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-[13px] font-semibold uppercase tracking-[0.1em] text-cream/55 transition-colors hover:bg-cream/[0.06] hover:text-cream"
            >
              <LogOut className="h-[18px] w-[18px] text-cream/40" />
              {t.nav.signOut}
            </button>
          </div>
        </div>
      </aside>

      {/* -------------------------------------------------- bar, phone and tablet */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/10 bg-cream lg:hidden">
        <div className="grid h-16 grid-cols-3 items-center px-4 sm:px-6">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="admin-menu"
              className="-ml-2 flex h-11 items-center px-2 text-[12px] font-bold uppercase tracking-[0.13em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px]"
            >
              {open ? t.common.close : t.nav.menu}
            </button>
          </div>

          <Link to="/admin" aria-label={t.nav.dashboard} className="justify-self-center">
            <LogoMark className="h-11" sizes="76px" priority />
          </Link>

          <Link
            to="/admin/enquiries"
            onClick={() => setOpen(false)}
            className="-mr-2 flex h-11 items-center gap-2 justify-self-end px-2 text-[12px] font-bold uppercase tracking-[0.13em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px]"
          >
            {unanswered > 0 ? (
              <span className="tnum inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1.5 text-[12px] font-bold text-espresso-950">
                {unanswered}
              </span>
            ) : (
              <Inbox className="h-[18px] w-[18px]" />
            )}
            <span className="sr-only sm:not-sr-only">{t.nav.enquiries}</span>
          </Link>
        </div>
      </header>

      {/* dimmed page behind the curtain; click closes */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-espresso/40 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden
        onClick={() => setOpen(false)}
      />

      {/* the curtain: slides down from behind the bar */}
      <div
        id="admin-menu"
        className={cn(
          'fixed inset-x-0 top-0 z-40 max-h-[100dvh] overflow-y-auto overscroll-contain bg-espresso pt-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <nav
          className="flex flex-col items-center px-5 py-8 text-center [padding-bottom:calc(2rem+env(safe-area-inset-bottom))]"
          aria-label={t.nav.menu}
        >
          {items.map(({ to, end, label, badge }, i) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-baseline gap-3 py-2.5 font-display text-3xl font-bold leading-tight transition-all duration-300',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  isActive ? 'text-gold-bright' : 'text-cream hover:text-gold-bright',
                )
              }
              style={{ transitionDelay: open ? `${100 + i * 45}ms` : '0ms' }}
            >
              {label}
              {badge > 0 ? (
                <span className="tnum rounded-full bg-gold px-2 py-0.5 font-sans text-[12px] font-bold text-espresso-950">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          ))}

          <div className="mt-8 w-full max-w-xs space-y-6 border-t border-cream/15 pt-6">
            {languages}
            {storage}
            <div className="flex items-center justify-center gap-6">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-bold uppercase tracking-[0.13em] text-cream/70 transition-colors hover:text-gold-bright"
              >
                {t.nav.viewSite}
              </a>
              <button
                type="button"
                onClick={onSignOut}
                className="text-[12px] font-bold uppercase tracking-[0.13em] text-cream/70 transition-colors hover:text-gold-bright"
              >
                {t.nav.signOut}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <main className="px-4 pb-10 pt-[calc(4rem+1.25rem)] sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1100px]">{children}</div>
      </main>
    </div>
  )
}
