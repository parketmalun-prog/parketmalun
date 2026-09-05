# Admin panel

Everything the client needs is behind `/admin`: the enquiry inbox, visit
statistics, campaign links and the blog. This file is the setup and handover
note.

## Opening it

| | |
|---|---|
| Local | http://localhost:5180/admin |
| Live | https://expertparket.is/admin |
| Address | `verk@expertparket.is`, or whatever `VITE_ADMIN_EMAIL` is set to |
| Password | set by `VITE_ADMIN_PASSWORD_HASH`, see below |

Sign-in asks for an address and a password, and what those are worth depends
on whether Supabase is connected.

Without Supabase the password is checked in this browser against a hash, and
the address is built into the bundle like every other `VITE_` value: a second
thing to type rather than a second secret.

With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set, the same two fields
become a real sign-in against Supabase Auth. The token that comes back is what
the data layer sends, and the policies in `supabase/schema.sql` decide what it
may touch. Two things must both be true for an address to get in: a user with
that address exists under Authentication in the Supabase dashboard, and the
address is listed in the `admin_emails` table. `VITE_ADMIN_PASSWORD_HASH` is
then unused in production.

This repository is PUBLIC, so no password is written down here or anywhere
else in the tree. Until `VITE_ADMIN_PASSWORD_HASH` is set in the hosting
environment the live panel has no working password at all and cannot be
opened; that is deliberate.

The panel is in Icelandic by default. The IS / EN / RO switch at the bottom of
the sidebar changes the panel language and is remembered per browser. It does
not touch the public site.

`/admin` is excluded in `robots.txt` and sets `noindex, nofollow` on itself, so
it stays out of search results.

## What runs where

| Piece | Today | After Supabase |
|---|---|---|
| Enquiries | This browser's storage | Every enquiry, on every device |
| Blog posts | This browser's storage | Shared, visible to every visitor |
| Statistics | Visits made in this browser | Every visit from every device |
| Campaign links | This browser's storage | Shared |
| Sign in | Password checked in the browser | Supabase Auth plus row level security |

**Read that table before the client starts writing.** Until Supabase is
connected, a post written on the laptop is not visible on the phone, and the
statistics only count the browser they were recorded in. The screens are the
same either way, so nothing has to be rebuilt: the switch is two environment
variables.

## 1. Connect Supabase (makes it real)

1. Create a project at supabase.com.
2. Open the SQL editor and run [`supabase/schema.sql`](../supabase/schema.sql).
3. In that file, uncomment the `insert into admin_emails` line and put the
   client's address in it. Only addresses in that table may write, so being
   signed in is not by itself enough.
4. In Vercel, add:
   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
5. Redeploy. The admin footer switches from "Vaframinni" to the project
   hostname, which is how you confirm it took.

Anything written before the switch stays in the old browser. Move it across with
Stillingar, Sækja afrit (export) before the switch and Lesa inn afrit (import)
after it.

## 2. Turn on automatic translation

The blog editor translates a post into the other two languages with one button.
The call runs server side in [`api/translate.ts`](../api/translate.ts), so the
API key never reaches the browser.

In Vercel, add:

```
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_API_TOKEN=<any long random string>      # optional
VITE_ADMIN_API_TOKEN=<the same string>        # optional, must match
```

Without the key the endpoint answers 503 and the editor says so, offering a
"copy the prompt" button instead. Nothing breaks, the translation just has to be
written by hand.

The two token variables are a speed bump: they stop a stranger who finds the URL
from spending the key. `VITE_` variables ship inside the JavaScript bundle, so
anyone determined can read the token. Real protection arrives with Supabase Auth.

For local development, put `ANTHROPIC_API_KEY` in a `.env` file at the project
root. The dev server serves `api/translate.ts` itself, so translation works on
`npm run dev` as well as on Vercel.

## 3. Change the password

1. Open Stillingar in the admin.
2. Type the new password under "Breyta lykilorði". The panel shows the value to
   copy.
3. Put it in Vercel as `VITE_ADMIN_PASSWORD_HASH=...` and redeploy.

Only the hash is stored, never the password itself. Be honest about what this
protects: the check runs in the browser, so it keeps the panel away from
visitors and search engines and nothing more. That matches the risk while the
data lives in the client's own browser. Once Supabase is connected, real sign in
takes over.

## The inbox

Every form on the site writes into Fyrirspurnir: the contact page, the quick
request dialog on a product, and the closer at the bottom of each page. The card
carries the message, a one-tap call or reply, the page it was sent from and,
when there was one, the campaign link the visitor arrived through. The sidebar
shows how many are still unanswered.

Three states: new, in progress, handled. Use the note field for what happened on
the phone; it saves when you click away.

Two things worth knowing:

- **The inbox is a copy, not the delivery.** The message still goes out by mail
  (Formspree, or the visitor's own mail client). If the copy ever fails to save,
  the submission still succeeds for the visitor.
- **A "sent from a mail client" enquiry may never have been sent.** Without a
  Formspree endpoint the form opens the visitor's mail app and there is no way
  to know whether they pressed send. Those cards carry a warning and are exactly
  the ones worth calling. Setting `formspreeEndpoint` in `src/data/site.ts`
  removes the guesswork.

This is the only place the site holds personal data. It is covered in the
privacy page, and in Supabase the table has no public read policy at all: the
anon key can write an enquiry and can never read one back.

## Campaign links

Hlekkir creates one short link per advert or post, for example
`https://expertparketogmal.is/l/fb-agust`. Opening it records the click,
forwards to the page you chose, and tags every page the visitor opens in that
tab, so you see both the clicks and how far people went.

Use one link per place you post. Sharing the same link on Facebook and in an
email makes the two indistinguishable afterwards.

## The blog

Write in one language, press "Þýða yfir á hin tungumálin", check the result,
publish. A post only appears in the languages that have both a title and a body,
so a half-translated post is never shown broken.

The body is Markdown: `##` for a subheading, `-` for bullets, `**bold**`,
`[text](url)`, `![alt](image url)` for an image. The Forskoðun tab renders it
exactly as the public page will.

Two articles ship with the site as worked examples. Delete them once the client
has posts of their own.

## The dashboard

Each tile compares the chosen period with the one before it, so "30 days" also
tells you whether it is better or worse than the previous 30. Enquiries and the
conversion rate sit next to the visit numbers, because visits without enquiries
are the thing worth noticing. Descarca CSV / Sækja CSV downloads the daily
series for a spreadsheet.

## What the statistics collect

Path, language, device class, referring site, campaign code, and a random
per-tab id that dies when the tab closes. No IP address, no cookies, no
cross-site identifier, nothing that identifies a person. That is why there is no
cookie banner.

Turn counting off for your own browser in Stillingar so your visits stay out of
the client's numbers.
