import { createElement } from 'react'
import type { ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LANGS, SLUGS, langPrefix } from './i18n/config'
import type { Lang } from './i18n/config'
import { LanguageProvider } from './i18n/context'
import { Layout } from './components/Layout'

/**
 * The one route table.
 *
 * It takes the page components as a map so the browser build can pass lazy
 * ones and the prerender build can pass eager ones, without either copy of the
 * table drifting from the other. Paths come from `SLUGS`, so adding a page in
 * one place adds it in all three languages.
 */
export type PageKey =
  | 'home'
  | 'services'
  | 'portfolio'
  | 'catalog'
  | 'blog'
  | 'blogPost'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'notFound'
  | 'go'
  | 'admin'

export type PageMap = Record<PageKey, ComponentType>

/** Pages that exist once per language, in navigation order. */
const LANG_PAGES = ['services', 'portfolio', 'catalog', 'blog', 'about', 'contact', 'privacy'] as const

function LangShell({ lang }: { lang: Lang }) {
  return (
    <LanguageProvider lang={lang}>
      <Layout />
    </LanguageProvider>
  )
}

export function AppRoutes({ pages }: { pages: PageMap }) {
  return (
    <Routes>
      {/* Campaign links: /l/<code> counts the click, then forwards */}
      <Route path="/l/:code" element={createElement(pages.go)} />

      {/* Admin panel, never indexed, never prerendered */}
      <Route path="/admin/*" element={createElement(pages.admin)} />

      {LANGS.map((lang) => (
        <Route key={lang} path={langPrefix(lang) || '/'} element={<LangShell lang={lang} />}>
          <Route index element={createElement(pages.home)} />
          {LANG_PAGES.map((key) => (
            <Route key={key} path={SLUGS[key][lang]} element={createElement(pages[key])} />
          ))}
          <Route path={`${SLUGS.blog[lang]}/:slug`} element={createElement(pages.blogPost)} />
          <Route path="*" element={createElement(pages.notFound)} />
        </Route>
      ))}
    </Routes>
  )
}
