# Expert Parket og Mál ehf — vefsíða

Fjöltyngd, marg-síðu vefsíða fyrir parket-, slípunar- og málningarþjónustu á höfuðborgarsvæðinu.
Öll framsetning er á **íslensku**. Byggt með Vite + React + TypeScript + Tailwind CSS.
Allar opinberar síður eru forbyggðar í statískt HTML við build.

> Website for an Icelandic parquet / floor-sanding / painting company. This README is bilingual for the developer.

---

## 🚀 Keyrsla (development)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # framleiðsluútgáfa í dist/
npm run preview  # forskoða build
```

## 🧭 Síður (pages / routes)

| Slóð | Síða | Innihald |
|------|------|----------|
| `/` | Heim | Hero, þjónusta, fyrir/eftir, af hverju okkur, ferli, umsagnir |
| `/thjonusta` | Þjónusta | Parketlögn, Parketslípun, Málun — ítarlegt |
| `/verkefni` | Verkefni | Verkefnasafn með síu eftir þjónustu |
| `/parket` | Vöruúrval | Parketgerðir + **verð á m²** |
| `/frettir` | Fréttir | Greinar úr stjórnborðinu, á öllum tungumálum |
| `/frettir/:slug` | Grein | Ein grein |
| `/um-okkur` | Um okkur | Saga, gildi, þjónustusvæði, algengar spurningar |
| `/hafdu-samband` | Hafðu samband | Fyrirspurnarform + samskiptaupplýsingar |
| `/l/:code` | Hlekkur | Telur smell og vísar áfram |
| `/admin` | Stjórnborð | Tölfræði, hlekkir, greinar |

## 🔐 Stjórnborð (admin)

Fyrirspurnir úr öllum formum vefsins, tölfræði um heimsóknir, hlekkir fyrir
auglýsingar og bloggið eru á `/admin` (lykilorð `expert2026`, því er breytt í
stillingum). Stjórnborðið er á íslensku, ensku eða rúmensku. Uppsetning,
Supabase-tenging og sjálfvirk þýðing: **[docs/ADMIN.md](docs/ADMIN.md)**.

## ✏️ Að breyta texta og verði

Allur texti og gögn eru í `src/data/` — engin þörf á að snerta útlitskóðann:

- `site.ts` — nafn, sími (785 7079), netfang, Facebook, valmynd.
- `home.ts`, `services.ts`, `about.ts`, `portfolio.ts`, `contact.ts` — texti hverrar síðu.
- `catalog.ts` — **parketgerðir og verð á m²**. Bættu við eða breyttu hlutum í `products`:

```ts
{
  name: 'Nafn parkets',
  category: 'gegnheilt', // gegnheilt | hardparket | vinyl | fiskibein
  woodTone: 'Ljóst eik',
  description: '…',
  pricePerM2: 13900,     // krónur á m²
  thickness: '15 mm',
  finish: 'Olíuborið',
  bestFor: '…',
  badge: 'Vinsælt',      // valfrjálst
  tone: '#C1904E',       // grunnlitur fyrir viðar-mynstrið
  pattern: 'plank',      // plank | herringbone
}
```

## 📧 Fyrirspurnarform (Formspree)

Formið sendir fyrirspurnir á **expertparket2024@gmail.com** í gegnum Formspree (ókeypis).

1. Stofnaðu form á [formspree.io](https://formspree.io) og láttu það senda á `expertparket2024@gmail.com`.
2. Afritaðu endapunktinn (t.d. `https://formspree.io/f/abcdwxyz`).
3. Límdu hann í `src/data/site.ts`:

```ts
formspreeEndpoint: 'https://formspree.io/f/abcdwxyz',
```

Ef reiturinn er tómur opnar formið einfaldlega tölvupóstforrit gestsins (mailto) sem varaleið.

## 🖼️ Myndir — MIKILVÆGT

Ljósmyndirnar á síðunni eru **tímabundnar staðgengilsmyndir** frá Unsplash (falleg gólf/rými), sóttar í gegnum `img()` hjálparfallið. **Skiptu þeim út fyrir raunverulegar myndir af verkum Expert Parket** þegar þær eru tilbúnar:

- Myndanúmer (Unsplash `photo-…` id) eru geymd sem `imageId` / `heroImageId` í gögnunum og í `src/data/site.ts` (`serviceImages`).
- Til að nota eigin myndir: settu þær í `public/myndir/…` og breyttu viðkomandi component til að nota `/myndir/nafn.jpg` í stað `img(id)`.
- Parket-mynstrin í vöruúrvalinu eru búin til með vektorgrafík (`ParquetSwatch`) — engin ljósmynd þarf.

Merkið (logo) er **opinbera merki fyrirtækisins** (`public/logo.webp`) — hvíti bakgrunnurinn var fjarlægður úr upprunalegu myndinni og símanúmerslínan skorin af (síminn er sér hnappur í haus). Á dökkum bakgrunni (footer) birtist merkið á kremlitri plötu svo dökki textinn sjáist. Ekkert var endurteiknað.

## 🎨 Litir, letur & sérteiknuð tákn

Skilgreint í `tailwind.config.js`:

- **Espresso / valhnota** (dökkir brúnir) — fyrirsagnir, dökkir kaflar, footer.
- **Gull / karamella** (`gold`) — hnappar, áherslur.
- **Krem / sandur** — bakgrunnur og mjúkir kaflar.
- Letur: **Archivo** (fyrirsagnir, breið iðnaðarleg grotesk) + **Space Grotesk** (meginmál og viðmót).
- **Sérteiknuð tákn** (`src/components/icons.tsx`): einstakt „craft“ táknasett teiknað fyrir þetta vörumerki — parket-chevron, slípivél, málningarrúlla, demantur o.fl. Ekki staðlað safn.
- Skreytingar: fiskibeina-mynstur (`.pattern-herringbone-*`), útlínu-vatnsmerki (`.text-ghost`), borði (Marquee), teljarar (Stat).

## ⚡ Hraði, SEO og öryggi

Allar opinberar síður eru forbyggðar (prerender) í raunverulegt HTML, svo fyrsta
skjámyndin birtist án þess að bíða eftir JavaScript. Nánar, ásamt öryggislögunum
og því sem eftir stendur fyrir eigandann: **[docs/PERFORMANCE-SEO-SECURITY.md](docs/PERFORMANCE-SEO-SECURITY.md)**.

Í stuttu máli:

- Öryggishausar í `vercel.json` (nosniff, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy, COOP/CORP, hert CSP).
- Honeypot, lágmarks útfyllingartími og hámarkslengdir á öllum formum.
- Hraðatakmörkun og upprunaathugun á `/api/translate`; bið eftir röng lykilorð í stjórnborði.
- `robots.txt`, sjálfgenerað þrítyngt `sitemap.xml` með hreflang, og JSON-LD á hverri síðu.

## ⚖️ Persónuvernd (GDPR)

- Persónuverndarstefna á þremur tungumálum: `/personuvernd`, `/en/privacy`, `/pl/polityka-prywatnosci` (efni í `src/data/privacy.ts`).
- Vefurinn notar **engar vafrakökur**. Heimsóknartalningin er okkar eigin, án vafrakaka og án IP talna, svo ekki þarf vafraköku-borða. Fyrirspurnir eru geymdar í stjórnborðinu og það kemur fram í persónuverndarstefnunni.
- **TODO fyrir eiganda:** bæta kennitölu (og skráðu heimilisfangi ef vill) fyrirtækisins í persónuverndarstefnuna/footer þegar hún er staðfest — æskilegt fyrir viðskiptavef á Íslandi.

## ☁️ Útgáfa (deploy) á Vercel

1. Ýttu verkefninu á GitHub.
2. „Import Project" á [vercel.com](https://vercel.com) — Vite greinist sjálfkrafa.
3. `vercel.json` beinir því sem ekki er forbyggt á `app.html`; forbyggðu síðurnar
   eru bornar fram beint af skráakerfinu.

### Lén (domain)

The site answers on **https://expertparket.is**, registered at ISNIC. The zone
is hosted by ISNIC itself, not by Vercel nameservers, because the company
mailboxes live on Microsoft 365 and their MX and SPF records sit on the same
zone. Two records point the site at Vercel, and nothing else in the zone may be
touched:

| Type | Name | Value |
|------|------|-------|
| A | @ | `216.198.79.1` |
| CNAME | www | `cname.vercel-dns.com.` |

`www` is attached in Vercel as a 308 redirect to the apex. `SITE_URL` in
`src/i18n/config.ts` is the only place the origin is written in the code.

### Umhverfisbreytur (environment variables)

None of these are required for the site to render. Each one switches on a
feature that degrades quietly when it is missing, which is what keeps a plain
`npm run dev` usable with an empty environment.

| Variable | Switches on | Missing means |
|----------|-------------|---------------|
| `RESEND_API_KEY` | enquiry mail from `/api/kontakt` | the endpoint answers 503 and the form opens the visitor's mail client instead |
| `CONTACT_TO` | inbox that receives enquiries | defaults to the address printed on the site |
| `CONTACT_FROM` | sender address | defaults to `vefur@send.expertparket.is` |
| `ANTHROPIC_API_KEY` | blog auto-translation | the editor reports "not connected" and translations are written by hand |
| `ADMIN_API_TOKEN` | guards `/api/translate` | translation refuses every call, deliberately |
| `VITE_ADMIN_API_TOKEN` | the browser half of that token | must hold the same value as `ADMIN_API_TOKEN` |
| `ALLOWED_ORIGIN` | one extra origin allowed to call the functions | only the deployment's own host may call them |
| `VITE_ADMIN_PASSWORD_HASH` | the admin login | `/admin` cannot be opened at all in a production build |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | shared storage | enquiries, posts and stats live only in the browser that typed them |

### Resend

Enquiries leave through Resend so the mail comes from the company's own domain
and carries the visitor's address as Reply-To.

1. Create an API key at [resend.com](https://resend.com) and add it to Vercel
   as `RESEND_API_KEY`, for Production and Preview.
2. Add the domain **`send.expertparket.is`** in Resend, not the apex. Resend
   asks for its own MX and TXT records, and putting them on a subdomain keeps
   them away from the Microsoft 365 records that carry the company mailboxes.
   Verifying the apex would overwrite those and break the company's email.
3. Copy the records Resend gives into the ISNIC zone for `expertparket.is`,
   using the host names Resend states (`send`, `resend._domainkey.send`, and so
   on). Leave every existing record alone.
4. Redeploy. A 502 from `/api/kontakt` with `resend rejected the enquiry` in the
   function log means the domain is not verified yet.

---

© 2026 Expert Parket og Mál ehf.
