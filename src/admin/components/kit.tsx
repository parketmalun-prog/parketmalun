import { useEffect, useRef } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * The admin's building blocks. Everything is flat: hairlines and colour do the
 * work, nothing floats. Same rules as the public site, tuned for a tool that
 * has to stay readable on a phone at 375px and on a wide screen.
 */

/* --------------------------------- buttons -------------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const VARIANT = {
  primary: 'bg-espresso text-cream hover:bg-walnut',
  outline: 'border border-espresso/20 bg-paper text-espresso hover:border-espresso/45 hover:bg-sand-light',
  ghost: 'text-taupe hover:bg-sand-light hover:text-espresso',
  danger: 'border border-danger/35 bg-paper text-danger hover:bg-danger hover:text-white',
} as const

export function Button({ variant = 'outline', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-2 text-[13px]' : 'px-4 py-2.5 text-sm',
        VARIANT[variant],
        className,
      )}
    />
  )
}

/* ---------------------------------- cards --------------------------------- */

export function Card({
  title,
  hint,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode
  hint?: ReactNode
  right?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('rounded-xl border border-line bg-paper', className)}>
      {title ? (
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-espresso">{title}</h2>
            {hint ? <p className="pt-1 text-[13px] leading-snug text-taupe">{hint}</p> : null}
          </div>
          {right}
        </header>
      ) : null}
      <div className={cn('px-5 py-5', bodyClassName)}>{children}</div>
    </section>
  )
}

/* --------------------------------- fields --------------------------------- */

export function Field({
  label,
  hint,
  error,
  htmlFor,
  right,
  children,
}: {
  label: string
  hint?: string
  error?: string
  htmlFor?: string
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={htmlFor} className="cap-label text-espresso">
          {label}
        </label>
        {right}
      </div>
      {children}
      {error ? (
        <p className="text-[13px] font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[13px] leading-snug text-taupe">{hint}</p>
      ) : null}
    </div>
  )
}

const CONTROL =
  'w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-taupe/60 focus:border-gold focus:outline-none focus:ring-0'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(CONTROL, className)} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={cn(CONTROL, 'min-h-[120px] leading-relaxed', className)} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn(CONTROL, 'cursor-pointer appearance-none pr-9', className)}>
      {children}
    </select>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  id: string
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            'h-6 w-11 rounded-full border transition-colors',
            checked ? 'border-espresso bg-espresso' : 'border-line bg-sand-light',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'absolute left-1 h-4 w-4 rounded-full bg-cream transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </span>
      <span className="text-sm text-ink">{label}</span>
    </label>
  )
}

/* --------------------------------- badges --------------------------------- */

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'ok' | 'warn' | 'bad'; children: ReactNode }) {
  const TONE = {
    neutral: 'border-line bg-sand-light text-taupe',
    ok: 'border-positive/30 bg-positive/10 text-positive',
    warn: 'border-gold/40 bg-gold/10 text-gold-dark',
    bad: 'border-danger/30 bg-danger/10 text-danger',
  } as const
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
        TONE[tone],
      )}
    >
      {children}
    </span>
  )
}

/* --------------------------------- layout --------------------------------- */

export function PageHeader({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pb-7">
      <div>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-espresso">
          {title}
        </h1>
        {lead ? <p className="max-w-[62ch] pt-2 text-[15px] leading-relaxed text-taupe">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-line bg-sand-light/40 px-6 py-10">
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-taupe">{children}</p>
      {action}
    </div>
  )
}

/* --------------------------------- modal ---------------------------------- */

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-espresso-950/45 p-0 sm:items-center sm:p-6">
      <button type="button" aria-label="" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-paper outline-none sm:rounded-2xl',
          wide ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        )}
      >
        <header className="sticky top-0 flex items-center justify-between gap-4 border-b border-line bg-paper px-5 py-4">
          <h2 className="font-display text-lg font-bold text-espresso">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Loka">
            ✕
          </Button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-line bg-paper px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  )
}

/** A confirm dialog with the destructive action spelled out. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[15px] leading-relaxed text-ink">{message}</p>
    </Modal>
  )
}
