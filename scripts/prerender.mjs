/**
 * Writes a real HTML file for every public page.
 *
 * The site is a single page app, which means a crawler or a slow phone has to
 * download and run the whole bundle before it sees a word. This step renders
 * each route at build time and writes it to disk, so the first paint is the
 * finished page and the app hydrates on top of it.
 *
 * Three outputs matter:
 *   dist/<route>/index.html  the prerendered pages, served by the filesystem
 *   dist/app.html            the empty shell, the rewrite target for anything
 *                            not prerendered (/admin, /l/<code>, 404s)
 *   dist/sitemap.xml         generated from the same list, so it can never
 *                            drift from what actually exists
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')

const entry = pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
const { render, PRERENDER_ROUTES, headTags, SITE_URL } = await import(entry)

const template = await readFile(join(dist, 'index.html'), 'utf8')

if (!template.includes('<!--seo-->') || !template.includes('<!--/seo-->')) {
  throw new Error('index.html lost its <!--seo--> markers; prerendering would emit wrong metadata')
}
if (!template.includes('<!--hints-->') || !template.includes('<!--/hints-->')) {
  throw new Error('index.html lost its <!--hints--> markers; pages would ship without resource hints')
}

/* ------------------------------ resource hints ----------------------------- */

/**
 * Vite writes one modulepreload for the entry and the shared vendor chunk, and
 * nothing for the page chunks, because at build time it cannot know which page
 * a given HTML file will show. Prerendering does know: it writes one file per
 * route. So each page gets a preload for its own code.
 *
 * Without it the browser has to download the entry bundle, parse it, run
 * main.tsx and only then discover the page's chunk, which is a whole round
 * trip that happens while the visitor is already looking at the page and
 * waiting for it to answer a tap.
 */
const manifest = JSON.parse(await readFile(join(dist, '.vite', 'manifest.json'), 'utf8'))

/** Source file of a page component, keyed the way `pageLoaders` keys them. */
const sourceFor = (page) => `src/pages/${page[0].toUpperCase()}${page.slice(1)}.tsx`

/** A chunk plus everything it statically imports, deepest last, deduplicated. */
function chunkWithImports(key, seen = new Set()) {
  const entry = manifest[key]
  if (!entry || seen.has(key)) return []
  seen.add(key)
  const files = [entry.file]
  for (const dep of entry.imports ?? []) files.push(...chunkWithImports(dep, seen))
  return files
}

const missingHints = []

/** The <link> hints that belong to this route and to no other. */
function headHints(route) {
  const links = []

  const source = sourceFor(route.page)
  const files = chunkWithImports(source)
  if (files.length === 0) missingHints.push(`${route.path} (${source})`)
  for (const file of files) {
    // Anything Vite already put in the template must not be asked for twice.
    if (template.includes(`/${file}`)) continue
    links.push(`<link rel="modulepreload" crossorigin href="/${file}">`)
  }

  // The home page opens on this photograph: it is the largest contentful
  // paint, so it is fetched alongside the document rather than after it. It
  // used to sit in the shared template, which meant every other page also
  // spent its first high-priority connection on an image it never shows.
  if (route.page === 'home') {
    links.push(
      '<link rel="preload" as="image" type="image/webp" href="/photos/hero-herringbone-sun-640.webp" imagesrcset="/photos/hero-herringbone-sun-320.webp 320w, /photos/hero-herringbone-sun-640.webp 640w, /photos/hero-herringbone-sun-960.webp 960w, /photos/hero-herringbone-sun-1100.webp 1100w" imagesizes="100vw" media="(max-width: 767px)" fetchpriority="high">',
      '<link rel="preload" as="image" type="image/webp" href="/photos/hero-herringbone-wide-1440.webp" imagesrcset="/photos/hero-herringbone-wide-320.webp 320w, /photos/hero-herringbone-wide-640.webp 640w, /photos/hero-herringbone-wide-960.webp 960w, /photos/hero-herringbone-wide-1440.webp 1440w" imagesizes="100vw" media="(min-width: 768px)" fetchpriority="high">',
    )
  }

  return links.join('\n    ')
}

const seoBlock = /<!--seo-->[\s\S]*?<!--\/seo-->/
const hintsBlock = /<!--hints-->[\s\S]*?<!--\/hints-->/

// The shell keeps the default head and an empty root: it is what a route that
// was never prerendered falls back to, and it must not hydrate someone else's
// markup. It preloads nothing, because it does not know which page it is
// about to become.
await writeFile(join(dist, 'app.html'), template.replace(hintsBlock, () => ''), 'utf8')

let count = 0
for (const route of PRERENDER_ROUTES) {
  const body = render(route.path)
  // Every replacement is a FUNCTION, never a string. String.replace treats
  // the replacement as a pattern, so a literal $$ collapses to $ (which is
  // how priceRange "$$" was shipping as "$" in the LocalBusiness block) and
  // a $& or $` anywhere in rendered content would splice the page into
  // itself. The body injection makes that a whole-page hazard, not a typo.
  const html = template
    // data-prerendered tells the first paint that this page arrived as
    // finished HTML. See motionPrimitives.tsx.
    .replace('<html lang="is">', () => `<html lang="${route.lang}" data-prerendered="1">`)
    .replace(seoBlock, () => headTags(route))
    .replace(hintsBlock, () => headHints(route))
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)

  const file = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html, 'utf8')
  count++
}

/* --------------------------------- sitemap -------------------------------- */

// One origin for the whole build, read from the same constant the pages
// themselves use, so a domain change is one line in src/i18n/config.ts and
// can never leave the sitemap pointing somewhere else than the canonicals.
const SITE = SITE_URL
const today = new Date().toISOString().slice(0, 10)
const HREFLANG = { is: 'is', en: 'en', pl: 'pl' }

/** Home first, then the rest: priority follows depth, not alphabetical order. */
const priority = (path) => {
  if (path === '/' || path === '/en' || path === '/pl') return '1.0'
  if (path.split('/').filter(Boolean).length > 2) return '0.6'
  return '0.8'
}

const abs = (path) => `${SITE}${path === '/' ? '/' : path}`

const urls = PRERENDER_ROUTES.map((route) => {
  const alternates = Object.entries(route.alternates)
    .map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[lang]}" href="${abs(href)}"/>`,
    )
    .join('\n')
  return [
    '  <url>',
    `    <loc>${abs(route.path)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <priority>${priority(route.path)}</priority>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(route.alternates.is ?? '/')}"/>`,
    '  </url>',
  ].join('\n')
}).join('\n')

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  'utf8',
)

if (missingHints.length > 0) {
  console.warn(
    `prerender: no chunk found in the manifest for ${missingHints.length} route(s), ` +
      `so they ship without a modulepreload: ${missingHints.slice(0, 5).join(', ')}`,
  )
}

/* --------------------------------- robots --------------------------------- */

// Generated rather than kept in public/, for the same reason as the sitemap:
// it carries the origin, and a hand-edited copy is one rename away from
// advertising a sitemap that does not exist.
await writeFile(
  join(dist, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /l/',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n'),
  'utf8',
)

console.log(`prerender: ${count} pages written, sitemap and robots regenerated ✓`)
