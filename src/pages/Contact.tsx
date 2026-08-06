import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { contact as contactByLang, contactSeo as contactSeoByLang } from '@/data/contact'
import { useContent, useLang, useUi } from '@/i18n/context'
import { useEnquiry, enquiryFieldClass } from '@/lib/enquiry'
import { Seo } from '@/components/Seo'
import { SectionIndex } from '@/components/SectionIndex'
import { PhotoSlot } from '@/components/PhotoSlot'
import { Button } from '@/components/Button'
import { Closer } from '@/components/Closer'
import { LineReveal, Wipe, DrawRule, FadeIn } from '@/components/motionPrimitives'

const inputClass = enquiryFieldClass

/** Same hairline field, minus the native select chrome (no arrow box). */
const selectClass = `${inputClass} cursor-pointer appearance-none pr-8 invalid:text-taupe/60`

export default function Contact() {
  const c = useContent(contactByLang)
  const seo = useContent(contactSeoByLang)
  const t = useUi()
  const { path } = useLang()
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
    <>
      <Seo title={seo.title} description={seo.description} />

      {/* Article opener: huge title, one concrete lead sentence, quick contact strip */}
      <section className="container-x pb-14 pt-14 sm:pt-24">
        <LineReveal
          as="h1"
          lines={c.titleLines}
          className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.02em] text-espresso"
        />
        <div className="grid grid-cols-12 gap-x-4 pt-8 md:gap-x-6">
          <FadeIn delay={0.25} className="col-span-12 md:col-span-8 lg:col-span-6 lg:col-start-2">
            <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{c.lead}</p>
          </FadeIn>
        </div>

        {/* Quick contact strip: the three things a visitor needs before scrolling */}
        <div className="mt-12 lg:mt-16">
          <DrawRule />
          <dl className="grid grid-cols-1 sm:grid-cols-3">
            <div className="py-5 sm:pr-6">
              <dt className="cap-label">{t.contact.labelPhone}</dt>
              <dd className="m-0 pt-1.5">
                <a
                  href={`tel:${site.phoneRaw}`}
                  aria-label={`${t.common.callPrefix} ${site.phone}`}
                  className="tnum font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-none text-espresso transition-colors hover:text-gold-deep"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="border-t border-espresso/10 py-5 sm:border-l sm:border-t-0 sm:px-6">
              <dt className="cap-label">{t.contact.labelEmail}</dt>
              <dd className="m-0 pt-1.5">
                <a
                  href={`mailto:${site.email}`}
                  className="break-all font-display text-base font-semibold text-espresso transition-colors hover:text-gold-deep lg:text-lg"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-espresso/10 py-5 sm:border-l sm:border-t-0 sm:px-6">
              <dt className="cap-label">{t.footer.hoursTitle}</dt>
              <dd className="tnum m-0 pt-1.5 font-display text-base font-semibold text-espresso lg:text-lg">
                {t.topbar.hours}
              </dd>
            </div>
          </dl>
          <DrawRule delay={0.15} />
        </div>
      </section>

      {/* Form on plinth: cream panel overlapping a full width espresso strip */}
      <section className="pt-4">
        <div className="container-x">
          <SectionIndex n="01" label={c.indexLabel} />
        </div>
        <div className="relative mt-12">
          <div className="absolute inset-x-0 bottom-0 top-[35%] bg-espresso" aria-hidden />
          <div className="container-x relative pb-20 sm:pb-28">
            <div className="grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-6">
              {/* The order form panel */}
              <div className="col-span-12 lg:col-span-6 lg:col-start-2">
                <Wipe>
                  <div className="rounded-xl border border-espresso/15 bg-cream p-6 sm:p-10">
                    {/* Always-mounted live region so the outcome is announced */}
                    <p role="status" aria-live="polite" className="sr-only">
                      {status === 'success' ? f.successTitle : status === 'mailto' ? f.mailtoTitle : ''}
                    </p>
                    {status === 'success' || status === 'mailto' ? (
                      <div className="flex min-h-[420px] flex-col justify-center">
                        <h2
                          ref={doneRef}
                          tabIndex={-1}
                          className="font-display text-[clamp(1.6rem,2.5vw,2.1rem)] font-semibold leading-[1.1] text-espresso outline-none"
                        >
                          {status === 'mailto' ? f.mailtoTitle : f.successTitle}
                        </h2>
                        <p className="mt-4 max-w-[48ch] leading-relaxed text-ink/80">
                          {status === 'mailto' ? f.mailtoText : f.successText}
                        </p>
                        <div className="mt-8">
                          <Button variant="outline" onClick={reset}>
                            {t.contact.sendAnother}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-display text-[clamp(1.6rem,2.5vw,2.1rem)] font-semibold leading-[1.1] text-espresso">
                          {f.panelTitle}
                        </h2>
                        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
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
                              className={inputClass}
                            />
                          </label>
                          <label className="block">
                            <span className="cap-label block">{f.contactLabel}</span>
                            <input
                              name="contact"
                              type="text"
                              required
                              maxLength={160}
                              placeholder={f.contactPlaceholder}
                              className={inputClass}
                            />
                          </label>
                          <label className="block">
                            <span className="cap-label block">{f.serviceLabel}</span>
                            <span className="relative block">
                              <select name="service" required defaultValue="" className={selectClass}>
                                <option value="" disabled>
                                  {t.contact.selectService}
                                </option>
                                {f.serviceOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span
                                aria-hidden
                                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-espresso/50"
                              >
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
                                  <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                              </span>
                            </span>
                          </label>
                          <label className="block">
                            <span className="cap-label block">{f.messageLabel}</span>
                            <textarea
                              name="message"
                              required
                              rows={5}
                              maxLength={3000}
                              placeholder={f.messagePlaceholder}
                              className={`${inputClass} resize-none`}
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
                          <p className="text-xs leading-relaxed text-taupe">
                            {f.privacyNote}{' '}
                            <Link
                              to={path('privacy')}
                              className="underline underline-offset-2 transition-colors hover:text-gold-deep"
                            >
                              {t.footer.privacyLabel}
                            </Link>
                          </p>
                        </form>
                      </>
                    )}
                  </div>
                </Wipe>
              </div>

              {/* Contact ledger: dark column that grows out of the plinth strip */}
              <div className="col-span-12 bg-espresso py-8 text-cream lg:col-span-4 lg:col-start-9 lg:self-end">
                <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight text-cream">
                  {c.info.title}
                </h2>

                <p className="cap-label-dark pt-7">{t.contact.labelPhone}</p>
                <a
                  href={`tel:${site.phoneRaw}`}
                  aria-label={`${t.common.callPrefix} ${site.phone}`}
                  className="tnum mt-2 inline-block font-display text-[clamp(2.5rem,4.6vw,3.5rem)] font-bold leading-none text-cream transition-colors hover:text-gold-bright"
                >
                  {site.phone}
                </a>

                <dl className="m-0 mt-9">
                  <div className="border-t border-cream/15 py-4">
                    <dt className="cap-label-dark">{t.contact.labelEmail}</dt>
                    <dd className="m-0 pt-1">
                      <a
                        href={`mailto:${site.email}`}
                        className="break-all text-base text-cream transition-colors hover:text-gold-bright"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-cream/15 py-4">
                    <dt className="cap-label-dark">{t.footer.hoursTitle}</dt>
                    <dd className="tnum m-0 space-y-1 pt-1 text-base text-cream/90">
                      {c.info.hours.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="border-t border-cream/15 py-4">
                    <dt className="cap-label-dark">{t.contact.labelArea}</dt>
                    <dd className="m-0 pt-1 text-base leading-relaxed text-cream/90">{c.info.areaValue}</dd>
                  </div>
                  <div className="border-t border-cream/15 py-4">
                    <dt className="cap-label-dark">{c.info.facebookLabel}</dt>
                    <dd className="m-0 pt-1">
                      <a
                        href={site.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright"
                      >
                        {c.info.facebookValue}
                      </a>
                    </dd>
                  </div>
                  <div className="border-b border-t border-cream/15 py-4">
                    <dt className="cap-label-dark">{c.info.responseLabel}</dt>
                    <dd className="m-0 max-w-[40ch] pt-1 text-[15px] leading-relaxed text-cream/70">
                      {c.info.responseNote}
                    </dd>
                  </div>
                </dl>

                {/* Mounted print: cream mat holds the dark slot off the espresso ground */}
                <Wipe delay={0.1} className="mt-10">
                  <div className="rounded-xl border border-cream/20 bg-cream p-3.5">
                    <PhotoSlot aspect="4/3" tone="espresso" caption={c.info.photoCaption} />
                  </div>
                </Wipe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Closer n="02" withForm={false} />
    </>
  )
}
