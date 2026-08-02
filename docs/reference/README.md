# Reference art

Source artwork, kept for provenance. **None of it is shipped.** Nothing in this
directory is imported by the site, and `public/` is the only place a served
asset may live.

## `isometric-blocks-rig.svg`, `isometric-blocks-assemble.svg`

The hero figure, as supplied: seven cantilevered blocks with one green bar,
still and animated. `src/components/surface/HeroFigure.astro` is a
transcription of it onto the site's own isometric grid rather than a copy of
the file, because the file could not be shipped as-is:

- **Colour.** It uses nine hex values (`#242424`, `#b4f9ba`, `#67df70`,
  `#dedede`, `#e0e0e0`, `#d5d5d5`, …), none of them in the token set. §15 —
  "no colour outside the token set appears anywhere" — is enforced by
  `npm run budgets` over every built `.css`, `.html` and `.svg`.
- **Projection.** The art is drawn at ~29.5° with per-block rounding, not the
  30° isometric of §6.1, so it would not have sat in the same world as the
  three motifs on the rail. Transcribed, every vertex is on the unit grid and
  `npm run motifs` proves it.
- **Motion.** The animated file loops on a 4.4 s cycle. Motifs have been stills
  since v0.6 and the site's motion budget is a single 900 ms entrance (§7.5),
  so the assemble was kept as a one-shot entrance and the loop dropped.

The transcription is exact in structure — same seven blocks, same footprints,
same stacking, same accent. Reading it back off the geometry: heights are one
cell throughout, `z` runs −1 to 5, and the arrival vectors in `HeroFigure.astro`
are the same directions the original slid its blocks in along.
