/**
 * Motif checks — SPEC §6.1, §7.3.
 *
 * §7.3 made "satisfying" testable with eight criteria written for looping
 * motifs. As of v0.6 the motifs are stills (see src/motifs/iso.js), so the
 * three loop criteria this script used to prove — seamless, desynchronised,
 * poster frame inside the loop — no longer have anything to prove. What
 * replaces them are the properties a still has to have instead:
 *
 *   1. Static        no motif emits a keyframe or an animation, anywhere
 *   2. Grid-true     every vertex is on the isometric unit grid (§6.1)
 *   3. One accent    exactly one accent object per composition (§7.3)
 *   4. Unique ids    <defs> ids are per-instance, so five uses of one motif on
 *                    one page cannot cross-wire each other's gradients
 *
 * What is left is genuinely manual and is listed in docs/TODO.md: whether the
 * composition reads as the idea it is named after.
 *
 * Usage: npm run motifs   (after npm run build)
 */
import { readFileSync, existsSync } from 'node:fs';

const DIST = new URL('../dist/', import.meta.url).pathname;
const U = 24;
const COS30 = Math.sqrt(3) / 2;

const problems = [];
const notes = [];

if (!existsSync(`${DIST}index.html`)) {
	console.error('No dist/ — run `npm run build` first.');
	process.exit(1);
}

const pages = ['index.html', '404.html', 'projects/index.html'];
const read = (page) => (existsSync(DIST + page) ? readFileSync(DIST + page, 'utf8') : null);

/* ------------------------------------------------------------------------
   1. Static.

   The motifs carry no motion of their own; the rail carries all of it (§7.4).
   A stray @keyframes prefixed with a motif id means an old loop survived a
   refactor, and a paused loop is still bytes on the LCP path.
   ------------------------------------------------------------------------ */
{
	let found = 0;
	for (const page of pages) {
		const html = read(page);
		if (!html) continue;
		for (const match of html.matchAll(/@keyframes\s+(m\d+[A-Za-z0-9_-]*)/g)) {
			problems.push(`${match[1]}: a motif keyframe survived the still refactor (${page})`);
			found++;
		}
	}
	if (found === 0) notes.push(`static: no motif keyframes on ${pages.length} surfaces`);
}

/* ------------------------------------------------------------------------
   2. Grid-true vertices.

   Inverting the projection: sx/(U cos30) is (x - y) and sy/U is (x+y)/2 - z.
   On the quarter grid the first is a multiple of 0.25 and the second of
   0.125. Anything else is off-grid, which is what makes a composition feel
   unresolved (§6.1).

   Only face polygons are checked. The ground plate is a blurred shadow drawn
   with quadratic corners and is deliberately not on the grid.
   ------------------------------------------------------------------------ */
{
	let checked = 0;
	const offGrid = new Set();
	const isMultiple = (value, step) => Math.abs(value / step - Math.round(value / step)) < 1e-3;

	for (const page of pages) {
		const html = read(page);
		if (!html) continue;

		for (const face of html.matchAll(/<polygon class="iso-face--[a-z]+" points="([^"]+)"/g)) {
			for (const point of face[1].trim().split(/\s+/)) {
				const [sx, sy] = point.split(',').map(Number);
				if (!isMultiple(sx / (U * COS30), 0.25) || !isMultiple(sy / U, 0.125)) {
					offGrid.add(`off-grid vertex at (${sx}, ${sy}) — see §6.1 unit grid`);
				}
				checked++;
			}
		}
	}

	for (const entry of offGrid) problems.push(entry);
	if (offGrid.size === 0) notes.push(`grid: ${checked} vertices, all on the isometric unit grid`);
}

/* ------------------------------------------------------------------------
   3. One protagonist (§7.3).

   Every motif is allowed exactly one full-strength accent object, whether it
   is drawn as a solid (iso--accent) or seen edge-on (iso--accent-edge). The
   quiet --accent-soft material does not count against it; that is what it is
   for.
   ------------------------------------------------------------------------ */
{
	const html = read('index.html');
	const svgs = [...html.matchAll(/<svg[^>]*class="[^"]*\bmotif\b[^"]*"[\s\S]*?<\/svg>/g)].map((m) => m[0]);

	if (svgs.length === 0) problems.push('no motifs found on / — is the rail rendering?');

	for (const [i, svg] of svgs.entries()) {
		const accents = (svg.match(/class="iso iso--accent(?:-edge)?"/g) ?? []).length;
		if (accents !== 1) {
			problems.push(`motif ${i + 1} on / has ${accents} accent objects — §7.3 allows exactly one`);
		}
	}
	if (svgs.length) notes.push(`accent: ${svgs.length} motifs on /, one protagonist each`);
}

/* ------------------------------------------------------------------------
   4. Unique <defs> ids across a page.
   ------------------------------------------------------------------------ */
{
	for (const page of pages) {
		const html = read(page);
		if (!html) continue;
		const ids = [...html.matchAll(/\sid="(iso\d+-[a-z]+)"/g)].map((m) => m[1]);
		const unique = new Set(ids);
		if (ids.length !== unique.size) {
			problems.push(`${page}: ${ids.length - unique.size} duplicate motif <defs> id(s)`);
		}
	}
	if (!problems.some((p) => p.includes('duplicate'))) notes.push('defs: motif ids are unique per page');
}

console.log('\nMotifs — SPEC §6.1, §7.3\n');
for (const note of notes) console.log(`  ok    ${note}`);
if (problems.length) {
	console.log('');
	for (const problem of problems) console.log(`  FAIL  ${problem}`);
	console.log(`\n${problems.length} motif violation(s).\n`);
	process.exit(1);
}
console.log('\nStatically checkable criteria met.');
console.log('Still manual (§7.3): whether each composition reads as the idea it is');
console.log('named after, and whether the accent lands where the eye should go.\n');
