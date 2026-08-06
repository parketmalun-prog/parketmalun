export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Icelandic króna formatting, e.g. 13900 -> "13.900 kr." (period as thousands separator). */
export function formatIsk(n: number): string {
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${grouped} kr.`
}

export function scrollToTop(): void {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}
