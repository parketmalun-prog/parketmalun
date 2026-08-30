import type Lenis from 'lenis'

/**
 * Momentum scrolling, the macOS-fluid feel (Lenis, the same engine the
 * reference site runs).
 *
 * Two gates decide whether it runs at all, and the module is only fetched
 * once they pass, so a phone never downloads or parses it:
 *
 * 1. Fine pointers only. A touch device already scrolls on the compositor,
 *    off the main thread; hijacking that makes an old phone worse, which is
 *    the opposite of what this site optimises for.
 * 2. Never when the visitor asked for reduced motion.
 *
 * Lenis drives the real scroll position, so window.scrollY stays truthful
 * and native scroll events keep firing. That matters here: the Panorama
 * reads window.scrollY every frame, the masthead watches it to decide when
 * to take its cream ground, and position:sticky must keep working.
 */
let instance: Lenis | null = null

/**
 * One scroll source for the whole page.
 *
 * This exists because of a real timing bug. Lenis writes the scroll position
 * inside its own rAF; the browser then dispatches the resulting scroll event
 * in the NEXT frame. Anything that listens for that event and schedules yet
 * another rAF ends up one to two frames behind, which on the pinned filmstrip
 * shows up as the plates shearing away from their own sticky frame.
 *
 * Subscribers are therefore driven by Lenis's own tick when Lenis is running,
 * and by a passive window listener when it is not (touch, reduced motion).
 * The source is rebound the moment Lenis finishes loading, so components that
 * subscribed before the dynamic import resolved are moved across.
 */
type ScrollCb = () => void
const subs = new Set<ScrollCb>()
let unbindSource: (() => void) | null = null

function fanOut() {
  for (const cb of subs) cb()
}

function bindSource() {
  unbindSource?.()
  const lenis = instance
  if (lenis) {
    lenis.on('scroll', fanOut)
    unbindSource = () => lenis.off('scroll', fanOut)
    return
  }
  window.addEventListener('scroll', fanOut, { passive: true })
  unbindSource = () => window.removeEventListener('scroll', fanOut)
}

/** Subscribe to scroll. Returns the unsubscribe, ready for a useEffect. */
export function subscribeScroll(cb: ScrollCb): () => void {
  subs.add(cb)
  if (subs.size === 1) bindSource()
  return () => {
    subs.delete(cb)
    if (subs.size === 0) {
      unbindSource?.()
      unbindSource = null
    }
  }
}

/**
 * Freeze the page behind an overlay. Setting body overflow is not enough on
 * its own any more: html is the scrollport and Lenis writes it every frame,
 * so the page would keep moving under an open menu.
 */
export function lockScroll(locked: boolean): void {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (locked) instance?.stop()
  else instance?.start()
}

export function getLenis(): Lenis | null {
  return instance
}

export function startSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {}

  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || reduced) return () => {}

  let cancelled = false
  let started: Lenis | null = null

  void import('lenis').then(({ default: LenisCtor }) => {
    if (cancelled) return
    const lenis = new LenisCtor({
      // Longer glide, the macOS feel the client asked for (2026-08-26).
      duration: 1.4,
      // Expo-out: reacts at once, settles long, never rubber bands.
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch stays native even on a laptop that also has a touchscreen.
      syncTouch: false,
      autoRaf: true,
    })
    started = lenis
    instance = lenis
    // Move any component that subscribed while the import was in flight.
    if (subs.size > 0) bindSource()
  })

  return () => {
    cancelled = true
    started?.destroy()
    if (instance === started) {
      instance = null
      if (subs.size > 0) bindSource()
    }
  }
}

/** Jump without animation, used on route change. */
export function scrollToTopImmediate(): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
    return
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/** Animated scroll to an element, used for in-page anchors. */
export function scrollToElement(el: Element): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -72 })
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
