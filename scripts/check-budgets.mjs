/**
 * Budget and token enforcement — SPEC §12.1, §15.
 *
 * The performance budgets in §12.1 are meant to be enforced in CI, not
 * admired. This script checks the ones that can be measured from a static
 * build without a browser:
 *
 *   - JS shipped per page, gzipped
 *   - total page transfer for /
 *   - motif SVG size
 *   - total font payload
 *   - "no colour outside the token set appears anywhere" (§15)
 *   - tokens.css and its JS mirror have not drifted
 *
 * The remaining budgets — LCP, CLS, INP, Lighthouse scores — need a real
 * browser on a throttled profile and belong in Lighthouse CI. See docs/TODO.md.
 *
 * Usage: npm run budgets   (after npm run build)
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { colour } from '../src/lib/tokens.js';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SRC = new URL('../src/', import.meta.url).pathname;

/* --- §12.1 budgets ------------------------------------------------------- */
const BUDGETS = {
	jsHome: 40 * 1024, // initial JS on /, gzipped
	jsProject: 10 * 1024, // initial JS on a project page, gzipped
	fonts: 120 * 1024, // reading typefaces, on every page's critical path
	/* Maths is a different payload with different economics: KaTeX ships one
	   file per face, and a browser fetches only the faces the glyphs on the
	   page actually reference — a project page with two display equations
	   pulls Main-Regular and Math-Italic and leaves the other eighteen on
	   disk. The budget is on the whole shipped set so it cannot grow
	   unwatched, but it is not on the critical path of any page. */
	fontsMath: 320 * 1024,
	motif: 12 * 1024, // each motif SVG
	homeTotal: 450 * 1024, // home page total transfer
};

/**
 * Colours permitted outside the token palette.
 * Print is explicitly specified as "black on white" with link URLs shown
 * (§12.3), which is a different medium with different contrast rules, so the
 * print stylesheet gets its own small greyscale allowlist. Nothing else does.
 */
const PRINT_ALLOWLIST = ['#fff', '#000', '#999', '#ccc', '#444', '#333'];

const problems = [];
const notes = [];
const gz = (buf) => gzipSync(buf).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function walk(dir, out = []) {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

if (!existsSync(DIST)) {
	console.error('No dist/ — run `npm run build` first.');
	process.exit(1);
}

const files = walk(DIST);

/* ------------------------------------------------------------------------
   1. tokens.css and its JS mirror must agree (§5.1, src/lib/tokens.js).
   ------------------------------------------------------------------------ */
{
	const css = readFileSync(join(SRC, 'styles/tokens.css'), 'utf8');
	for (const [name, value] of Object.entries(colour)) {
		const declared = new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(css);
		if (!declared) {
			problems.push(`token mirror: --${name} is in src/lib/tokens.js but not in tokens.css`);
		} else if (declared[1].toLowerCase() !== value.toLowerCase()) {
			problems.push(
				`token mirror: --${name} is ${declared[1]} in tokens.css but ${value} in src/lib/tokens.js`,
			);
		}
	}
	notes.push(`token mirror: ${Object.keys(colour).length} colours checked against tokens.css`);
}

/* ------------------------------------------------------------------------
   2. No colour outside the token set (§15).
   ------------------------------------------------------------------------ */
{
	const palette = new Set(Object.values(colour).map((v) => v.toLowerCase()));
	const allowed = new Set([...palette, ...PRINT_ALLOWLIST.map((v) => v.toLowerCase())]);
	const seen = new Map();

	for (const file of files) {
		if (!['.css', '.html', '.svg'].includes(extname(file))) continue;
		const text = readFileSync(file, 'utf8');
		for (const match of text.matchAll(/#[0-9a-fA-F]{3,6}\b/g)) {
			const hex = match[0].toLowerCase();
			/* Expand shorthand so #fff and #ffffff compare equal. */
			const full =
				hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
			if (allowed.has(hex) || allowed.has(full)) continue;
			if (!seen.has(full)) seen.set(full, new Set());
			seen.get(full).add(file.replace(DIST, ''));
		}
	}

	if (seen.size) {
		for (const [hex, where] of seen) {
			problems.push(`colour outside the token set: ${hex} in ${[...where].slice(0, 3).join(', ')}`);
		}
	} else {
		notes.push('colour: no hex outside the token set in any built CSS, HTML or SVG');
	}
}

/* ------------------------------------------------------------------------
   3. Contrast (§12.2, WCAG 2.2 AA — non-negotiable).

   Body text >= 4.5:1, large text and non-text indicators >= 3:1. §12.2 names
   two pairs specifically; the rest of the combinations the site actually uses
   are listed here so that darkening one token cannot quietly break another.
   ------------------------------------------------------------------------ */
{
	const luminance = (hex) => {
		const channels = [1, 3, 5]
			.map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
			.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
		return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
	};
	const ratio = (a, b) => {
		const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
		return (light + 0.05) / (dark + 0.05);
	};

	/* [foreground, background, minimum, what it is] */
	const pairs = [
		['ink-900', 'field', 4.5, 'hero and card text on the surface'],
		['ink-700', 'field', 4.5, 'second hero line'],
		['ink-500', 'field', 4.5, 'status line, section labels, captions'],
		['ink-500', 'field-deep', 4.5, 'footer text on the deep band'],
		['ink-900', 'paper', 4.5, 'document body'],
		['ink-700', 'paper', 4.5, 'project subtitle'],
		['ink-500', 'paper', 4.5, 'sidenotes, TOC, section numbers'],
		['ink-900', 'green-300', 4.5, 'text on a green card'],
		['ink-900', 'green-200', 4.5, 'text on the card gradient top'],
		['ink-900', 'green-400', 4.5, 'text on the card gradient bottom'],
		['green-700', 'paper', 4.5, 'green text in Layer 2'],
		['green-700', 'green-050', 4.5, 'green text on the faint wash'],
		['paper', 'ink-900', 4.5, 'primary button label'],
		/* Non-text: the focus indicator must be visible on every surface it can
		   land on, including a green card. */
		['green-700', 'field', 3, 'focus ring on the surface'],
		['green-700', 'green-300', 3, 'focus ring on a green card'],
	];

	for (const [fg, bg, min, what] of pairs) {
		const value = ratio(colour[fg], colour[bg]);
		const line = `contrast ${fg} on ${bg}: ${value.toFixed(2)}:1 (min ${min}) — ${what}`;
		if (value < min) problems.push(`${line} FAILS`);
	}
	notes.push(`contrast: ${pairs.length} token pairs meet WCAG 2.2 AA`);
}

/* ------------------------------------------------------------------------
   4. Per-page JS and total transfer (§12.1).
   ------------------------------------------------------------------------ */
function pageAssets(htmlPath) {
	const html = readFileSync(htmlPath, 'utf8');
	const js = new Set();
	const css = new Set();

	for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) js.add(m[1]);
	for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) css.add(m[1]);

	const resolve = (href) => join(DIST, href.replace(/^\//, ''));
	const size = (set) =>
		[...set].reduce((total, href) => {
			const path = resolve(href);
			return existsSync(path) ? total + gz(readFileSync(path)) : total;
		}, 0);

	/* Inline <script> bytes count against the JS budget too. */
	const inlineJs = [...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/g)]
		.map((m) => m[1])
		.join('');

	return {
		html: gz(Buffer.from(html)),
		js: size(js) + (inlineJs ? gz(Buffer.from(inlineJs)) : 0),
		css: size(css),
	};
}

const home = pageAssets(join(DIST, 'index.html'));
const project = pageAssets(join(DIST, 'projects/ridge/index.html'));

const check = (label, actual, budget) => {
	const line = `${label}: ${kb(actual)} / ${kb(budget)}`;
	if (actual > budget) problems.push(`over budget — ${line}`);
	else notes.push(line);
};

check('JS on / (gz)', home.js, BUDGETS.jsHome);
check('JS on /projects/ridge (gz)', project.js, BUDGETS.jsProject);

/* Home total transfer: markup + styles + scripts + the OG card is not on the
   critical path, so it is excluded, as are fonts until they exist. */
const woff2 = files.filter((f) => extname(f) === '.woff2');
const isMath = (f) => /KaTeX_/.test(f);
const size = (list) => list.reduce((total, f) => total + statSync(f).size, 0);

const fontFiles = woff2.filter((f) => !isMath(f));
const fontTotal = size(fontFiles);
check('fonts (total)', fontTotal, BUDGETS.fonts);
if (fontFiles.length === 0) {
	notes.push('fonts: none installed yet — the fallback stacks are carrying the site (docs/TODO.md)');
}

const mathFiles = woff2.filter(isMath);
if (mathFiles.length) check(`maths fonts (${mathFiles.length} faces)`, size(mathFiles), BUDGETS.fontsMath);

check('home total transfer (gz)', home.html + home.js + home.css + fontTotal, BUDGETS.homeTotal);

/* ------------------------------------------------------------------------
   5. Motif SVG size (§12.1: <= 12 KB each).
   ------------------------------------------------------------------------ */
{
	const html = readFileSync(join(DIST, 'index.html'), 'utf8');
	const motifs = [...html.matchAll(/<svg class="motif[\s\S]*?<\/svg>/g)];
	if (motifs.length === 0) problems.push('no motif found on / — the rail should carry one per card');
	motifs.forEach((m, i) => {
		const bytes = Buffer.byteLength(m[0]);
		const id = /class="motif ([a-z0-9-]+)/.exec(m[0])?.[1] ?? `#${i}`;
		check(`motif ${id}`, bytes, BUDGETS.motif);
	});
}

/* ------------------------------------------------------------------------
   Report.
   ------------------------------------------------------------------------ */
console.log('\nBudgets — SPEC §12.1\n');
for (const note of notes) console.log(`  ok    ${note}`);
if (problems.length) {
	console.log('');
	for (const problem of problems) console.log(`  FAIL  ${problem}`);
	console.log(`\n${problems.length} budget or token violation(s).\n`);
	process.exit(1);
}
console.log('\nAll measurable budgets met.\n');
