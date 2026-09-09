# Image credits and provenance

Every image the site ships, where it came from, and on what basis it is
published. Kept so the claim on the privacy page ("every photograph is of
our own work") can be checked file by file. Update it whenever a file in
`public/photos` changes.

Last audit: 8 September 2026. Revised 9 September 2026, when the client
asked for the stock photography back on the home page and the catalogue.

## Photographs in `public/photos` (shipped)

The site ships two kinds of photograph, and the split is deliberate.

### The company's own work (`real-*.jpg`)

Expert Parket og Mál ehf.'s own photographs of its own jobs, received from
the client as WhatsApp batches on 22 August 2026. EXIF and GPS were stripped
and the files re-encoded by `scripts/optimize-photos.py`. Rights: the
company's own.

| file | what it shows | used on |
|---|---|---|
| real-hero.jpg, real-hero-wide.jpg | laid oak floor | portfolio |
| real-pano-1 to real-pano-5.jpg | five finished floors | portfolio |
| real-before.jpg, real-after.jpg | the same floor before and after sanding | portfolio |
| real-home-break.jpg | finished room | portfolio |
| real-service-parket / slipun / malun.jpg | the craftsman at work, one per trade | services, portfolio |
| real-pf-1.jpg, real-pf-break.jpg | finished floor, primer at the window | portfolio |
| real-work-malun-2.jpg, real-work-malun-3.jpg | painting jobs | portfolio |
| real-about-owner.jpg, real-about-work.jpg | the owner, the owner at work | about |
| real-contact.jpg | finished room | contact |

Further real photographs that no page uses sit in `photos-library/`, same
origin and rights.

### Stock, restored 9 September 2026

The home page and the catalogue run on stock again. They had been swapped to
the client's own photographs during the legal pass of 8 September; the client
judged the result wrong for the page and asked for the stock set back
(9 September 2026). What went back is the pictures, not the claims: the
projects strip is captioned by what the frame shows (wood and pattern) and no
longer by a neighbourhood and a year, so no stock room is presented as a job
this company did.

| file | used on | licence |
|---|---|---|
| hero-herringbone-sun.jpg, hero-herringbone-wide.jpg | home hero | not established, see below |
| pano-1-gardabaer-eik.jpg | home projects strip | Unsplash 1581858726788-75bc0f6a952d |
| pano-2-vesturbaer-sildarbein.jpg | home projects strip | not established |
| pano-3-karsnes-askur.jpg | home projects strip | Unsplash 1631679706909-1844bbd07221 |
| pano-4-mosfellsbaer-eik.jpg | home projects strip | Unsplash 1618221195710-dd6b41faaea6 |
| pano-5-grafarvogur-hnota.jpg | home projects strip | Unsplash 1600494603989-9650cf6ddd3d |
| before-floor.jpg, after-floor.jpg | home slider | not established |
| break-room-wide.jpg | home break band | not established |
| service-parket / slipun / malun.jpg | home cards | not established |
| service-slipun-fg.webp, service-malun-fg.webp | home cards, subject cutouts | derived from the above |
| grain-eik / askur / fura / hnota.jpg | catalogue material bench | not established |
| nine parket-*.jpg | catalogue cards | Real Dutch Floor, permission pending |

The file names still carry Icelandic place names from the captions they used
to have. They are file names only; nothing on the page repeats them.

### Open licence questions

These are unresolved and worth resolving before the site is advertised
widely. They are the reason the 8 September pass removed these files.

Four of the seventeen stock files could be traced. The July 2026 backup still
hotlinked twelve Unsplash photo ids; downloading those and comparing them to
the local files by perceptual hash matched:

| removed file | Unsplash id |
|---|---|
| pano-1-gardabaer-eik.jpg | 1581858726788-75bc0f6a952d |
| pano-3-karsnes-askur.jpg | 1631679706909-1844bbd07221 |
| pano-4-mosfellsbaer-eik.jpg | 1618221195710-dd6b41faaea6 |
| pano-5-grafarvogur-hnota.jpg | 1600494603989-9650cf6ddd3d |

Those four are fine to use: Unsplash Licence, commercial use permitted, no
attribution required.

The other thirteen (hero-herringbone-sun, hero-herringbone-wide,
before-floor, after-floor, break-room-wide, pano-2-vesturbaer-sildarbein,
service-parket, service-slipun, service-malun, grain-eik, grain-askur,
grain-fura, grain-hnota) matched none of the twelve ids, carry no metadata,
and appear in no backup or commit message. No licence has been established
for them. The likeliest source is the same Unsplash search the four traced
files came from, but likely is not a receipt. Two ways to close it: find the
original download, or re-shoot the slots with an Unsplash or Pexels file
whose id is recorded here on the day it is downloaded.

The nine `parket-*.jpg` catalogue swatches are composed by
`scripts/build-parquet-swatches.py` from Real Dutch Floor board photographs
fetched from realdutchfloor.com; the sources sit in
`photos-library/parket-source/`. These are the manufacturer's own boards,
shown to sell that manufacturer's product through the importer the client
buys from, which is the ordinary reason a fitter shows them. Written
confirmation from Planki Parket ehf. or Real Dutch Floor has still not been
asked for and answered. `src/components/ParquetSwatch.tsx` stays in the
repository as the drawn fallback if it is ever refused.

## Other assets

`public/logo.webp`, `public/logo-320.webp`, `public/favicon.svg` and
`public/og-card.jpg` are the company's own mark, supplied by the client.
Fonts are self-hosted subsets of Fraunces and Space Grotesk (SIL Open Font
Licence).
