# Personal site — Charif Hamza

A two-layer personal site: a designed **surface** for people who will spend 60
seconds on it, sitting on top of a sober, dense, document-grade **depth** for
people who will spend 20 minutes on it.

The full build contract is [`docs/SPEC.md`](docs/SPEC.md). It is normative:
amendments go through that document rather than into code comments. Everything
that could not be supplied from the spec is registered in
[`docs/TODO.md`](docs/TODO.md).

```
npm install
npm run dev        # http://localhost:4321
npm run verify     # build + budgets + motif checks + acceptance criteria
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server, drafts visible |
| `npm run build` | Static build to `dist/`; fails loudly on any schema violation |
| `npm run preview` | Serve the built site |
| `npm run check` | TypeScript and Astro diagnostics |
| `npm run budgets` | §12.1 performance budgets, §12.2 contrast, token-set enforcement |
| `npm run motifs` | §6.1/§7.3 motif criteria that can be checked statically |
| `npm run acceptance` | §15 acceptance criteria that can be checked statically |
| `npm run verify` | All of the above, in order |

`SHOW_DRAFTS=true npm run build` includes `draft: true` entries — the preview
deploy behaviour of §13.

## How it is put together

```
src/
  layouts/      BaseLayout · SurfaceLayout (Layer 1) · DocumentLayout (Layer 2)
  components/
    surface/    Hero, HeroFigure, ProjectRail, ProjectCard, WritingTeaser, Footer, header
    document/   FactsTable, Callout, Figure, Sidenote, Toc, ArtifactList, NextPrev
    common/     Button, PillTag, Wordmark, MotifFrame, Icon
  motifs/       iso.js + Scene.astro + one .astro file per motif (inline SVG)
  styles/       tokens.css · fonts.css · base.css · document.css · motif.css · print.css
  lib/          site.ts (config) · collections.ts (content) · typo.ts (French) · tokens.js
  pages/
content/
  projects/*.mdx
  writing/*.mdx
public/         cv/ · fonts/ · og/ · figures/
site.config.yaml
docs/SPEC.md    the build contract
docs/TODO.md    everything still outstanding
docs/reference/ source art, kept for provenance, never shipped
```

Three ideas carry most of the weight.

**Tokens are the only source of values.** `src/styles/tokens.css` holds the
design system; components reference tokens and never write a raw value.
`src/lib/tokens.js` mirrors the palette for the two build-time contexts that
cannot read CSS — the Shiki syntax theme and the OG image generator — and
`npm run budgets` fails if the two drift or if any hex outside the token set
appears anywhere in the built output.

**One motif, five uses.** Each project owns one isometric motif: on its card,
in the project header, rendered into its OG image, shown in the `/projects`
grid, and watermarked on the printed page. All five go through
`MotifFrame.astro`, so they cannot drift apart. A motif file is a list of boxes
on the unit grid; `src/motifs/Scene.astro` is the only place that turns one
into markup, which is what makes the four read as one drawing system.
`src/motifs/iso.js` is the construction kit: a locked 30° camera, a unit grid,
and the projection.

The motifs are **stills** as of v0.6. The looping choreography the spec
originally called for was cut: the loops read as unresolved rather than
satisfying, and a compelling still was always the acceptance bar for one
(§6.6). The motion budget went to the project rail instead, where one card is
in focus at a time and the neighbours are cut by the page edges.

The one exception is the hero figure (v0.7), built from the same `Scene.astro`
but looping: it assembles itself block by block, holds, fades and begins again
on a 4.4 s cycle. It carries no `animation-fill-mode`, so the resting state of
the markup is the finished object and every reduced-motion path leaves that on
screen; and it observes the §7.6 guards, pausing off-screen and with the tab.
It is why the hero has two columns instead of one.

**Content is Markdown and the build defends it.** `src/content.config.ts`
validates each entry; `src/lib/collections.ts` validates the set. A build fails
if a required field is missing, a card description runs long, a tag falls
outside the controlled vocabulary, a motif id has no matching asset, two
projects claim the same rail position, or a writing piece cross-references a
project that does not exist.

## Adding a project

Target is under 45 minutes, excluding the motif (§13).

1. Copy an existing file in `content/projects/` to `new-slug.mdx`. The file name
   must equal the `slug`, and `order` must be unique — the build enforces both.
2. Write the eight mandatory sections (§8.2.4). This is the real work and it is
   yours, not the build's.
3. Drop figures in `public/figures/<slug>/` and reference them with `<Figure>`.
   Axis labels with units are a hard requirement, not a preference.
4. Pick a motif: reuse one, or claim a name from the reserved list in
   `src/motifs/index.ts` and design it. A motif is a handful of `box()` calls —
   reusing an existing composition is the intended escape hatch.
5. `npm run verify`.

`Callout`, `Figure` and `Sidenote` are available in any content file without an
import.

## Things that are deliberate

- **No navigation bar on the home page.** It would re-introduce the "which tab
  do I click" cost that the two-layer split exists to remove (§3.2).
- **No education, skills, timeline or languages section.** A fact that fits on
  the CV does not get a section on the website (§3.3). `npm run acceptance`
  audits for this.
- **No dark mode in v1.0.** The identity is light field + green + paper; a dark
  inversion weakens it and doubles the motif asset work (§5.1.5).
- **No contact form, no Google Analytics, no cookie banner.** Email is what both
  audiences will use, and the absence of a banner is itself a design decision
  (§11.1).
- **The vertical wheel is never hijacked into horizontal scroll.** It breaks the
  page for anyone trying to leave, and leaving is a legitimate outcome once the
  visitor has the CV (§7.4).
- **Layer 2 ships almost no JavaScript** and works entirely without it.

## Deploying

Static output. Netlify, Vercel or Cloudflare Pages, free tier: build command
`npm run build`, publish directory `dist`. Set the domain in `site.config.yaml`
first — it feeds canonical URLs, the sitemap, RSS and absolute OG image URLs.
