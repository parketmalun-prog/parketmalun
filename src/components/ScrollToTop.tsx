import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToElement, scrollToTopImmediate } from '@/lib/smoothScroll'

/** Scroll to top on navigation; scroll to #hash target when present. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        window.requestAnimationFrame(() => scrollToElement(el))
        return
      }
    }
    scrollToTopImmediate()
    // Move keyboard/screen-reader focus to the new page's main region so
    // assistive tech announces the change instead of staying silent (SPA nav).
    document.getElementById('efni')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return null
}
