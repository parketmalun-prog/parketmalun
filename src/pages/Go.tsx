import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '@/lib/db'
import { recordLinkClick, rememberRef } from '@/lib/analytics'

/**
 * Campaign link handler: /l/<code>.
 *
 * Counts the click, remembers the code for the rest of the session so the
 * pages that follow are attributed to the same campaign, then forwards to the
 * link's destination. An unknown code quietly lands on the homepage.
 *
 * The destination is re-checked here rather than trusted from storage. The
 * editor already refuses anything that is not a path, but this is the line
 * that actually performs the navigation, and `//host` or `/\host` in a row
 * that reached the table another way would walk a visitor off the site
 * (GHSA-wrjc-x8rr-h8h6 in the installed react-router). Anything that is not a
 * plain in-site path lands on the homepage instead.
 */

/** One leading slash, and nothing after it that can be read as a host. */
const SAFE_TARGET = /^\/(?![/\\])/
/** Guards against a remount counting the same click twice. */
let lastCode = ''
let lastAt = 0

export default function Go() {
  const { code = '' } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function run() {
      rememberRef(code)
      const now = Date.now()
      if (code !== lastCode || now - lastAt > 2000) {
        lastCode = code
        lastAt = now
        await recordLinkClick(code)
      }
      let target = '/'
      try {
        const links = await db.listLinks()
        const match = links.find((l) => l.code === code && !l.archived)
        if (match && SAFE_TARGET.test(match.target)) target = match.target
      } catch {
        /* fall through to the homepage */
      }
      if (cancelled) return
      const separator = target.includes('?') ? '&' : '?'
      navigate(`${target}${separator}ref=${encodeURIComponent(code)}`, { replace: true })
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [code, navigate])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-6">
      <p className="cap-label animate-pulse">Augnablik</p>
    </div>
  )
}
