import { useId } from 'react'
import type { ParquetPattern } from '@/data/catalog'

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

/** Generated wood-parquet swatch (no external image). Plank boards or herringbone. */
export function ParquetSwatch({ tone, pattern, className }: Props) {
  const uid = useId().replace(/:/g, '')
  const grain = shade(tone, -34)

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
            planks.push(<line key={`g${y}`} x1={-70} y1={y + 4.5} x2={190} y2={y + 4.5} stroke={grain} strokeWidth={0.5} opacity={0.35} />)
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

  // plank pattern: horizontal boards with offset butt joints + grain
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
