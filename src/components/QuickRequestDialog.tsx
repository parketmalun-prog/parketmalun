import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { contact as contactByLang } from '@/data/contact'
import { lockScroll } from '@/lib/smoothScroll'
import { useContent, useUi } from '@/i18n/context'
import { useEnquiry, enquiryFieldClass } from '@/lib/enquiry'
import { Button } from './Button'

type Props = {
  /** Product the visitor wants a quote for; null renders nothing. */
  product: string | null
  onClose: () => void
}

/**
 * Quick per-product enquiry: a small modal opened straight from a catalog
 * card so the visitor can request a quote without leaving the page. Reuses
 * the contact form's copy and the shared enquiry submission. Keyboard
 * complete: Tab cycles inside the panel, Escape closes, focus returns to
 * the button that opened it.
 */
export function QuickRequestDialog({ product, onClose }: Props) {
  const c = useContent(contactByLang)
  const t = useUi()
  const { status, submit, reset } = useEnquiry()
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  /** True while the current pointer press started on the backdrop (not the panel). */
  const downOnBackdrop = useRef(false)
  const f = c.form

  const open = product !== null

  // Fresh state per opening; focus the first field; lock page scroll;
  // return focus to the invoking button on close. Reset also runs on close
  // so a reopen never flashes the previous success panel.
  useEffect(() => {
    if (!open) {
      reset()
      return
    }
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    nameRef.current?.focus()
    // Body overflow alone does not hold under Lenis: html is the scrollport
    // and Lenis writes it every frame, so the page would scroll behind this.
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Minimal focus trap: keep Tab cycling inside the panel.
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLInputElement>('button, input, textarea, a[href]'),
      ).filter((el) => el.tabIndex !== -1 && !el.disabled && el.type !== 'hidden')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      const inside = panelRef.current.contains(active)
      if (e.shiftKey) {
        if (active === first || !inside) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !inside) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      document.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  // Move focus onto the confirmation heading so screen readers announce it
  // and keyboard focus does not drop to <body> when the form unmounts.
  useEffect(() => {
    if (status === 'success' || status === 'mailto') doneRef.current?.focus()
  }, [status])

  if (!open) return null

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const ok = await submit(new FormData(formEl), {
      subjectPrefix: t.contact.mailtoSubjectPrefix,
      name: t.contact.mailtoName,
      contact: f.contactLabel,
      service: t.contact.mailtoProduct,
    })
    if (ok) formEl.reset()
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-espresso/60 p-4"
      onPointerDown={(e) => {
        downOnBackdrop.current = panelRef.current !== null && !panelRef.current.contains(e.target as Node)
      }}
      onClick={(e) => {
        // Close only when the press started AND ended on the backdrop, so a
        // scrollbar grab or a scroll gesture never wipes a half-filled form.
        if (downOnBackdrop.current && panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
        downOnBackdrop.current = false
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-request-title"
    >
      <div ref={panelRef} className="relative my-auto w-full max-w-md rounded-xl border border-espresso/15 bg-cream p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.quick.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-sand-light"
        >
          <X className="h-[18px] w-[18px]" />
        </button>

        {/* Always-mounted live region: announces the outcome even though the
            form and confirmation swap in and out of the tree. */}
        <p role="status" aria-live="polite" className="sr-only">
          {status === 'success' ? f.successTitle : status === 'mailto' ? f.mailtoTitle : ''}
        </p>

        {status === 'success' || status === 'mailto' ? (
          <div>
            <h2
              id="quick-request-title"
              ref={doneRef}
              tabIndex={-1}
              className="pr-10 font-display text-2xl font-semibold leading-tight text-espresso outline-none"
            >
              {status === 'mailto' ? f.mailtoTitle : f.successTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">{status === 'mailto' ? f.mailtoText : f.successText}</p>
            <div className="mt-7">
              <Button variant="outline" onClick={onClose}>
                {t.quick.close}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <span className="cap-label block">{product}</span>
            <h2 id="quick-request-title" className="mt-1 pr-10 font-display text-2xl font-semibold leading-tight text-espresso">
              {t.common.getQuoteForPrefix} {product}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Honeypot field: invisible to humans, catches spam bots */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <input type="hidden" name="service" value={product ?? ''} />
              <label className="block">
                <span className="cap-label block">{f.nameLabel}</span>
                <input
                  ref={nameRef}
                  name="name"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="name"
                  placeholder={f.namePlaceholder}
                  className={enquiryFieldClass}
                />
              </label>
              <label className="block">
                <span className="cap-label block">{f.contactLabel}</span>
                <input name="contact" type="text" required maxLength={160} placeholder={f.contactPlaceholder} className={enquiryFieldClass} />
              </label>
              <label className="block">
                <span className="cap-label block">{f.messageLabel}</span>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={3000}
                  placeholder={f.messagePlaceholder}
                  className={`${enquiryFieldClass} resize-none`}
                />
              </label>

              {status === 'error' && (
                <p role="alert" className="rounded-md border border-espresso/25 bg-sand px-4 py-3 text-sm font-medium text-espresso">
                  {f.errorText}
                </p>
              )}

              <button type="submit" disabled={status === 'sending'} className="btn btn-lg btn-primary w-full">
                {status === 'sending' ? f.sendingLabel : f.submitLabel}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
