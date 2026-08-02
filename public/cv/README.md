# Put the CV PDFs here

Two files, named for the confirmed order (given name Hamza, surname Charif):

```
CHARIF-Hamza-CV-FR-YYYY-MM.pdf
CHARIF-Hamza-CV-EN-YYYY-MM.pdf
```

Uppercase surname first is the French filing convention and it matters: Persona
A downloads this file and drops it into a folder with forty others (SPEC §8.4).

Regenerate the `YYYY-MM` suffix on every update, and keep stable redirects at
`/cv/latest-fr.pdf` and `/cv/latest-en.pdf` so an old link never dies.

Then, in `site.config.yaml`, flip `available` and point the entries at the files.
While `available` is false they deliberately address `/cv` itself, so the CTAs
lead to the status page rather than to a 404:

```yaml
cv:
  available: true
  fr:
    href: /cv/CHARIF-Hamza-CV-FR-2026-09.pdf
    latest: /cv/latest-fr.pdf
    size: '312 Ko'
    updated: 2026-09
```

That one flip also restores the `download` attribute and the download icon on
the home and `/cv` buttons, and switches `/cv` from the "not online yet" note to
the embedded preview. Until then the CV is still reachable in one click from
home, which is what success criterion S1 actually requires.

**The CV is the source of truth for facts the site deliberately does not
restate**: education, ranking, scholarships, internship chronology, skill
lists, language levels (§3.3). Version it here so the two can never diverge
(§16).
