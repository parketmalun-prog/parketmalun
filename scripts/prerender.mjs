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
const { render, PRERENDER_ROUTES, headTags } = await import(entry)

const template = await readFile(join(dist, 'index.html'), 'utf8')

if (!template.includes('<!--seo-->') || !template.includes('<!--/seo-->')) {
  throw new Error('index.html lost its <!--seo--> markers; prerendering would emit wrong metadata')
}

// The shell keeps the default head and an empty root: it is what a route that
// was never prerendered falls back to, and it must not hydrate someone else's
// markup.
await writeFile(join(dist, 'app.html'), template, 'utf8')

const seoBlock = /<!--seo-->[\s\S]*?<!--\/seo-->/

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
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)

  const file = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html, 'utf8')
  count++
}

/* --------------------------------- sitemap -------------------------------- */

const SITE = 'https://expertparketogmal.is'
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

console.log(`prerender: ${count} pages written, sitemap regenerated ✓`)
