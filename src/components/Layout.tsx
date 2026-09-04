import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { QuickContact } from './QuickContact'
import { GrainOverlay } from './GrainOverlay'
import { ScrollToTop } from './ScrollToTop'
import { RoutePrefetch } from './RoutePrefetch'
import { NavProgress } from './NavProgress'
import { Tracker } from './Tracker'
import { useUi } from '@/i18n/context'
import { startSmoothScroll } from '@/lib/smoothScroll'

/**
 * Placeholder for a route chunk that is still arriving.
 *
 * Navigation runs inside a React transition, so this is now the exception
 * rather than the rule: the previous page stays painted while the next one
 * loads, and this only appears where there is no previous page to keep, which
 * in practice means a cold deep link into a route that was never prerendered.
 *
 * It fills the viewport under the fixed masthead rather than the old 70vh.
 * At 70vh the document was shorter than the page it replaced, so the footer
 * climbed into view and was shoved back down a moment later, and those two
 * reflows were most of what made the wait read as a glitch.
 */
function PageFallback() {
  return (
    <div
      className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-cream md:min-h-[calc(100dvh-72px)]"
      aria-hidden
    >
      <span className="cap-label animate-pulse">···</span>
    </div>
  )
}

export function Layout() {
  const t = useUi()
  useEffect(startSmoothScroll, [])
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#efni"
        className="sr-only z-[60] bg-espresso px-5 py-2.5 font-semibold text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.common.skipToContent}
      </a>
      <ScrollToTop />
      <RoutePrefetch />
      <NavProgress />
      <Tracker />
      <GrainOverlay />
      <Navbar />
      <main id="efni" tabIndex={-1} className="flex-1 pt-[64px] outline-none md:pt-[72px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <QuickContact />
    </div>
  )
}
