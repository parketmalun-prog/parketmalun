import { useCallback, useEffect, useState } from 'react'

/**
 * Sign-in gate for /admin.
 *
 * Be clear about what this is: a lock on the door, not a vault. The check runs
 * in the browser, so it keeps the panel out of reach of visitors and search
 * engines, and that is all it can do. Right now there is nothing behind it but
 * this browser's own storage, so that matches the risk.
 *
 * The moment Supabase is connected, real authentication moves here: Supabase
 * Auth issues the session, row level security decides what it may touch, and
 * this file shrinks to a wrapper around it. See supabase/schema.sql.
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
    setSignedIn(hasSession())
    setReady(true)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (lockedFor() > 0) return false
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
    closeSession()
    setSignedIn(false)
  }, [])

  return { ready, signedIn, signIn, signOut }
}
