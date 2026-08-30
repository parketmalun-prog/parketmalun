import type { Lang } from '@/i18n/config'
import { db, emitChange } from './db'
import type { Device } from './db/types'
import { newId } from './ids'

/**
 * First-party, cookieless visit counting.
 *
 * What is stored per view: the path, the language, the device class, the
 * referring hostname, the campaign code and a random per-tab session id.
 * What is never stored: IP address, cookies, fingerprints, query strings or
 * anything that could identify a person across sites.
 */

const SESSION_KEY = 'epm.session'
const REF_KEY = 'epm.ref'
const OPTOUT_KEY = 'epm.optout'

/** Per-tab id, regenerated whenever a new tab opens. */
function sessionId(): { id: string; fresh: boolean } {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return { id: existing, fresh: false }
    const id = newId()
    sessionStorage.setItem(SESSION_KEY, id)
    return { id, fresh: true }
  } catch {
    return { id: 'no-storage', fresh: true }
  }
}

export function deviceOf(): Device {
  const w = typeof window === 'undefined' ? 1280 : window.innerWidth
  if (w < 640) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

/** Hostname of the referring site, or null for direct and same-site traffic. */
export function referrerHost(): string | null {
  try {
    const raw = document.referrer
    if (!raw) return null
    const host = new URL(raw).hostname.replace(/^www\./, '')
    if (host === window.location.hostname.replace(/^www\./, '')) return null
    return host
  } catch {
    return null
  }
}

/** Remember which campaign the visitor arrived through, for this tab only. */
export function rememberRef(code: string): void {
  try {
    sessionStorage.setItem(REF_KEY, code)
  } catch {
    /* private mode: attribution just stays per page view */
  }
}

/** Campaign code for the current view: the ?ref= parameter wins, then the tab. */
export function currentRef(search: string): string | null {
  const fromUrl = new URLSearchParams(search).get('ref')
  if (fromUrl) {
    rememberRef(fromUrl)
    return fromUrl
  }
  try {
    return sessionStorage.getItem(REF_KEY)
  } catch {
    return null
  }
}

/** Anyone can silence tracking for their own browser from the admin settings. */
export function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPTOUT_KEY) === '1'
  } catch {
    return false
  }
}

export function setOptedOut(value: boolean): void {
  try {
    if (value) localStorage.setItem(OPTOUT_KEY, '1')
    else localStorage.removeItem(OPTOUT_KEY)
  } catch {
    /* nothing to do */
  }
}

function skip(path: string): boolean {
  if (path.startsWith('/admin') || path.startsWith('/l/')) return true
  if (isOptedOut()) return true
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true
  return false
}

/** Record one page view. Never throws: statistics must not break a page. */
export async function recordPageview(path: string, search: string, lang: Lang): Promise<void> {
  if (skip(path)) return
  const { id, fresh } = sessionId()
  try {
    await db.recordVisit({
      id: newId(),
      ts: Date.now(),
      path,
      lang,
      ref: currentRef(search),
      referrer: referrerHost(),
      device: deviceOf(),
      session: id,
      entry: fresh,
    })
    emitChange('stats')
  } catch {
    /* a dropped visit row is not worth a broken page */
  }
}

/** Record a hit on /l/<code> before the redirect fires. */
export async function recordLinkClick(code: string): Promise<void> {
  if (isOptedOut()) return
  try {
    await db.recordClick({
      id: newId(),
      ts: Date.now(),
      code,
      referrer: referrerHost(),
      device: deviceOf(),
    })
    emitChange('stats')
  } catch {
    /* ignore */
  }
}
