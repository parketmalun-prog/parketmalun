import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * A small Markdown subset for blog bodies: headings, paragraphs, lists,
 * quotes, images, rules, and inline bold / italic / code / links.
 *
 * It renders React elements rather than HTML strings, so a pasted post can
 * never inject markup into the page. Anything the parser does not recognise
 * stays visible as plain text instead of disappearing.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(INLINE).filter((p) => p !== '')
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-espresso">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="bg-sand-light px-1.5 py-0.5 text-[0.92em] text-espresso-700">
          {part.slice(1, -1)}
        </code>
      )
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) {
      const [, label, href] = link
      if (href.startsWith('/')) {
        return (
          <Link key={key} to={href} className="u-link">
            {label}
          </Link>
        )
      }
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="u-link">
          {label}
        </a>
      )
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}

type Block =
  | { type: 'h2' | 'h3' | 'quote' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'img'; src: string; alt: string }
  | { type: 'hr' }

function parse(body: string): Block[] {
  const blocks: Block[] = []
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  let paragraph: string[] = []

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flush()
      continue
    }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flush()
      blocks.push({ type: 'hr' })
      continue
    }
    const image = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(trimmed)
    if (image) {
      flush()
      blocks.push({ type: 'img', alt: image[1], src: image[2] })
      continue
    }
    if (trimmed.startsWith('### ')) {
      flush()
      blocks.push({ type: 'h3', text: trimmed.slice(4) })
      continue
    }
    if (trimmed.startsWith('## ')) {
      flush()
      blocks.push({ type: 'h2', text: trimmed.slice(3) })
      continue
    }
    if (trimmed.startsWith('# ')) {
      flush()
      blocks.push({ type: 'h2', text: trimmed.slice(2) })
      continue
    }
    if (trimmed.startsWith('> ')) {
      flush()
      blocks.push({ type: 'quote', text: trimmed.slice(2) })
      continue
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flush()
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      i--
      blocks.push({ type: 'ul', items })
      continue
    }
    if (/^\d+[.)]\s+/.test(trimmed)) {
      flush()
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''))
        i++
      }
      i--
      blocks.push({ type: 'ol', items })
      continue
    }
    paragraph.push(trimmed)
  }
  flush()
  return blocks
}

export function Markdown({ body }: { body: string }) {
  const blocks = parse(body)
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const key = `b${i}`
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={key} className="pt-4 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight">
                {inline(block.text, key)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={key} className="pt-2 font-display text-xl font-bold leading-snug">
                {inline(block.text, key)}
              </h3>
            )
          case 'quote':
            return (
              <blockquote key={key} className="border-l-2 border-gold pl-5 font-display text-xl font-medium text-walnut">
                {inline(block.text, key)}
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={key} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-gold" />
                    <span>{inline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={key} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="tnum mt-[0.1em] shrink-0 text-sm font-semibold text-gold-deep">
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    <span>{inline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ol>
            )
          case 'img':
            return (
              <figure key={key} className="my-8 overflow-hidden rounded-lg border border-line">
                <img src={block.src} alt={block.alt} loading="lazy" className="w-full" />
                {block.alt ? <figcaption className="cap-label px-4 py-3">{block.alt}</figcaption> : null}
              </figure>
            )
          case 'hr':
            return <hr key={key} className="rule" />
          default:
            return (
              <p key={key} className="text-[17px] leading-[1.7] text-ink/90">
                {inline(block.text, key)}
              </p>
            )
        }
      })}
    </div>
  )
}

/** Rough reading time in minutes, used in the blog byline. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Markdown stripped down to a single line, for excerpts and meta tags. */
export function plainText(body: string, max = 200): string {
  const text = body
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*`>]/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}
