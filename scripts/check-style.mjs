#!/usr/bin/env node
/**
 * PLANKI style guard — fails the build when a banned pattern sneaks back in.
 * Run automatically by `npm run build`; run manually with `node scripts/check-style.mjs`.
 *
 * Bans (per DESIGN-BRIEF.md):
 *  - em-dash (—) and en-dash (–) anywhere in source or content
 *  - shadow-* Tailwind classes (except shadow-none)
 *  - the old eyebrow pattern
 *  - imports of deleted template-era components
 *  - hotlinked Unsplash imagery
 *
 * (The old zero-radius rule was dropped 2026-08-05: the client asked for
 * softly rounded shapes on cards, slots and buttons.)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const TARGETS = ['src', 'index.html']
const EXT = new Set(['.ts', '.tsx', '.css', '.html'])

const RULES = [
  { name: 'em-dash (banned everywhere)', re: /—/g },
  { name: 'en-dash (banned everywhere, use "til"/"to"/"do")', re: /–/g },
  { name: 'shadow-* class (zero shadows sitewide)', re: /\bshadow-(?!none\b)[\w[\](),._/-]+/g },
  { name: 'eyebrow pattern (deleted)', re: /\beyebrow\b/g },
  {
    name: 'import of deleted component',
    re: /from '(?:\.{1,2}|@)\/?.*(?:SectionHeading|PageHero|CtaSection|Marquee|FloatingContact|Stat|Reveal)'/g,
  },
  { name: 'Unsplash hotlink (photos are PhotoSlot placeholders)', re: /images\.unsplash\.com/g },
]

/** Files exempt from specific rules (the guard itself, this list). */
const EXEMPT = new Set(['scripts/check-style.mjs'])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) yield* walk(full)
    else yield full
  }
}

let failures = 0
for (const target of TARGETS) {
  const full = join(ROOT, target)
  const files = statSync(full).isDirectory() ? [...walk(full)] : [full]
  for (const file of files) {
    const rel = relative(ROOT, file)
    if (EXEMPT.has(rel)) continue
    if (!EXT.has(file.slice(file.lastIndexOf('.')))) continue
    const text = readFileSync(file, 'utf8')
    const lines = text.split('\n')
    for (const rule of RULES) {
      lines.forEach((line, i) => {
        const m = line.match(rule.re)
        if (m) {
          failures++
          console.error(`✗ ${rel}:${i + 1}  [${rule.name}]  ${line.trim().slice(0, 110)}`)
        }
      })
    }
  }
}

if (failures > 0) {
  console.error(`\ncheck-style: ${failures} violation(s). See DESIGN-BRIEF.md.`)
  process.exit(1)
} else {
  console.log('check-style: clean ✓')
}
