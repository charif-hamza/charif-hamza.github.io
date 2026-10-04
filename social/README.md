# Social images

LinkedIn post images in the site's identity, built from the site's own files
rather than imitating them: `render.mjs` links `src/styles/tokens.css` and
`src/styles/motif.css`, and motifs are drawn with `src/motifs/iso.js`. Change a
token on the site and the next render follows.

```bash
node social/render.mjs social/posts/<YYYY-MM-DD-slug>.mjs   # → social/out/<slug>.{html,png,jpg}
```

Upload the `.jpg`: the 2x PNG carries the motif grain and runs to several MB.
`social/out/` is ignored by git; the post module is the source.

## A post module

Default-exports `{ width, height, css, body }`. `body` is HTML; build its motif
with `scene()` from `lib.mjs` (the string twin of `Scene.astro`). Feed format
is 1080 × 1350 (4:5, the tallest LinkedIn shows uncropped).

The base layout, from `2026-10-05-ridge.mjs`: field background, a blue hero
card (pill, headline, lede bottom-left, motif on the right), a white card for
the figures and the limit, the signature on the field. Blue then white, as on the home rail.

## The LinkedIn banner

`banner.mjs` is the one image that is not a post module: it writes its own
SVG master (fonts embedded) and rasterises it, because the banner is a vector
rebuild of a fixed drawing — the cube he chose on 04/10/2026 — and not a card
layout. Type is Switzer, Bold for the title and Regular for the sentence.

```bash
node social/banner.mjs           # → social/out/banner-linkedin.{svg,png,jpg}
node social/banner.mjs --motif   # drawing only → banner-linkedin-motif.*
```

The words live in `COPY`, with one layout number (`x`, where the title's last
word and the sentence under it start); the comment above it says what the
profile photo and the app's side crop leave free.

## Rules kept from the SPEC

- Colours from the tokens only. Text on blue is `--ink-900`, never white.
- Motifs: true isometric, light from the upper left, white tops, `--iso-shadow`
  right faces, one blue protagonist, a soft blue ground shadow.
- Switzer only, bold headings at `--track-display`. No mono labels, no all caps.
- Illustrative geometry, not data. Real plots belong on the project page.

## Text speaks, the motif composes

Decided 04/10/2026, after a staircase-under-a-curve version of the RIDGE post:
a drawing that tries to explain the project ends up needing labels, and then
it is neither a good diagram nor a good composition. So:

- **The text carries the project** — headline, lede, figures, the limit.
- **The motif is aesthetic.** A post about a project uses that project's own
  motif from `src/motifs/` (same box list, so the post matches the link
  preview under it). A post with no project gets a new abstract composition
  from the same kit. No curves, no labels, no leader lines.

## What differs from the site, and why

- Radii and strokes about twice the site's: the feed shows the image at half
  size.
- A deeper blue ground shadow (`post.css`): the site's is the colour of the
  card gradient's lower half, where post motifs stand, and vanishes there.
- Motifs are copied as box lists (Astro files cannot be imported from Node);
  each post names the motif file it copies.

## Fonts

`fonts/` holds Switzer 400–700 (Fontshare, Free Font License, `fonts/License/`).
The WOFF2 files are not in git: the licence forbids redistributing them from a
public repository. On a fresh clone, download Switzer from fontshare.com and
drop the four weights in `fonts/`.
The site itself still runs on fallbacks until the WOFF2 files go in
`public/fonts/` (see that README); posts do not wait for it.
