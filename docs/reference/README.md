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
The transcription is exact in structure — same seven blocks, same footprints,
same stacking, same accent — and the **motion is kept as authored**: the
`assemble` file's 4.4 s cycle, its arrival directions and its keyframe
percentages are all transcribed with the geometry. What changed is only how it
degrades (no fill-mode, so the resting state is the finished object) and that it
pauses off-screen per §7.6.

Reading the structure back off the geometry: heights are one cell throughout,
`z` runs −1 to 5, and `shelf` + `riser` are one 2.5-cell bar broken in two,
contiguous in y at the same x and z — which is what caps the green bar and puts
the seam where the art has it.

**Depth is not recoverable from a single projection.** Screen position fixes
only two of a block's three coordinates; the third has to come from the paint
order and from what the structure has to be for it to stand. Getting `riser`
wrong the first time put it two levels low, which exposed the accent's top face
and left a stray cube visible behind it. If any block is ever re-derived from
this art, check it against the original's paint order — `painterSort` must
reproduce the reference file's group order for every pair of blocks that
overlap on screen.
