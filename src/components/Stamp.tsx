import { useId } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  /** Center numeral, e.g. "25+". */
  value: string
  /** Circular caps text, e.g. "ÁR Í FAGINU · EXPERT PARKET · ". Repeated around the ring. */
  ringText: string
  size?: number
  dark?: boolean
  className?: string
}

/**
 * Static experience seal: circular Fraunces caps text around a bare numeral,
 * 1px gold ring, transparent fill. Print-stamp language; use once per page max.
 */
export function Stamp({ value, ringText, size = 150, dark = false, className }: Props) {
  const id = useId()
  const pathId = `stamp-circle-${id}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      className={cn('select-none', className)}
      aria-hidden
    >
      <defs>
        <path id={pathId} d="M 75,75 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
      </defs>
      <circle cx="75" cy="75" r="72" fill="none" stroke="#B4813A" strokeWidth="1" />
      <circle cx="75" cy="75" r="38" fill="none" stroke="#B4813A" strokeWidth="0.75" strokeOpacity="0.55" />
      <text
        fontSize="11.5"
        letterSpacing="2.6"
        fill={dark ? '#CAA15C' : '#9A6828'}
        style={{ fontFamily: '"Space Grotesk Variable", sans-serif', fontWeight: 500, textTransform: 'uppercase' }}
      >
        <textPath href={`#${pathId}`}>{ringText}</textPath>
      </text>
      <text
        x="75"
        y="75"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="26"
        fontWeight="700"
        fill={dark ? '#FAF5EC' : '#2B1C10'}
        style={{ fontFamily: '"Fraunces Variable", serif' }}
      >
        {value}
      </text>
    </svg>
  )
}
