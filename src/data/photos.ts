import type { ServiceKey } from './site'

/**
 * Every photograph on the site is Expert Parket's own work.
 *
 * It was not always so. Until 8 September 2026 the home page ran on licensed
 * stock while the client's own photographs sat unused in photos-library, and
 * the home strip captioned those stock frames "Gardabaer 2024 Eik" under the
 * heading "Recent work". Two things were wrong with that at once: it claimed
 * someone else's rooms as this company's jobs, and the licence behind most of
 * those files could no longer be established. Thirteen of the seventeen stock
 * files matched none of the Unsplash ids recovered from the July backup, and
 * nothing in the repository recorded where they came from.
 *
 * So the home page now runs on the WhatsApp batches of 22.08 like every other
 * page: real rooms, EXIF and GPS stripped, re-encoded. What a caption claims
 * is what the picture shows.
 *
 * The catalogue is the one place with no photograph at all. Its swatches are
 * drawn (see ParquetSwatch): the board photographs they used to be composed
 * from belong to Real Dutch Floor, and no licence for publishing them has been
 * confirmed. They go back the day it is.
 */
export const photos = {
  /* ---------------- Home ---------------- */
  /** Home hero, portrait file for phones. */
  hero: '/photos/real-hero.jpg',
  /** The wide frame used from md up. */
  heroWide: '/photos/real-hero-wide.jpg',
  /** Home projects panorama, order matches portfolioStrip.captions. */
  pano: [
    '/photos/real-pano-1.jpg',
    '/photos/real-pano-2.jpg',
    '/photos/real-pano-3.jpg',
    '/photos/real-pano-4.jpg',
    '/photos/real-pano-5.jpg',
  ],
  /** Home service cards, the same craft shots the Services page carries. */
  services: {
    parket: '/photos/real-service-parket.jpg',
    slipun: '/photos/real-service-slipun.jpg',
    malun: '/photos/real-service-malun.jpg',
  } satisfies Record<ServiceKey, string>,
  /**
   * Foreground subject cutouts for the trades gallery, where the giant letters
   * slip BEHIND the object. Empty since the home page moved to the real
   * photographs: the two cutouts that existed were lifted from the stock
   * frames that are gone, and a cutout only works when it is lifted from the
   * exact frame behind it. A missing key simply renders no depth layer, so
   * the gallery runs flat until the lifts are redone from the real shots.
   */
  servicesFg: {} satisfies Partial<Record<ServiceKey, string>>,
  /** Home before/after slider. */
  before: '/photos/real-before.jpg',
  after: '/photos/real-after.jpg',
  /** Home full-bleed break band. */
  homeBreak: '/photos/real-home-break.jpg',

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

}
