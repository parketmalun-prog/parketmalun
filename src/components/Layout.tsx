import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { QuickContact } from './QuickContact'
import { GrainOverlay } from './GrainOverlay'
import { ScrollToTop } from './ScrollToTop'
import { useUi } from '@/i18n/context'

/** Minimal, layout-stable placeholder while a lazily-loaded route chunk arrives. */
function PageFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream" aria-hidden>
      <span className="cap-label animate-pulse">···</span>
    </div>
  )
}

export function Layout() {
  const t = useUi()
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#efni"
        className="sr-only z-[60] bg-espresso px-5 py-2.5 font-semibold text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.common.skipToContent}
      </a>
      <ScrollToTop />
      <GrainOverlay />
      <Navbar />
      <main id="efni" tabIndex={-1} className="flex-1 pt-[64px] outline-none md:pt-[110px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <QuickContact />
    </div>
  )
}
