import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { site } from '@/data/site'
import { NAV_KEYS } from '@/i18n/config'
import { useLang, useUi } from '@/i18n/context'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'
import { LogoMark } from './Logo'
import { lockScroll } from '@/lib/smoothScroll'

/**
 * Masthead in the reference's three-part cut (client, 2026-08-30, after
 * elicyon.com): MENU on the left, the mark alone in the centre, contact on
 * the right, the same on every width. The menu itself is one espresso
 * curtain that slides DOWN from the top edge (the same move as the client's
 * bpe-cleaning site), carrying the page links, the language switcher, the
 * phone and the quote button; it closes on Escape, on the dimmed page
 * behind it, and on any navigation.
 *
 * The curtain lives UNDER the bar (z-40 vs z-50) so it appears to unroll
 * from behind the cream row. `inert` is set imperatively: this React
 * version renders inert="false" as a present boolean attribute.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const { path } = useLang()
  const t = useUi()

  const navItems = NAV_KEYS.map((key, i) => ({
    key,
    n: String(i + 1).padStart(2, '0'),
    label: t.nav[key],
    to: path(key),
  }))

  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/10 bg-cream">
        <div className="container-x grid h-[64px] grid-cols-3 items-center md:h-[72px]">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="valmynd"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px] sm:tracking-[0.14em]"
            >
              {open ? t.quick.close : 'Menu'}
            </button>
          </div>

          <Link to={path('home')} aria-label={t.a11y.logoHome} className="justify-self-center">
            <LogoMark className="h-11 md:h-[52px]" sizes="(min-width: 768px) 90px, 76px" priority />
          </Link>

          <Link
            to={path('contact')}
            className="justify-self-end whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px] sm:tracking-[0.14em]"
          >
            {t.nav.contact}
          </Link>
        </div>
      </header>

      {/* dimmed page behind the curtain; click closes */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-espresso/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden
        onClick={() => setOpen(false)}
      />

      {/* the curtain: slides down from behind the bar */}
      <div
        id="valmynd"
        ref={panelRef}
        className={cn(
          'fixed inset-x-0 top-0 z-40 max-h-[100dvh] overflow-y-auto overscroll-contain bg-espresso pt-[64px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pt-[72px]',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <nav
          className="container-x flex flex-col gap-1 py-10 [padding-bottom:calc(2.5rem+env(safe-area-inset-bottom))]"
          aria-label={t.a11y.menuMain}
        >
          {navItems.map((item, i) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-baseline gap-5 py-3 transition-all duration-300 sm:py-3.5',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  isActive ? 'text-gold-bright' : 'text-cream hover:text-gold-bright',
                )
              }
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
            >
              <span className="tnum text-sm font-semibold text-gold/80">{item.n}</span>
              <span className="font-display text-3xl font-bold leading-tight sm:text-4xl">{item.label}</span>
            </NavLink>
          ))}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <LanguageSwitcher variant="panel" />
            <div className="flex items-center gap-6">
              <a
                href={`tel:${site.phoneRaw}`}
                className="tnum font-display text-2xl font-bold text-gold-bright transition-colors hover:text-cream"
                aria-label={`${t.common.callPrefix} ${site.phone}`}
              >
                {site.phone}
              </a>
              <Link to={path('contact')} className="btn btn-sm bg-gold text-espresso hover:bg-gold-bright">
                {t.common.getQuote}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
