# Floor sanding guide: editorial research and publication

Research date: 16 September 2026. Primary audience: homeowners in Reykjavík
and Iceland's capital area comparing sanding quotations before renovation.

## Topic selection

This is qualitative search research, not a keyword-volume report. Search
Console, Keyword Planner and paid volume datasets were not available. The
ordering below is an editorial priority based on local relevance and service
intent, not a claim about the most searched keywords in Iceland.

| Topic | Observed local evidence | Decision |
| --- | --- | --- |
| Sanding price, scope and disruption | Local providers discuss quotations, what is included, renewal and finishing; homeowner FAQs repeatedly address replacement versus sanding and cleanup. | Publish a practical quotation/planning guide. |
| Sanding versus replacement | Explicit question on Parketverksmiðjan's FAQ; site already has a short article about this decision. | Brief supporting section, distinct primary intent. |
| Wood floors and underfloor heating | Dedicated Icelandic installation guidance and manufacturer instructions. | Include a short, product-specific section; a future standalone guide is possible. |
| Laminate versus vinyl | Icelandic homeowner discussion surfaced in search. | Future topic; do not infer population-wide demand from a discussion. |

Local research sources:

- https://www.parketverksmidjan.is/spurningar-og-svor/
- https://parketslipunislands.is/
- https://www.parketutlit.is/
- https://www.parketverksmidjan.is/parketlogn/
- https://www.reddit.com/r/Iceland/comments/1favph8/ (topic signal only, not technical evidence)

Primary phrase: `parketslípun verð`. Related questions: `hvað kostar
parketslípun`, what a quote includes, suitability for sanding, duration,
furniture return, dust, water stains and colour changes. No competitor's
prices were reused as Expert Parket prices. No savings percentages, search
volumes, ranking guarantees or fabricated client cases are included.

## Technical research and link correction

The initial research consulted manufacturer material about flooring types,
drying, underfloor heating and cleaning. The original article linked to
Bona homeowner pages, a Kährs underfloor-heating guide and Osmo Wash and Care.

On 16 September 2026, the client reported that the Kährs link returned a
404 and that the Osmo destination looked like a product recommendation.
A fresh browser check confirmed that the old Kährs URL did not display the
promised guide. The Osmo page is a specific branded cleaning-product page.
Search results still quoted the old Kährs guide, illustrating why a search
snippet alone was insufficient validation of the visitor experience.

Correction in all three translations:

- Removed all four external manufacturer links and all named brands from
  the article. Manufacturer references must not suggest that Expert Parket
  uses, recommends or is certified by those brands without confirmation.
- Removed the example manufacturer's temperature and humidity figures.
  The article now directs readers to confirm requirements for the actual
  flooring, heating system and finish with their contractor.
- Cleaning advice asks for care instructions for the applied finish and
  confirmation of when damp cleaning can begin. It recommends no product.
- Kept general guidance about assessing sanding suitability, drying versus
  curing, quotation scope and preparation. No prices, fixed project times,
  equipment ownership or case studies are invented.

The article uses three AI-generated editorial illustrations in the site's
cream-and-oak palette, replacing the initial company photographs at the
client's request on 16 September 2026. All three language versions disclose
their illustrative origin. See IMAGE-CREDITS.md and
BLOG-IMAGE-PROMPTS-2026-09-16.md.

## Publication

The Icelandic original and complete English and Polish versions live in
`src/data/publishedPosts.ts`. These are deployed editorial content, edited
through Git, separate from the browser-local admin drafts and starter posts.
`src/lib/publicPosts.ts` combines them with backend posts for public pages.
The deployed copy wins for its own ID, so returning visitors with an old
localStorage list still see the article. Backend failures retain static
published content. No database records or visitor data are overwritten.

All three versions are prerendered, linked from their blog index, included
in the sitemap and connected by canonical/hreflang metadata. The article
contains visible company authorship, publication date, a linked contents
list, localized service/contact links, image captions and BlogPosting plus
BreadcrumbList structured data. FAQ answers are visible editorial content;
no FAQ rich-result eligibility is claimed.

Icelandic URL: https://expertparket.is/frettir/parketslipun-verd-timi-undirbuningur

## Follow-up measurement

Once Search Console is available, request inspection of the canonical
Icelandic URL and evaluate indexation, query impressions, clicks and enquiries
after enough data accumulates. Publication and technically valid markup do
not guarantee indexing or a particular ranking.
