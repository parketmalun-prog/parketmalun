/**
 * Language-independent site facts (contact details, brand).
 * All translatable navigation labels live in `src/i18n/ui.ts`; page content
 * lives in the other `src/data/*` modules keyed by language.
 */
export const site = {
  name: 'Expert Parket og Mál',
  legalName: 'Expert Parket og Mál ehf.',
  short: 'Expert Parket',
  /**
   * Registration details, from fyrirtaekjaskra (skatturinn.is) and the ISNIC
   * registrant record, both read on 8 September 2026. Lög um rafræn viðskipti
   * nr. 30/2002, 6. gr., requires a service provider to keep its name,
   * address, kennitala, VSK number and public register easy to find on the
   * site, so these print in the footer of every page and on the legal pages.
   */
  kennitala: '500123-1250',
  vsk: '159068',
  street: 'Álfholti 10',
  postal: '220 Hafnarfjörður',
  /** The public register the company is entered in. */
  register: 'Fyrirtækjaskrá Skattsins',
  /** ÍSAT activity codes as registered, for the terms page. */
  isat: '43.33.0 og 43.99.0',
  phone: '785 7079',
  phoneRaw: '+3547857079',
  email: 'expertparket2024@gmail.com',
  /** wa.me deep link: international number without "+" or spaces. */
  whatsapp: 'https://wa.me/3547857079',
  facebook: 'https://www.facebook.com/share/14mSWnaktqV/?mibextid=wwXIfr',
  /**
   * Optional Formspree endpoint, kept only as a middle rung.
   *
   * Enquiries go through /api/kontakt now, which mails them from the company
   * domain. This is tried when that endpoint is unavailable, and if it is
   * empty too the form falls back to the visitor's own mail client. Leave it
   * empty unless there is a reason not to: a form id here means enquiries
   * leave through a third party on a free monthly quota.
   */
  formspreeEndpoint: '' as string,
}

/** Service keys shared across the site. */
export type ServiceKey = 'parket' | 'slipun' | 'malun'
