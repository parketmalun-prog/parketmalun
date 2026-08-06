# PLANKI — Design Brief (Redesign 2026-07)

The binding contract for the full restyle. Every page and component MUST follow this.
Direction: **print-masthead Scandinavian editorial**. The site reads like a confident
printed catalog from a craftsman firm, not a web template.

## Non-negotiable rules

1. **NO em-dashes (—) and NO en-dashes (–) anywhere** — not in copy, not in aria-labels,
   not in SEO titles, not in code-visible strings. Ranges use words: is `til`, en `to`,
   pl `do` (e.g. "2 til 4 dagar", "08:00 til 18:00"). Separators use middle dot `·` or comma.
2. **NO eyebrow labels** (the small uppercase kicker above headings) and NO decorative
   dash/line ornaments around headings. Sections open with `SectionIndex` (rule + number + title).
3. **Zero border-radius sitewide.** Never write any `rounded-*` class (not even rounded-sm).
   Everything is sharp rectangles.
4. **Zero box shadows.** Never write any `shadow-*` class. Depth comes from color blocking
   (espresso bands on cream), hairline rules, and overlap.
5. **NO photos.** Every image slot renders `<PhotoSlot />` (empty, professional, flat sand
   surface with a print caption). The client adds real photography later. Never hotlink
   Unsplash or any stock. The old `img()`/`imgSet()` helpers must have zero call sites.
6. **Palette is untouched**: cream #FAF5EC, sand #EFE3CD, espresso #2B1C10, walnut #5B3E24,
   gold #B4813A (tokens already in tailwind.config). Gold is rationed: index numbers, one
   hover state, the Málun block, small accents. Espresso does the heavy lifting.
7. **Copy formulas are banned** (they read AI-generated): "from X to Y" merisms,
   "not just X but Y", "stands the test of time", abstract triads ("quality, experience and
   reliability"), rhetorical-question headlines, "100%" stats, "breathe new life".
   Rewrite in the concrete voice of the FAQ answers: machines, materials, days, m², suburbs.
8. **All three languages (is/en/pl) stay** and get identical structural treatment.

## Typography

- Display: `font-display` → **Fraunces Variable** (imported in main.tsx). Headings get
  `font-optical-sizing: auto` via base CSS. Weight 600-700. Sentence case ALWAYS.
  H1 scale: `text-[clamp(3.25rem,10vw,9rem)] leading-[0.92] tracking-[-0.02em]`.
  Section H2: `text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02]`.
- Body/UI: `font-sans` → **Space Grotesk Variable**. Body 16-17px/1.65.
- Labels/captions: `.cap-label` utility (12px, uppercase, tracking 0.14em, font-medium).
  Numbers always `tabular-nums` (`.tnum`).
- One italic Fraunces word max per page, gold-deep, no underline swoosh.

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
- `Navbar` — cream masthead, hairline bottom, numbered links (01 Þjónusta…), full-screen
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
