/**
 * Language-independent site facts (contact details, brand).
 * All translatable navigation labels live in `src/i18n/ui.ts`; page content
 * lives in the other `src/data/*` modules keyed by language.
 */
export const site = {
  name: 'Expert Parket og Mál',
  legalName: 'Expert Parket og Mál ehf.',
  short: 'Expert Parket',
  phone: '785 7079',
  phoneRaw: '+3547857079',
  email: 'expertparket2024@gmail.com',
  /** wa.me deep link: international number without "+" or spaces. */
  whatsapp: 'https://wa.me/3547857079',
  facebook: 'https://www.facebook.com/share/14mSWnaktqV/?mibextid=wwXIfr',
  years: '25+',
  /**
   * Formspree endpoint for the contact form.
   * Create a free form at https://formspree.io (send to expertparket2024@gmail.com)
   * and paste the endpoint id here, e.g. 'https://formspree.io/f/abcdwxyz'.
   * Until it is set, the form falls back to opening the visitor's email client.
   */
  formspreeEndpoint: '' as string,
}

/** Service keys shared across the site. */
export type ServiceKey = 'parket' | 'slipun' | 'malun'
