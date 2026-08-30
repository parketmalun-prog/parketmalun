import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { adminCopy, readAdminLang, writeAdminLang } from './copy'
import type { AdminLang } from './copy'

type Toast = { id: number; message: string; tone: 'ok' | 'bad' }

type AdminCtx = {
  lang: AdminLang
  setLang: (lang: AdminLang) => void
  t: (typeof adminCopy)['is']
  toast: (message: string, tone?: 'ok' | 'bad') => void
}

const Ctx = createContext<AdminCtx | null>(null)

let nextToastId = 1

export function AdminProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(() => readAdminLang())
  const [toasts, setToasts] = useState<Toast[]>([])

  const setLang = useCallback((next: AdminLang) => {
    writeAdminLang(next)
    setLangState(next)
  }, [])

  const toast = useCallback((message: string, tone: 'ok' | 'bad' = 'ok') => {
    const id = nextToastId++
    setToasts((list) => [...list, { id, message, tone }])
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3200)
  }, [])

  const value = useMemo<AdminCtx>(() => ({ lang, setLang, t: adminCopy[lang], toast }), [lang, setLang, toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={
              item.tone === 'ok'
                ? 'pointer-events-auto rounded-lg border border-espresso bg-espresso px-5 py-3 text-sm font-medium text-cream'
                : 'pointer-events-auto rounded-lg border border-danger bg-danger px-5 py-3 text-sm font-medium text-white'
            }
          >
            {item.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useAdmin(): AdminCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
