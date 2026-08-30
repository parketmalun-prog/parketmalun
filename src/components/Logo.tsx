import { cn } from '@/lib/utils'

/**
 * Official Expert Parket og Mál logo: the client's real artwork (phone row
 * cropped; NOT a vector recreation), in its own colours. Walnut roof, oak
 * planks with their grain, brown wordmark, gold rules and dots.
 *
 * One file, `/logo.webp`, 512x295 with a real alpha channel, so the same
 * artwork sits on any ground and stays crisp up to the largest call site
 * (the footer mark at h-24) at triple density.
 *
 * The mark ships in the client's colours, straight on any ground; nothing
 * may flatten it onto a background or repaint it to one tone.
 */
const LOGO_SRC = '/logo.webp'
const LOGO_ALT = 'Expert Parket og Mál'
const LOGO_W = 512
const LOGO_H = 295

/**
 * Two cuts of the one artwork. The 512 exists for the footer plaque, which is
 * the only place the mark gets big (h-24 is 166px wide, 499px at triple
 * density); the masthead never needs more than 271px, so it pulls the 320 and
 * keeps 27 kB off the first screen. Callers pass `sizes` so the browser can
 * choose; without it the browser assumes 100vw and takes the heavier cut,
 * which is the safe way round to be wrong.
 */
const LOGO_SRCSET = '/logo-320.webp 320w, /logo.webp 512w'

/**
 * Bare logo image. Size it via className (e.g. h-16).
 */
export function LogoMark({
  className,
  sizes,
  priority = false,
}: {
  className?: string
  /** Rendered width per breakpoint, e.g. "(min-width: 768px) 90px, 76px". */
  sizes?: string
  /** Above the fold: load eagerly. Not fetchpriority: the hero photograph is the LCP and keeps that lane. */
  priority?: boolean
}) {
  return (
    <img
      src={LOGO_SRC}
      srcSet={LOGO_SRCSET}
      sizes={sizes}
      alt={LOGO_ALT}
      width={LOGO_W}
      height={LOGO_H}
      {...(priority ? {} : { loading: 'lazy' as const })}
      decoding="async"
      className={cn('w-auto select-none', className)}
      draggable={false}
    />
  )
}

