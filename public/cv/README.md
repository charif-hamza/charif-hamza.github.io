# Put the CV PDFs here

Two files, named exactly as declared in `site.config.yaml`:

```
HAMZA-Charif-CV-FR-2026-07.pdf
HAMZA-Charif-CV-EN-2026-07.pdf
```

Uppercase surname first is the French filing convention and it matters: Persona
A downloads this file and drops it into a folder with forty others (SPEC §8.4).
Confirm the surname before generating them — see `docs/TODO.md` T5.

Regenerate the `YYYY-MM` suffix on every update, and keep stable redirects at
`/cv/latest-fr.pdf` and `/cv/latest-en.pdf` so an old link never dies.

Then, in `site.config.yaml`:

```yaml
cv:
  available: true
  fr: { size: '312 Ko', updated: 2026-07 }
```

Until `available` is true, `/cv` renders an explicit note instead of a broken
PDF viewer. The download buttons keep rendering regardless, because success
criterion S1 requires the CV to be reachable in one click from anywhere.

**The CV is the source of truth for facts the site deliberately does not
restate** — education, ranking, scholarships, internship chronology, skill
lists, language levels (§3.3). Version it here so the two can never diverge
(§16).
