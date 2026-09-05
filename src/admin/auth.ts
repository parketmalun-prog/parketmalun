import { useCallback, useEffect, useState } from 'react'
import { setAccessToken } from '@/lib/db/supabaseBackend'

/**
 * Sign-in gate for /admin.
 *
 * Be clear about what this is: a lock on the door, not a vault. The check runs
 * in the browser, so it keeps the panel out of reach of visitors and search
 * engines, and that is all it can do. Right now there is nothing behind it but
 * this browser's own storage, so that matches the risk.
 *
 * That description holds only while Supabase is unset. With VITE_SUPABASE_URL
 * and VITE_SUPABASE_ANON_KEY in place the panel signs in against Supabase Auth
 * for real: the token it gets back is what the data layer sends, and row level
 * security decides what that token may touch. The local hash below stays as
 * the fallback so `npm run dev` opens with nothing configured. See
 * supabase/schema.sql for the policies that do the actual protecting.
 */

/**
 * The password hash comes from the environment, and ONLY from there in a
 * production build. This repository is public: a default hash shipped in the
 * source is a published password, so a build without VITE_ADMIN_PASSWORD_HASH
 * set simply has no working password and the panel cannot be opened at all.
 *
 * The convenience default is kept for local development only (import.meta.env
 * .DEV is compiled to false in the production bundle, so the string below is
 * tree-shaken out of anything that ships). Set VITE_ADMIN_PASSWORD_HASH in
 * Vercel to the SHA-256 of the real password before using /admin live.
 */
const DEV_HASH = 'fb65b2ea87c5d87dc85d495ec9e9b0d6bffe7682b5f215b4cda957d2578c4d26'

const PASSWORD_HASH: string =
  import.meta.env.VITE_ADMIN_PASSWORD_HASH || (import.meta.env.DEV ? DEV_HASH : '')

/**
 * The address the sign-in screen expects, alongside the password.
 *
 * Be honest about what this is. It ships in the bundle like everything else
 * built with Vite, so anyone who wants to read it can. It is a second thing to
 * type, not a second secret, and it buys exactly one thing: a stranger who
 * finds the panel cannot try passwords until they also know which address it
 * belongs to. Real per-person sign-in arrives with Supabase Auth, and that is
 * the point at which this constant goes away.
 */
const ADMIN_EMAIL: string = import.meta.env.VITE_ADMIN_EMAIL || 'verk@expertparket.is'

/** Addresses are compared case-insensitively; nobody types their own the same way twice. */
function emailMatches(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()
}

/* ------------------------------ Supabase Auth ------------------------------ */

/**
 * When Supabase is configured the panel signs in against it for real, and the
 * address and password above stop being a formality: row level security in the
 * database only opens for a genuine session whose address is listed in
 * `admin_emails`. Without a session the anon key can insert an enquiry or a
 * visit and read nothing back, which is the whole point of the policies in
 * `supabase/schema.sql`.
 *
 * Without Supabase the panel falls back to the local hash, so `npm run dev`
 * and any deployment that has not been switched over still open.
 */
const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY)

const TOKEN_KEY = 'epm.admin.token'

type StoredSession = { access: string; refresh: string; expires: number }

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    const parsed = raw ? (JSON.parse(raw) as StoredSession) : null
    if (parsed && typeof parsed.access === 'string' && typeof parsed.expires === 'number') {
      return parsed
    }
  } catch {
    /* unreadable storage is the same as no session */
  }
  return null
}

function writeSession(session: StoredSession | null): void {
  try {
    if (session) localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private mode: the session lasts until reload */
  }
}

type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  user?: { email?: string }
}

/** One call to Supabase's token endpoint, spoken with fetch like the rest of the data layer. */
async function token(body: Record<string, string>, grant: string): Promise<StoredSession | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grant}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const data = (await res.json()) as TokenResponse
    if (!data.access_token || !data.refresh_token) return null
    return {
      access: data.access_token,
      refresh: data.refresh_token,
      // A minute of slack, so a request never leaves with a token that expires mid-flight.
      expires: Date.now() + (data.expires_in ?? 3600) * 1000 - 60_000,
    }
  } catch {
    return null
  }
}

/**
 * Hands the stored session to the data layer, refreshing it first when it has
 * aged out. Supabase access tokens last an hour; without the refresh the client
 * would be asked for the password every hour of a working day.
 */
async function restoreSupabaseSession(): Promise<boolean> {
  const stored = readSession()
  if (!stored) return false
  if (stored.expires > Date.now()) {
    setAccessToken(stored.access)
    return true
  }
  const refreshed = await token({ refresh_token: stored.refresh }, 'refresh_token')
  if (!refreshed) {
    writeSession(null)
    setAccessToken(null)
    return false
  }
  writeSession(refreshed)
  setAccessToken(refreshed.access)
  return true
}

const SESSION_KEY = 'epm.admin.session'
const ATTEMPTS_KEY = 'epm.admin.attempts'
/** How long a sign-in lasts before the password is asked for again. */
const TTL_MS = 12 * 60 * 60 * 1000

/**
 * Back-off after wrong passwords: 5 free tries, then a wait that doubles up to
 * five minutes. It runs in this browser, so a determined attacker with a script
 * steps around it; what it stops is someone sitting at the page guessing, and
 * it costs a real user nothing.
 */
const FREE_ATTEMPTS = 5
const MAX_LOCK_MS = 5 * 60 * 1000

type Attempts = { count: number; until: number }

function readAttempts(): Attempts {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    const parsed = raw ? (JSON.parse(raw) as Attempts) : null
    if (parsed && typeof parsed.count === 'number' && typeof parsed.until === 'number') return parsed
  } catch {
    /* fall through */
  }
  return { count: 0, until: 0 }
}

function writeAttempts(value: Attempts): void {
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(value))
  } catch {
    /* nothing to do */
  }
}

/** Milliseconds the caller still has to wait, or 0 when a try is allowed. */
export function lockedFor(): number {
  const { until } = readAttempts()
  return Math.max(0, until - Date.now())
}

function recordFailure(): void {
  const { count } = readAttempts()
  const next = count + 1
  const over = Math.max(0, next - FREE_ATTEMPTS)
  const wait = over === 0 ? 0 : Math.min(MAX_LOCK_MS, 2 ** (over - 1) * 5000)
  writeAttempts({ count: next, until: Date.now() + wait })
}

function clearFailures(): void {
  try {
    localStorage.removeItem(ATTEMPTS_KEY)
  } catch {
    /* nothing to do */
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** True while a sign-in from this browser is still inside its time window. */
export function hasSession(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const until = Number(raw)
    if (!Number.isFinite(until) || until < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

function openSession(): void {
  try {
    localStorage.setItem(SESSION_KEY, String(Date.now() + TTL_MS))
  } catch {
    /* private mode: the session simply lasts until reload */
  }
}

export function closeSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* nothing to do */
  }
}

export async function checkPassword(password: string): Promise<boolean> {
  if (!password) return false
  const hash = await sha256Hex(password)
  // Constant-time-ish compare. The hash is public anyway (it ships in the
  // bundle), so this guards against nothing serious, but it costs nothing.
  if (hash.length !== PASSWORD_HASH.length) return false
  let diff = 0
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ PASSWORD_HASH.charCodeAt(i)
  return diff === 0
}

/** Session state for the admin router. */
export function useAuth() {
  const [signedIn, setSignedIn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let live = true
    const settle = (value: boolean) => {
      if (!live) return
      setSignedIn(value)
      setReady(true)
    }
    if (usingSupabase) {
      restoreSupabaseSession().then(settle, () => settle(false))
    } else {
      settle(hasSession())
    }
    return () => {
      live = false
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (lockedFor() > 0) return false

    if (usingSupabase) {
      // The database decides. A wrong address, a wrong password or an address
      // missing from admin_emails all end here the same way, and the screen
      // says only that one of the two was wrong.
      const session = await token({ email: email.trim(), password }, 'password')
      if (!session) {
        recordFailure()
        return false
      }
      writeSession(session)
      setAccessToken(session.access)
      clearFailures()
      openSession()
      setSignedIn(true)
      return true
    }

    // Both are checked before anything is reported, and a wrong address costs
    // the same failed attempt as a wrong password. Telling the visitor which
    // half they got wrong would hand them the address for free.
    const ok = emailMatches(email) && (await checkPassword(password))
    if (ok) {
      clearFailures()
      openSession()
      setSignedIn(true)
    } else {
      recordFailure()
    }
    return ok
  }, [])

  const signOut = useCallback(() => {
    writeSession(null)
    setAccessToken(null)
    closeSession()
    setSignedIn(false)
  }, [])

  return { ready, signedIn, signIn, signOut }
}
