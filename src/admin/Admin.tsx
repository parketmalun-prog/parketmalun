import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { lockedFor, useAuth } from './auth'
import { AdminProvider, useAdmin } from './context'
import { AdminShell } from './components/AdminShell'
import { Button, Card, Field, Input } from './components/kit'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Enquiries = lazy(() => import('./pages/Enquiries'))
const Links = lazy(() => import('./pages/Links'))
const Posts = lazy(() => import('./pages/Posts'))
const PostEditor = lazy(() => import('./pages/PostEditor'))
const Settings = lazy(() => import('./pages/Settings'))

/** Keeps the panel out of search results whatever the host is configured to do. */
function useNoIndex() {
  useEffect(() => {
    document.title = 'Expert Parket · Stjórnborð'
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow')
  }, [])
}

function Login({ onSubmit }: { onSubmit: (password: string) => Promise<boolean> }) {
  const { t } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(0)

  // Counts the back-off down so the visitor sees when they may try again
  // rather than a button that silently does nothing.
  useEffect(() => {
    if (wait <= 0) return
    const id = window.setInterval(() => setWait(Math.ceil(lockedFor() / 1000)), 1000)
    return () => window.clearInterval(id)
  }, [wait])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    const ok = await onSubmit(password)
    setBusy(false)
    if (!ok) {
      setError(true)
      setPassword('')
      setWait(Math.ceil(lockedFor() / 1000))
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="pb-1 font-display text-2xl font-bold leading-none text-espresso">Expert Parket</p>
        <p className="cap-label pb-6">{t.login.title}</p>

        <Card>
          <form onSubmit={submit} className="space-y-5">
            <p className="text-[15px] leading-relaxed text-taupe">{t.login.lead}</p>
            <Field
              label={t.login.password}
              htmlFor="admin-password"
              error={
                wait > 0
                  ? t.login.locked.replace('{n}', String(wait))
                  : error
                    ? t.login.error
                    : undefined
              }
            >
              <Input
                id="admin-password"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
              />
            </Field>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={busy || !password || wait > 0}
            >
              {t.login.submit}
            </Button>
          </form>
        </Card>

        <p className="pt-4 text-[13px] leading-relaxed text-taupe">{t.login.hint}</p>
      </div>
    </div>
  )
}

function AdminRoutes() {
  const { t } = useAdmin()
  const { ready, signedIn, signIn, signOut } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <span className="cap-label animate-pulse">···</span>
      </div>
    )
  }

  if (!signedIn) return <Login onSubmit={signIn} />

  return (
    <AdminShell onSignOut={signOut}>
      <Suspense fallback={<p className="cap-label animate-pulse">{t.common.loading}</p>}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="links" element={<Links />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:id" element={<PostEditor />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </AdminShell>
  )
}

export default function Admin() {
  useNoIndex()
  return (
    <AdminProvider>
      <AdminRoutes />
    </AdminProvider>
  )
}
