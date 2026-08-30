import type { ComponentType } from 'react'
import { SLUGS, parsePath } from './i18n/config'
import type { PageKey } from './routes'

/**
 * One dynamic import per page, shared by the lazy route map and by the
 * hydration step.
 *
 * Hydration is why this file exists. Every public page ships as prerendered
 * HTML, but `React.lazy` always suspends on its first render, even when the
 * module is already in the browser's cache. Suspending during hydration makes
 * React throw the prerendered markup away and rebuild it, which is both a
 * flash for the visitor and a wasted render. So `main.tsx` resolves the module
 * for the current route first and hands React a plain component for it, and
 * only the pages the visitor has not asked for stay lazy.
 */
export const pageLoaders: Record<PageKey, () => Promise<{ default: ComponentType }>> = {
  home: () => import('./pages/Home'),
  services: () => import('./pages/Services'),
  portfolio: () => import('./pages/Portfolio'),
  catalog: () => import('./pages/Catalog'),
  blog: () => import('./pages/Blog'),
  blogPost: () => import('./pages/BlogPost'),
  about: () => import('./pages/About'),
  contact: () => import('./pages/Contact'),
  privacy: () => import('./pages/Privacy'),
  notFound: () => import('./pages/NotFound'),
  go: () => import('./pages/Go'),
  admin: () => import('./admin/Admin'),
}

/** Which page a pathname resolves to, using the same slug table as the router. */
export function pageKeyFor(pathname: string): PageKey {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/l/')) return 'go'

  const { lang, key } = parsePath(pathname)
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const rest = lang === 'is' ? segments : segments.slice(1)

  // A second segment under the blog slug is an article, not the index.
  if (rest[0] === SLUGS.blog[lang] && rest.length > 1) return 'blogPost'
  return key
}
