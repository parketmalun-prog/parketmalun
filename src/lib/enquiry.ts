import { useState } from 'react'
import { site } from '@/data/site'

export type EnquiryStatus = 'idle' | 'sending' | 'success' | 'mailto' | 'error'

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

  async function submit(data: FormData, labels: EnquiryLabels): Promise<boolean> {
    // Honeypot: silently drop bot submissions that filled the hidden field.
    if (data.get('_gotcha')) {
      setStatus('success')
      return true
    }

    const name = String(data.get('name') ?? '')
    const contact = String(data.get('contact') ?? '')
    const service = String(data.get('service') ?? '')
    const message = String(data.get('message') ?? '')

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
