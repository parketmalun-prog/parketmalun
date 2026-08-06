import { cn } from '@/lib/utils'
import { LANGS, LANG_LABEL, LANG_NAME } from './config'
import { useLang, useUi } from './context'

type Props = {
  /** 'bar' = inline text row for the masthead; 'panel' = larger row for the mobile overlay. */
  variant?: 'bar' | 'panel'
  className?: string
}

/**
 * Print-dateline language switcher: the three language codes as plain text,
 * separated by middle dots. The active language is espresso and underlined;
 * the rest are taupe. No dropdown, no globe icon, no pills.
 */
export function LanguageSwitcher({ variant = 'bar', className }: Props) {
  const { lang, setLang } = useLang()
  const t = useUi()

  const isPanel = variant === 'panel'

  return (
    <div
      role="group"
      aria-label={t.a11y.switcher}
      className={cn('flex items-center', isPanel ? 'gap-5' : 'gap-2.5', className)}
    >
      {LANGS.map((l, i) => {
        const active = l === lang
        return (
          <span key={l} className="flex items-center gap-2.5">
            {i > 0 && !isPanel && (
              <span className="text-espresso/25" aria-hidden>
                ·
              </span>
            )}
            <button
              type="button"
              aria-pressed={active}
              aria-label={LANG_NAME[l]}
              onClick={() => {
                if (!active) setLang(l)
              }}
              className={cn(
                'font-medium uppercase tracking-[0.14em] transition-colors',
                isPanel ? 'text-base' : 'text-xs',
                isPanel
                  ? active
                    ? 'text-gold-bright underline decoration-2 underline-offset-4'
                    : 'text-cream/60 hover:text-cream'
                  : active
                    ? 'text-espresso underline decoration-gold decoration-2 underline-offset-4'
                    : 'text-taupe hover:text-espresso',
              )}
            >
              {LANG_LABEL[l]}
            </button>
          </span>
        )
      })}
    </div>
  )
}
