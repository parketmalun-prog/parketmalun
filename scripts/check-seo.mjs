import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { PRERENDER_ROUTES, SITE_URL } from '../dist-ssr/entry-server.js'

// Inspect the shipped HTML, including SSR content and links, after npm run build.
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const pages = new Map()
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(([tag]) => tag)
for (const route of PRERENDER_ROUTES) {
  const html = await readFile(join(dist, route.path, 'index.html'), 'utf8')
  pages.set(route.path, { route, html })
}
const titles = new Set()
for (const [path, { route, html }] of pages) {
  const label = `${path}: `
  assert.equal(tags(html, 'h1').length, 1, label + 'exactly one server-rendered H1')
  assert.equal(attr(tags(html, 'html')[0], 'lang'), route.lang, label + 'document language')
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  assert.ok(title && !titles.has(title), label + 'unique nonempty title')
  titles.add(title)
  assert.ok(tags(html, 'meta').some((tag) => attr(tag, 'name') === 'description' && attr(tag, 'content')?.length > 40), label + 'description')
  assert.ok(!tags(html, 'meta').some((tag) => attr(tag, 'name') === 'robots' && /noindex/.test(attr(tag, 'content'))), label + 'indexable')
  const links = tags(html, 'link')
  const canonicals = links.filter((tag) => attr(tag, 'rel') === 'canonical')
  assert.equal(canonicals.length, 1, label + 'single canonical')
  assert.equal(attr(canonicals[0], 'href'), SITE_URL + path, label + 'self canonical')
  for (const tag of links.filter((tag) => attr(tag, 'hreflang'))) {
    const href = attr(tag, 'href')
    const target = pages.get(new URL(href).pathname)
    assert.ok(target, label + 'alternate target exists: ' + href)
    if (attr(tag, 'hreflang') !== 'x-default') {
      assert.equal(target.route.lang, attr(tag, 'hreflang'), label + 'alternate language')
      assert.ok(tags(target.html, 'link').some((other) => attr(other, 'hreflang') === route.lang && attr(other, 'href') === SITE_URL + path), label + 'reciprocal alternate')
    }
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json))
  if (['installation', 'sanding', 'painting'].includes(route.page)) {
    const service = schemas.flatMap((schema) => schema['@graph'] ?? [schema]).find((schema) => schema['@type'] === 'Service')
    assert.equal(service?.url, SITE_URL + path, label + 'service structured data matches page')
  }
  for (const tag of tags(html, 'a')) {
    const href = attr(tag, 'href')
    if (!href?.startsWith('/') || href.startsWith('//')) continue
    const target = new URL(href, SITE_URL).pathname.replace(/\/$/, '') || '/'
    if (/\.[a-z0-9]+$/i.test(target) || target.startsWith('/l/')) continue
    assert.ok(pages.has(target), label + 'internal page exists: ' + href)
  }
}
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => value)
assert.equal(locations.length, pages.size, 'sitemap count matches rendered pages')
assert.equal(new Set(locations).size, locations.length, 'sitemap has no duplicates')
for (const path of pages.keys()) assert.ok(locations.includes(SITE_URL + path), `sitemap includes ${path}`)
console.log(`SEO checks passed: ${pages.size} pages, metadata, H1s, hreflang, JSON-LD, internal links and sitemap.`)
