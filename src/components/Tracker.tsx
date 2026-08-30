import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import { recordPageview } from '@/lib/analytics'

/**
 * Records one visit per navigation. Rendered inside Layout, so it sees every
 * public page and none of the admin.
 */
let lastKey = ''
let lastAt = 0

export function Tracker() {
  const { pathname, search } = useLocation()
  const { lang } = useLang()

  useEffect(() => {
    const key = `${pathname}|${lang}`
    const now = Date.now()
    // Guards against React's double effect run in development and against a
    // re-render firing a second row for the same page within a moment.
    if (key === lastKey && now - lastAt < 2000) return
    lastKey = key
    lastAt = now
    void recordPageview(pathname, search, lang)
  }, [pathname, search, lang])

  return null
}
