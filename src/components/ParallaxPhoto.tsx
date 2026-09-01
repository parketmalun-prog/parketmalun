import { useEffect, useRef } from 'react'
import { reducedMotion } from './motionPrimitives'
import { subscribeScroll } from '@/lib/smoothScroll'
import { imgSources } from '@/lib/img'

/**
 * Full-bleed band photograph with a slow counter-drift.
 *
 * The flat backgrounds read as static plates (client, 2026-09-01), so the
 * image is drawn a quarter taller than its band and translated against the
 * scroll: as the band crosses the viewport the photograph slides through
 * its own window, which reads as depth. The drift exactly consumes the
 * overdraw, so no edge is ever exposed.
 *
 * Mechanics in the Panorama's mould: the shared scroll source, cached
 * bounds, one transform write per frame straight to a ref. Reduced motion
 * never subscribes and renders the photograph plain and centred.
 *
 * `mobileSrc` swaps in a different photograph below md, for wide frames
 * whose phone crop keeps nothing recognisable (the area band's empty-room
 * shot read as a beige blur; client, 2026-09-01). Two <img> elements under
 * visibility classes, NOT <picture>: hydration re-runs source selection on
 * a <picture> and fetches twice (see the note in lib/img.ts), while a
 * display:none image is simply never laid out, so its lazy load never
 * triggers.
 */
const OVERDRAW = 0.24

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function ParallaxPhoto({
  src,
  mobileSrc,
  sizes = '100vw',
}: {
  src: string
  /** Optional replacement photograph below the md breakpoint. */
  mobileSrc?: string
  sizes?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const drift = driftRef.current
    if (!wrap || !drift || reducedMotion()) return

    let top = 0
    let height = 1
    let last = Infinity

    const tick = () => {
      const vh = window.innerHeight
      const t = clamp01((window.scrollY + vh - top) / (vh + height))
      const ty = (0.5 - t) * OVERDRAW * height
      if (ty === last) return
      last = ty
      drift.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`
    }

    const measure = () => {
      const r = wrap.getBoundingClientRect()
      top = r.top + window.scrollY
      height = r.height
      tick()
    }

    measure()
    const unsubscribe = subscribeScroll(tick)
    window.addEventListener('resize', measure)
    return () => {
      unsubscribe()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const imgClass = (hiddenClass: string) =>
    `absolute inset-0 h-full w-full object-cover ${hiddenClass}`.trim()

  const renderImg = (photo: string, hiddenClass: string) => {
    const img = imgSources(photo)
    return (
      <img
        src={img.src}
        srcSet={img.srcSet || undefined}
        sizes={img.srcSet ? sizes : undefined}
        alt=""
        width={img.width}
        height={img.height}
        className={imgClass(hiddenClass)}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={driftRef}
        className="absolute inset-x-0 will-change-transform"
        style={{
          top: `${(-OVERDRAW / 2) * 100}%`,
          height: `${(1 + OVERDRAW) * 100}%`,
        }}
      >
        {mobileSrc ? (
          <>
            {renderImg(mobileSrc, 'md:hidden')}
            {renderImg(src, 'hidden md:block')}
          </>
        ) : (
          renderImg(src, '')
        )}
      </div>
    </div>
  )
}
