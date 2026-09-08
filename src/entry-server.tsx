import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import type { PageMap } from './routes'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Catalog from './pages/Catalog'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import Withdrawal from './pages/Withdrawal'
import NotFound from './pages/NotFound'

/**
 * The prerender step preloads the home hero. It reads which file that is
 * from here rather than carrying its own copy of the path, which is how the
 * hint once kept pointing at a photograph the page had stopped showing.
 */
export { photos } from './data/photos'
export { photoManifest } from './data/photoManifest'

/**
 * Build-time rendering entry.
 *
 * Pages are imported eagerly here on purpose: `renderToString` cannot resolve
 * `React.lazy`, it would emit the Suspense fallback for every route and the
 * prerendered files would all be a loading dot.
 *
 * `/l/:code` and `/admin` are never prerendered, so they get a stub. Their real
 * components are browser-only anyway.
 *
 * This renders `<App>` rather than `<AppRoutes>` directly. React's server
 * renderer writes a comment marker for every Suspense boundary, so a tree that
 * is missing App's outer boundary produces HTML the browser cannot hydrate.
 */
const Stub = () => null

const pages: PageMap = {
  home: Home,
  services: Services,
  portfolio: Portfolio,
  catalog: Catalog,
  blog: Blog,
  blogPost: BlogPost,
  about: About,
  contact: Contact,
  privacy: Privacy,
  terms: Terms,
  cookies: Cookies,
  withdrawal: Withdrawal,
  notFound: NotFound,
  go: Stub,
  admin: Stub,
}

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App pages={pages} />
    </StaticRouter>,
  )
}

export { PRERENDER_ROUTES, headTags } from './lib/seoRoutes'
// Re-exported so scripts/prerender.mjs writes the sitemap and robots.txt
// against the same origin the pages themselves declare.
export { SITE_URL } from './i18n/config'
