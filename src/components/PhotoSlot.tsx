import { cn } from '@/lib/utils'
import { IconPhoto } from './icons'

type Aspect = '4/5' | '4/3' | '3/2' | '16/9' | '1/1' | '21/9' | '1/3' | '3/4'

/**
 * Surface tone of the placeholder block. Neutral greys only, per the client:
 * a grey block reads as "a real photo goes here", not as a design element.
 * The tone names are kept from the old palette so call sites stay untouched;
 * they now map dark to light grey.
 */
type Tone = 'espresso' | 'walnut' | 'sand' | 'cream'

const aspectClass: Record<Aspect, string> = {
  '4/5': 'aspect-[4/5]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
  '1/3': 'aspect-[1/3]',
  '3/4': 'aspect-[3/4]',
}

const toneClass: Record<Tone, string> = {
  espresso: 'bg-neutral-800 border-neutral-800',
  walnut: 'bg-neutral-600 border-neutral-600',
  sand: 'bg-neutral-300 border-neutral-400/50',
  cream: 'bg-neutral-200 border-neutral-300',
}

/** Tones that need light type on top. */
const isDarkTone = (tone: Tone) => tone === 'espresso' || tone === 'walnut'

type Props = {
  aspect?: Aspect
  tone?: Tone
  /** Print caption rendered UNDER the slot, house style: "Garðabær · 2024 · Eik". */
  caption?: string
  /** Tiny corner mark inside the slot. Defaults to "Mynd". */
  label?: string
  /** Future real photo. When provided, renders the image instead of the grey block. */
  src?: string
  alt?: string
  className?: string
}

/**
 * The only way to place imagery on the site. Renders a neutral grey block
 * standing in for photography the client has not supplied yet; passing `src`
 * later swaps in the real image with zero layout change.
 */
export function PhotoSlot({ aspect = '4/3', tone = 'sand', caption, label = 'Mynd', src, alt = '', className }: Props) {
  const dark = isDarkTone(tone)

  return (
    <figure className={cn('m-0', className)}>
      <div className={cn('relative w-full overflow-hidden rounded-lg border', aspectClass[aspect], toneClass[tone])}>
        {src ? (
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <>
            {/* soft light gradient so the block reads as a surface, not flat fill */}
            <div
              className={cn(
                'absolute inset-0',
                dark
                  ? 'bg-gradient-to-br from-white/[0.07] via-transparent to-black/30'
                  : 'bg-gradient-to-br from-white/50 via-transparent to-neutral-500/15',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.16em]',
                dark ? 'text-white/75' : 'text-neutral-600',
              )}
            >
              {label}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <IconPhoto className={cn('h-9 w-9', dark ? 'text-white/25' : 'text-neutral-400')} />
            </span>
          </>
        )}
      </div>
      {caption ? <figcaption className="cap-label tnum pt-2">{caption}</figcaption> : null}
    </figure>
  )
}
