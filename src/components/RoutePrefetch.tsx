import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pageKeyFor } from '@/pageLoaders'
import { warmHref, warmSiteWhenIdle } from '@/lib/routePrefetch'
import type { PageKey } from '@/routes'

/**
 * Loads the next page's code before it is asked for.
 *
 * Two passes, deliberately in this order:
 *
 * 1. Intent. One delegated listener per intent signal, on the document, so it
 *    covers every link on the site (masthead, footer, cards, body copy, the
 *    mobile curtain) without a single call site having to opt in. A mouse
 *    resting on a link, a link taking keyboard focus and a finger landing on
 *    one all precede the navigation by enough milliseconds to hide the fetch.
 *
 * 2. Idle. Whatever is still cold is fetched once the page has gone quiet, so
 *    even a visitor who clicks without hovering (touch, or straight from the
 *    keyboard) lands on a page that is already in memory.
 *
 * The listeners are passive and capture phase: they never call preventDefault,
 * never touch the event, and only start a fetch the browser would have had to
 * make anyway a moment later.
 */

/** Warmed at idle, in the order a visitor is most likely to want them. */
const IDLE_ORDER: PageKey[] = ['services', 'catalog', 'portfolio', 'contact', 'about', 'blog']

export function RoutePrefetch() {
  const { pathname } = useLocation()

  useEffect(() => {
    const onIntent = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (anchor) warmHref(anchor.getAttribute('href'))
    }

    const options = { passive: true, capture: true } as const
    document.addEventListener('pointerover', onIntent, options)
    document.addEventListener('focusin', onIntent, options)
    document.addEventListener('touchstart', onIntent, options)
    return () => {
      document.removeEventListener('pointerover', onIntent, options)
      document.removeEventListener('focusin', onIntent, options)
      document.removeEventListener('touchstart', onIntent, options)
    }
  }, [])

  // Re-run per navigation so the page just landed on is dropped from the
  // queue, and so a visitor who deep links into an article still ends up with
  // the rest of the site warm.
  useEffect(() => {
    const here = pageKeyFor(pathname)
    warmSiteWhenIdle(IDLE_ORDER.filter((key) => key !== here))
  }, [pathname])

  return null
}
