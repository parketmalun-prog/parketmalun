import { useId } from 'react'
import type { ParquetPattern } from '@/data/catalog'

/**
 * A drawn parquet swatch: boards in the pattern the product is sold in, from
 * one tone, with no photograph behind it.
 *
 * This component was deleted on 1 September 2026 in favour of swatches
 * composed from Real Dutch Floor's own board photographs, which read far more
 * like a floor. It is back because no licence for publishing those
 * photographs was ever confirmed, and the note that asked for that
 * confirmation sat unanswered in photos-library/parket-source/README.md until
 * the legal pass of 8 September. A drawing we own beats a photograph we cannot
 * account for. The moment Planki or Real Dutch Floor put the permission in
 * writing, ProductSwatch goes back to the photographs and this file can leave
 * again.
 *
 * Three patterns, because the range is sold in three: planks, herringbone and
 * chevron. Chevron is the one the old version could not draw and fell through
 * to planks; it is drawn properly here, mitred rather than butted, so a
 * chevron product no longer shows a plank floor.
 */

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function shade(hex: string, amt: number): string {
  const [r, g, b] = toRgb(hex)
  return `rgb(${clamp(r + amt)}, ${clamp(g + amt)}, ${clamp(b + amt)})`
}

type Props = { tone: string; pattern: ParquetPattern; className?: string }

export function ParquetSwatch({ tone, pattern, className }: Props) {
  const uid = useId().replace(/:/g, '')
  const grain = shade(tone, -34)

  if (pattern === 'chevron') {
    // Columns of mitred parallelograms. Adjacent columns mirror the angle and
    // step their offset by exactly the drop across one column, which is what
    // makes the plank ends meet in a V on the seam instead of sliding past it.
    const colW = 20
    const drop = colW // tan(45 degrees)
    const pitch = 11
    const cols = Math.ceil(120 / colW)
    return (
      <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
        <rect width="120" height="90" fill={shade(tone, -6)} />
        {Array.from({ length: cols }).map((_, c) => {
          const x0 = c * colW
          const up = c % 2 === 0
          const base = up ? 0 : -drop
          const planks = []
          let idx = 0
          for (let y = -drop - pitch * 2; y < 90 + drop + pitch * 2; y += pitch) {
            const top = y + base
            const rightTop = up ? top - drop : top + drop
            const s = shade(tone, idx % 3 === 0 ? 7 : idx % 3 === 1 ? -11 : 0)
            planks.push(
              <polygon
                key={y}
                points={`${x0},${top} ${x0 + colW},${rightTop} ${x0 + colW},${rightTop + pitch} ${x0},${top + pitch}`}
                fill={s}
                stroke={grain}
                strokeWidth={0.5}
                strokeOpacity={0.45}
              />,
            )
            idx++
          }
          return <g key={c}>{planks}</g>
        })}
      </svg>
    )
  }

  if (pattern === 'herringbone') {
    const colW = 20
    const cols = Math.ceil(120 / colW)
    const shadesByCol = (c: number) => (c % 2 === 0 ? 0 : -8)
    return (
      <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
        <defs>
          {Array.from({ length: cols }).map((_, c) => (
            <clipPath id={`hb-${uid}-${c}`} key={c}>
              <rect x={c * colW} y={0} width={colW} height={90} />
            </clipPath>
          ))}
        </defs>
        <rect width="120" height="90" fill={shade(tone, -6)} />
        {Array.from({ length: cols }).map((_, c) => {
          const cx = c * colW + colW / 2
          const angle = c % 2 === 0 ? -43 : 43
          const planks = []
          let idx = 0
          for (let y = -70; y < 170; y += 12) {
            const s = shade(tone, shadesByCol(c) + (idx % 2 === 0 ? 6 : -10))
            planks.push(<rect key={y} x={-70} y={y} width={260} height={9} fill={s} />)
            planks.push(
              <line
                key={`g${y}`}
                x1={-70}
                y1={y + 4.5}
                x2={190}
                y2={y + 4.5}
                stroke={grain}
                strokeWidth={0.5}
                opacity={0.35}
              />,
            )
            idx++
          }
          return (
            <g key={c} clipPath={`url(#hb-${uid}-${c})`}>
              <g transform={`rotate(${angle} ${cx} 45)`}>{planks}</g>
            </g>
          )
        })}
      </svg>
    )
  }

  // Planks: horizontal boards with offset butt joints and a little grain.
  const rowH = 15
  const rows = Math.ceil(90 / rowH)
  return (
    <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="120" height="90" fill={tone} />
      {Array.from({ length: rows }).map((_, i) => {
        const y = i * rowH
        const s = shade(tone, i % 3 === 0 ? 8 : i % 3 === 1 ? -12 : 0)
        const jointX = ((i * 37) % 90) + 15
        return (
          <g key={i}>
            <rect x={0} y={y} width={120} height={rowH} fill={s} />
            <line x1={0} y1={y} x2={120} y2={y} stroke={grain} strokeWidth={0.8} opacity={0.5} />
            <line x1={jointX} y1={y} x2={jointX} y2={y + rowH} stroke={grain} strokeWidth={0.8} opacity={0.45} />
            <line x1={0} y1={y + rowH * 0.4} x2={120} y2={y + rowH * 0.4} stroke={grain} strokeWidth={0.4} opacity={0.25} />
            <line x1={0} y1={y + rowH * 0.72} x2={120} y2={y + rowH * 0.72} stroke={grain} strokeWidth={0.4} opacity={0.2} />
          </g>
        )
      })}
    </svg>
  )
}
