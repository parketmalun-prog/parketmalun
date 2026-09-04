import { pageKeyFor, pageLoaders } from '@/pageLoaders'
import type { PageKey } from '@/routes'

/**
 * Fetches a page's JavaScript before the visitor asks for it.
 *
 * Every page is code split, so clicking a link used to start the download of
 * that page's chunk at click time. Even on a fast line that is one round trip
 * the visitor spends looking at the Suspense placeholder, and the placeholder
 * is what reads as "the site paused on an empty page". Measured on a local
 * preview, with no network latency at all, the gap was still 14 to 39 ms; add
 * a real connection to a Vercel edge and it becomes a few hundred.
 *
 * The fix is to move the download earlier than the click. A pointer resting on
 * a link, a link taking keyboard focus, or a finger touching one all happen
 * tens to hundreds of milliseconds before the navigation commits, which is
 * exactly the budget the chunk needs. Anything still cold when the visitor
 * clicks is covered by the idle pass below.
 *
 * Nothing here changes what is rendered, so it cannot affect the prerendered
 * HTML or hydration: it only warms the browser's module cache.
 */

/** Pages already requested. A chunk is never fetched twice. */
const started = new Set<PageKey>()

/** Start a page's chunk download, at most once per page. */
export function warmPage(key: PageKey): void {
  if (started.has(key)) return
  started.add(key)
  // A failed fetch is forgotten, so a later hover (or the click itself) can
  // retry rather than leave the page permanently unloadable.
  void pageLoaders[key]().catch(() => started.delete(key))
}

/**
 * Warm whatever page an href points at, ignoring everything that is not an
 * in-app page: other origins, downloads, mail and phone links, pure hashes,
 * and the two routes that are never worth preloading (the admin bundle is
 * large and private, and /l/ is a redirect the visitor passes straight
 * through).
 */
export function warmHref(href: string | null | undefined): void {
  if (!href) return
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

  let pathname: string
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return
    pathname = url.pathname
  } catch {
    return
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/l/')) return
  warmPage(pageKeyFor(pathname))
}

/**
 * True when the visitor is on a connection where speculative downloads would
 * be rude: data saver on, or a 2G class link. The Network Information API is
 * Chromium only, so the absence of an answer counts as "go ahead".
 */
function cheapToPrefetch(): boolean {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  if (!connection) return true
  if (connection.saveData) return false
  return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g'
}

const idle: (cb: () => void) => void =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (cb) => window.requestIdleCallback(cb, { timeout: 2500 })
    : (cb) => window.setTimeout(cb, 300)

/**
 * Warm the rest of the site once the current page has settled.
 *
 * The whole public site is about 35 kB of gzipped page chunks, so this is a
 * one-off cost smaller than a single photograph, paid at idle, in exchange for
 * every later navigation being a render with nothing to download. Pages are
 * warmed one per idle slot so a slow phone never spends a long task on it.
 */
export function warmSiteWhenIdle(order: PageKey[]): void {
  if (!cheapToPrefetch()) return
  const queue = order.filter((key) => !started.has(key))
  const next = () => {
    const key = queue.shift()
    if (!key) return
    warmPage(key)
    idle(next)
  }
  idle(next)
}
