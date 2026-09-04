import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

/**
 * The hairline that answers a click when the page cannot answer it instantly.
 *
 * Navigation runs inside a React transition now, which means the page already
 * on screen stays on screen until the next one is ready to paint. That removes
 * the blank placeholder, but it also removes the only signal the visitor had
 * that their click registered. On a warm route the swap is a single frame and
 * needs no signal at all; on a cold one over a slow link it can be a few
 * hundred milliseconds of an apparently unchanged page.
 *
 * So the bar waits. Nothing is drawn for the first 140 ms, which covers every
 * navigation that is already fast, and only a slow one ever reveals it. That
 * ordering matters: a bar that appeared on every click would just be the old
 * flash wearing a different colour.
 */
type Phase = 'idle' | 'running' | 'done'

/** How long a navigation may take before it is worth acknowledging. */
const SHOW_AFTER_MS = 140
/** Never leave the bar running if a navigation is abandoned or fails. */
const SAFETY_MS = 12000

export function NavProgress() {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])
  const here = useRef(pathname)

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

      let url: URL
      try {
        url = new URL(href, window.location.origin)
      } catch {
        return
      }
      // A different origin leaves the app entirely, and a link back to the
      // page we are on is not a navigation.
      if (url.origin !== window.location.origin) return
      if (url.pathname === here.current) return

      clearTimers()
      timers.current.push(window.setTimeout(() => setPhase('running'), SHOW_AFTER_MS))
      timers.current.push(window.setTimeout(() => setPhase('idle'), SAFETY_MS))
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimers()
    }
  }, [])

  // The transition has committed: the new page is on screen.
  useEffect(() => {
    here.current = pathname
    clearTimers()
    setPhase((current) => {
      if (current !== 'running') return 'idle'
      // Let the bar finish its run before it goes, so it never rewinds.
      timers.current.push(window.setTimeout(() => setPhase('idle'), 420))
      return 'done'
    })
  }, [pathname])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden"
    >
      <div
        className={cn(
          'h-full w-full origin-left bg-gold',
          // Only the width is animated while it runs. Fading the bar in over
          // the same long duration would have kept it invisible for the first
          // second of exactly the wait it exists to explain.
          phase === 'idle' && 'scale-x-0 opacity-0 transition-none',
          phase === 'running' && 'scale-x-[0.85] opacity-100 transition-transform duration-[2600ms] ease-out',
          phase === 'done' && 'scale-x-100 opacity-0 transition-[transform,opacity] duration-300 ease-out',
        )}
      />
    </div>
  )
}
