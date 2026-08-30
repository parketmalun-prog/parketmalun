# PLANKI — Design Brief (Redesign 2026-07)

The binding contract for the full restyle. Every page and component MUST follow this.
Direction: **print-masthead Scandinavian editorial**. The site reads like a confident
printed catalog from a craftsman firm, not a web template.

## Non-negotiable rules

1. **NO em-dashes (—) and NO en-dashes (–) anywhere** — not in copy, not in aria-labels,
   not in SEO titles, not in code-visible strings. Ranges use words: is `til`, en `to`,
   pl `do` (e.g. "2 til 4 dagar", "08:00 til 18:00"). Separators use middle dot `·` or comma.
2. **NO eyebrow labels** (the small uppercase kicker above headings) and NO decorative
   dash/line ornaments around headings. `SectionIndex` renders NOTHING but the optional
   right-aligned link: the gold index numbers and small-caps labels went 2026-08-26,
   and the hairline rule itself followed 2026-08-29 ("no such lines on our website").
   Sections open with their heading alone. Do not reintroduce numbers, labels or rules.
3. **Zero border-radius sitewide.** Never write any `rounded-*` class (not even rounded-sm).
   Everything is sharp rectangles.
4. **Zero box shadows.** Never write any `shadow-*` class. Depth comes from color blocking
   (espresso bands on cream), hairline rules, and overlap.
5. **Photos are self-hosted placeholders.** (Rule relaxed 2026-08-22 at the client's
   request.) Every image slot is still `<PhotoSlot />`, but slots now carry licensed
   stock placeholders from `/public/photos` (Unsplash/Pexels licenses, mapped in
   `src/data/photos.ts`) until Expert Parket's own photography arrives; swap file by
   file, keep the names. Never HOTLINK stock CDNs; the guard bans images.unsplash.com.
5b-0a. **Each hero word makes its own entrance** (client, 2026-08-26): the first
   slides in from the left, the second surfaces in place out of a blur, the
   third arrives from the right. Keyframes hero-from-left / hero-surface /
   hero-from-right in index.css; stilled under reduced motion.

5b-0b. **A cream interlude introduces the gallery** (client, 2026-08-26,
   reference elicyon.com's OUR PROJECTS plate): the services title staggered
   over two light uppercase lines, services.lead, the view-all link. It exists
   so the hero photograph and the first gallery photograph never touch.

5b-0. **The hero carries the three words and NOTHING else** (client, 2026-08-26).
   Parket. top left, Slípun. dead centre, Málun. bottom right in italic gold, set
   on the diagonal at calc(var(--masthead)*1.1). The lead, the CTA button, the
   phone and the photo credit all left the hero: the masthead row already holds
   the number and the quote button. The home services heading band is gone too;
   the pinned gallery IS the section heading.

5b. **The home page opens on a photograph, under one cream masthead.**
   (Added 2026-08-22, revised 2026-08-26.) The hero is the picture, a scrim
   weighted to the foot, the three-word masthead in cream with a cognac block
   on the third word, the lead, the call to action and the phone, plus the
   print credit for the picture. It fills the screen that is left below the
   bar: `min-h-[calc(100svh-64px)]`, `md:min-h-[calc(100svh-72px)]`.

   The bar itself is the SAME cream row on every page, home included. It used
   to ride transparently over the picture and take its cream ground on scroll,
   which forced the logo into a cream plaque to survive the photograph; the
   client rejected that on 2026-08-26. There is no transparent masthead state
   and no logo plaque in the navbar any more. Do not reintroduce either.

5b-i. **The logo ships in the client's own colours.** One file, `/logo.webp`,
   512x295 with a real alpha channel. Never flatten it onto a ground and never
   repaint it to a single tone: a cream monotone cut of it lived in the navbar
   until 2026-08-26 and was rejected. On espresso (the footer) the artwork goes
   on a cream plaque via `<Logo tone="dark" />`, never recoloured.

5c. **Display type is sized per language.** `--masthead` in index.css carries
   one clamp per `:root[lang]`. Polish holds the longest word on the site
   (Cyklinowanie.) and would otherwise force the line to grow and reflow the
   page whenever the language changed. Never hardcode a font size on the
   home h1; use `text-[length:var(--masthead)]`.

5d. **Scrolling is Lenis, on fine pointers only.** `src/lib/smoothScroll.ts`
   dynamic-imports it after the gate passes, so a phone never downloads it
   and keeps native compositor scrolling. Nothing may reintroduce
   `scroll-behavior: smooth`, and route changes must go through
   `scrollToTopImmediate()` rather than `window.scrollTo`.

5d-i. **Section 01 is the pinned trades gallery** (added 2026-08-26, reference
   elicyon.com; mechanics in `src/components/TradesShowcase.tsx`). One
   full-viewport photograph per trade pinned under the masthead; the trade
   name's letters start scattered over the picture, gather into one justified
   line at the top, hold, then the next photograph rises from the foot as a
   curtain (two nested translates, no clip-path). Letters move on the Y axis
   ONLY, each from its own deterministic depth: x-jitter read as chaos and was
   removed 2026-08-26. Runway is 1.25 frame heights per slide (was 1.7; too
   much scrolling). Offsets are DETERMINISTIC so prerender and hydration
   agree; never use Math.random there. No slide corner label: the letters are
   the heading. Each letter makes ONE continuous staggered journey from
   below the frame to its slot, starting the moment the curtain starts, so
   an incoming word arrives as a loose flock, never a frozen block
   (2026-08-29). The assembled word lifts away under the next curtain. Each
   slide lays a Vision-lifted foreground cutout (photos.servicesFg) OVER the
   letters. Occluders must be COMPACT objects with clean edges, a letter
   entering at one edge and leaving at the other. Only the sanding discs
   qualify (holes OPEN, a letter behind a disc peeks through them). The
   craftsman's arms and boot, the machine, the roller (it beheaded the T
   of PAINTING) all chopped letters mid glyph: parket and malun run with
   NO cutout. When in doubt, leave a slide out. Slide captions carry the name and Lesa meira
   only, no copy line. BeforeAfter is a borderless rounded-3xl card, and the
   footer wordmark renders WHOLE, never baseline-cropped (2026-08-29). Reduced motion collapses it to a plain stack via the
   `.trades-` rules in index.css.

5e. **Ground rhythm.** No more than two flat light sections may run back to
   back on a long page: break the run with espresso, with the cognac band,
   or with a full-bleed photograph. Home currently runs photo, espresso,
   cream, cognac, cream, espresso, cream, photo, cream, cream, espresso.

6. **Palette lives in tailwind.config, nowhere else.** Retuned again 2026-08-22 toward the
   Aveon direction the client picked: greige linen ground cream #E9E1D3, sand #D3C6B0,
   warm near-black espresso #272019, walnut #5C4A31, cognac accent gold #B07A48,
   plus paper #FFFDFA for admin surfaces and positive/danger for admin state. The cream is
   a shade less yellow and the gold a shade warmer, so accents read as deliberate instead
   of blending into sand. Gold stays rationed: index numbers, one hover state, the Málun
   block, small accents. Espresso does the heavy lifting.
7. **Copy formulas are banned** (they read AI-generated): "from X to Y" merisms,
   "not just X but Y", "stands the test of time", abstract triads ("quality, experience and
   reliability"), rhetorical-question headlines, "100%" stats, "breathe new life".
   Rewrite in the concrete voice of the FAQ answers: machines, materials, days, m², suburbs.
8. **All three languages (is/en/pl) stay** and get identical structural treatment.

## Typography

Changed 2026-08-18. The client's verdict on the serif was that it read elegant in a way
that had nothing to do with laying and sanding floors. The display face is now a wide
industrial grotesque; the layout grammar below is unchanged.

- Display: `font-display` → **Archivo Variable** (`wdth.css` + `wdth-italic.css`, imported
  in main.tsx). Base CSS sets `font-variation-settings: 'wdth' 112` and
  `letter-spacing: -0.015em` on h1 to h4: slightly expanded and tight is what makes a
  grotesque read as solid signage rather than as a default sans. Weight 700-800.
  H1 scale: `text-[clamp(3.25rem,10vw,9rem)] leading-[0.92] tracking-[-0.02em]`.
  Section H2: `text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02]`.
- Body/UI: `font-sans` → **Space Grotesk Variable**. Body 16-17px/1.65. Unchanged.
- Labels/captions: `.cap-label` utility (12px, uppercase, tracking 0.14em, font-medium).
  Numbers always `tabular-nums` (`.tnum`).
- **No italic display accents.** They were a serif device; in a grotesque a slant reads as
  an accident. Accent words carry weight and `gold-bright` instead. Body italic via `<em>`
  in blog text is still fine.
- The footer wordmark is `7vw` at most: Archivo at wdth 112 is far wider than the serif it
  replaced, and the line has to stay inside the viewport at every width.

## Layout grammar

- Container: `.container-x` (max-w 1280). Grid: `grid grid-cols-12 gap-x-4 md:gap-x-6`.
- Body text starts at col 2 on desktop (`lg:col-start-2`), spans ≤ 6 cols. Headlines may
  span cols 1-11. PhotoSlots bleed to ONE viewport edge per section (`.bleed-right` /
  `.bleed-left` utilities), alternating sides section by section.
- Section rhythm is deliberately varied: dense strips (py-0 data rows) against airy
  statements (py-24 up to py-40). Full-bleed espresso bands every 2-3 screens
  (`.band-dark` = bg-espresso text-cream).
- Every section opens with `<SectionIndex n="01" label="…" />`: a full-width hairline rule
  with the gold number + small-caps label sitting on it, optional right-aligned link.
- Hairlines: `.rule` (espresso/15 on cream) and `.rule-dark` (cream/15 on espresso).

## Components (already built — USE THESE, never re-invent)

- `SectionIndex` — section opener (rule + "01 · Label" + optional right slot).
- `PhotoSlot` — the ONLY way to place imagery. Props: `aspect`, `tone`
  ('espresso'|'walnut'|'sand'|'cream'), `caption?` (print caption below, e.g.
  "Garðabær · 2024 · Eik"), `label?` (corner mark, defaults to "Mynd"), `src?`/`alt?`
  (swaps in the real photo later with zero layout change).
  Renders a SOLID tonal block with a soft light gradient, so a page reads as a finished
  composition rather than an empty grid. **Always pass an explicit `tone`**, and never
  repeat a tone on two adjacent slots: espresso is the bold anchor (one or two per page),
  walnut is the mid brown, sand and cream carry the rest.
- `LineReveal` — heading entrance (words rise from overflow-hidden lines). H1/H2 only.
- `Wipe` — block/image entrance (clip-path inset wipe). For PhotoSlots and espresso bars.
- `DrawRule` — hairline draws scaleX 0→1. Used inside SectionIndex automatically.
- `Button` — square. Variants: `primary` (espresso block, gold hover wipe), `outline`
  (1px espresso border), `light`/`ghost` for dark bands. NO pill, NO shimmer.
- `TextLink` — underlined text link, 2px espresso underline growing to gold on hover.
- `Navbar` — REWRITTEN 2026-08-31 to the reference's three-part cut (elicyon.com):
  MENU left, the logo mark alone centred, CONTACT right, identical at every
  width. There is no inline desktop nav and no hamburger. The links live in a
  full-width espresso CURTAIN that slides down from the top edge (the same
  move as the client's bpe-cleaning site), carrying the seven pages, the
  language switcher, the phone and the quote button. Header z-50, curtain
  z-40 so it unrolls from behind the bar, dimmed scrim z-30 that closes on
  click; Escape closes; a route change closes; `lockScroll` freezes Lenis
  while it is open. Old text below is superseded: numbered links (01 Þjónusta…), full-screen
  espresso mobile overlay. Done.
- `Footer` — espresso, editorial link rows, giant `EXPERT PARKET` wordmark at 12vw. Done.
- `MobileCallBar` — slim fixed bottom call strip, mobile only, appears after 480px scroll. Done.
- `GrainOverlay` — one fixed feTurbulence overlay, already mounted in Layout. Do not add
  more texture layers.
- KEPT from old site: `PlankEdge` (the parquet-board divider — use it exactly once per page
  max, e.g. above the footer or under the hero), `ParquetSwatch` (catalog swatches — pass
  `sharp` prop styling via wrapper, no rounding), `BeforeAfter` (reworked: flat tone
  surfaces when no photos, tape chips, square gold handle), `Seo`, `ScrollToTop`, `icons.tsx`
  (use ONLY inline at 16-20px next to text; never inside circular badges).
- DELETED (never import): `SectionHeading`, `PageHero`, `CtaSection`, `Marquee`,
  `FloatingContact`, `Stat`, `Reveal`.

## Motion rules

Exactly three gestures: LineReveal (headings), Wipe (blocks/slots), DrawRule (rules).
Body copy renders static — print does not fade in. No hover-lift anywhere; hover grammar:
links grow/recolor underline, buttons color-wipe, PhotoSlot border darkens, rows recolor
bg to sand. All primitives already handle prefers-reduced-motion + a 500ms failsafe.

## Page recipes (summary — each page agent gets details in its prompt)

Every page: NO PageHero. Pages open like an article: masthead rule (the Navbar provides it),
huge Fraunces title (LineReveal), one concrete lead sentence, then content. Every page ends
with the shared `Closer` section (in `components/Closer.tsx`): espresso full-bleed,
"Segðu okkur frá gólfinu þínu." + phone huge + one Button, flowing directly into Footer.

## Copy sweep

Each page agent rewrites its own `src/data/<page>.ts`: remove every dash, every eyebrow
field usage, every banned formula, in ALL THREE languages. Keep the concrete facts.
SEO titles switch to `|` separators. The fabricated testimonials are DELETED (section
dropped until the client supplies real reviews). The "100% vönduð vinnubrögð" stat is deleted.
Photo captions follow the house style: `Place · Year · Wood` with middle dots.

## Grafts from the client's Envato references (re-interpreted, never copied)

These patterns were extracted from the two templates the client liked. Execute them in
PLANKI language (sharp, hairline, Fraunces, no photos):

- **Dateline strip**: one hairline-bounded caps text line above the masthead nav:
  `Reykjavík · Mán til Fös 08:00 til 18:00 · Sími 785 7079`. Text only, no icons. (Navbar has it.)
- **Spine annotation**: on the Home hero's left edge, a vertical rotated tiny-caps line
  (`SÍMI · 785 7079`), espresso/50, like a book spine. Desktop only.
- **Outlined numerals**: service rows / step numbers may use large Fraunces numerals with
  transparent fill + 1px gold stroke (`.num-outline` utility in index.css). This is the ONE
  permitted outline-text use; never outline whole words.
- **Folio fraction**: sequenced content (process steps) may carry a print folio mark
  `01 / 04` in tabular Fraunces with a hairline between the numbers.
- **Passe-partout project frames** (Portfolio): PhotoSlot inside a 1px espresso/20 frame with
  ~14px cream mat padding; the title plate sits on a hairline row UNDER the frame.
- **Seam panels** (Services on Home): espresso/sand panels separated by literal 1px hairline
  seams in a full-width band; content = numeral + name + one concrete line + TextLink.
- **Interlude band**: one mid-page full-bleed espresso band with a single 7-9vw Fraunces
  line (one gold italic word), ~60vh, hairline top and bottom. Type only, no photo.
- **Material strip** (Catalog): plank-proportioned (1:3) vertical PhotoSlots in a hairline-
  separated row, like physical samples laid on a bench.
- **Experience stamp**: `Stamp` component: static circular SVG, Fraunces caps text
  "25+ ÁR Í FAGINU · EXPERT PARKET ·" around the numeral, 1px gold ring, transparent fill.
  Use at most once per page (hero or About).
- **Form on plinth** (Contact): cream form panel with hairline border overlapping a
  full-width espresso strip by ~50%; inputs are bottom-hairline only; the form asks only
  name, phone/email, message (conversational title, not "Contact form").

## Guard

`npm run build` runs `scripts/check-style.mjs` first: it greps src/ + index.html and FAILS
on: `—`, `–`, `rounded-`, `shadow-` (except shadow-none), `eyebrow`, imports of deleted
components, `images.unsplash.com`. Keep it green.

8. **One phone number on screen at a time** (client, 2026-08-26). The number
   lives in the masthead and in the footer's CALL NOW block. The Closer band
   does not print it, and the QuickContact launcher is icon-only: a small gold
   circle that appears five seconds after arrival with a 4% scale pulse
   (`.qc-pulse`), fanning out WhatsApp / call / email on tap. The footer ends
   in the EXPERT PARKET signage line at 10.5vw whose letters rise left to
   right when scrolled into view. No ticking clock in the masthead.

9. **Photograph bands, not flat espresso holes** (client, 2026-08-29). The
   interlude statement sits on the herringbone picture under espresso/70; the
   area block merged into the break photograph (short title + towns, centred,
   espresso/60); the Closer sits on the contact photograph under espresso/85
   with the statement centred against the form. BeforeAfter's text column is
   title, one search-friendly lead naming the service and the region, then
   three fact pairs. The FAQ opens with its heading alone. The QuickContact
   receiver icon shivers (.qc-ring) beside the scale pulse.

10. **Footer is the beige plate** (client's sketch, 2026-08-29): bg-sand,
   logo plaque left, ONE vertical hairline, the three link columns beside
   it; email lives under the Facebook link. No tagline, no area line, no
   CALL NOW phone block, no horizontal rules; the signage line prints
   espresso + deep gold on the sand. Every enquiry form carries the GDPR
   consent note (contact form.consentPrefix/consentLink) linking the
   privacy policy; keep it on any new form.

11. **Inner pages, the 2026-08-29 sweep.** Catalog is a shop shelf: identical
   cards (swatch, name, tone, price, one button), bottoms aligned, no spec
   ledger, no description, no hairlines anywhere on the page. Blog is a
   magazine grid with covers (a post without one borrows a stable stock
   panorama via hashCode(slug)) and pages of six with a round-number pager.
   About: opener and story aligned to one grid (no offsets, no stamp), plain
   gold sans numerals instead of display or outlined figures, the WHY band
   sits on the portfolio-break photograph under espresso/85, the work plate
   is straight and full-container. Contact: the title is ONE centred line,
   details live in a cream panel that twins the form (no dark boxed ledger,
   no mounted photo), and the plinth is a photograph under espresso/80. The
   footer logo sits STRAIGHT on the sand, no plaque. Openers everywhere:
   heading then lead, no column offsets.
