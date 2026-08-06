/**
 * Custom "craft" icon set for Expert Parket og Mál: drawn by hand for this
 * brand, NOT a standard library. Shared visual language:
 *  - 24×24 grid, 1.7px rounded strokes
 *  - every icon carries a small filled "diamond spark" signature
 *  - secondary strokes at 50% opacity for a two-tone, engraved feel
 *
 * NOTE: only a subset is wired up today (quick contact + photo placeholder);
 * the rest (IconParquet, IconSander, ...) is reserved for the planned
 * services/real-photo content pass. Do not prune.
 */
type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** Herringbone chevrons: parquet laying. */
export function IconParquet({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9.5 12 5l8 4.5" />
      <path d="M4 14.5 12 10l8 4.5" opacity="0.5" />
      <path d="M4 19.5 12 15l8 4.5" />
      <path d="M12 1.9l1.2 1.2L12 4.3l-1.2-1.2z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Floor sanding machine with polish sparks. */
export function IconSander({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4.4" y="12" width="8.2" height="5.6" rx="1.3" />
      <circle cx="7" cy="19.4" r="1.5" />
      <path d="M12.6 12 19 5.2" />
      <path d="M17.6 3.6l2.8 2.8" />
      <path d="M15.6 20.6h2.4M19.8 20.6h1" opacity="0.5" />
      <path d="M3 20.6h9.6" />
      <path d="M15 8.4l1.1 1.1L15 10.6l-1.1-1.1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Paint roller with a wavy fresh-paint stripe. */
export function IconRoller({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4.4" y="4.4" width="11.2" height="4.8" rx="2" />
      <path d="M15.6 6.8h3v4.4h-5.2v2.4" />
      <path d="M13.4 13.6v3" />
      <rect x="11.8" y="16.6" width="3.2" height="3.6" rx="1" />
      <path d="M5.4 11.6c3.4 1.3 7.2 1.3 10.2 0" opacity="0.5" />
      <path d="M7.4 13.4l1.1 1.1-1.1 1.1-1.1-1.1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Trowel: preparation & craft. */
export function IconTrowel({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.2 4.2l9.6 2-7.6 7.6-2-9.6z" />
      <path d="M6.6 6.4l4.4.9" opacity="0.5" />
      <path d="M11.4 10.6l2.2 2.2" />
      <path d="M13.6 12.8l4.4 4.4" strokeWidth="2.4" />
      <path d="M19.6 18.4l1.1 1.1-1.1 1.1-1.1-1.1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Lacquer / oil drop with sheen. */
export function IconDrop({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.4c3.2 3.9 5.4 6.4 5.4 9.3a5.4 5.4 0 1 1-10.8 0c0-2.9 2.2-5.4 5.4-9.3z" />
      <path d="M9.5 13.2a2.7 2.7 0 0 0 1.9 2.5" opacity="0.5" />
      <path d="M17.8 5.4l1.1 1.1-1.1 1.1-1.1-1.1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Shield with herringbone floor inside: guarantee. */
export function IconShieldPlank({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2.8l7 2.8v5.5c0 4.4-2.9 7.4-7 9.4-4.1-2-7-5-7-9.4V5.6l7-2.8z" />
      <path d="M8.6 12.4 12 10l3.4 2.4" />
      <path d="M8.6 15.6 12 13.2l3.4 2.4" opacity="0.5" />
    </svg>
  )
}

/** Clock with gold hour ticks: punctuality. */
export function IconClockCraft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12.6" r="7.9" />
      <path d="M12 8.4v4.2l2.9 1.9" />
      <path d="M12 6.2v-1M18.4 12.6h1" opacity="0.5" />
      <path d="M12 1.6l1 1-1 1-1-1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Four-point sparkle: clean finish / quality. */
export function IconSparkleStar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11.2 3.2c.8 4 2.6 5.8 6.6 6.6-4 .8-5.8 2.6-6.6 6.6-.8-4-2.6-5.8-6.6-6.6 4-.8 5.8-2.6 6.6-6.6z" />
      <path d="M18.4 15.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" fill="currentColor" stroke="none" opacity="0.55" />
    </svg>
  )
}

/** Medal with herringbone chevron: 25+ years of experience. */
export function IconAward({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="9" r="5.2" />
      <path d="M9.4 8.9 12 7l2.6 1.9" opacity="0.5" />
      <path d="M9.3 13.3 7.6 20.6l4.4-2.5 4.4 2.5-1.7-7.3" />
    </svg>
  )
}

/** Ringing handset. */
export function IconPhoneRing({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.2 3.6h1.5c.7 0 1.3.5 1.4 1.2l.6 2.7c.1.6-.1 1.2-.6 1.6l-1.1 1a12.4 12.4 0 0 0 5.9 5.9l1-1.1c.4-.5 1-.7 1.6-.6l2.7.6c.7.1 1.2.7 1.2 1.4v1.5c0 .8-.7 1.5-1.5 1.4C10.5 18.7 5.3 13.5 3.8 5.1c-.1-.8.6-1.5 1.4-1.5z" />
      <path d="M14.6 5.6a4.6 4.6 0 0 1 3.4 3.4" opacity="0.5" />
      <path d="M15.4 2.6a7.8 7.8 0 0 1 5.6 5.6" opacity="0.5" />
    </svg>
  )
}

/** Map pin with chevron floor inside. */
export function IconMapPinCraft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21.2s-6.6-5.5-6.6-10.2a6.6 6.6 0 1 1 13.2 0c0 4.7-6.6 10.2-6.6 10.2z" />
      <path d="M9.2 11.4 12 9.4l2.8 2" opacity="0.7" />
    </svg>
  )
}

/** Chunky serif quotes (filled). */
export function IconQuote({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M9.8 6.6c-3 .7-4.9 2.8-4.9 6v4.8h5.4v-5.2H7.6c.1-1.9 1.2-3.1 3.1-3.7l-.9-1.9zm9 0c-3 .7-4.9 2.8-4.9 6v4.8h5.4v-5.2h-2.7c.1-1.9 1.2-3.1 3.1-3.7l-.9-1.9z" />
    </svg>
  )
}

/** Plump rating star (filled, rounded joins). */
export function IconStarRate({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 3.8l2.1 4.5 4.9.6-3.6 3.4 1 4.8L12 14.7l-4.4 2.4 1-4.8-3.6-3.4 4.9-.6L12 3.8z" />
    </svg>
  )
}

/** Small rotated-square diamond (filled): separators & bullets. */
export function IconDiamond({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 4.5 19.5 12 12 19.5 4.5 12z" />
    </svg>
  )
}

/** Brush-stroke check. */
export function IconCheckBrush({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={2.1}>
      <path d="M4.4 12.8c2 .9 3.6 2.4 4.6 4.3C11.4 12.2 15 8.3 19.6 5.8" />
    </svg>
  )
}

/** Diagonal ruler with ticks: precision / thickness. */
export function IconRulerCraft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.4 16.6 16.6 3.4l4 4L7.4 20.6l-4-4z" />
      <path d="M7.2 12.8l1.5 1.5M10.2 9.8l1.5 1.5M13.2 6.8l1.5 1.5" opacity="0.6" />
    </svg>
  )
}

/** Envelope with a soft fold: email. */
export function IconMail({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="1.8" />
      <path d="M4.6 7.6 12 13.2l7.4-5.6" />
      <path d="M4.6 16.6l4.8-4M19.4 16.6l-4.8-4" opacity="0.5" />
    </svg>
  )
}

/** Speech bubble with three dots: the quick contact toggle. */
export function IconChatBubble({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4.4c-4.6 0-8.2 2.9-8.2 6.5 0 1.8.9 3.4 2.3 4.6l-.9 3.6 3.9-1.9c.9.2 1.9.4 2.9.4 4.6 0 8.2-2.9 8.2-6.6s-3.6-6.6-8.2-6.6z" />
      <path d="M8.4 11h.02M12 11h.02M15.6 11h.02" strokeWidth="2.4" />
    </svg>
  )
}

/** Official WhatsApp glyph (filled): instantly recognisable, so kept as-is. */
export function IconWhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

/** Framed landscape: photo placeholder mark. */
export function IconPhoto({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.4" y="4.9" width="17.2" height="14.2" rx="1.8" />
      <circle cx="8.8" cy="9.4" r="1.5" opacity="0.6" />
      <path d="M6 16.8l4.4-4.4 3 3 2.4-2.4 2.2 2.2" />
    </svg>
  )
}

/** Stacked planks with offset joints: flooring material. */
export function IconPlanks({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7.7h16M4 12.2h16M4 16.7h16" />
      <path d="M10 7.7v4.5M14.5 12.2v4.5M7.5 3.2v4.5" opacity="0.5" />
      <path d="M4 3.2h16" opacity="0.5" />
    </svg>
  )
}
