# Photo library (not deployed)

Real Expert Parket photographs, curated from the client's WhatsApp batches
of 22.08.2026, that no page currently references.

They live here rather than in `public/photos` so they stay in the repo and
stay easy to bring back, without being copied into every deploy: the site
ships what it renders, and these were adding 6 MB to it.

To use one, move the whole set back (the `.jpg` plus its `-320/-640/...webp`
derivatives), add the path in `src/data/photos.ts`, then re-run:

    python3 scripts/optimize-photos.py

Contents are mostly extra portfolio candidates: more `real-pf-*` plates,
the unused panorama alternates, and `real-before.jpg` / `real-hero-wide.jpg`
from the round when the real photos briefly ran on the home page.
