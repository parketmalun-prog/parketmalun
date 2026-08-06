import { cn } from '@/lib/utils'

/**
 * Official Expert Parket og Mál logo: the client's real artwork
 * (white background removed, phone row cropped; NOT a vector recreation).
 * Source file processed into /public/logo.webp.
 */
const LOGO_SRC = '/logo.webp'
const LOGO_ALT = 'Expert Parket og Mál'

/** Bare logo image: for light backgrounds. Size it via className (e.g. h-16). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={640}
      height={369}
      className={cn('w-auto select-none', className)}
      draggable={false}
    />
  )
}

type LogoProps = {
  className?: string
  /** 'light' = on light backgrounds (plain image); 'dark' = on dark backgrounds (cream plaque keeps the brown wordmark legible). */
  tone?: 'light' | 'dark'
}

export function Logo({ className, tone = 'light' }: LogoProps) {
  if (tone === 'dark') {
    return (
      <span className={cn('inline-flex rounded-xl border border-gold/25 bg-cream px-4 py-3', className)}>
        <img src={LOGO_SRC} alt={LOGO_ALT} width={640} height={369} className="h-20 w-auto select-none sm:h-24" draggable={false} />
      </span>
    )
  }
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={640}
      height={369}
      className={cn('h-[52px] w-auto select-none md:h-[60px]', className)}
      draggable={false}
    />
  )
}
