import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { reducedMotion } from './motionPrimitives'
import { subscribeScroll } from '@/lib/smoothScroll'

/**
 * Panorama: a horizontal filmstrip driven by the vertical scrollbar.
 *
 * Below lg (and whenever the visitor asks for reduced motion) this is the
 * native snap carousel the site always had: pure compositor scrolling with
 * no JavaScript attached, which is exactly what an old phone should get.
 *
 * From lg up the section grows a vertical runway, the viewport pins under
 * the 72px masthead and the track translates 1px left for every 1px
 * scrolled. One passive scroll listener sets one rAF; the frame reads only
 * cached bounds and writes one transform. No IntersectionObserver (the
 * embedded preview pane never fires it), no React state per frame.
 *
 * The matchMedia gate in the effect and the motion-safe:lg: classes on the
 * markup must describe the same condition or CSS and JS disagree, and it is
 * re-read on every measure rather than once at mount. Reading it once was a
 * real bug: a window opened wide and then narrowed past lg kept the runway
 * height the pinned mode had written, while the CSS had already dropped to
 * the carousel, so the section ended in a screen and a half of empty ground
 * under the strip. HEADER_PX is the fixed masthead height and mirrors
 * lg:top-[72px] below.
 *
 * The track is moved from the shared scroll source rather than from a raw
 * scroll listener: when Lenis is driving, its own tick is the only signal
 * that lands in the same frame as the sticky container, and anything later
 * shears the plates away from their frame.
 */
const HEADER_PX = 72

export function Panorama({
  heading,
  children,
  className,
}: {
  heading?: ReactNode
  children: ReactNode
  /** Ground colour for the whole runway, e.g. 'bg-espresso'. */
  className?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (reducedMotion()) return

    const mq = window.matchMedia('(min-width: 1024px)')
    let pinned = false
    let start = 0
    let maxX = 0

    // Hand the section back to the carousel: drop the runway height and the
    // track offset this effect wrote, so the layout is the one the classes
    // describe on their own.
    const release = () => {
      pinned = false
      maxX = 0
      section.style.height = ''
      track.style.transform = ''
    }

    const frame = () => {
      if (!pinned) return
      const x = Math.min(maxX, Math.max(0, window.scrollY - start))
      track.style.transform = `translate3d(${-x}px, 0, 0)`
    }

    const measure = () => {
      // Same gate as the motion-safe:lg: classes, re-read every time: the
      // window can cross the breakpoint long after mount.
      if (!mq.matches) {
        if (pinned) release()
        return
      }
      // innerWidth reads 0 inside some embedded preview panes, which would
      // make the runway the whole track wide and open a hole under it.
      const viewportW = window.innerWidth || document.documentElement.clientWidth
      if (!viewportW) {
        if (pinned) release()
        return
      }
      pinned = true
      maxX = Math.max(0, track.scrollWidth - viewportW)
      // Runway: the pinned viewport is (100svh minus header) tall, so the
      // section keeps it pinned for exactly maxX pixels of scroll.
      section.style.height = `${window.innerHeight - HEADER_PX + maxX}px`
      start = section.getBoundingClientRect().top + window.scrollY - HEADER_PX
      frame()
    }

    measure()
    const unsubscribe = subscribeScroll(frame)
    window.addEventListener('resize', measure)
    mq.addEventListener('change', measure)
    // The display face swapping in changes the track width; measure again.
    document.fonts?.ready.then(measure).catch(() => {})

    return () => {
      unsubscribe()
      window.removeEventListener('resize', measure)
      mq.removeEventListener('change', measure)
      release()
    }
  }, [])

  return (
    <section ref={sectionRef} className={`py-16 lg:py-24 motion-safe:lg:py-0 ${className ?? ''}`}>
      <div className="motion-safe:lg:sticky motion-safe:lg:top-[72px] motion-safe:lg:flex motion-safe:lg:h-[calc(100svh-72px)] motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:overflow-hidden">
        {heading}
        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 md:gap-6 lg:gap-10 motion-safe:lg:snap-none motion-safe:lg:overflow-visible motion-safe:lg:pb-0 motion-safe:lg:will-change-transform"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
