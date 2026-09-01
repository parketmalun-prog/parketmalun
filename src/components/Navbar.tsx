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
 * Two mastheads in one bar, cut at lg (1024px), on the client's call
 * (2026-08-31):
 *
 * - Phone and tablet keep the reference's three-part cut (after elicyon.com):
 *   MENU on the left, the mark alone in the centre, contact on the right. The
 *   menu is one espresso curtain that slides DOWN from the top edge, carrying
 *   the page links and the language switcher, every one of them centred in a
 *   single column and none of them numbered (client, 2026-08-31). It closes
 *   on Escape, on the dimmed page behind it, and on any navigation.
 * - Desktop goes back to the print masthead it had before: the mark on the
 *   left, the numbered links inline, then the language switcher and the phone
 *   on the right. The bar text stays in the grotesk, not the display serif.
 *   Matching the logo's serif was tried on 2026-08-31 and rejected the same
 *   day: the shipped Fraunces subset has its optical-size axis pinned to the
 *   display end, whose hairlines thin out to nothing at a 13px cap, so the
 *   labels stopped reading. The serif carries the headlines, the grotesk
 *   carries the navigation, and it is set a weight heavier than the medium
 *   it began at so the bar still holds its own beside the wordmark. No curtain, no burger. The quote pill that row used to end
 *   on is gone: the nav has grown a sixth link since, and with the pill the
 *   parts touched at the 1280px measure. Contact is still the last link, and
 *   the phone beside it dials.
 *
 * The bar stays 64px / 72px tall at every width. That height is hard-coded in
 * Layout, Home's hero, Panorama and the pinned gallery in index.css, so it is
 * not a free number to change here.
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

  const navItems = NAV_KEYS.map((key) => ({
    key,
    label: t.nav[key],
    to: path(key),
  }))

  // The desktop row carries no Home link: the mark on its left already is
  // one, so the numbering starts at the first real page.
  const barItems = NAV_KEYS.filter((k) => k !== 'home').map((key, i) => ({
    key,
    n: String(i + 1).padStart(2, '0'),
    label: t.nav[key],
    to: path(key),
  }))

  // The curtain is a modal: while it is open the rest of the page goes
  // inert, so Tab cannot walk out of the menu onto the links and form
  // fields hidden behind the scrim. <main> and <footer> are siblings of
  // the header in Layout, so marking them covers everything behind it.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open
    const behind = document.querySelectorAll<HTMLElement>('main, footer')
    behind.forEach((el) => (el.inert = open))
    return () => behind.forEach((el) => (el.inert = false))
  }, [open])

  // Keyed on location.key, not pathname: tapping the link for the page you
  // are already on is a replace-navigation to the same URL, so the pathname
  // never changes and the curtain stayed open with the page scroll-locked.
  // Every link also closes on click, so this holds even if the router
  // swallows a same-URL navigation entirely.
  useEffect(() => {
    setOpen(false)
  }, [location.key, location.pathname])

  useEffect(() => {
    lockScroll(open)
    // Reopening kept the panel's old scroll offset, so on a short screen the
    // menu came back already scrolled past its first links.
    if (open) panelRef.current?.scrollTo({ top: 0 })
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

  // Widening past the desktop cut takes the burger away with it. Without
  // this, a curtain opened on a phone-width window stayed open and left
  // <main> inert behind a desktop masthead that has no way to close it.
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
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/10 bg-cream">
        <div className="container-x flex h-[64px] items-center md:h-[72px]">
          {/* Phone and tablet: MENU | mark | contact */}
          <div className="grid w-full grid-cols-3 items-center lg:hidden">
            <div className="justify-self-start">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="valmynd"
                className="-ml-2 flex h-11 items-center px-2 text-[12px] font-bold uppercase tracking-[0.13em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px]"
              >
                {open ? t.quick.close : t.common.menu}
              </button>
            </div>

            <Link to={path('home')} aria-label={t.a11y.logoHome} className="justify-self-center">
              <LogoMark className="h-11 md:h-[52px]" sizes="(min-width: 768px) 90px, 76px" priority />
            </Link>

            <Link
              to={path('contact')}
              onClick={() => setOpen(false)}
              className="-mr-2 flex h-11 items-center justify-self-end whitespace-nowrap px-2 text-[12px] font-bold uppercase tracking-[0.13em] text-espresso transition-colors hover:text-gold-deep sm:text-[13px]"
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Desktop: mark left, numbered links inline, contact block right */}
          <div className="hidden w-full items-center justify-between gap-6 lg:flex">
            <Link to={path('home')} aria-label={t.a11y.logoHome} className="shrink-0">
              <LogoMark className="h-[52px]" sizes="90px" priority />
            </Link>

            <nav className="flex items-center gap-5 xl:gap-6" aria-label={t.a11y.menuMain}>
              {barItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-baseline gap-1.5 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors xl:text-[13px]',
                      isActive ? 'text-espresso' : 'text-taupe hover:text-espresso',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          'tnum hidden text-[11px] font-semibold xl:inline',
                          isActive ? 'text-gold-deep' : 'text-gold/70',
                        )}
                      >
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

            <div className="flex shrink-0 items-center gap-5">
              <LanguageSwitcher variant="bar" />
              <a
                href={`tel:${site.phoneRaw}`}
                className="tnum font-display text-lg font-bold text-espresso transition-colors hover:text-gold-deep"
                aria-label={`${t.common.callPrefix} ${site.phone}`}
              >
                {site.phone}
              </a>
            </div>
          </div>
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
        id="valmynd"
        ref={panelRef}
        className={cn(
          'fixed inset-x-0 top-0 z-40 max-h-[100dvh] overflow-y-auto overscroll-contain bg-espresso pt-[64px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pt-[72px] lg:hidden',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <nav
          className="container-x flex flex-col items-center gap-1 py-10 text-center [padding-bottom:calc(2.5rem+env(safe-area-inset-bottom))]"
          aria-label={t.a11y.menuMobile}
        >
          {navItems.map((item, i) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.key === 'home'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block py-3 font-display text-3xl font-bold leading-tight transition-all duration-300 sm:py-3.5 sm:text-4xl',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  isActive ? 'text-gold-bright' : 'text-cream hover:text-gold-bright',
                )
              }
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Links and languages, nothing else. The number and the quote
              button left the curtain (client, 2026-09-01): a phone already
              carries the call pill at the foot of every page and the contact
              link sits in the bar, so repeating both here only crowded the
              menu. The menu says who we are; the contact comes after. */}
          <div className="mt-10 flex flex-col items-center">
            <LanguageSwitcher variant="panel" />
          </div>
        </nav>
      </div>
    </>
  )
}
