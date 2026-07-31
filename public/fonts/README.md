# Put the font files here

Self-hosted WOFF2 only. No Google Fonts CDN — latency, and a French audience
where GDPR hygiene is noticed (SPEC §5.2.2).

```
switzer-400.woff2            Switzer Regular       Fontshare, free
switzer-500.woff2            Switzer Medium
switzer-600.woff2            Switzer Semibold
switzer-700.woff2            Switzer Bold
source-serif-4.woff2         Source Serif 4 variable 200–900, OFL
source-serif-4-italic.woff2
jetbrains-mono-400.woff2     JetBrains Mono Regular, OFL
```

Subset to `latin` + `latin-ext`. The French accents are not optional, and
neither are accented capitals — `École`, not `Ecole`.

Total payload budget: **120 KB** (§12.1). `npm run budgets` measures it.

Then set `fonts.installed: true` in `site.config.yaml`, which switches on the
preload hints for the sans regular and bold.

Until these files exist the site runs on the fallback stacks in `tokens.css`,
which are real stacks rather than a bare `sans-serif`, and every build prints
one Vite warning per missing file. Those warnings are the reminder.

Do **not** substitute Inter — it reads as a default — or Poppins, whose
single-storey `a` breaks the character of the reference (§5.2.1).
