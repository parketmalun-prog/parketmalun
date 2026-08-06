import { useCallback, useId, useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUi } from '@/i18n/context'

type Props = {
  /** Real "before" photo URL. Until the client supplies photos, omit both and
      the slider demos with two neutral grey placeholder surfaces. */
  beforeSrc?: string
  afterSrc?: string
  className?: string
}

/**
 * Interactive before/after comparison. Rounded-lg container, a square gold
 * grip on a 2px cream rule, masking-tape labels (the only rotated elements on
 * the site). With no photos yet it renders two neutral grey placeholder
 * surfaces (deliberately grey, not the brown palette, so they read as pending
 * photos rather than final art).
 */
export function BeforeAfter({ beforeSrc, afterSrc, className }: Props) {
  const [pos, setPos] = useState(52)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const t = useUi()
  const id = useId()

  const update = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(3, Math.min(97, pct)))
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-[4/3] w-full select-none overflow-hidden rounded-lg border border-espresso/15 focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-cream',
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* AFTER: finished floor (base layer) */}
      {afterSrc ? (
        <img
          src={afterSrc}
          alt={t.common.alt.beforeAfterAfter}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(90deg, #3E3E3E 0 72px, #4A4A4A 72px 144px, #383838 144px 146px)',
          }}
          aria-hidden
        >
          {/* photo placeholder sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
        </div>
      )}
      <span className="tape tape-alt pointer-events-none absolute bottom-4 right-4 z-10">{t.common.after}</span>

      {/* BEFORE: raw floor (clipped layer) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeSrc ? (
          <img
            src={beforeSrc}
            alt={t.common.alt.beforeAfterBefore}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            decoding="async"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(90deg, #D2D2D2 0 72px, #DEDEDE 72px 144px, #C7C7C7 144px 146px)',
            }}
            aria-hidden
          >
            {/* dust and wear */}
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-500/20 via-transparent to-neutral-500/10" />
          </div>
        )}
        <span className="tape pointer-events-none absolute bottom-4 left-4">{t.common.before}</span>
      </div>

      {/* Divider rule + square grip */}
      <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-cream" />
        <div className="absolute top-1/2 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center border-2 border-cream bg-gold-deep text-cream">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>

      <label className="sr-only" htmlFor={`ba-${id}`}>
        {t.a11y.sliderCompare}
      </label>
      <input
        id={`ba-${id}`}
        type="range"
        min={3}
        max={97}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label={t.a11y.sliderCompare}
        aria-valuetext={t.a11y.sliderValueText.replace('{n}', String(Math.round(pos)))}
      />
    </div>
  )
}
