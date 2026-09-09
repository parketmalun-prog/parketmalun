import type { ServiceKey } from './site'

/**
 * Two kinds of photography, deliberately kept apart (client's call, 24.08):
 *
 * - The HOME page stays on licensed stock: it is the editorial face of the
 *   site and the stock set is calmer and more composed than phone shots
 *   from a live worksite.
 * - REAL project photography (WhatsApp batches from 22.08, labelled by
 *   trade, EXIF and GPS stripped, re-encoded) carries the pages that exist
 *   to PROVE the work: the portfolio grouped by service, the Services page
 *   craft shots, About and Contact.
 *
 * Catalog grain slivers stay stock for a different reason: they must show
 * the named species (hnota/eik/askur/fura) and the client's jobs are oak.
 */
export const photos = {
  /* ---------------- Home: stock, editorial ---------------- */
  /** Home hero, portrait file for phones. */
  hero: '/photos/hero-herringbone-sun.jpg',
  /** The same corner cropped landscape, used from md up. */
  heroWide: '/photos/hero-herringbone-wide.jpg',
  /** Home projects panorama, order matches portfolioStrip.captions. */
  pano: [
    '/photos/pano-1-gardabaer-eik.jpg',
    '/photos/pano-2-vesturbaer-sildarbein.jpg',
    '/photos/pano-3-karsnes-askur.jpg',
    '/photos/pano-4-mosfellsbaer-eik.jpg',
    '/photos/pano-5-grafarvogur-hnota.jpg',
  ],
  /** Home service cards. */
  services: {
    parket: '/photos/service-parket.jpg',
    slipun: '/photos/service-slipun.jpg',
    malun: '/photos/service-malun.jpg',
  } satisfies Record<ServiceKey, string>,
  /**
   * Foreground subject cutouts of the SAME frames (macOS Vision subject
   * lift, tools in the session scratchpad), alpha WebP at the derivative
   * aspect. The trades gallery layers them over the giant letters so the
   * type slips BEHIND the subject. ONLY compact objects with clean edges
   * qualify: a letter must enter at the object's edge and leave at its
   * edge, whole (client, 2026-08-29). The craftsman's arms and boot
   * chopped letters mid glyph, so parket runs with NO cutout. Malun keeps
   * the ROLLER ONLY (no hand, no forearm): the client asked for letters
   * passing behind the roller (2026-08-30). The discs keep their holes
   * OPEN so a letter behind a disc peeks through them the way it would in
   * the room. A missing key simply renders no depth layer.
   */
  servicesFg: {
    slipun: '/photos/service-slipun-fg.webp',
    malun: '/photos/service-malun-fg.webp',
  } satisfies Partial<Record<ServiceKey, string>>,
  /** Home before/after slider. */
  before: '/photos/before-floor.jpg',
  after: '/photos/after-floor.jpg',
  /** Home full-bleed break band. */
  homeBreak: '/photos/break-room-wide.jpg',

  /* ---------------- Real work: proof pages ---------------- */
  /** Services page: one craft shot per trade, branded shirts visible. */
  craft: {
    parket: '/photos/real-service-parket.jpg',
    slipun: '/photos/real-service-slipun.jpg',
    malun: '/photos/real-service-malun.jpg',
  } satisfies Record<ServiceKey, string>,
  /**
   * Portfolio pools, grouped by service. Index 0 and 1 sit under the two
   * project plates of that trade; index 2 is the wide closing plate.
   */
  work: {
    parket: [
      '/photos/real-hero.jpg',
      '/photos/real-pano-5.jpg',
      '/photos/real-pf-1.jpg',
    ],
    slipun: [
      '/photos/real-service-slipun.jpg',
      '/photos/real-after.jpg',
      '/photos/real-about-work.jpg',
    ],
    malun: [
      '/photos/real-service-malun.jpg',
      '/photos/real-work-malun-2.jpg',
      '/photos/real-work-malun-3.jpg',
    ],
  } satisfies Record<ServiceKey, string[]>,
  /** Full-bleed break inside the portfolio: primer rolled at the window. */
  portfolioBreak: '/photos/real-pf-break.jpg',
  aboutOwner: '/photos/real-about-owner.jpg',
  aboutWork: '/photos/real-about-work.jpg',
  contact: '/photos/real-contact.jpg',

  /** Catalog material strip, keyed by the SAMPLES wood names. Stock. */
  grain: {
    Hnota: '/photos/grain-hnota.jpg',
    Eik: '/photos/grain-eik.jpg',
    Askur: '/photos/grain-askur.jpg',
    Fura: '/photos/grain-fura.jpg',
  } as Record<string, string>,
}
