import { useEffect, useRef } from 'react'
import { reducedMotion } from './motionPrimitives'
import { subscribeScroll } from '@/lib/smoothScroll'
import { imgSources } from '@/lib/img'
import { useLang, useUi } from '@/i18n/context'
import { TextLink } from './TextLink'
import type { ServiceKey } from '@/data/site'

/**
 * TradesShowcase: the pinned trades gallery (reference elicyon.com).
 *
 * One full-viewport photograph per trade, pinned under the masthead. The
 * trade's name is set in giant display capitals whose letters start
 * SCATTERED across the picture; scrolling gathers them into one line at the
 * top. Then a quiet hold where nothing moves, so the composed image gets a
 * beat. Then the next photograph rises from the foot of the frame over the
 * current one, carrying its own scattered letters, and the cycle repeats.
 * After the last hold the whole frame unpins and rides away with the page.
 *
 * Mechanics, in the Panorama's mould: one scroll subscription, cached
 * bounds, transform-only writes straight to refs, no React state per frame.
 * The curtain reveal is two nested translates (outer down 100%, inner up
 * -100%) so the incoming photograph appears stationary behind a rising
 * edge; pure compositor work, no clip-path repaints.
 *
 * The scatter is DETERMINISTIC (hashed from slide and letter index), which
 * is what lets the server render the exact same scattered start state and
 * hydration match it. Never use Math.random here.
 *
 * Reduced motion gets none of this: CSS flattens the frame into a plain
 * stack of photographs (see .trades-static rules in index.css) and the
 * effect below never subscribes. The giant letters are hidden there; the
 * caption already carries the name.
 */

/** One slide of the showcase. */
export type TradeSlide = {
  key: ServiceKey
  name: string
  line: string
}

/** Scroll phases, as fractions of one slide's runway. */
const GATHER_END = 0.5 // letters travel during [0, .5]
const REVEAL_SPAN = 0.25 // next photo rises during [.75, 1]
/**
 * One slide's runway, in frame heights. Mirrored by the 1.25 factor in the
 * .trades-wrap rules in index.css. Was 1.7; the hold read as too much
 * scrolling (client, 2026-08-26), so the whole gallery now costs
 * n * 1.25 + 1 screens instead of n * 1.7 + 1.
 */
const RUNWAY = 1.25

/**
 * Pre-roll, in frame heights: how much of the approach, before the frame
 * pins, already belongs to the FIRST slide's gather.
 *
 * Without it slide 0's clock only started once the photograph had locked
 * under the masthead, so the letters sat frozen through the whole approach
 * and then set themselves in one go. The client read that stall as the
 * picture standing still and the type jumping (2026-09-01). The letters now
 * begin to lift once about half the picture is on screen and keep
 * the same clock straight through the pin, so nothing ever waits. The gather
 * still finishes exactly where it did, at GATHER_END, and the hold after it
 * is untouched.
 */
const PRE_ROLL = 0.5

/**
 * Horizontal focal point per trade, for the narrow frames where cover has to
 * throw most of a landscape photograph away. Only malun needs one: the
 * roller sits right of centre in a 3:2 frame, so a phone's centre crop kept
 * the bare wall and cut the roller at the edge, and the slide read as an
 * empty grey panel (client, 2026-08-31). Shifting the window right brings
 * the whole roller in.
 *
 * It MUST be applied to the photograph and to its cutout together: the two
 * share one frame and one cover mapping, and the type only slips behind the
 * roller while they register exactly.
 */
const FOCUS_X: Partial<Record<ServiceKey, string>> = { malun: '64%' }

/** Deterministic pseudo-random in [0, 1), the classic sine hash. */
function hash(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return s - Math.floor(s)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * The letters' own curve. Cubic OUT, not in-out: a letter has to answer the
 * very first turn of the wheel, or the rise reads as a stall however early
 * its clock starts (client, 2026-09-01). In-out spent its first fifth
 * covering three percent of the travel, which is invisible. This leaves at
 * once and lands slowly, which is also how type settles. The curtain and the
 * outgoing line keep easeInOutCubic; only the letters changed.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Where letter k of slide i rests before the gather: straight DOWN from its
 * place in the line, each letter a different depth, never sideways. The
 * client rejected x-jitter as chaotic (2026-08-26): every letter rises
 * vertically into its slot, staggered, like type being set.
 */
function scatter(i: number, k: number) {
  return {
    sy: 10 + hash(i * 131 + k * 7 + 2) * 46, // vh
    delay: hash(i * 131 + k * 7 + 3) * 0.22, // stagger, fraction of the gather
  }
}

/**
 * Display size per word so the longest name on the site (pl "Układanie
 * parkietu") still fits one justified line. 0.78em approximates a Fraunces
 * capital, 0.4em a word space.
 */
function letterFontSize(letters: string[]): string {
  const effLen = letters.reduce((n, c) => n + (c === ' ' ? 0.4 : 0.78), 0)
  return `clamp(2rem, ${Math.min(10.5, 94 / effLen).toFixed(2)}vw, 10.5rem)`
}

export function TradesShowcase({
  items,
  photosByKey,
  cutoutsByKey,
}: {
  items: TradeSlide[]
  photosByKey: Record<ServiceKey, string>
  /** Alpha-WebP foreground lifts of the same frames; letters slide behind them. */
  cutoutsByKey?: Partial<Record<ServiceKey, string>>
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const outerRefs = useRef<(HTMLDivElement | null)[]>([])
  const innerRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const letterRefs = useRef<(HTMLSpanElement | null)[][]>([])
  const { path } = useLang()
  const t = useUi()
  const n = items.length

  useEffect(() => {
    const wrap = wrapRef.current
    const frame = frameRef.current
    if (!wrap || !frame || reducedMotion()) return

    let runwayPx = 0
    let pinStart = 0
    let frameH = 0
    // Slide 0's gather, in absolute scroll px: it opens PRE_ROLL frames
    // before the pin and still closes at GATHER_END of the pinned runway.
    let gatherStart0 = 0
    let gatherSpan0 = 1
    // Last written value per slide, so a settled frame writes nothing.
    const lastGather: number[] = items.map(() => -1)
    const lastReveal: number[] = items.map(() => -1)
    const lastRow: number[] = items.map(() => -1)

    const tick = () => {
      const y = window.scrollY
      const p = Math.min(n, Math.max(0, (y - pinStart) / runwayPx))

      for (let i = 0; i < n; i++) {
        // Each letter makes ONE continuous journey to its slot, staggered.
        // The first slide's letters start scattered in frame and gather. An
        // incoming slide's letters start BELOW the frame, each at its own
        // depth, and rise on their own clocks from the moment the curtain
        // starts: they arrive as a loose flock, never as a frozen block
        // shifted up (client, 2026-08-29). The curtain clips them until its
        // edge passes, so a letter can never appear over the old photo.
        const journey =
          i === 0
            ? clamp01((y - gatherStart0) / gatherSpan0)
            : clamp01((p - (i - REVEAL_SPAN)) / (REVEAL_SPAN + GATHER_END))
        if (journey !== lastGather[i]) {
          lastGather[i] = journey
          const row = letterRefs.current[i] ?? []
          for (let k = 0; k < row.length; k++) {
            const el = row[k]
            if (!el) continue
            const { sy, delay } = scatter(i, k)
            const le = easeOutCubic(clamp01((journey - delay) / (1 - delay)))
            const depth = i === 0 ? (sy / 100) * frameH : frameH * (0.45 + (sy / 100) * 1.15)
            el.style.transform = `translate3d(0, ${(depth * (1 - le)).toFixed(2)}px, 0)`
          }
        }

        // The assembled word lifts away as the NEXT curtain rises, so it
        // leaves the frame instead of being guillotined by the sweep.
        let rowTy = 0
        if (i < n - 1)
          rowTy = -easeInOutCubic(clamp01((p - (i + 1 - REVEAL_SPAN)) / REVEAL_SPAN)) * frameH * 0.45
        if (rowTy !== lastRow[i]) {
          lastRow[i] = rowTy
          const row = rowRefs.current[i]
          if (row) row.style.transform = `translate3d(0, ${rowTy.toFixed(2)}px, 0)`
        }

        // The curtain: slide i rises over slide i-1 at the end of i-1's hold.
        if (i === 0) continue
        const reveal = clamp01((p - (i - REVEAL_SPAN)) / REVEAL_SPAN)
        if (reveal !== lastReveal[i]) {
          lastReveal[i] = reveal
          const ty = (1 - easeInOutCubic(reveal)) * 100
          const outer = outerRefs.current[i]
          const inner = innerRefs.current[i]
          if (outer) outer.style.transform = `translate3d(0, ${ty.toFixed(3)}%, 0)`
          if (inner) inner.style.transform = `translate3d(0, ${(-ty).toFixed(3)}%, 0)`
        }
      }
    }

    const measure = () => {
      const stickyTop = parseFloat(getComputedStyle(frame).top) || 0
      frameH = frame.clientHeight
      runwayPx = frameH * RUNWAY
      pinStart = wrap.getBoundingClientRect().top + window.scrollY - stickyTop
      gatherStart0 = pinStart - frameH * PRE_ROLL
      gatherSpan0 = frameH * PRE_ROLL + GATHER_END * runwayPx
      tick()
    }

    measure()
    const unsubscribe = subscribeScroll(tick)
    window.addEventListener('resize', measure)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', measure)
    }
  }, [items, n])

  return (
    <div ref={wrapRef} className="trades-wrap" style={{ '--n': n } as React.CSSProperties}>
      <div ref={frameRef} className="trades-frame bg-espresso">
        {items.map((s, i) => {
          const img = imgSources(photosByKey[s.key])
          const focusX = FOCUS_X[s.key]
          const letters = [...s.name.toUpperCase()]
          const fontSize = letterFontSize(letters)
          return (
            <div
              key={s.key}
              ref={(el) => (outerRefs.current[i] = el)}
              className="trades-layer absolute inset-0 overflow-hidden will-change-transform"
              style={i > 0 ? { transform: 'translate3d(0, 100%, 0)' } : undefined}
            >
              <div
                ref={(el) => (innerRefs.current[i] = el)}
                className="trades-layer-inner absolute inset-0 will-change-transform"
                style={i > 0 ? { transform: 'translate3d(0, -100%, 0)' } : undefined}
              >
                <img
                  src={img.src}
                  srcSet={img.srcSet || undefined}
                  sizes={img.srcSet ? '100vw' : undefined}
                  alt=""
                  width={img.width}
                  height={img.height}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={focusX ? { objectPosition: `${focusX} 50%` } : undefined}
                  decoding="async"
                />
                {/* One scrim, heavier at the foot for the caption, a breath at
                    the top so the gathered line always lands on ground. */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/20 to-espresso/50"
                  aria-hidden
                />

                {/* The name, one letter per span. The row is the FINAL state;
                    the scattered start is only a transform, so any language
                    and any word length lays itself out. */}
                <div
                  ref={(el) => (rowRefs.current[i] = el)}
                  className="trades-letters pointer-events-none absolute inset-x-0 top-0 flex justify-between px-[3vw] pt-[3.5vh] font-display font-light uppercase leading-none text-cream will-change-transform"
                  style={{ fontSize }}
                  aria-hidden
                >
                  {letters.map((c, k) =>
                    c === ' ' ? (
                      <span key={k} className="w-[0.4em]" />
                    ) : (
                      <span
                        key={k}
                        ref={(el) => {
                          ;(letterRefs.current[i] ??= [])[k] = el
                        }}
                        className="block will-change-transform"
                        style={{
                          transform:
                            i === 0
                              ? `translate3d(0, ${scatter(i, k).sy.toFixed(3)}vh, 0)`
                              : `translate3d(0, ${(45 + scatter(i, k).sy * 1.15).toFixed(3)}vh, 0)`,
                        }}
                      >
                        {c}
                      </span>
                    ),
                  )}
                </div>

                {/* The subject lifted off the photograph, laid OVER the
                    letters: the type slips behind the craftsman, the sander,
                    the roller. Same frame, same cover mapping, so the two
                    layers register exactly. */}
                {cutoutsByKey?.[s.key] ? (
                  <img
                    src={cutoutsByKey[s.key]}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    style={focusX ? { objectPosition: `${focusX} 50%` } : undefined}
                    decoding="async"
                  />
                ) : null}

                {/* Corner caption: the name and the invitation, nothing else.
                    The line of copy moved to the service page (client,
                    2026-08-26: "Painting, Read more, and that is all"). */}
                <div className="container-x absolute inset-x-0 bottom-0 flex items-end justify-end pb-24 sm:pb-8 sm:pr-24 lg:pb-12">
                  <div className="text-right">
                    <h3 className="font-display text-xl font-bold leading-tight text-cream lg:text-2xl">{s.name}</h3>
                    <TextLink to={path('services', s.key)} dark className="mt-3 inline-block">
                      {t.common.readMore}
                    </TextLink>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
