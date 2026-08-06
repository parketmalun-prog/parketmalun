import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { site } from '@/data/site'
import { contact as contactByLang } from '@/data/contact'
import { useContent, useUi } from '@/i18n/context'
import { useEnquiry, enquiryFieldClass } from '@/lib/enquiry'
import { Button } from './Button'
import { SectionIndex } from './SectionIndex'
import { LineReveal } from './motionPrimitives'

/**
 * Shared page closer: full-bleed espresso band that flows straight into the
 * Footer. One Fraunces statement on the left; on the right the phone plus a
 * compact enquiry form, so every single page ends with a way to send us the
 * job without hunting for the contact page. The contact page itself passes
 * `withForm={false}` since its own full form sits right above.
 */
export function Closer({ n = '05', withForm = true }: { n?: string; withForm?: boolean }) {
  const t = useUi()
  const c = useContent(contactByLang)
  const { status, submit, reset } = useEnquiry()
  const doneRef = useRef<HTMLHeadingElement>(null)
  const f = c.form

  // Put keyboard focus on the confirmation heading when the form unmounts.
  useEffect(() => {
    if (status === 'success' || status === 'mailto') doneRef.current?.focus()
  }, [status])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const ok = await submit(new FormData(formEl), {
      subjectPrefix: t.contact.mailtoSubjectPrefix,
      name: t.contact.mailtoName,
      contact: f.contactLabel,
      service: t.contact.mailtoService,
    })
    if (ok) formEl.reset()
  }

  return (
    <section className="bg-espresso text-cream">
      <div className="container-x pb-20 pt-16 sm:pb-24 sm:pt-20">
        <SectionIndex n={n} label={t.closer.label} dark />
        <div className="grid grid-cols-12 gap-x-4 gap-y-10 pt-10 md:gap-x-6">
          <div className="col-span-12 lg:col-span-6">
            <LineReveal
              as="h2"
              lines={[t.closer.line1, t.closer.line2]}
              className="font-display text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.02em] text-cream"
            />
            <a
              href={`tel:${site.phoneRaw}`}
              className="tnum mt-8 inline-block font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-gold-bright transition-colors hover:text-cream"
              aria-label={`${t.common.callPrefix} ${site.phone}`}
            >
              {site.phone}
            </a>
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-cream/70">{t.closer.support}</p>
          </div>

          {/* Compact enquiry form: cream panel on the espresso band */}
          {withForm && (
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="rounded-xl border border-espresso/15 bg-cream p-6 sm:p-8">
              {/* Always-mounted live region so the outcome is announced */}
              <p role="status" aria-live="polite" className="sr-only">
                {status === 'success' ? f.successTitle : status === 'mailto' ? f.mailtoTitle : ''}
              </p>
              {status === 'success' || status === 'mailto' ? (
                <div>
                  <h3
                    ref={doneRef}
                    tabIndex={-1}
                    className="font-display text-xl font-semibold leading-tight text-espresso outline-none"
                  >
                    {status === 'mailto' ? f.mailtoTitle : f.successTitle}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
                    {status === 'mailto' ? f.mailtoText : f.successText}
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" onClick={reset}>
                      {t.contact.sendAnother}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold leading-tight text-espresso">{f.panelTitle}</h3>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                    {/* Honeypot field: invisible to humans, catches spam bots */}
                    <input
                      type="text"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />
                    <label className="block">
                      <span className="cap-label block">{f.nameLabel}</span>
                      <input
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

                    <button type="submit" disabled={status === 'sending'} className="btn btn-md btn-primary w-full">
                      {status === 'sending' ? f.sendingLabel : f.submitLabel}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}
