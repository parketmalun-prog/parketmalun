import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { site } from '@/data/site'
import { NAV_KEYS } from '@/i18n/config'
import { useLang, useUi } from '@/i18n/context'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'
import { Logo } from './Logo'

/**
 * PLANKI masthead: a print-style cream header. A hairline-bounded dateline
 * strip on top (text only, no icons), then the main row with a live Fraunces
 * wordmark and numbered nav links. Mobile opens a full-screen espresso
 * overlay with large Fraunces links.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const overlayRef = useRef<HTMLDivElement>(null)
  const { path } = useLang()
  const t = useUi()

  const navItems = NAV_KEYS.filter((k) => k !== 'home').map((key, i) => ({
    key,
    n: String(i + 1).padStart(2, '0'),
    label: t.nav[key],
    to: path(key),
  }))

  // `inert` set imperatively: this React version renders inert="false" as a
  // present (thus active) boolean attribute if passed via JSX.
  useEffect(() => {
    if (overlayRef.current) overlayRef.current.inert = !open
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Auto-close the overlay if the viewport crosses into desktop while open.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/15 bg-cream">
      {/* Dateline strip: newspaper-style single caps line, no icons */}
      <div className="hidden border-b border-espresso/10 md:block">
        <div className="container-x flex h-9 items-center justify-between gap-6">
          <p className="cap-label tnum truncate">{t.topbar.dateline}</p>
          <div className="flex shrink-0 items-center gap-5">
            <a
              href={`mailto:${site.email}`}
              className="cap-label hidden normal-case tracking-normal transition-colors hover:text-espresso lg:inline"
            >
              {site.email}
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="cap-label transition-colors hover:text-espresso"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main masthead row */}
      <div className="container-x flex h-[64px] items-center justify-between gap-4 md:h-[72px]">
        <Link to={path('home')} aria-label={t.a11y.logoHome} className="shrink-0">
          <Logo className="h-11 w-auto md:h-[52px]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={t.a11y.menuMain}>
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group flex items-baseline gap-1.5 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors',
                  isActive ? 'text-espresso' : 'text-taupe hover:text-espresso',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('tnum text-[11px] font-semibold', isActive ? 'text-gold-deep' : 'text-gold/70')}>
                    {item.n}
                  </span>
                  <span
                    className={cn(
                      'pb-0.5',
                      isActive
                        ? 'underline decoration-gold decoration-2 underline-offset-4'
                        : 'group-hover:underline group-hover:decoration-espresso/30 group-hover:decoration-2 group-hover:underline-offset-4',
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitcher variant="bar" className="hidden sm:flex" />
          <a
            href={`tel:${site.phoneRaw}`}
            className="tnum hidden font-display text-lg font-bold text-espresso transition-colors hover:text-gold-deep sm:block"
            aria-label={`${t.common.callPrefix} ${site.phone}`}
          >
            {site.phone}
          </a>
          <Link to={path('contact')} className="btn btn-sm btn-primary hidden lg:inline-flex">
            {t.common.getQuote}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-espresso/20 text-espresso lg:hidden"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            aria-controls="farsima-valmynd"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen espresso overlay (mobile). Inert while closed. */}
      <div
        id="farsima-valmynd"
        ref={overlayRef}
        className={cn(
          // top matches the real header height: 64px masthead on mobile,
          // plus the 37px dateline strip and taller masthead from md up.
          'fixed inset-x-0 bottom-0 top-[64px] z-40 flex flex-col bg-espresso transition-opacity duration-300 md:top-[110px] lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav className="container-x flex flex-1 flex-col justify-center gap-1 py-8" aria-label={t.a11y.menuMobile}>
          {navItems.map((item, i) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-baseline gap-4 border-b border-cream/10 py-4 transition-all duration-300',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  isActive ? 'text-gold-bright' : 'text-cream',
                )
              }
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : '0ms' }}
            >
              <span className="tnum text-sm font-semibold text-gold/80">{item.n}</span>
              <span className="font-display text-3xl font-bold leading-tight">{item.label}</span>
            </NavLink>
          ))}
          <div className="mt-8 flex items-center justify-between">
            <LanguageSwitcher variant="panel" />
            <a
              href={`tel:${site.phoneRaw}`}
              className="tnum font-display text-2xl font-bold text-gold-bright"
              aria-label={`${t.common.callPrefix} ${site.phone}`}
            >
              {site.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
