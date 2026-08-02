# TODO register

Everything the specification asked for that could not be supplied from the
specification itself. Each entry says what is missing, where the placeholder
lives, and what unblocks it. Nothing here is a hidden assumption — every one of
these is also marked `TODO` at the place it is used.

`npm run verify` reports the state of the machine-checkable ones on every build.

---

## 1 · Identity and contact

| # | What | Where | Notes |
|---|---|---|---|
| ~~T1~~ | ~~**Domain** (D1, §17)~~ | — | **Resolved.** `charifhamza.com` is registered with Cloudflare and is the canonical site domain. `site.config.yaml`, `public/CNAME`, and `public/robots.txt` carry the same host. |
| T2 | **Email** | `site.config.yaml` → `email` | Now a real address, but a temporary one: `charifhamza1709@gmail.com`. Replace with the IMT Mines Albi or custom-domain address once it exists. It is the only contact method on the site (§11.1 — no forms), and it appears in the hero, the footer, both document layouts and the JSON-LD. |
| T3 | **GitHub / LinkedIn / ORCID** | `site.config.yaml` → `social` | Placeholders contain `TODO`. An empty string hides the link entirely rather than rendering a dead one. ORCID is intentionally empty until §14 v1.2. |
| T4 | **Public repo URL** (D7, §17) | `site.config.yaml` → `social.repo` | The "Voir le code de ce site" footer link. D7 resolves to a public repo — it is a credibility artifact for Persona B. |
| ~~T5~~ | ~~**Surname order**~~ | — | **Resolved.** Given name Hamza, surname Charif, giving `CHARIF-Hamza-CV-FR-YYYY-MM.pdf`. §8.4 requires uppercase surname first (French HR filing convention). |
| ~~T6~~ | ~~**School legal names**~~ | — | **Resolved by removal.** `person.alumniOf` is empty on purpose: the degree is expected in 2028, so there is no alumnus claim to make. Add IMT Mines Albi's exact legal name on graduation. |

## 2 · Binary assets

| # | What | Where | Notes |
|---|---|---|---|
| ~~T7~~ | ~~**The two CV PDFs**~~ | — | **Resolved.** The French and English PDFs live in `public/cv/`; `cv.available` is enabled and all home, header, and `/cv` download affordances address the published files. |
| T8 | **Font files** | `public/fonts/` | Seven WOFF2 files, listed with their exact names in `src/styles/fonts.css`. Switzer is free from Fontshare; Source Serif 4 and JetBrains Mono are OFL. Subset to `latin` + `latin-ext` — the French accents are not optional. Budget 120 KB total (§12.1). Then set `fonts.installed: true`, which switches the preload hints on. Until then the fallback stacks carry the site and the build prints one Vite warning per missing file — that warning **is** this TODO. |
| T9 | **Quantitative figures** | `public/figures/<slug>/` | Each project now carries one hand-drawn *schematic* — RO topology, the moving boundary, the precedence graph — which answer §8.2.4 question 6 without inventing data. None is a chart. The pages still have no plot of a result, and cannot until the numbers behind T10 exist. §8.2.6 makes an unlabelled axis a hard rejection criterion: every chart needs axis labels with units, and the series must use the site palette (`--green-500`, `--ink-900`, `--ink-500`, `--green-700`), never a rainbow default. |

## 3 · Content that needs facts

All three project pages were rewritten from real project records in August 2026,
replacing the invented drafts. What is left is what the real work does not yet
have.

| # | What | Where | Notes |
|---|---|---|---|
| ~~T10~~ | ~~**RIDGE quantitative results**~~ | — | **Resolved.** §8 now reports ~62 % faster primary drying for 5 % mannitol and ~50 % for 5 % sucrose against typical cycle conditions, plotted in `relative-drying-time.svg`, with the framing the author insisted on: those two numbers reproduce published continuous-recipe figures and are not the contribution. The contribution is that they survive discretisation onto a classical lyophilizer within a chosen economic-insignificance gap. Still missing, and worth adding later: the certified gap itself and the enumeration cost. |
| T11 | **RIDGE experimental validation** | `content/projects/ridge.mdx` §8, §9 | Manufactured solutions verify the code; nothing yet validates the model against a real dryer. The page says exactly this, which is the right disclosure — this entry tracks closing the gap, not disclosing it. |
| ~~T12~~ | ~~**§8.2.4 sections on two pages**~~ | — | **Resolved.** Written from the author's own account, August 2026. WFI gained "Why the obvious comparison fails", "How the conclusions were checked" and "Limitations and what I would revisit"; batch coating gained "Why the balances were not the lever" and "Limitations and next steps". All three projects now run to nine sections. |
| T13 | **Artifacts** | all three project frontmatters | `artifacts` is empty on every project. RIDGE is the one with something to link — a repository, once it is public — and §8.2 treats an artifact list as the difference between a claim and a checkable one. |
| T14 | ~~**Batch-coating headline figure**~~ | — | **Resolved.** The audited number is ~60 % compound reduction in batch-to-batch elapsed time including inter-operation intervals, stated identically on the card and in §5/§6, and correctly framed as projected rather than measured in production. Note that SPEC §6.5 (line ~499) and §8.3 (line ~749) still describe this project as ">70 %" — that was the invented brief, and the spec is now the stale document, not the page. |
| T15 | **Employer permission** (D8, §17) | WFI and batch coating | Both pages are method-only and say so in a standing callout. D8 resolves to method-only until permission is explicit. Get it in writing before any figure derived from employer data is published (§8.3). |
| T15b | **The two essays** | `content/writing/*.mdx`, `features.showWriting` | Both are `draft: true` and the section is switched off, because the drafts are in a voice that is not the author's. They are unreachable and absent from the RSS feed until both are rewritten and the flag flipped — §16 wants two real pieces before the section exists at all. |
| T16 | **French proofread** | `site.config.yaml` → `strings.fr` | §15 requires the French copy to be read by a native speaker. The narrow no-break spaces and guillemet spacing are applied automatically by `src/lib/typo.ts`; the *wording* is not. §10.4 also asks you to rewrite the ~350 words a week after first writing them — that is the highest-leverage hour in the project. |

## 4 · Pipeline

| # | What | Where | Notes |
|---|---|---|---|
| T17 | **OG rasterisation** | `site.config.yaml` → `og.format` | `src/pages/og/[slug].svg.ts` produces complete 1200×630 poster-frame cards that are correct in a browser. §6.7 specifies the last step as a headless screenshot; LinkedIn and Slack want raster. Screenshot each `/og/<slug>.svg` at 1200×630, write the PNGs to `public/og/`, then set `og.format: png`. Deliberately not wired to a headless-browser dependency here — that is a CI concern, not a build-time one. |
| T18 | **Analytics** | `site.config.yaml` → `analytics` | Plausible or Umami, cookieless (§11.1). Google Analytics is not approved: it needs a consent banner in France, and the absence of that banner is itself a design decision. Track only `cv_download`, `project_open`, `artifact_click`, `rail_engaged` (§11.3). The number that matters is CV downloads per 100 home visits. |
| T19 | **Lighthouse CI** | not present | §12.1 wants the budgets enforced in CI. `npm run verify` covers the ones measurable from a static build (JS, transfer, motif size, fonts, contrast, token set). LCP ≤ 1.8 s, CLS ≤ 0.02, INP ≤ 150 ms and the 95/100/100/100 scores need a real browser on a throttled profile. |
| T20 | **External link check** | not present | §15 asks for a link-check in CI. `npm run acceptance` verifies every *internal* reference resolves; external URLs are not fetched. |

## 5 · Manual passes before launch

None of these can be automated, and §15 blocks launch on all of them.

- **Screen reader.** One pass with VoiceOver or NVDA. §12.2: once is enough to catch 90 % of problems.
- **Keyboard.** Tab through home: skip link → wordmark → CV → hero links → each card → writing rows → footer. Arrow keys must move the rail one card when it has focus, and a focused card must scroll into view.
- **Throttled mobile.** Lighthouse on a 4G profile for the §12.1 budgets.
- **The motifs as images** (§6.6). `npm run motifs` proves they are static, grid-true, one-protagonist and id-unique. Still needs eyes: look at each of the three on its own, at card size and at OG size, and ask whether it reads as the idea it is named after. §6.6 is now the whole bar rather than half of it — there is no animation to save a composition that does not hold.
- **The rail on a real device.** One card in focus, neighbours cut by the page edges, and the slide landing on a snap point every time on iOS Safari and Chrome for Android — the one surface that still moves.
- **OG cards** in the LinkedIn and Slack preview inspectors (after T17).
- **Print** a project page on A4 and read it.
- **`prefers-reduced-motion`** on the rail (the slide becomes a jump) and the entrance choreography, plus the footer toggle.

---

## Deviations from the specification

### v0.6 — the motifs are stills, and the rail shows one card at a time

An owner's decision, not a constraint. §6.3, §6.5 and §7.3 specify a looping
choreography per motif — sweep, prune, certify, on a 9–11 s cycle. Built, the
loops did not read as satisfying; they read as unresolved, which §7.3 itself
names as the failure mode. §6.6 already required every motif to stand up as a
still ("if it is not compelling as a still image, the motif is rejected"), so
the still was kept and the choreography dropped. Consequences, all deliberate:

- `src/motifs/iso.js` no longer emits keyframes. A motif file is a list of
  boxes on the unit grid; `Scene.astro` turns it into SVG. `npm run motifs` now
  proves the motifs are static, grid-true and single-protagonist, in place of
  the three loop criteria it used to prove.
- The §7.6 performance guards (pause off-screen, cap at three concurrent loops,
  pause on `document.hidden`) are gone with the thing they were guarding.
- The motion budget moved to the rail (§7.4). One card is in focus, its
  neighbours are cut by the page edges, and the slide is a native smooth scroll
  over mandatory snap points — so it degrades to a plain scrollable rail with
  JavaScript off, and to an instant jump under `prefers-reduced-motion`.
- The card fill no longer alternates down the rail (§5.1.4). Green marks the
  card in focus; the rest are paper. The alternation is kept on `/projects`,
  where nothing is in focus and every card is its own subject.
- `--iso-lit`, `--iso-shadow` and the Dark material were added to the token set
  so the three face tones match the reference art (Appendix C).

### v0.6 — two things the spec asked for that were simply missing

Not deviations; bugs, now fixed, recorded because both were invisible in the
build output and neither had a test.

- **`document.css` was never imported.** Layer 2 shipped with none of §5.3.4 or
  §8.2 applied: no reading column, no gutters, no numbered sections, text
  running edge to edge. It is imported by `DocumentLayout.astro`, which is the
  only layer that should carry it.
- **KaTeX's stylesheet was never imported.** `rehype-katex` was configured and
  emitting correct markup, but unstyled KaTeX markup renders as token soup
  rather than as an equation, so every display equation on the site was
  plain-text mathematics. Self-hosted from `node_modules`, no CDN (§5.2.2).
  The maths faces get their own line in `npm run budgets`: they are one file
  per face and a browser fetches only the faces a page actually uses, so they
  do not belong in the reading-typeface budget.

### v0.7 — the hero is two columns, and one of them is an object

The §8.1.2 hero was a text column and nothing else, which on a 1440 px screen
left the right half of the fold empty for the full height of the hero. On the
site's own terms — §4.1, "a well-made object" — that read as a page that had not
been finished rather than as generous space. Three changes, in order of how much
they matter:

- **The second hero line is gone.** §8.1.2 drafts the hero as
  *« Ingénieur procédés. J'optimise des procédés avec des méthodes discrètes. »*
  At `--t-display` the second sentence wrapped to three lines, pushed the CV
  button most of a screen down, and said in headline type what the intro
  paragraph two blocks below says properly. The hero states what he is; the
  intro states what he does. §8.1.2's "maximum two lines" is a ceiling, not a
  quota.
- **A figure fills the other column** (`HeroFigure.astro`): seven blocks on the
  §6.1 unit grid with one green accent, built out of `Scene.astro` like every
  other motif, so the fold now teaches the drawing language instead of deferring
  it to the first card. It is not the optional §8.1.2 portrait — there is still
  no photo. Below `lg` it is not rendered: it is 0.6 as wide as it is tall, and
  stacking it on a phone would buy the illustration with the CV button, which S1
  wants above the fold.
- **That one motif loops**, which is a deliberate exception to the v0.6 decision
  above — the owner's call, overriding it for this one object. The choreography
  and its timing are the supplied art's, transcribed with the geometry: the
  blocks fly in bottom-up along the isometric axes over 1.8 s, the assembled
  figure holds for 2.1 s, everything fades, and it begins again on a 4.4 s
  cycle. `--hero-loop` in `HeroFigure.astro` is the one number that changes the
  tempo.

  Three things keep it affordable. It carries **no `animation-fill-mode`**, so
  the resting state of the markup is the finished object and reduced motion,
  reduced data, the footer toggle and CSS-off all leave the assembled figure on
  screen rather than the empty first frame. The **§7.6 guards are real**: an
  IntersectionObserver pauses the loop once more than a quarter of the figure
  has left the viewport, and `visibilitychange` pauses it with the tab. And
  100% is the same invisible state as 0%, so the wrap is **seamless** — which is
  the criterion the old motif loops failed and the reason they were cut.

  `npm run motifs` still passes: it proves that no *motif* emits a keyframe of
  its own, and this choreography lives in the hero component rather than in
  `Scene.astro` or `iso.js`, so the rail motifs remain stills.

Two smaller things went with it: `Scene.astro` gained `fit="natural"` (a
viewBox cropped to the drawing, for the one motif not sitting on a card) and
per-box `id`s, and the header strip gained the hairline the section labels below
already use, so the wordmark and the CV button read as one strip rather than as
two objects a thousand pixels apart.

The source art is in `docs/reference/`, with a note on why it was transcribed
rather than shipped.

### Two forced by contrast

Both forced by §12.2's "WCAG 2.2 AA, non-negotiable", both inside the token
set, both re-checked by `npm run budgets` so they cannot silently regress.

**`--ink-500` darkened from `#6B7079` to `#5E636A`.** §12.2 names this exact
pair and says to verify it: `#6B7079` measures 4.44:1 on `--field` and 4.06:1
on `--field-deep`, under the 4.5:1 body-text minimum. The spec's instruction
for this case is "darken if it fails". The replacement measures 5.40 / 4.94 /
6.05 on `--field`, `--field-deep` and `--paper`. Appendix A should be amended.

**The focus ring uses `--green-700` rather than `--green-500`.** §5.5.2
specifies a `--green-500` ring. Measured, `--green-500` is 2.16:1 on `--paper`
and 1.60:1 on a `--green-300` card — the ring would be effectively invisible on
half the cards on the home page, and WCAG 2.2 AA requires 3:1 for a focus
indicator. `--green-700` is the same brand green one step darker and measures
5.39 / 4.81 / 3.98 on `--paper`, `--field` and `--green-300`.

## One thing left as designed, and flagged

Link underlines are `--green-500` on `--paper` (2.16:1), per §5.5.4. The link
text itself is `--ink-900` at 18.89:1 and the underline is a shape rather than
a colour cue, so §12.2's "no colour-only differentiation" is satisfied. A
strict reading of WCAG 1.4.11 would still want a darker underline. Left as
specified because it is a deliberate design decision in §5.5.4 rather than an
oversight — but it is the one place a reviewer may reasonably disagree.

## Partially implemented

**The page transition (§4.4).** Implemented with native cross-document view
transitions: the motif is the shared element and carries a per-project
`view-transition-name`, so it scales down, travels to the project header and
freezes at its poster frame (step 3), while the background crossfades
`--field` → `--paper` (step 4) and the first three body blocks fade and rise
12 px on a 60 ms stagger (step 5). Steps 1 and 2 — the clicked card expanding
to fill the viewport while its siblings fade — need JavaScript to know which
card was clicked, and §4.4 explicitly accepts a plain navigation with a fade as
the fallback ("Do not polyfill"). The zero-JS route was taken deliberately;
adding the full choreography is a contained change to `base.css` plus a small
click handler on the rail.
