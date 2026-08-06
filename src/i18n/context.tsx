import { createContext, useContext, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Lang, RouteKey } from './config'
import { pathFor, parsePath } from './config'
import { ui } from './ui'

type LanguageCtx = {
  /** The active language for the current subtree. */
  lang: Lang
  /** Switch language, staying on the equivalent page (and hash). */
  setLang: (next: Lang) => void
  /** Build a localized in-app path for a route key (+ optional hash). */
  path: (key: RouteKey, hash?: string) => string
}

const LanguageContext = createContext<LanguageCtx | null>(null)

export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const setLang = useCallback(
    (next: Lang) => {
      const { key } = parsePath(location.pathname)
      navigate(pathFor(key, next) + location.hash)
    },
    [location.pathname, location.hash, navigate],
  )

  const path = useCallback((key: RouteKey, hash?: string) => pathFor(key, lang, hash), [lang])

  return <LanguageContext.Provider value={{ lang, setLang, path }}>{children}</LanguageContext.Provider>
}

export function useLang(): LanguageCtx {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}

/** Pick the current language's slice out of a `{ is, en, pl }` content dictionary. */
export function useContent<T>(dict: Record<Lang, T>): T {
  const { lang } = useLang()
  return dict[lang]
}

/** Shorthand for the shared UI microcopy in the current language. */
export function useUi() {
  const { lang } = useLang()
  return ui[lang]
}
