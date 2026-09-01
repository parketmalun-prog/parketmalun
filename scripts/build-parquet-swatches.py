#!/usr/bin/env python3
"""
Lay every catalogue board into its real pattern and write the swatches.

    python3 scripts/build-parquet-swatches.py
    python3 scripts/optimize-photos.py     # then rebuild the WebP ladder

The catalogue used to draw its parquet in SVG from a single hex colour, which
read as a diagram rather than a floor. Each product now gets a photographic
swatch composed from the manufacturer's own board photograph, laid in the
pattern that product is actually sold in, so the picture on the card and the
name under it describe the same thing.

Sources live in photos-library/parket-source/<collection>-<colour>.jpg and are
not shipped. Output goes to public/photos/parket-<collection>-<colour>.jpg.

Herringbone is built axis-aligned on its true lattice and then turned 45
degrees, which is far easier to get right than placing every plank at an
angle: the pair {horizontal L x W at (0,0), vertical W x L at (L,0)} tiles the
plane under a*(L+W, L-W) + b*(-W, W), whose determinant is exactly the 2*L*W
the pair covers. Chevron cannot use that trick, because its planks are mitred
vertically rather than butted, so each one is masked to its parallelogram.

Needs Pillow only.
"""
import math, sys
from PIL import Image, ImageDraw, ImageEnhance

def _src(path):
    im = Image.open(path).convert('RGB')
    return im.rotate(-90, expand=True)      # portrait board -> lengthwise

def board(im, long_px, wide_px, seed):
    """A plank cut from the source photo, its length along x."""
    w, h = im.size
    fw = max(40, int(w * 0.88)); fh = max(20, int(h * 0.88))
    ox = (seed * 137) % max(1, w - fw)
    oy = (seed * 91) % max(1, h - fh)
    cut = im.crop((ox, oy, ox + fw, oy + fh))
    if seed % 3 == 0:
        cut = cut.transpose(Image.FLIP_LEFT_RIGHT)
    # No two boards off the same tree read alike; a little exposure jitter
    # keeps a field of them from looking like one printed sheet.
    cut = ImageEnhance.Brightness(cut).enhance(0.93 + ((seed * 37) % 15) / 100)
    if long_px >= wide_px:
        return cut.resize((long_px, wide_px), Image.LANCZOS)
    return cut.resize((wide_px, long_px), Image.LANCZOS).rotate(90, expand=True)

SEAM = (26, 20, 15)

def _seam(canvas, poly, width=2):
    ImageDraw.Draw(canvas).line(list(poly) + [poly[0]], fill=SEAM, width=width, joint='curve')


def plank_field(path, W, H, courses=5):
    im = _src(path)
    c = Image.new('RGB', (W, H), (30, 24, 18))
    bh = H // courses + 1
    for row in range(courses + 1):
        y = row * bh
        x = -((row * 137) % (W // 2))
        seg = 0
        while x < W:
            bw = W // 2 + ((row * 53 + seg * 29) % (W // 5))
            c.paste(board(im, bw, bh, row * 7 + seg), (x, y))
            _seam(c, [(x, y), (x + bw, y), (x + bw, y + bh), (x, y + bh)])
            x += bw + 2
            seg += 1
    return c

def herringbone(path, W, H, pw=None):
    im = _src(path)
    pw = pw or max(18, H // 9)
    pl = pw * 4
    # oversize so the 45 degree turn still covers the frame
    big = int(max(W, H) * 1.55)
    c = Image.new('RGB', (big, big), (30, 24, 18))
    u = (pl + pw, pl - pw)      # along a staircase
    v = (-pw, pw)               # to the next staircase
    k = 0
    span = int(big / pw) + 6
    for a in range(-span, span):
        for b in range(-span * 2, span * 2):
            x = a * u[0] + b * v[0]
            y = a * u[1] + b * v[1]
            if x < -pl - pw or x > big + pl or y < -pl - pw or y > big + pl:
                continue
            c.paste(board(im, pl, pw, k), (x, y)); k += 1
            _seam(c, [(x, y), (x + pl, y), (x + pl, y + pw), (x, y + pw)], 3)
            c.paste(board(im, pw, pl, k + 7), (x + pl, y)); k += 1
            _seam(c, [(x + pl, y), (x + pl + pw, y), (x + pl + pw, y + pl), (x + pl, y + pl)], 3)
    c = c.rotate(45, resample=Image.BICUBIC, expand=False)
    left = (big - W) // 2; top = (big - H) // 2
    return c.crop((left, top, left + W, top + H))

def chevron(path, W, H, pw=None):
    """Chevron: planks mitred vertically, apex to apex on every seam.

    Each plank is a parallelogram with vertical ends, so the courses zigzag
    and the points line up down the seam. The wood goes in rotated and is
    then masked to that parallelogram, which is what gives the mitre.
    """
    im = _src(path)
    pw = pw or max(16, H // 8)
    band = pw * math.sqrt(2)          # a 45 degree plank's vertical thickness
    seam = band * 3.4                 # horizontal run of one plank
    c = Image.new('RGB', (W, H), (30, 24, 18))
    diag = int(math.hypot(seam, seam) * 1.6)
    k = 0
    cols = int(W / seam) + 3
    rows = int(H / band) + int(seam / band) + 4
    for r in range(-int(seam / band) - 2, rows):
        for col in range(-1, cols):
            x0 = col * seam
            up = col % 2 == 0
            y0 = r * band + (0 if up else -seam)
            y1 = y0 - seam if up else y0 + seam
            poly = [(x0, y0), (x0 + seam, y1), (x0 + seam, y1 + band), (x0, y0 + band)]
            ys = [p[1] for p in poly]
            if max(ys) < 0 or min(ys) > H:
                continue
            plank = board(im, diag, int(band * 1.6), k); k += 1
            rot = plank.rotate(45 if up else -45, expand=True, resample=Image.BICUBIC)
            mask = Image.new('L', (W, H), 0)
            ImageDraw.Draw(mask).polygon(poly, fill=255)
            ox = int(x0 + seam / 2 - rot.width / 2)
            oy = int(min(y0, y1) + (band + seam) / 2 - rot.height / 2)
            layer = Image.new('RGB', (W, H), (30, 24, 18))
            layer.paste(rot, (ox, oy))
            c.paste(layer, (0, 0), mask)
            _seam(c, poly)
    return c

# Every product in src/data/catalog.ts, and the pattern it is sold in.
SWATCHES = {
    'eco-desert': 'plank',
    'classic-latte': 'plank',
    'forest-bronze': 'plank',
    'classic-mist': 'plank',
    'classic-ash': 'herringbone',
    'classic-mocha': 'herringbone',
    'eco-night': 'herringbone',
    'design-taupe': 'chevron',
    'royal-ridge': 'chevron',
}

SRC_DIR = 'photos-library/parket-source'
OUT_DIR = 'public/photos'
# 4:3, the aspect of the catalogue card. Wide enough for the card at two
# device pixels per CSS pixel without carrying a photograph nobody zooms into.
SIZE = (1200, 900)

if __name__ == '__main__':
    import os
    builders = {'plank': plank_field, 'herringbone': herringbone, 'chevron': chevron}
    for name, pattern in SWATCHES.items():
        src = os.path.join(SRC_DIR, f'{name}.jpg')
        if not os.path.exists(src):
            raise SystemExit(f'missing source: {src}')
        out = os.path.join(OUT_DIR, f'parket-{name}.jpg')
        builders[pattern](src, *SIZE).save(out, 'JPEG', quality=90)
        print(f'{pattern:12} {out}')
    print(f'{len(SWATCHES)} swatches written')
