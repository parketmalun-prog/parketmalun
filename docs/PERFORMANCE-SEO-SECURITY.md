# Speed, search and safety

What was done on 18 August 2026, what it buys, and what is left for the owner.

## Speed on an old phone

The measure that matters is not the total download, it is how much JavaScript a
phone has to parse before it sees anything. That used to be everything.

| Change | Why |
|---|---|
| Every public page is prerendered to real HTML (`scripts/prerender.mjs`) | The first paint is the finished page. A phone reads the heading before the bundle has arrived, and a crawler sees the content without running the app. 30 files, three languages, blog articles included. |
| framer-motion removed | 70 kB of JavaScript to move four properties. The same three entrance gestures now run on CSS transitions with one shared IntersectionObserver (`src/components/motionPrimitives.tsx`). |
| Entrance animations skipped on the first screen | On a prerendered page the text renders visible. Hiding the hero until React runs would give back exactly what prerendering bought. Navigations inside the app animate as before. |
| The grain overlay stops below `md` | A fixed, full-viewport `mix-blend-mode` layer forces the browser to re-composite the whole screen on every scroll frame. At phone size the grain is invisible anyway. |
| Both critical fonts preloaded | They used to be discovered only after the stylesheet parsed, which is a visible second of fallback type on a slow connection. The build injects the hashed filenames (`preloadFonts` in `vite.config.ts`). |
| Unused italic font cut, priority hint on the masthead logo | Smaller first load, and the largest thing on screen fetches first. |

What the first page now costs, gzipped: **11 kB of HTML that renders on its
own**, then 20 kB app, 52 kB React, 10 kB CSS in the background.

## Search

- **Real HTML per page**, so nothing depends on Google choosing to run the app.
- Per-page `<title>`, description, canonical, `hreflang` for all three
  languages plus `x-default`, Open Graph with locale alternates. Generated from
  the same page data the site renders from, in `src/lib/seoRoutes.ts`.
- **Structured data**: LocalBusiness on the home and contact pages, Service for
  each of the three trades, BreadcrumbList on every inner page, FAQPage from the
  real questions on the About page, Article on each blog post.
- **The sitemap is generated at build time** from the list of pages that were
  actually written, so it cannot drift. Blog articles are in it.
- `robots.txt` keeps crawlers out of `/admin`, `/l/` and `/api/`, and the admin
  sends `X-Robots-Tag: noindex` as well.

## Safety

Layered, and each layer is honest about what it is.

| Layer | Against |
|---|---|
| Security headers in `vercel.json` (CSP, HSTS, nosniff, frame denial, COOP/CORP, permissions policy) | Injection, clickjacking, MIME sniffing, cross-origin leaks |
| Honeypot field plus a minimum fill time on every form | Scripted form spam. A submission faster than a person can type is dropped in silence, so the script learns nothing. |
| Field length caps in the browser **and** as `check` constraints in Postgres | A flood filling the inbox with megabytes |
| Same-origin check, shared token and per-address rate limit on `/api/translate` | A stranger who finds the endpoint spending the API key |
| Back-off after five wrong admin passwords, doubling to five minutes | Someone sitting at the login guessing |
| Row level security in `supabase/schema.sql`: writes gated by an `admin_emails` table, enquiries insert-only for the public and never readable | Anyone with the anon key, which ships in the bundle by design |

**The honest limits**, which are worth saying out loud:

- The admin password is checked in the browser. It keeps the panel away from
  visitors and search engines. It is not authentication, and it is only enough
  because the data currently lives in the client's own browser. Connect
  Supabase and real sign-in takes over.
- The API rate limit lives in the memory of one warm serverless instance. It
  stops a script, not a distributed attack.
- Visit and click rows can be forged by anyone who reads the bundle. The cost is
  a wrong number on a dashboard; nothing can be read back out.

## Left for the owner

1. Set `formspreeEndpoint` in `src/data/site.ts`. Until then the contact form
   opens the visitor's mail client and nobody can confirm they pressed send.
2. Connect Supabase (see [ADMIN.md](ADMIN.md)) so posts, enquiries and
   statistics are shared rather than per browser.
3. Add real photographs. Every image slot is a `PhotoSlot` placeholder, and
   photographs of finished floors are the single biggest thing still missing
   from the pages, for visitors and for search alike.
4. Add the company kennitala to the privacy page and footer.
