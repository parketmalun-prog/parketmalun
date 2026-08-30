#!/usr/bin/env python3
"""
Rebuild the Fraunces display subsets in src/styles/fonts/.

Fontsource slices this face by unicode range, which made a Polish visitor
fetch two files and 124 kB before a heading painted. Both cuts here are
instanced on the optical-size axis and subset to Basic Latin plus the
Icelandic and Polish letters, so every language is one request:

    fraunces-subset.woff2         23.7 kB  (weight axis kept: 500/600/700)
    fraunces-italic-subset.woff2  14.6 kB  (also pinned to semibold)

Run this after changing display copy to a letter outside the covered set.

Needs fonttools and brotli, which are NOT project dependencies:
    python3 -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python scripts/build-italic-subset.py
"""
import os
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FILES = 'node_modules/@fontsource-variable/fraunces/files'
OUT_DIR = 'src/styles/fonts'

CHARS = set(range(0x20, 0x7F))
for ch in 'ÁÉÍÓÚÝÐÞÆÖáéíóúýðþæö' 'ĄĆĘŁŃÓŚŹŻąćęłńóśźż' '·°€„“”‘’…':
    CHARS.add(ord(ch))

FEATURES = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'tnum', 'onum', 'lnum']

# The upright keeps its weight axis (medium, semibold and bold are all in
# use). The italic sets accent words only, always semibold, so it is pinned.
CUTS = [
    ('fraunces-latin-opsz-normal.woff2', 'fraunces-subset.woff2', {'opsz': 144}),
    ('fraunces-latin-opsz-italic.woff2', 'fraunces-italic-subset.woff2', {'opsz': 144, 'wght': 600}),
]


def build(src_name, out_name, axes):
    src = os.path.join(FILES, src_name)
    out = os.path.join(OUT_DIR, out_name)
    tmp = out + '.tmp.ttf'

    font = TTFont(src)
    instancer.instantiateVariableFont(font, axes, inplace=True)
    font.save(tmp)

    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = FEATURES
    opts.name_IDs = ['*']
    opts.notdef_outline = True

    f = subset.load_font(tmp, opts)
    s = subset.Subsetter(options=opts)
    s.populate(unicodes=CHARS)
    s.subset(f)
    subset.save_font(f, out, opts)
    os.remove(tmp)
    print(f'{out}: {os.path.getsize(out) / 1024:.1f} kB  (from {src_name})')


for args in CUTS:
    build(*args)
