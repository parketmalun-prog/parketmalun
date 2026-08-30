import { photoManifest } from '@/data/photoManifest'

export type ImgSources = {
  /** What to put in `src`: the widest WebP, or the original when unknown. */
  src: string
  /** WebP candidates for `srcSet`, empty when the photo is unknown. */
  srcSet: string
  /** Intrinsic pixel size, for width/height so the box never shifts. */
  width?: number
  height?: number
}

/**
 * Resolve a photograph to its responsive WebP set.
 *
 * Every slot used to hand a phone the same full-size JPEG, which on the
 * catalog strip meant 487 kB to fill a 112px sliver. The derivatives come
 * from scripts/optimize-photos.py and are described in photoManifest, so
 * this is a lookup rather than a guess; an unknown path degrades to the
 * plain original rather than a broken image.
 *
 * WebP is served DIRECTLY rather than through <picture> with a JPEG
 * fallback. That is deliberate: React's hydration re-runs source selection
 * on a <picture>, and the browser fetches the <img src> fallback as well as
 * the chosen <source>, so every photograph was downloaded twice. Measured
 * on the prerendered page with scripts stripped, the markup alone fetches
 * only the WebP; the duplicate appears the moment React takes over. Serving
 * WebP directly removes the second request, and WebP has been supported by
 * every browser this site can run in since 2020.
 */
export function imgSources(src?: string): ImgSources {
  if (!src) return { src: '', srcSet: '' }
  const meta = photoManifest[src]
  if (!meta) return { src, srcSet: '' }

  const stem = src.replace(/\.jpe?g$/i, '')
  const widest = meta.widths[meta.widths.length - 1]
  return {
    src: `${stem}-${widest}.webp`,
    srcSet: meta.widths.map((w) => `${stem}-${w}.webp ${w}w`).join(', '),
    width: meta.w,
    height: meta.h,
  }
}
