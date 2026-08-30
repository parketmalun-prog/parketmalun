import { Suspense } from 'react'
import { AppRoutes } from './routes'
import type { PageMap } from './routes'

/**
 * The app shell. The page map is passed in rather than built here: the browser
 * entry mixes lazy pages with one eagerly resolved page (the route being
 * hydrated), and the prerender entry passes eager pages for all of them.
 */
function Booting() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream" aria-hidden>
      <span className="cap-label animate-pulse">···</span>
    </div>
  )
}

export default function App({ pages }: { pages: PageMap }) {
  return (
    <Suspense fallback={<Booting />}>
      <AppRoutes pages={pages} />
    </Suspense>
  )
}
