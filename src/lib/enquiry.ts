import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '@/data/site'
import { useLang } from '@/i18n/context'
import { currentRef } from '@/lib/analytics'
import { db, emitChange } from '@/lib/db'
import { newId } from '@/lib/ids'

export type EnquiryStatus = 'idle' | 'sending' | 'success' | 'mailto' | 'error'

/**
 * Nobody reads a page, types a name, a phone number and a message in under
 * this. A submission that fast came from a script, and it is dropped the same
 * way the honeypot drops one: silently, so the script learns nothing.
 */
const MIN_FILL_MS = 2500

/** Field ceilings, so a flood attempt cannot post a novel into the inbox. */
const LIMITS: Record<string, number> = {
  name: 120,
  contact: 160,
  service: 80,
  message: 4000,
}

/** Shared hairline underline field style used by every enquiry form. */
export const enquiryFieldClass =
  'w-full border-0 border-b border-espresso/25 bg-transparent px-0 py-2.5 text-base text-espresso outline-none transition-colors placeholder:text-taupe/60 focus:border-espresso focus-visible:ring-0 focus-visible:ring-offset-0'

/** Labels used when composing the mailto fallback body. */
export type EnquiryLabels = {
  subjectPrefix: string
  name: string
  contact: string
  service: string
}

/**
 * Shared submission logic for every enquiry form on the site (contact page,
 * per-product quick request, page closer). Posts to Formspree when an endpoint
 * is configured; otherwise falls back to opening the visitor's email client
 * with a prefilled message. Returns true when the caller may reset the form.
 */
export function useEnquiry() {
  const [status, setStatus] = useState<EnquiryStatus>('idle')
  const { lang } = useLang()
  const location = useLocation()
  const openedAt = useRef(Date.now())

  /**
   * Every submission is also written to the admin inbox, whichever way it
   * leaves the site. Formspree and a mail client both drop the message into an
   * inbox nobody audits; this is the copy the client can actually work from,
   * and it carries the campaign the visitor arrived through.
   */
  async function record(
    fields: { name: string; contact: string; service: string; message: string },
    delivery: 'formspree' | 'mailto',
  ) {
    try {
      await db.saveEnquiry({
        id: newId(),
        ts: Date.now(),
        ...fields,
        ref: currentRef(location.search),
        path: location.pathname,
        lang,
        delivery,
        status: 'new',
        note: '',
      })
      emitChange('enquiries')
    } catch {
      // The visitor's message still goes out by mail. A failed local copy must
      // never turn into a failed submission in front of them.
    }
  }

  async function submit(data: FormData, labels: EnquiryLabels): Promise<boolean> {
    // Honeypot: silently drop bot submissions that filled the hidden field.
    // Same treatment for anything submitted faster than a person can type.
    if (data.get('_gotcha') || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('success')
      return true
    }

    const read = (key: string) => String(data.get(key) ?? '').slice(0, LIMITS[key] ?? 500)
    const name = read('name')
    const contact = read('contact')
    const service = read('service')
    const message = read('message')
    const fields = { name, contact, service, message }

    if (!site.formspreeEndpoint) {
      // Fallback: open the visitor's email client with a prefilled message.
      // We cannot confirm the mail client actually opened or sent anything,
      // so callers show distinct "please double check" copy instead of a
      // false confirmed success message.
      const subject = encodeURIComponent(`${labels.subjectPrefix} ${name}`)
      const body = encodeURIComponent(
        `${labels.name}: ${name}\n` +
          `${labels.contact}: ${contact}\n` +
          (service ? `${labels.service}: ${service}\n` : '') +
          `\n${message}`,
      )
      await record(fields, 'mailto')
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return false
    }

    setStatus('sending')
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        await record(fields, 'formspree')
        setStatus('success')
        return true
      }
      setStatus('error')
      return false
    } catch {
      setStatus('error')
      return false
    }
  }

  return { status, submit, reset: () => setStatus('idle') }
}
