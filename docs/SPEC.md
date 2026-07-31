# Personal Website — Full Design & Build Specification

**Version** 1.0 · **Date** 31 July 2026 · **Status** Ready for build
**Owner** [Your Name] — Process Systems Engineering
**Deliverable type** Specification only. No code in this document.

---

## 0. How to read this document

This is a build contract. It is written so that either (a) a developer, (b) an AI-assisted workflow, or (c) you at 1 a.m. six months from now can implement or extend the site without re-deciding anything already decided here.

- **Normative language:** *MUST* = non-negotiable, *SHOULD* = strong default, deviation must be justified, *MAY* = optional.
- **Placeholders:** `[Your Name]`, `[domain]`, `[email]` appear where a decision is pending. All pending decisions are collected in §17.
- **Tokens:** every value that appears twice in this document is a named token. Implementations MUST reference tokens, never raw values.

---

## 1. Product summary

### 1.1 One line

A two-layer personal site: a designed, animated, low-friction **surface** for people who will spend 60 seconds on it, sitting on top of a sober, dense, document-grade **depth** for people who will spend 20 minutes on it.

### 1.2 The core concept

Most engineering portfolios fail in one of two directions. They are either pretty and empty (nice animations, nothing to read), or dense and repellent (a wall of PDF links). This site refuses the trade-off by **splitting the audience at the click**.

| | **Layer 1 — Surface** | **Layer 2 — Depth** |
|---|---|---|
| Entry point | `/` (home) | any project or writing page |
| Who | French HR, recruiters, school contacts, anyone linked from LinkedIn | Senior engineers, R&D leads, potential PhD supervisors, researchers, peers |
| Time on page | 40–90 s | 5–25 min |
| Job to be done | "Is this person serious, capable, and worth forwarding? Give me the CV." | "Is this work real? Does he reason well? Would I supervise / hire / cite him?" |
| Register | Designed, confident, animated, generous white space | Sober, typographic, dense, document-like |
| Dominant surface | Green + white cards on light grey field | Paper white, thin rules, restrained green accents |
| Motion | Signature — looping isometric motifs | Near-zero — only navigational feedback |
| Reading mode | Scanning | Reading |

**The click on a project card is the audience filter.** Nobody has to self-identify; behaviour does it.

### 1.3 What this site is *not*

- It is **not a CV in HTML**. Education, ranking, scholarships, internship chronology, and skill lists live in the PDF CV. See §3.3 for the hard content boundary.
- It is **not a blog-first site**. Writing supports the projects; it does not lead.
- It is **not a playground**. Every animation is tied to a project's actual logic (§6.5). No decorative particle fields, no generic 3D blobs.

### 1.4 Success criteria

| # | Criterion | Measure |
|---|---|---|
| S1 | An HR reader gets the CV without thinking | CV download reachable in ≤1 click from any page, ≥1 CTA above the fold on mobile |
| S2 | The site is remembered | The isometric motif system is unique per project and reused as OG image, so a shared link is visually identifiable |
| S3 | A technical reader can evaluate depth without contacting you | Every project page answers the 8 mandatory questions in §8.2.4 |
| S4 | Adding a project costs < 45 minutes of your time (excluding the motif) | One Markdown file + one frontmatter block + one motif asset (§13) |
| S5 | It is fast enough to survive a mobile connection in a recruiter's commute | Budgets in §12.1 |
| S6 | It ages well | Nothing dated to 2026 design trends; no dependency on a paid animation SaaS |

---

## 2. Audiences and journeys

### 2.1 Persona A — "Camille", French HR / talent acquisition (primary for Layer 1)

Context: 30–120 s on the site, often on a phone, between two other candidates, possibly from a LinkedIn link. In the French market, presentation quality is read as a proxy for rigour and seriousness — a poorly presented dossier is penalised in a way it is not in Anglo-Saxon markets. She is *not* going to read about the Thiele modulus.

She needs, in order:
1. Name, current situation, and what kind of engineer this is — in one sentence.
2. Evidence the person is credible (school, double degree, ranking — one line, not a section).
3. **The CV, in French, in one click, as a PDF, with a filename she can file.**
4. A reason to remember you when she reviews 40 profiles tonight.

Journey target:
```
Land on /  →  reads hero (8 s)  →  reads intro paragraph (20 s)
   →  scrolls / swipes the project rail, watches 1–2 motifs (25 s)
   →  clicks "Télécharger le CV"  →  leaves
Total: ~60 s. Zero dead ends. Zero required clicks before the CV.
```

**Design consequence:** the home page MUST be fully comprehensible with the sound off, the animations disabled, and no scrolling past the second screen.

### 2.2 Persona B — "Prof. Ferrand", technical evaluator (primary for Layer 2)

A senior engineer, an R&D manager, or a professor considering you for a PhD or a research internship. Arrives from an email you sent, a paper, a GitHub README, or a direct link to one project.

He needs:
1. What the problem actually was, and why it was non-trivial.
2. What you did, in enough method detail to judge it — formulation, assumptions, data, validation.
3. What the result was, with honest error bars and limitations.
4. Access to artifacts: repository, report, notebook, figures.
5. A sense of taste — can you tell a real contribution from a nice-looking one.

Journey target:
```
Land on /projects/ridge  →  reads TL;DR box + facts table (30 s)
   →  scans TOC, jumps to Method and Results (6–15 min)
   →  opens the repository in a new tab
   →  optionally: /writing, then /  → CV
```

**Design consequence:** project pages MUST be linkable, deep-linkable by section, readable without JavaScript, and printable.

### 2.3 Persona C — "the passer-by"

Peers, students, people arriving from search or from a shared writing piece. Low intent, high volume. Served by good OG images, fast loads, and a writing index that stands on its own.

### 2.4 Persona D — you, the author

Non-negotiable: the site must not become a second job. Content is Markdown. Adding a project must not require touching layout code. See §13.

### 2.5 Priority conflicts, resolved in advance

| Conflict | Resolution |
|---|---|
| Beautiful home vs. fast home | Fast wins. Motifs lazy-load, static poster frame ships first. |
| Depth on home vs. CV-first | CV-first. Depth is one click away, never inline on `/`. |
| Consistent brand vs. sober technical pages | Brand invariants in §4.3 are kept; everything else relaxes. |
| More projects vs. curated rail | Rail shows max 6, `/projects` grid holds the rest (§8.1.5). |

---

## 3. Information architecture

### 3.1 Sitemap

```
/                          Home — Layer 1. The whole surface experience.
/projects                  Grid index of all projects (appears in nav once N > 4)
/projects/[slug]           Project deep-dive — Layer 2 template
/writing                   Index of written pieces, reverse chronological
/writing/[slug]            Article — Layer 2 template
/cv                        Thin page: embedded PDF viewer + FR/EN download buttons
/about                     OPTIONAL, phase 2. Longer first-person note + contact.
/404                       Isometric 404 motif
/rss.xml                   Feed for /writing
/sitemap.xml, /robots.txt
```

Static assets:
```
/cv/[name]-cv-fr.pdf
/cv/[name]-cv-en.pdf
/og/[slug].png             Generated OG images, 1200×630
```

### 3.2 Navigation rules

- **Home MUST NOT have a top navigation bar.** It has a hero, a rail, a writing teaser, and a footer. Adding a nav bar re-introduces the "which tab do I click" cost that the two-layer design exists to remove. The only persistent element is a small wordmark top-left and the CV button top-right.
- **Layer 2 pages have a slim sticky header:** `← [wordmark]` on the left, section title in the middle (desktop only), `CV` on the right. Height `space-14`. It is the only cross-layer chrome.
- **Every Layer 2 page MUST end with a "next" affordance:** next project, or back to the rail. No dead ends.
- Breadcrumbs: `Projects / RIDGE` on project pages, small, above the title. Not on home.

### 3.3 Content boundary — the hard rule

This is the rule you asked for, made enforceable.

> **A fact that fits on the CV does not get a section on the website. A fact that cannot fit on a CV is the website's entire reason to exist.**

| Belongs to the **CV (PDF)** | Belongs to the **site** |
|---|---|
| Baccalauréat, CPGE, EIA/UIASS, CNC, track | Why you chose discrete optimisation over continuous simulation |
| Cohort ranking, IMT Foundation scholarship | How you formulated the WFI comparison and what you'd change |
| Internship names, dates, employers | The reasoning, the trade-off table, the failure modes |
| The list "Python, Linux, OR tools" | Code you actually shipped, with the design decisions behind it |
| Language levels, DET score | Writing that shows how you think |
| Symposium selection | What you took from it, if it changed anything (as a writing piece) |

**Permitted leakage:** the home hero MAY carry at most **two** credential lines (see §8.1.1) — e.g. current school and a single distinguishing fact — because Persona A needs an anchor before she opens the PDF. Beyond that, credentials appear on the site only as incidental context inside a project narrative ("during a three-month internship at …"), never as a list.

**Explicitly forbidden on the site:** a "Timeline" section, an "Education" section, a "Skills" section with progress bars, a "Languages" section, a rating of yourself out of five for anything.

### 3.4 Routing and URL rules

- Slugs are lowercase, hyphenated, stable forever. `ridge`, `wfi-feasibility`, `batch-coating`.
- URLs MUST NOT contain dates or language codes at launch. If bilingual routing is added later (§10.3), the scheme is `/fr/...` with `/` defaulting to FR and `/en/...` for English.
- Project pages MUST support fragment links to every `h2`/`h3` (`#method`, `#results`) with stable ids derived from headings.

---

## 4. The two-layer system

This section is the heart of the design. Everything in §5–§8 is a consequence of it.

### 4.1 Layer 1 — Surface

**Feeling:** a well-made object. Calm, geometric, slightly playful, expensive-looking, not loud.

- Background: `--field` (light grey), never pure white — the white cards need something to sit on.
- Cards float on the field with soft shadows and large radii.
- Colour ratio target: **50% field grey, 25% green, 20% white, 5% ink.**
- Motion is constant but slow. Nothing blinks, nothing bounces hard.
- Type is large, short-measure, high-contrast in size (huge headline, small body).
- Density: low. Generous white space is the point.

### 4.2 Layer 2 — Depth

**Feeling:** a technical note or a preprint that happens to be well designed. Think Quarto / Tufte / a good lab report — not a startup blog.

- Background: `--paper` (near-white), full-bleed. No cards, no floating panels. The page *is* the document.
- Structure comes from **rules (hairlines), numbering, and margins** — not from boxes and shadows.
- Colour ratio target: **88% paper, 9% ink, 3% green.** Green is reduced to: the left border of callouts, link underlines, one accent in figures, the still motif in the header.
- Motion: none, except link/hover feedback and the sticky TOC highlight.
- Type: serif body for long-form reading, grotesque for headings and UI, mono for code and data.
- Density: high. Measure 68–72 characters. Sidenotes in the margin on wide screens.

### 4.3 Brand invariants — what MUST NOT change across layers

These four things carry the identity through the mood switch. Everything else is allowed to change.

1. **The green.** `--green-300` is the same hex in both layers. Only its *quantity* changes.
2. **The isometric motif language.** Layer 1 animates it; Layer 2 freezes it. Same geometry, same projection, same stroke weight.
3. **The heading typeface.** Same grotesque, same weight, same tight tracking on large sizes.
4. **The ink.** `--ink-900` is the same near-black. No layer uses pure `#000`.

### 4.4 The transition

The click from a card to a project page is the most important moment in the site. It MUST feel like *descending into* the card, not like navigating away.

**Specified behaviour (desktop, motion allowed):**
1. On click, the clicked card scales to `1.0` from its hover state and its siblings fade to `opacity 0` over `--dur-fast`.
2. The card expands to fill the viewport width over `--dur-page` with `--ease-entrance`, its radius animating from `--radius-card` to `0`.
3. Its motif animation completes to its **poster frame** (§6.6) and freezes; it simultaneously scales down and moves to its final position in the project header.
4. The background crossfades `--field` → `--paper`.
5. Body content fades and rises 12 px with a 60 ms stagger across the first three blocks.

**Fallbacks:**
- `prefers-reduced-motion: reduce` → instant navigation, no transform, 120 ms crossfade only.
- No View Transitions API support → plain navigation with a 160 ms fade. Acceptable. Do not polyfill.
- Mobile → simplified: fade + 8 px rise, no shared-element expansion. Do not attempt the full choreography on low-end devices.

**Return path:** browser back MUST restore the rail at the same horizontal scroll position with the previously clicked card centred.

---

## 5. Design system

### 5.1 Colour

All values are tokens. Implementations MUST NOT hardcode hex.

#### 5.1.1 Core palette

| Token | Value | Role |
|---|---|---|
| `--green-050` | `#F1FDF2` | Faintest wash — table zebra, code block background in Layer 2 |
| `--green-100` | `#DFFAE2` | Hover tint on white cards, callout fill |
| `--green-200` | `#C2F5C9` | Card gradient top / light isometric faces |
| `--green-300` | `#A3EFAE` | **Signature green.** Card fill, motif accent faces. The brand colour. |
| `--green-400` | `#7FE18E` | Card gradient bottom, motif shading, ground shadow |
| `--green-500` | `#48C862` | Interactive accent: link underline, focus ring, chart series 1 |
| `--green-700` | `#1E7A38` | Green text on white when text must be green (rare). Passes AA on paper. |

> **Contrast rule:** `--green-300` and lighter are **fill colours only**. Text on green fill MUST be `--ink-900`. Text in green MUST use `--green-700` or darker. Never white text on any green in this palette.

#### 5.1.2 Neutrals

| Token | Value | Role |
|---|---|---|
| `--ink-900` | `#101113` | Primary text, isometric dark faces, wordmark |
| `--ink-700` | `#3A3D42` | Secondary text in Layer 2 |
| `--ink-500` | `#6B7079` | Meta text, captions, sidenotes |
| `--ink-300` | `#B9BDC4` | Disabled, placeholder |
| `--rule` | `#E3E5E8` | Hairlines, table borders, TOC divider |
| `--paper` | `#FFFFFF` | Layer 2 page background, white card fill |
| `--field` | `#F2F2F1` | Layer 1 page background (matches the reference image) |
| `--field-deep` | `#E8E8E7` | Footer band, rail edge fades |

#### 5.1.3 Semantic mapping

| Semantic token | Layer 1 | Layer 2 |
|---|---|---|
| `--bg-page` | `--field` | `--paper` |
| `--bg-surface` | `--paper` / `--green-300` | transparent |
| `--fg-primary` | `--ink-900` | `--ink-900` |
| `--fg-secondary` | `--ink-700` | `--ink-500` |
| `--accent` | `--green-300` | `--green-500` |
| `--border` | none (shadow instead) | `--rule` |

#### 5.1.4 Card fill alternation

The rail alternates card fills to create rhythm, exactly as in the reference image: `green → white → green → white …`, starting with green.

- **Green card:** linear gradient `165deg, --green-200 0%, --green-300 45%, --green-400 100%`. Text `--ink-900`. No border. Shadow `--shadow-card`.
- **White card:** flat `--paper`. Text `--ink-900`. Shadow `--shadow-card`. A `1px` `--rule` border MAY be added only if the shadow proves too weak on `--field`.

#### 5.1.5 Dark mode

**Out of scope for v1.0.** The identity is built on light-field + green + paper; a dark inversion weakens it and doubles the motif asset work. If demanded later, restrict it to Layer 2 only (`--paper` → `#121316`, `--green-500` accent), and keep Layer 1 permanently light. Document this decision so it is not re-litigated.

### 5.2 Typography

The brief is "no fancy fonts". That means: **no display faces, no serif logotypes, no variable-width experiments.** It does not mean "default system font". Choose one neutral grotesque with good geometry and stick to it.

#### 5.2.1 Families

| Token | Recommendation | Fallback stack | Used for |
|---|---|---|---|
| `--font-sans` | **Switzer** (Fontshare, free, self-hosted) — geometric grotesque with the same neutral warmth as the reference image | `Switzer, "General Sans", "Helvetica Neue", Arial, sans-serif` | All headings, all UI, all Layer 1 body |
| `--font-serif` | **Source Serif 4** (OFL, variable) | `"Source Serif 4", Charter, Georgia, serif` | Layer 2 long-form body only |
| `--font-mono` | **JetBrains Mono** (OFL) | `"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace` | Code, equations fallback, data tables, numbers in facts tables |

Alternates if Switzer is unavailable or you want a paid upgrade: *General Sans* (free), *Aeonik* / *Basier Circle* / *Söhne* (paid, closest to the reference). Do **not** substitute Inter or Poppins — Inter reads as a default, Poppins' single-storey `a` breaks the reference's character.

**Serif is a recommendation, not a requirement.** If you prefer a single-family site, use `--font-sans` at `17px/1.7` for Layer 2 body and rely on measure and rules for the sober mood. Decide once (§17, D3) and never mix.

#### 5.2.2 Loading

- Self-host WOFF2. No Google Fonts CDN (privacy + latency + a French audience where GDPR hygiene is noticed).
- `font-display: swap`, preload the sans regular + bold only.
- Subset to `latin` + `latin-ext` (French accents, needed) and the specific glyphs used in the wordmark.
- Total font payload budget: **≤ 120 KB** (§12.1).

#### 5.2.3 Type scale

Fluid, using `clamp()`. Ratio ≈ 1.25 at small sizes, opening to ≈ 1.333 at display sizes.

| Token | Mobile → Desktop | Weight | Tracking | Line height | Use |
|---|---|---|---|---|---|
| `--t-display` | 40 → 76 px | 700 | −0.03em | 1.02 | Home hero name/statement |
| `--t-h1` | 30 → 44 px | 700 | −0.02em | 1.1 | Project page title |
| `--t-h2` | 24 → 30 px | 700 | −0.015em | 1.2 | Card title, section heading |
| `--t-h3` | 19 → 21 px | 600 | −0.01em | 1.3 | Sub-section |
| `--t-lead` | 18 → 21 px | 400 | 0 | 1.55 | Home intro paragraph, project TL;DR |
| `--t-body` | 16 → 17 px | 400 | 0 | 1.65 (sans) / 1.72 (serif) | Body |
| `--t-small` | 14 → 15 px | 400 | 0 | 1.5 | Card description, captions |
| `--t-meta` | 12 → 13 px | 500 | 0.02em | 1.4 | Pill tags, facts table labels, breadcrumbs |
| `--t-mono` | 13 → 14 px | 400 | 0 | 1.6 | Code, figures |

Rules:
- Headings ≥ `--t-h2` MUST use negative tracking. This is the single biggest difference between "designed" and "default".
- Body measure: **max 34em** in Layer 1, **68–72 characters** in Layer 2.
- Never centre a paragraph longer than two lines.
- Numerals: tabular in tables and facts blocks (`font-variant-numeric: tabular-nums`), proportional elsewhere.

### 5.3 Space and layout

#### 5.3.1 Spacing scale (4 px base)

`--space-1: 4px` · `2: 8` · `3: 12` · `4: 16` · `5: 20` · `6: 24` · `8: 32` · `10: 40` · `12: 48` · `14: 56` · `16: 64` · `20: 80` · `24: 96` · `32: 128` · `40: 160`

Section rhythm on home: `--space-32` between major blocks on desktop, `--space-20` on mobile.

#### 5.3.2 Breakpoints

| Token | Min width | Notes |
|---|---|---|
| `sm` | 480 px | Large phone |
| `md` | 768 px | Tablet — rail becomes 1.5 cards visible |
| `lg` | 1024 px | Desktop — rail shows 2.5 cards; Layer 2 gains right-hand TOC |
| `xl` | 1440 px | Layer 2 gains margin sidenotes |
| `2xl` | 1800 px | Max container reached; field grows, content does not |

#### 5.3.3 Containers

- `--container-wide`: 1440 px — home sections, rail viewport (rail itself bleeds past it).
- `--container-doc`: 1180 px — Layer 2 grid total.
- `--container-text`: 720 px — Layer 2 reading column.
- Gutters: 20 px mobile, 32 px `md`, 48 px `lg`, 64 px `xl`.

#### 5.3.4 Layer 2 document grid (`lg` and up)

```
┌──────────┬─────────────────────────────┬──────────────┐
│ 180px    │ 720px                       │ 240px        │
│ sidenote │ reading column              │ sticky TOC   │
│ margin   │                             │              │
└──────────┴─────────────────────────────┴──────────────┘
```
Below `lg`: single column, TOC collapses into a `<details>` block under the title. Figures may bleed into the sidenote margin at `xl` (see §8.2.6).

### 5.4 Radii, borders, elevation

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 28 px | Project cards (matches reference) |
| `--radius-md` | 14 px | Buttons, code blocks, figures |
| `--radius-pill` | 999 px | Tags, CV button |
| `--radius-sm` | 8 px | Inline code, small chips |
| `--border-hair` | 1px solid `--rule` | Layer 2 rules, tables |
| `--border-pill` | 1.25px solid `--ink-900` | Pill tag outline (reference image uses a crisp dark hairline) |

Shadows — soft, low-contrast, never blue-tinted:

| Token | Value (approx.) | Use |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(16,17,19,.04), 0 8px 24px rgba(16,17,19,.06)` | Resting card |
| `--shadow-card-hover` | `0 2px 4px rgba(16,17,19,.05), 0 18px 44px rgba(16,17,19,.10)` | Hovered card |
| `--shadow-ground` | radial, `--green-400` at 22% alpha, blur 40px | The green ground shadow under isometric objects on green cards |
| `--shadow-ground-neutral` | radial, `--ink-900` at 8% alpha, blur 36px | Same, on white cards |

Layer 2 MUST NOT use `--shadow-card`. Elevation is a Layer 1 language only.

### 5.5 Component primitives

#### 5.5.1 Pill tag
Height 34 px · padding `0 --space-4` · `--border-pill` · `--radius-pill` · `--t-meta` · uppercase **off** (sentence case, as in the reference) · background transparent. On green cards the border is `--ink-900`; on white cards the border is `--ink-900` at 85% alpha.

#### 5.5.2 Primary button ("Télécharger le CV")
Height 52 px · `--radius-pill` · background `--ink-900` · text `--paper` · `--t-body` weight 600 · icon (download arrow, 16 px) with `--space-2` gap. Hover: background `--ink-900`, transform `translateY(-2px)`, shadow grows. Active: `translateY(0)`. Focus: 2 px `--green-500` ring at 3 px offset.

#### 5.5.3 Secondary button
Same metrics, background transparent, `1.25px` `--ink-900` border, text `--ink-900`. Hover: background `--ink-900` at 6%.

#### 5.5.4 Link (Layer 2)
`--ink-900` text with a `--green-500` underline at 2 px, offset 3 px. Hover: underline thickens to 3 px and the text shifts to `--green-700` over `--dur-fast`. External links get a 10 px arrow glyph. No colour-only differentiation (accessibility).

#### 5.5.5 Callout (Layer 2)
No box fill. A 3 px `--green-500` left rule, `--space-5` left padding, label in `--t-meta` uppercase `--ink-500`, body in `--t-body`. Variants by label only: `Note`, `Result`, `Assumption`, `Limitation`, `Aside`. Limitation variant uses `--ink-300` rule instead of green — honesty is not an accent colour.

### 5.6 Do / Don't

| Do | Don't |
|---|---|
| Let the green be a *field*, in big calm areas | Use green as a highlight on small text |
| Keep the isometric camera fixed everywhere | Rotate, tilt, or perspective-project the motifs |
| Use one green, four tints of it | Introduce a second hue (blue, teal, lime) |
| Use white space as the luxury signal | Fill space with decorative geometry |
| Let Layer 2 look almost plain | "Brand" Layer 2 with cards and gradients |
| Use shadows only in Layer 1 | Put drop shadows on text, ever |

---

## 6. The isometric illustration system

This is the site's signature and its most defensible asset. It MUST be treated as a system with rules, not as a set of pretty pictures.

### 6.1 Projection and construction rules

- **True isometric, camera locked.** Axes at 30° above horizontal. `transform: rotateX(60deg) rotateZ(-45deg)` in 3D terms, or a 2:1 pixel-ratio 2D construction. The camera NEVER moves — no orbit, no dolly, no perspective. All apparent motion comes from objects translating along the three isometric axes.
- **Unit grid.** Every object is built from a unit cube of side `U`. All positions are integer or half-integer multiples of `U`. Nothing sits off-grid. This is what makes the compositions feel resolved.
- **Stroke.** All edges: `1.5px` `--ink-900`, non-scaling (`vector-effect: non-scaling-stroke`), mitre joins. Edges are drawn on light faces only where needed for legibility; dark faces need no outline against light faces.
- **Face shading — fixed light, from the upper left:**

| Face | On a "light" object | On a "dark" object | On an "accent" object |
|---|---|---|---|
| Top | `--paper` | `--paper` | `--green-200` |
| Left (lit) | `--paper` with hairline | `--paper` | `--green-300` |
| Right (shadow) | `--ink-900` | `--ink-900` | `--ink-900` |
| Inner void | `--ink-900` | `--ink-900` | `--green-300` (glowing void) |

  This exactly reproduces the reference: white-and-black cubes with green accents, giving the illustrations their crisp, printed quality.
- **Ground shadow.** Every composition sits on an invisible ground plane with one soft ellipse-ish shadow, offset down-right by `0.35U`, using `--shadow-ground` on green cards and `--shadow-ground-neutral` on white cards. It MUST track the object's motion — this is 60% of the "satisfying" quality.

### 6.2 The vocabulary of forms

Six primitives only. Every motif is a composition of these.

| Primitive | Description | Semantic use |
|---|---|---|
| **Cube** | 1×1×1 unit | An item, a candidate, a batch, a discrete decision |
| **Slab** | 1×1×0.15, a thin plate | A layer, a stage, a membrane, a constraint |
| **Column** | 1×1×n stack | Accumulation, a column, a queue |
| **Void** | A cube-shaped absence in a solid | An unexplored region, a removed option, a gap |
| **Frame** | A hollow cube (edges only) | A bound, an envelope, a certificate |
| **Ghost** | 30%-opacity cube with dashed edges | A candidate not yet evaluated, a hypothesis |

### 6.3 The vocabulary of operations

Motion is restricted to these. Anything else is off-system.

`translate` along one iso axis · `stack` (fall into place with a settle) · `extrude` (grow along one axis) · `split` (a solid separates into slabs along a plane) · `swap` (two units exchange positions along an arc constrained to the iso plane) · `prune` (a cube dissolves to Ghost, then to nothing, edges last) · `certify` (a Frame closes around a cube, which turns accent green) · `sweep` (a plane passes through the composition, changing what it touches).

### 6.4 Motifs are identity

Each project owns **one motif**, used in five places, always the same geometry:

1. Animated, on its home card.
2. Frozen at its poster frame, in the project page header.
3. Rendered into the project's OG image (1200×630).
4. As the project's entry in the `/projects` grid.
5. OPTIONAL: as a faint watermark on the printed version of the page.

A motif is therefore an **asset with a name**, versioned in the repo, not a one-off decoration.

### 6.5 Motif briefs for the three launch projects

These are design briefs, not implementations. Each MUST read as the *logic of the project made geometric* — never a literal illustration of the equipment.

#### M-01 · RIDGE — *"the certified gap"*
Concept: discrete enumeration converging on a certified optimum.
- Opens on a 3×3×2 lattice of Ghost cubes, faintly outlined.
- A `sweep` plane passes along one axis; touched cubes resolve to solid white.
- Three cubes `prune` away in staggered succession (edges linger 120 ms after the fill dissolves — this detail is the whole charm).
- One remaining cube rises `0.5U`, turns `--green-300`, and a `Frame` closes around it (`certify`), with the frame edges drawing in from the corners.
- Hold 1.2 s at the poster frame. Then the frame opens, the cube settles back, pruned cubes fade back in as Ghosts, and the lattice returns to its initial state.
- **Poster frame:** the certified green cube inside its frame, everything else resolved white. This is the strongest single image on the site — it is also the OG image.

#### M-02 · WFI feasibility — *"two paths, one chosen"*
Concept: comparing a multiple-effect distillation train against a membrane route.
- Two `Column` stacks stand side by side: left is three stacked cubes (the effects — literally staged), right is a set of five thin `Slabs` with gaps (the membrane).
- A single accent cube travels down through the left column, pausing at each stage, then re-enters at the top of the right column and passes through the slabs continuously.
- On the right pass, the slabs light `--green-300` in sequence, and the right stack compresses to a shorter total height than the left.
- Hold. Reset by both stacks returning to equal height simultaneously.
- **Poster frame:** the moment both routes are lit and the height difference is visible.
- This motif directly echoes the "Validate the network" card in the reference image — parallel slabs with a green edge — so it will feel native to the visual language.

#### M-03 · Batch coating optimisation — *"the collapse"*
Concept: a >70 % reduction, made physical.
- A `Column` of ten thin `Slabs` (each = one batch cycle) stands tall.
- A `sweep` marks slabs as removable; marked slabs `prune` in a rapid, rhythmic cascade (staggered 55 ms — the rhythm is the payoff).
- The remaining three slabs settle down onto the ground plane with a 6 % overshoot and one bounce. The ground shadow contracts with them.
- A thin `--green-300` gauge line at the side drops with the stack — the only "chart-like" element permitted anywhere in Layer 1.
- Hold 1.5 s. Reset by the removed slabs re-materialising top-down.
- **Poster frame:** the short green-topped stack next to the ghost outline of its original height.

#### Reserved motifs for future projects
Keep a documented list so future projects don't collide: `orbit-swap` (scheduling), `lattice-fill` (packing/allocation), `flow-split` (network/flowsheet), `staircase` (dynamic programming), `sieve` (screening/HAZOP).

### 6.6 Poster frames

Every motif MUST be designed **poster-frame-first**. The poster frame is:
- the first paint (before JS hydrates),
- the `prefers-reduced-motion` state,
- the OG image,
- the print state,
- the frozen state in the project header.

If a motif is not compelling as a still image, it is rejected — no amount of animation saves it.

### 6.7 Production pipeline

| Stage | Tool | Output |
|---|---|---|
| Construct | Figma with an isometric grid, or SVG by hand from a cube template | Layered SVG, one `<g>` per primitive, semantic ids (`#cube-3-1`, `#frame`) |
| Optimise | SVGO with id-preservation | ≤ 12 KB per motif |
| Animate | CSS `@keyframes` on `<g transform>` + `opacity`, driven by CSS custom properties | No JS required for the loop |
| Fallback | Same SVG, animation-free | Poster frame |
| OG render | Headless screenshot of the poster frame at 1200×630 with title overlay | PNG ≤ 180 KB |

**Format decision:** hand-authored **inline SVG + CSS animation** is the required baseline. Rationale: no runtime dependency, works with reduced-motion trivially, versionable in git, editable in five years, and tiny. *Rive* is an approved upgrade path if a motif genuinely needs physics or interactivity — but only per-motif, and never for all of them. **Lottie is not approved** (large runtime, poor reduced-motion story, JSON is not maintainable by hand). GIF/MP4 are forbidden.

**Hard constraint:** animate `transform` and `opacity` only. Never animate `d`, `width`, `x/y` attributes, or filters — they force layout/paint and will drop frames on a recruiter's mid-range phone.

---

## 7. Motion system

### 7.1 Principles

1. **Motion explains, or it doesn't ship.** Every animation either shows a state change, shows a relationship, or is a motif encoding real project logic.
2. **Slow in, slower out.** Nothing snaps. Nothing bounces more than once.
3. **One thing at a time.** At most one dominant motion per viewport region.
4. **The camera never moves.** No parallax on the motifs, no scroll-jacking, no scroll-driven scrubbing of the hero.
5. **Layer 2 is still.** Motion there is limited to hover feedback, TOC highlighting, and the page-entry fade.

### 7.2 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 90 ms | Colour/opacity feedback on press |
| `--dur-fast` | 160 ms | Hover states, pill highlights |
| `--dur-base` | 260 ms | Card lift, button, TOC |
| `--dur-slow` | 420 ms | Reveals, staggered entrances |
| `--dur-page` | 560 ms | Layer transition (§4.4) |
| `--dur-loop` | 9 s (default) | Motif loop; allowed range 7–13 s |
| `--ease-standard` | `cubic-bezier(.2,0,0,1)` | Default |
| `--ease-entrance` | `cubic-bezier(.16,1,.3,1)` | Things arriving |
| `--ease-exit` | `cubic-bezier(.7,0,.84,0)` | Things leaving |
| `--ease-settle` | `cubic-bezier(.34,1.28,.64,1)` | The single permitted overshoot (motif settles) |
| `--stagger` | 60 ms | Between sequential items |

### 7.3 Loop requirements ("satisfying" made testable)

A motif loop is accepted only if all of the following hold:

- [ ] **Seamless:** the rendered state at `t = 0` is pixel-identical to `t = --dur-loop`. No fade-to-black reset, no visible jump.
- [ ] **One protagonist:** exactly one accent-green element carries the eye through the loop.
- [ ] **Breathing room:** ≥ 15 % of the cycle is a hold at or near the poster frame. Continuous motion reads as anxious.
- [ ] **Rhythm:** staggered events use a consistent interval (55–80 ms) so the cascade reads as a beat.
- [ ] **Shadow coupled:** the ground shadow scales/moves with the object every frame.
- [ ] **Grid-true:** every rest position is on the unit grid.
- [ ] **Reversible read:** the loop makes sense watched from any starting point (a visitor will not see frame 0 first).
- [ ] **60 fps on a 4-year-old mid-range Android**, verified in a throttled profile.
- [ ] Each card's loop has a **desynchronised start offset** (`animation-delay: -Ns`) so adjacent cards never beat in unison.

### 7.4 Rail physics

- Horizontal scroll container with `scroll-snap-type: x mandatory`, `scroll-snap-align: center` on cards.
- Drag-to-scroll on pointer devices with momentum; wheel and trackpad horizontal gestures pass through natively. **Do not hijack vertical wheel into horizontal scroll** — it breaks the page for anyone trying to leave.
- Keyboard: `←`/`→` move one card when the rail has focus; `Tab` moves card-to-card and MUST scroll the focused card into view.
- Progress indicator: a thin `--rule` track with a `--ink-900` thumb below the rail, width proportional to viewport/content ratio. No dots — dots don't scale past six items.
- Edge treatment: 64 px gradient fade from `--field` on both edges at `lg`+, so cards appear to slide under the page edge. On mobile the rail bleeds full-width with a 20 px peek of the next card — the peek is what tells a phone user to swipe.

### 7.5 Entrance choreography (home, first load)

Total budget **900 ms**, once, never repeated on back-navigation.

```
   0 ms  wordmark + CV button          fade, --dur-base
  80 ms  hero line 1                   fade + rise 14px, --ease-entrance
 140 ms  hero line 2
 200 ms  intro paragraph               fade only (no rise — it's a text block)
 300 ms  CTA row                       fade + rise 10px
 420 ms  card 1                        fade + rise 24px, --dur-slow
 480 ms  card 2  (+--stagger)
 540 ms  card 3
 620 ms  motif loops begin, desynchronised
```

Anything below the fold uses a single `IntersectionObserver` reveal at 15 % visibility, `--dur-slow`, fade + 16 px rise, **once**. No re-animation on scroll-up.

### 7.6 Performance guards (mandatory)

- Motifs pause (`animation-play-state: paused`) when their card is > 25 % out of viewport, and when `document.hidden`.
- Maximum **3 concurrent** running motif loops. Beyond three cards, only those intersecting the viewport run.
- Respect `prefers-reduced-motion: reduce` **and** `prefers-reduced-data`: both → poster frames only, everywhere, including the page transition.
- Add a persistent user toggle in the footer: "Réduire les animations" — stored in `localStorage`, overrides everything. This is a courtesy that costs nothing and signals care.

---

## 8. Page specifications

### 8.1 Home (`/`) — Layer 1

Vertical order, top to bottom. Nothing else is permitted on this page.

#### 8.1.1 Header strip
- Left: wordmark — your name in `--font-sans` 600, `--t-body`, tracking −0.01em. Not a logo. Not an icon.
- Right: `Télécharger le CV` primary button (§5.5.2). On mobile it collapses to a pill with the download icon + "CV".
- The strip is **not sticky on home**. It scrolls away. (It is sticky in Layer 2.)

#### 8.1.2 Hero
- `--t-display`, maximum **two lines**, maximum 12 words. It states what you are, not that you are passionate.
  - Draft (FR): *« Ingénieur procédés. J'optimise des procédés avec des méthodes discrètes. »*
  - Draft (EN): *"Process engineer. I optimise processes with discrete methods."*
- Directly beneath: a single **status line** in `--t-meta`, `--ink-500`, containing at most two credential facts (the permitted leakage of §3.3):
  *« Double diplôme EIA–UIASS × IMT Mines Albi · Bourse d'excellence Fondation IMT »*
- No photo in v1.0. (Optional later: a small square portrait at 96 px, top-right of the hero, rounded `--radius-md`. French CVs often carry a photo; the site does not need one. Decide in §17, D5.)

#### 8.1.3 Intro paragraph
- 60–90 words, `--t-lead`, max-width 34em. First person. No adjectives about yourself.
- It MUST answer: what you work on, what kind of problem attracts you, where you are now, what you are looking for. It MUST NOT list schools, dates, or skills.
- Draft (EN, ~75 words):
  > *I'm a process engineering student working at the intersection of process design and discrete optimisation. Most of what interests me starts the same way: a plant has a recipe that works, nobody can say whether it's the best one, and the search space is combinatorial. I've spent the last two years building models and software that answer that question with a certificate rather than a guess. I'm currently completing a double degree at IMT Mines Albi, heading towards research in process systems engineering.*
- A French version is authored separately, not machine-translated (§10).

#### 8.1.4 CTA row
`Télécharger le CV (FR)` primary · `CV (EN)` secondary/text link · `[email]` text link. That is all. No social icon farm — at most a small GitHub and LinkedIn glyph pair, `--ink-500`, 18 px.

#### 8.1.5 Project rail
- Section label above: `Projets` in `--t-meta`, `--ink-500`, with a 1 px `--rule` line running to the right edge.
- Card anatomy (fixed, in this order — matching the reference image):

```
┌─────────────────────────────────┐
│ [Pill tag]                      │  ← --space-6 inset
│                                 │
│        [ Motif animation ]      │  ← square, ~66% of card width, optically centred
│                                 │
│                                 │
│ Card title            --t-h2    │
│ 2–3 line description  --t-small │
│                                 │
│ Lire l'analyse →      --t-meta  │  ← appears/slides in on hover; always visible on touch
└─────────────────────────────────┘
```
- Card size: `380 × 560` at `lg`, `320 × 500` at `md`, `86vw × 480` at `sm`. Gap `--space-6`.
- Fill alternates green/white (§5.1.4).
- Hover (pointer devices only): lift `translateY(-6px)`, shadow → `--shadow-card-hover`, motif loop speeds to 1.15×, `--dur-base`. Nothing else moves. No tilt, no glare, no 3D transform.
- The **entire card is one link**. No nested interactive elements.
- **Scaling rule:** the rail shows a maximum of **6** cards. At 7+, the last slot becomes a "Voir tous les projets →" card in `--field-deep` and `/projects` enters the picture.
- **Ordering:** manual `order` field in frontmatter (§9.1), not date — your best work is not necessarily your newest.

#### 8.1.6 Writing teaser
- Label `Écrits` in the same style as `Projets`.
- Three most recent pieces as plain rows: title (`--t-h3`), one-line description (`--t-small`, `--ink-500`), date (`--t-meta`, right-aligned, tabular). Separated by `--rule` hairlines.
- **Deliberately undesigned.** The visual drop between the rail and this list is the first hint of Layer 2. It prepares the mood switch.
- `Tous les écrits →` link at the end. Hidden entirely if there are zero published pieces (do not ship an empty section).

#### 8.1.7 Footer
- Band in `--field-deep`, `--space-20` vertical padding.
- Left: `[email]` as a large-ish text link (`--t-h3`) — the primary contact method. Right: GitHub · LinkedIn · ORCID (when it exists) · RSS.
- Bottom row `--t-meta` `--ink-500`: `© 2026 [Your Name]` · `Réduire les animations` toggle · `Voir le code de ce site` (GitHub link — a quiet credibility signal for Persona B).

### 8.2 Project page (`/projects/[slug]`) — Layer 2

#### 8.2.1 Header block
- Sticky slim bar (§3.2).
- Breadcrumb `Projets / RIDGE`, `--t-meta`.
- `--t-h1` title. Below it, a one-sentence subtitle in `--t-lead`, `--ink-700`.
- The frozen motif poster frame, 200 px square, right-aligned at `lg`+, above the title on mobile. It is the visual bridge from the card.
- A `--rule` hairline closes the header block.

#### 8.2.2 Facts table
Immediately after the header. Two columns, `--t-meta` labels in `--ink-500`, values in `--t-body`. Mono for anything numeric.

| Row | Example content |
|---|---|
| Context | Independent project / Internship, [organisation type] |
| Period | Nov 2025 – Jul 2026 |
| Role | Sole author: formulation, implementation, validation |
| Domain | Freeze-drying — primary drying |
| Methods | MILP, exhaustive enumeration with optimality certificate, [others] |
| Stack | Python, NumPy, [solver], pytest, Linux |
| Status | Released, open source |
| Artifacts | Repository · Documentation · Report (PDF) |

This block MUST be scannable in 15 seconds. It is the single most-read element for Persona B.

#### 8.2.3 TL;DR
A callout at the top: 3–5 bullets, each ≤ 20 words, stating problem, approach, result, and honest limitation. Written last, always.

#### 8.2.4 The eight mandatory questions
Every project page MUST answer all eight, in this order. Headings may be reworded; the sequence may not change.

1. **What is the problem, in industrial terms?** Who has it, what it costs.
2. **Why is it hard?** The reason the obvious approach fails — combinatorics, coupling, data scarcity, safety envelope.
3. **What did I actually do?** Scope and boundary, stated plainly, including what you did *not* do.
4. **The formulation.** Variables, objective, constraints, assumptions — explicit. Equations where they clarify.
5. **Implementation.** Architecture, key data structures, what made it fast/tractable, what you'd rewrite.
6. **Results.** Numbers with units and uncertainty. At least one figure. No unlabelled axes, ever.
7. **Validation.** How you know it's right — against what, with what error. If it wasn't validated, say so here.
8. **Limitations and next steps.** The section that separates an engineer from a marketer. Non-negotiable.

Optionally a 9th: **What I'd do differently.** Strongly encouraged — supervisors read this section first.

#### 8.2.5 Body typography
- Serif body at `--t-body` (or the single-family alternative, §5.2.1).
- `h2` numbered (`1.`, `2.` …) via CSS counters, with a `--rule` above and `--space-14` of top margin. Numbering is the strongest single "technical document" signal available and costs nothing.
- Paragraph spacing `--space-5`; no first-line indent.
- Inline code: `--font-mono`, `--t-mono`, `--green-050` background, `--radius-sm`, `2px 5px` padding.
- Code blocks: `--paper` on a `--border-hair`, `--radius-md`, optional filename chip in the top-left, no traffic-light decorations, no line numbers unless referenced in prose. Syntax highlighting: a muted theme using `--ink-900`/`--ink-500`/`--green-700` only. Copy button, top-right, appears on hover.
- Equations: KaTeX, display equations numbered on the right, referenced as `(3)` in prose.

#### 8.2.6 Figures
- Full reading-column width by default; at `xl` a figure MAY bleed 180 px into the left sidenote margin.
- Caption below, `--t-small`, `--ink-500`, prefixed `Figure 1 —` via counter.
- Charts MUST use the site palette: series 1 `--green-500`, series 2 `--ink-900`, series 3 `--ink-500`, series 4 `--green-700`; grid lines `--rule`. Never a rainbow default palette.
- Every chart MUST have axis labels with units. This is a hard rejection criterion.
- Images get `loading="lazy"`, explicit dimensions, and meaningful `alt`.

#### 8.2.7 Sidenotes
At `xl`, margin notes in the left 180 px column, `--t-small`, `--ink-500`, aligned to their reference point. Below `xl` they become inline `<details>` or footnotes. Use them for asides that would break the argument's flow — a very Quarto/Tufte move that reads as scholarly without costing legibility.

#### 8.2.8 Footer of a project page
- Artifacts block, repeated: large links to repo / PDF / docs.
- `Écrit en [month year] · Dernière mise à jour [date]`.
- Next/previous project navigation with the neighbouring motifs' poster frames at 64 px.
- A single-line contact prompt: *« Des questions sur ce travail ? [email] »*

### 8.3 Writing (`/writing`, `/writing/[slug]`)

- Index: reverse chronological list, grouped by year, each row = title, one-line description, date, and 1–2 tags. No cards, no images, no excerpts longer than one line. It should look like a bibliography.
- Article template: identical to the project template minus the facts table and the eight questions. Retains numbering, sidenotes, figures, callouts.
- Suggested first pieces (each one is something a CV cannot hold):
  - Why a certificate of optimality matters more than a good solution, in process design.
  - Multiple-effect distillation vs. ultrafiltration for WFI: how to structure the comparison (methodology, not the client's numbers).
  - What actually made a batch coating cycle 70 % shorter — and why the model was the easy part.
  - Notes on doing serious software work alongside a full course load.
- **Confidentiality rule:** anything from an internship is published as *method*, never as client data. Add a standing line to the site's writing template: *« Les données industrielles sont anonymisées ou omises. »* Get explicit permission before publishing any figure derived from employer data.

### 8.4 CV page (`/cv`)
Minimal. Title, two download buttons (FR/EN), file size and date, and an embedded PDF preview at `lg`+ (`<object>` with a link fallback). Exists so that "envoie-moi ton CV" can be answered with a URL.

**File naming (matters for HR filing):** `NOM-Prenom-CV-FR-2026-07.pdf`. Uppercase surname first is the French convention. Regenerate the date suffix on each update; keep a stable redirect at `/cv/latest-fr.pdf`.

### 8.5 404
The `prune` operation from the motif system, looping: a cube dissolves, the frame closes on nothing. `Cette page n'existe pas.` + link home. Ten minutes of work, disproportionate charm.

---

## 9. Content model

Scalability lives here. Layout code must never be edited to add content.

### 9.1 Project frontmatter schema

```yaml
# content/projects/ridge.md
slug: ridge                     # string, required, immutable
title: RIDGE                    # string, required, ≤ 28 chars (card constraint)
subtitle: >                     # string, required, ≤ 120 chars
  Gap-certified enumeration for primary drying recipe design
tag: Optimisation               # enum, required — see controlled vocabulary below
order: 1                        # int, required — rail position
featured: true                  # bool — appears in the home rail at all
motif: m-01-certified-gap       # string, required — asset id in /motifs
motifColor: green               # enum: green | white — card fill
card:
  description: >                # string, required, ≤ 165 chars — 2–3 lines on the card
    An open-source solver that returns a primary-drying recipe together with
    a proof that nothing better exists in the search space.
facts:                          # ordered map, rendered as the facts table
  context: Independent project
  period: Nov 2025 – Jul 2026
  role: Sole author
  domain: Freeze-drying — primary drying
  methods: [MILP, Certified enumeration]
  stack: [Python, NumPy, pytest, Linux]
  status: Released
artifacts:                      # array, optional
  - { label: Repository, url: "...", type: repo }
  - { label: Documentation, url: "...", type: docs }
  - { label: Technical report, url: "...", type: pdf }
og:
  image: /og/ridge.png          # auto-generated, overridable
seo:
  description: ...              # ≤ 155 chars
dates:
  published: 2026-07-15
  updated: 2026-07-31
draft: false
```

**Controlled tag vocabulary** (max 6, ever — a taxonomy that grows is a taxonomy that failed):
`Optimisation` · `Modélisation` · `Étude technico-économique` · `Logiciel` · `Recherche` · `Procédés`

### 9.2 Writing frontmatter schema

```yaml
slug: certificates-vs-solutions
title: A solution is not an answer
description: >                  # one line, used on the index
  Why optimality certificates change what you can promise an industrial client.
date: 2026-08-12
updated: 2026-08-14
tags: [Optimisation, Méthode]   # from the same controlled vocabulary
readingTime: auto               # computed
draft: false
related: [ridge]                # project slugs — renders a cross-link block
```

### 9.3 Site configuration

A single `site.config.ts`/`.yaml` holding: name, tagline FR/EN, email, social URLs, CV file paths and versions, the animation-reduction default, and the feature flags `showWriting`, `showProjectsIndex`, `showAbout`. **No string that appears on the site is hardcoded in a component.**

### 9.4 Validation

Content schemas MUST be validated at build time (Zod / Astro content collections / equivalent). A build MUST fail if: a required field is missing, `card.description` exceeds its length, a `tag` is outside the vocabulary, a `motif` id has no matching asset, or two projects share an `order`. This is what keeps the site coherent when you add a project at 2 a.m.

---

## 10. Language, copy and tone

### 10.1 Tone rules

| Layer | Voice | Rules |
|---|---|---|
| 1 | First person, plain, confident, short sentences | No adjectives about yourself ("passionate", "rigorous", "detail-oriented"). State what you did; let the reader draw the adjective. No exclamation marks. No "welcome to my portfolio". |
| 2 | First person, technical, precise | Active voice. Quantities with units. Hedge honestly ("within ±8 % of the measured value") rather than vaguely ("very accurate"). Define notation before using it. |

**Banned across the whole site:** "passionate about", "cutting-edge", "leveraging", "solutions" as a noun, "journey", "let's connect", stock photos, testimonials, a skills radar chart.

### 10.2 The French dimension

Persona A is French and reads presentation as a signal of seriousness. Concretely, this means:

- **French must be the default language of Layer 1.** A French recruiter landing on an English-only site of a candidate applying to a French school reads it as a small misalignment. Layer 1 in French costs ~300 words.
- Typography must be **French-correct**: narrow non-breaking spaces before `:` `;` `!` `?`, guillemets `« »` with inside spacing, `œ` ligature, accented capitals (`École`, not `Ecole`). Set `lang="fr"` on the root so the browser hyphenates and quotes correctly. This detail is noticed by exactly the audience you are targeting.
- Dates in French pages: `12 août 2026`. Decimal separator: comma in French prose, point in code and figures.
- The CV in French is the primary artifact; the English CV is secondary but must exist for Persona B and international applications.

### 10.3 Bilingual strategy — phased

- **v1.0:** Layer 1 in French. Layer 2 (projects, writing) in **English** — this is the working language of the technical audience and of research, and translating technical deep-dives is a maintenance trap. Add a small `EN` marker on project cards so a French reader isn't surprised.
- **v1.1 (optional):** full FR/EN toggle for Layer 1 only, routes `/` (FR) and `/en/`. `hreflang` tags on both.
- **Never:** machine-translate technical pages. Half-translated depth is worse than mono-lingual depth.

### 10.4 Copy inventory (every string on the site)

Home: hero (2 lines) · status line (1) · intro (75 words) · 3 CTA labels · section labels ×2 · 3 card titles + 3 descriptions · footer links · legal line.
**Total ≈ 350 words.** Write them in one sitting, then rewrite them a week later. This is the highest-leverage hour of the entire project.

---

## 11. Technical architecture

### 11.1 Recommended stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Astro** | Ships zero JS by default (Persona A's phone), first-class Markdown/MDX content collections with schema validation (§9.4), islands only where needed (the rail), View Transitions built in (§4.4). It is the closest thing to "a static site that scales into an app". |
| Content | Markdown/MDX in `content/` | Editable in any editor, diff-able, portable. |
| Styling | CSS with custom properties, or Tailwind with the tokens in §5 mapped into the theme | Either is fine. If Tailwind: the tokens MUST be in `theme`, arbitrary values are forbidden in components. |
| Motion | CSS keyframes + Web Animations API for the rail | No animation library needed at v1. |
| Math | KaTeX at build time | No client runtime. |
| Syntax highlighting | Shiki at build time | Zero client JS. |
| Hosting | Netlify / Vercel / Cloudflare Pages, free tier | Push-to-deploy, previews on PRs. |
| Domain | `[prenom-nom].com` or `.fr` | `.fr` reads well to a French audience; `.com` is safer long-term. Buy both, redirect one. **Avoid `.dev`/`.io`** — they signal web dev, and you are not one. |
| Analytics | Plausible or Umami (self-hostable, cookieless) | GDPR-clean, no banner needed, and no cookie banner is itself a design decision. **Google Analytics is not approved** — it requires a consent banner in France and pollutes the first impression. |
| Forms | None. `mailto:` only. | A contact form invites spam and adds a backend. Email is what both personas will use anyway. |

**Alternatives, if you prefer:** Next.js (heavier, justified only if you later add interactive demos of your solvers — a real possibility worth keeping in mind), Eleventy (lighter, less structure), or Quarto itself (excellent for Layer 2, poor for Layer 1 — do not try to make Quarto produce the home page).

### 11.2 Repository structure

```
/
├─ src/
│  ├─ layouts/        BaseLayout, SurfaceLayout (L1), DocumentLayout (L2)
│  ├─ components/
│  │   ├─ surface/    Hero, ProjectRail, ProjectCard, WritingTeaser, Footer
│  │   ├─ document/   FactsTable, Callout, Figure, Sidenote, Toc, ArtifactList
│  │   └─ common/     Button, PillTag, Wordmark, MotifFrame
│  ├─ motifs/         m-01-certified-gap.astro (inline SVG + scoped keyframes)
│  ├─ styles/         tokens.css, base.css, document.css, print.css
│  └─ pages/
├─ content/
│  ├─ projects/*.md
│  └─ writing/*.md
├─ public/
│  ├─ cv/  fonts/  og/  figures/
├─ site.config.yaml
└─ docs/SPEC.md      ← this document, committed
```

### 11.3 Events worth tracking (privacy-preserving, aggregate only)

`cv_download` (with `lang` property) · `project_open` (with `slug`) · `artifact_click` (with `type`) · `rail_engaged`. Nothing else. No session recording, no heatmaps, no per-visitor identity. The single number that matters is: **how many CV downloads per 100 home visits.**

---

## 12. Quality requirements

### 12.1 Performance budgets (enforced in CI via Lighthouse CI)

| Metric | Budget |
|---|---|
| LCP (mobile, throttled 4G) | ≤ 1.8 s |
| CLS | ≤ 0.02 (motifs have reserved square boxes — no layout shift) |
| INP | ≤ 150 ms |
| Initial JS shipped on `/` | ≤ 40 KB gzipped |
| Initial JS on a project page | ≤ 10 KB gzipped |
| Total fonts | ≤ 120 KB |
| Each motif SVG | ≤ 12 KB |
| Home page total transfer | ≤ 450 KB |
| Lighthouse Performance / A11y / Best practices / SEO | ≥ 95 / 100 / 100 / 100 |

### 12.2 Accessibility (WCAG 2.2 AA, non-negotiable)

- Contrast: body text on all backgrounds ≥ 4.5:1; large text ≥ 3:1. Verify `--ink-900` on `--green-300` (passes comfortably) and `--ink-500` on `--field` (verify — darken if it fails).
- Every interactive element has a visible focus state: 2 px `--green-500` ring, 3 px offset, never `outline: none`.
- The rail is fully keyboard-operable (§7.4) and announced with `role="region"` + `aria-label="Projets"`.
- Motifs are decorative → `aria-hidden="true"`, `role="presentation"`. The card's text carries the meaning.
- `prefers-reduced-motion` honoured everywhere, including the page transition and hover lifts.
- Semantic headings in strict order, one `h1` per page.
- The whole site must be usable and readable **with JavaScript disabled** — Layer 2 completely, Layer 1 minus the rail's drag (native scroll still works).
- Skip-to-content link as the first focusable element.
- Test with VoiceOver or NVDA once before launch. Once is enough to catch 90 % of problems.

### 12.3 SEO and sharing

- Unique `<title>` and meta description per page. Title format: `RIDGE — [Your Name]`.
- OG image per page from the motif poster frame (§6.7) with title text overlaid — shared links become recognisable.
- `schema.org/Person` JSON-LD on `/` with `name`, `jobTitle`, `alumniOf`, `knowsAbout`, `sameAs` (GitHub, LinkedIn, ORCID). This is what makes you findable as a researcher later.
- `schema.org/ScholarlyArticle` or `TechArticle` on project and writing pages.
- Canonical URLs, `sitemap.xml`, RSS for `/writing`.
- **A print stylesheet is required** for project pages: hide chrome and the TOC, black on white, show link URLs after link text, keep figures. Supervisors print things.

### 12.4 Browser support
Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+; Android Chrome. Graceful degradation for View Transitions and `:has()`. No IE, no polyfill budget.

---

## 13. Authoring workflow — adding a project

The target is **< 45 minutes** excluding motif design.

1. `content/projects/new-slug.md` — copy the template, fill the frontmatter (§9.1). *(10 min)*
2. Write the eight sections (§8.2.4). This is the real work and it belongs to you, not the build. *(the bulk)*
3. Drop figures in `public/figures/[slug]/`, reference them with the `Figure` component. *(5 min)*
4. Motif: either reuse a reserved motif from §6.5 or design a new one. *(2–4 h, once, separate from publishing)*
5. `npm run build` — schema validation fails loudly if anything is missing.
6. OG image is generated automatically at build.
7. Push. Preview deploy. Merge.

**Draft workflow:** `draft: true` excludes from build in production but renders in preview deploys. Write in public-adjacent, publish when ready.

---

## 14. Roadmap

| Phase | Scope | Definition of done |
|---|---|---|
| **v0.5 — Skeleton** (week 1) | Tokens, layouts, home with static poster frames, one project page with real content, CV download. Deploy to a real domain. | Someone can be sent the link today and it works. |
| **v1.0 — Launch** (weeks 2–3) | 3 motifs animated, rail interaction complete, all 3 project pages written, FR copy final, OG images, a11y + perf budgets met. | Every acceptance criterion in §15 passes. |
| **v1.1 — Depth** (month 2) | `/writing` with 2–3 pieces, sidenotes, print stylesheet, RSS, FR/EN toggle for Layer 1. | Writing index stands alone as a reason to visit. |
| **v1.2 — Research posture** (when relevant) | ORCID, publications list on `/about`, BibTeX export, links to preprints. | A supervisor can cite you. |
| **v2 — Interactive** (opportunistic) | One embedded interactive demo of a solver (WASM or a hosted endpoint) inside a project page. | It demonstrates something a figure cannot. Not before the rest is finished. |

**Ship v0.5 before designing motif M-03.** A perfect unlaunched site helps nobody, and you are about to move countries.

---

## 15. Acceptance criteria

Launch is blocked until every box is ticked.

**Function**
- [ ] CV (FR) downloads in one click from home, on mobile, above the fold.
- [ ] CV (EN) reachable in ≤ 2 clicks.
- [ ] All three project cards navigate to complete project pages.
- [ ] Back-navigation restores rail scroll position and focus.
- [ ] Every external link opens correctly; no 404s (link-check in CI).
- [ ] Site works with JS disabled (Layer 2 fully, Layer 1 readable).

**Content**
- [ ] Home contains **zero** education/skills/timeline sections (§3.3 audit).
- [ ] Each project answers all eight mandatory questions.
- [ ] Every figure has axis labels with units and a numbered caption.
- [ ] No confidential employer data published.
- [ ] French copy proofread by a native reader; typographic spacing correct.

**Design**
- [ ] No colour outside the token set appears anywhere.
- [ ] All three motifs pass the eight loop criteria in §7.3.
- [ ] Every motif poster frame stands alone as a still image.
- [ ] Layer 2 contains no card, no gradient, no drop shadow.
- [ ] Heading tracking is negative at `--t-h2` and above.

**Quality**
- [ ] All §12.1 budgets met on a throttled mobile profile.
- [ ] Lighthouse a11y = 100; manual keyboard pass complete; one screen-reader pass done.
- [ ] `prefers-reduced-motion` verified on every animated surface.
- [ ] OG cards render correctly in LinkedIn's and Slack's preview inspectors.
- [ ] Project page prints legibly on A4.

---

## 16. Risks and anti-patterns

| Risk | Why it happens | Mitigation |
|---|---|---|
| **Motif scope creep** — each new project needs a bespoke 4-hour animation | The system is fun to work in | The reserved motif list (§6.5); a project may launch with a static poster frame and gain animation later |
| **Layer 2 drifting toward Layer 1** — someone adds a gradient card to a project page | Consistency instinct | §4.3 invariants are the *only* shared elements; review against §15 |
| **The CV and the site diverging** | Two sources of truth | The CV is the source of truth for facts; the site never restates them. Version the CV in the repo. |
| **Empty writing section** | Ambition outpacing time | `showWriting` feature flag; the section is hidden until 2 pieces exist |
| **Over-animating** | New capability | Hard cap: 3 concurrent loops, zero motion in Layer 2 |
| **Publishing internship data** | Enthusiasm | Method-only rule (§8.3), explicit permission before any employer-derived figure |
| **Perfectionism blocking launch** | Everything above | v0.5 ships in week 1, with placeholder motifs if necessary |
| **Framework churn in 3 years** | Ecosystem | Content is plain Markdown + YAML; a migration is a day, not a rewrite |

---

## 17. Open decisions

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Domain | `prenom-nom.com` / `.fr` | Buy both, serve `.com`, redirect `.fr` |
| D2 | Wordmark | Name in text vs. a small isometric mark | Text at v1; a 3-cube mark can come later and must be built from the same primitives |
| D3 | Layer 2 body face | Serif (Source Serif 4) vs. single-family sans | Serif — the mood switch is worth one extra font file |
| D4 | Sans family | Switzer (free) vs. a paid grotesque | Switzer; revisit only if the site outgrows it |
| D5 | Portrait photo on home | Yes / no | No on the site; yes on the French CV (local convention) |
| D6 | Layer 2 language at launch | EN / FR / both | EN, with an `EN` marker on cards |
| D7 | Publish the site's source | Public repo / private | Public — it is a credibility artifact for Persona B |
| D8 | Third project's public depth | Full breakdown vs. method-only | Method-only until employer permission is explicit |
| D9 | `/about` page | v1 / later | Later — it competes with the CV |

---

## Appendix A — Token summary (implementation reference)

```
COLOUR   green-050 #F1FDF2 · green-100 #DFFAE2 · green-200 #C2F5C9
         green-300 #A3EFAE · green-400 #7FE18E · green-500 #48C862 · green-700 #1E7A38
         ink-900 #101113 · ink-700 #3A3D42 · ink-500 #6B7079 · ink-300 #B9BDC4
         rule #E3E5E8 · paper #FFFFFF · field #F2F2F1 · field-deep #E8E8E7

TYPE     sans Switzer · serif Source Serif 4 · mono JetBrains Mono
         display 40→76/700/-0.03em · h1 30→44/700/-0.02em · h2 24→30/700/-0.015em
         h3 19→21/600 · lead 18→21/400/1.55 · body 16→17/400/1.65
         small 14→15 · meta 12→13/500/+0.02em · mono 13→14

SPACE    4 8 12 16 20 24 32 40 48 56 64 80 96 128 160
RADIUS   card 28 · md 14 · sm 8 · pill 999
MOTION   instant 90 · fast 160 · base 260 · slow 420 · page 560 · loop 9000 · stagger 60
EASE     standard (.2,0,0,1) · entrance (.16,1,.3,1) · exit (.7,0,.84,0) · settle (.34,1.28,.64,1)
GRID     sidenote 180 | text 720 | toc 240 · containers 1440 / 1180 / 720
BREAKS   480 · 768 · 1024 · 1440 · 1800
```

## Appendix B — Filled example: the RIDGE card

```
Pill tag:     Optimisation
Motif:        M-01 · certified gap
Fill:         green (position 1)
Title:        RIDGE
Description:  Un solveur open source qui renvoie une recette de lyophilisation
              accompagnée de la preuve qu'aucune meilleure n'existe.
              (EN) An open-source solver that returns a freeze-drying recipe
              together with a proof that nothing better exists.
CTA:          Lire l'analyse →
Links to:     /projects/ridge
OG image:     poster frame — green cube inside a closing frame
```

## Appendix C — Reference image reading

The uploaded reference establishes, and this spec preserves:

- Light grey page field; cards alternating saturated-green and pure white.
- Card radius ≈ 28 px, generous internal padding, content bottom-aligned.
- Outlined pill tag, sentence case, top-left of the card.
- Bold grotesque title, tight tracking, followed by a short 3-line description at roughly half the title's weight and size.
- Isometric compositions built from unit cubes and thin slabs: white tops and lit faces, solid black shadow faces, one or two green accent faces, thin dark outlines.
- A soft green ground shadow beneath each composition — the element that makes the objects feel placed rather than pasted.
- No gradients in the illustrations themselves; the gradient lives in the card fill only.

**Deliberate divergences:** the reference is a documentation site for a product; this is a personal site. Consequences — the illustration becomes *semantic* (each motif encodes a project's logic rather than a generic abstraction), the pill tag becomes a real taxonomy rather than an audience label, and the whole system gains a second, sober layer underneath that the reference does not have.

---

*End of specification. Committed at `docs/SPEC.md`; amendments go through the same document rather than into code comments.*
