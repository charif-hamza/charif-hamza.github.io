/**
 * LinkedIn banner — 1584 × 396, drawn as vector.
 *
 *   node social/banner.mjs          # → social/out/banner-linkedin.{svg,png,jpg}
 *   node social/banner.mjs --motif  # the drawing alone, no text → banner-linkedin-motif.*
 *
 * The drawing is the AI-generated banner he chose (04/10/2026), rebuilt as
 * geometry: a 10-unit cube with a 3-unit slot cut out of its top-left edge and
 * a 3-unit notch out of its right corner, and the blue 3-unit cube — the
 * piece that came out of the slot — floating beside it. Projection, unit and
 * placement were least-squares fitted to the reference (residuals ≤ 4 px at
 * 1400 px, the AI image's own wobble); everything is then snapped to the grid.
 *
 * One deliberate departure: in the reference the notch's inner wall is white.
 * That wall faces the same way as the cube's right face, so under the site's
 * light it is in shadow; it is drawn dark here, like the slot's wall.
 * NOTCH_WALL flips it back.
 *
 * Colours come from src/styles/tokens.css, read at build time; the type is
 * Switzer, from fonts/. The SVG is the master: fonts are embedded, so it
 * renders the same anywhere a browser does.
 * The JPG is what goes to LinkedIn, which does not take SVG.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = import.meta.dirname;
const site = resolve(here, '..');

const NOTCH_WALL = 'shadow'; // 'shadow' (consistent light) | 'lit' (as in the reference)

/* --- Tokens ------------------------------------------------------------------- */

const css = readFileSync(join(site, 'src/styles/tokens.css'), 'utf8');
const tok = (name) => {
	const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
	if (!m) throw new Error(`banner — token --${name} not found in tokens.css`);
	return m[1];
};
const C = {
	field: tok('field'),
	lit: tok('iso-lit'),
	shadow: tok('iso-shadow'),
	ink: tok('ink-900'),
	ink700: tok('ink-700'),
	ink500: tok('ink-500'),
	b300: tok('blue-300'),
	b400: tok('blue-400'),
	b500: tok('blue-500'),
};

/* --- Canvas and camera ---------------------------------------------------------- */

const W = 1584;
const H = 396;
const U = 16.2; // one grid unit, in banner pixels
const O = [1178, 174.7]; // screen position of the cube's hidden back-bottom corner
const C30 = Math.sqrt(3) / 2;
const r = (n) => Math.round(n * 100) / 100;

/** True isometric, as in src/motifs/iso.js: x right-down, y left-down, z up. */
const pr = (x, y, z) => [r(O[0] + (x - y) * C30 * U), r(O[1] + ((x + y) / 2 - z) * U)];
const pts = (list) => list.map((p) => pr(...p).join(',')).join(' ');
const poly = (list, attrs = '') => `<polygon points="${pts(list)}" ${attrs}/>`;

/* --- The solid ------------------------------------------------------------------ */

/* Cube [0,10]³, minus the slot [4,7]×[7,10]×[7,10] (open on top and on the lit
   face) and the notch [7,10]×[0,3]×[7,10] (the right corner). Faces are listed
   back to front: the pockets' inner faces first, the outer skin over them. The
   skin is cut exactly around each pocket, so it hides the parts of the inner
   faces that the solid would hide. */

const slot = {
	wall: [[4, 7, 10], [4, 10, 10], [4, 10, 7], [4, 7, 7]], // faces +x: shadow
	back: [[4, 7, 10], [7, 7, 10], [7, 7, 7], [4, 7, 7]], // faces +y: lit
	floor: [[4, 7, 7], [7, 7, 7], [7, 10, 7], [4, 10, 7]],
};
const notch = {
	wall: [[7, 0, 10], [7, 3, 10], [7, 3, 7], [7, 0, 7]], // faces +x
	floor: [[7, 0, 7], [10, 0, 7], [10, 3, 7], [7, 3, 7]],
};
const skin = {
	top: [[0, 0, 10], [7, 0, 10], [7, 3, 10], [10, 3, 10], [10, 10, 10], [7, 10, 10], [7, 7, 10], [4, 7, 10], [4, 10, 10], [0, 10, 10]],
	left: [[0, 10, 0], [10, 10, 0], [10, 10, 10], [7, 10, 10], [7, 10, 7], [4, 10, 7], [4, 10, 10], [0, 10, 10]],
	right: [[10, 10, 0], [10, 0, 0], [10, 0, 7], [10, 3, 7], [10, 3, 10], [10, 10, 10]],
};

/* The blue cube: the slot's piece, 3 units, floating in front of the lit face. */
const G = [2.25, 12.75, 7];
const gbox = (dx, dy, dz) => [G[0] + dx, G[1] + dy, G[2] + dz];
const blue = {
	top: [gbox(0, 0, 3), gbox(3, 0, 3), gbox(3, 3, 3), gbox(0, 3, 3)],
	left: [gbox(0, 3, 0), gbox(3, 3, 0), gbox(3, 3, 3), gbox(0, 3, 3)],
	right: [gbox(3, 0, 0), gbox(3, 3, 0), gbox(3, 3, 3), gbox(3, 0, 3)],
};

/* --- Drawing ---------------------------------------------------------------------- */

const HORIZON = 152.8; // the hairline the reference runs across the field
const CAST = [
	{ dx: 0.6, blur: 3, a: 0.055 },
	{ dx: 1.5, blur: 6, a: 0.045 },
	{ dx: 2.5, blur: 10, a: 0.04 },
	{ dx: 3.6, blur: 14, a: 0.037 },
	{ dx: 4.8, blur: 19, a: 0.03 },
	{ dx: 6.2, blur: 24, a: 0.022 },
];

function motif({ skip = false } = {}) {
	const stroke = `stroke="${C.shadow}" stroke-width="1.1" stroke-linejoin="miter"`;
	const [fx, fy] = pr(10, 10, 10); // front corner
	const [, by] = pr(10, 10, 0); // bottom corner
	/* The footprint, grown by g units, slid along the ground by (dx, -0.15 dx):
	   away from the light, so it spills past the bottom-right edge only. */
	const plate = (dx, g) => {
		const dy = -0.15 * dx;
		return poly([[-g + dx, -g + dy, 0], [10 + g + dx, -g + dy, 0], [10 + g + dx, 10 + g + dy, 0], [-g + dx, 10 + g + dy, 0]]);
	};
	/* The cast shadow: the footprint slid away from the light in steps, each
	   step fainter and softer, so the shadow thins out instead of ending. */
	const cast = CAST.map((c, i) => `<g opacity="${c.a}" filter="url(#blur-cast-${i})">${plate(c.dx, 0)}</g>`).join('');
	const stops = (pairs, color) =>
		pairs.map(([o, a]) => `<stop offset="${o}" stop-color="${color}" stop-opacity="${a}"/>`).join('');
	const hull = [gbox(0, 0, 3), gbox(3, 0, 3), gbox(3, 0, 0), gbox(3, 3, 0), gbox(0, 3, 0), gbox(0, 3, 3)];

	/* Shading measured off the reference. Ground: a contact shadow all round
	   the footprint, plus the cast shadow, falling away from the light past
	   the bottom-right edge. Lit face: darkens toward the ground, plus
	   the blue cube's own shadow just under it. Shadow face: a soft highlight
	   down the front edge, where the two faces meet. */
	return `
  <defs>
    <filter id="blur-contact" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="20"/></filter>
    ${CAST.map((c, i) => `<filter id="blur-cast-${i}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${c.blur}"/></filter>`).join('')}
    <filter id="blur-face" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="blur-band" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="1.4"/></filter>
    <clipPath id="clip-left">${poly(skin.left)}</clipPath>
    <clipPath id="clip-right">${poly(skin.right)}</clipPath>
    <linearGradient id="lit-ground" gradientUnits="userSpaceOnUse" x1="${fx}" y1="${fy}" x2="${r(fx - 0.5 * 10 * U * C30)}" y2="${r(fy + C30 * 10 * U * C30)}">
      ${stops([[0, 0.005], [0.55, 0.034], [0.71, 0.06], [0.85, 0.073], [1, 0.08]], C.ink)}
    </linearGradient>
    <linearGradient id="band" gradientUnits="userSpaceOnUse" x1="0" y1="${fy}" x2="0" y2="${by}">
      ${stops([[0, 0.13], [0.55, 0.05], [1, 0.01]], '#fff')}
    </linearGradient>
    <linearGradient id="pocket" gradientUnits="userSpaceOnUse" x1="0" y1="${pr(4, 7, 10)[1]}" x2="0" y2="${pr(7, 10, 7)[1]}">
      ${stops([[0, 0.06], [1, 0.1]], C.ink)}
    </linearGradient>
    <linearGradient id="blue-left" gradientUnits="userSpaceOnUse" x1="${pr(...gbox(0, 3, 3))[0]}" y1="${pr(...gbox(0, 3, 3))[1]}" x2="${pr(...gbox(3, 3, 0))[0]}" y2="${pr(...gbox(3, 3, 0))[1]}">
      <stop offset="0" stop-color="${C.b300}"/><stop offset="0.75" stop-color="${C.b400}"/><stop offset="1" stop-color="${C.b500}"/>
    </linearGradient>
  </defs>

  <line x1="0" y1="${HORIZON}" x2="${W}" y2="${HORIZON}" stroke="${C.ink}" stroke-opacity="0.14" stroke-width="1.15"${skip ? ' mask="url(#skip)"' : ''}/>

  <g fill="${C.ink}">
    <g opacity="0.15" filter="url(#blur-contact)">${plate(0, 0.05)}</g>
    ${cast}
  </g>

  <g ${stroke}>
    ${poly(slot.wall, `fill="${C.shadow}"`)}
    ${poly(slot.back, `fill="${C.lit}"`)}${poly(slot.back, 'fill="url(#pocket)" stroke="none"')}
    ${poly(slot.floor, `fill="${C.lit}"`)}${poly(slot.floor, 'fill="url(#pocket)" stroke="none"')}
    ${poly(notch.wall, `fill="${NOTCH_WALL === 'lit' ? C.lit : C.shadow}"`)}
    ${poly(notch.floor, `fill="${C.lit}"`)}

    ${poly(skin.right, `fill="${C.shadow}"`)}
    <g clip-path="url(#clip-right)" stroke="none"><g filter="url(#blur-band)">${poly([[10, 10, -1], [10, 10, 11], [10, 9.2, 11], [10, 9.2, -1]], 'fill="url(#band)"')}</g></g>

    ${poly(skin.left, `fill="${C.lit}"`)}
    <g clip-path="url(#clip-left)" stroke="none">
      ${poly(skin.left, 'fill="url(#lit-ground)"')}
      <g opacity="0.045" filter="url(#blur-face)" transform="translate(16 28)">${poly(hull, `fill="${C.ink}"`)}</g>
    </g>
    ${poly(skin.left, 'fill="none"')}

    ${poly(skin.top, `fill="${C.lit}"`)}
  </g>

  <g ${stroke.replace('stroke-width="1.1"', 'stroke-width="1"')} stroke-opacity="0.6">
    ${poly(blue.right, `fill="${C.shadow}" stroke-opacity="1"`)}
    ${poly(blue.left, 'fill="url(#blue-left)"')}
    ${poly(blue.top, `fill="${C.b300}"`)}
  </g>`;
}

/* --- Text --------------------------------------------------------------------------- */

function fontFaces() {
	const face = (file, weight) =>
		`@font-face{font-family:Switzer;src:url(data:font/woff2;base64,${readFileSync(join(here, 'fonts', file)).toString('base64')}) format('woff2');font-weight:${weight}}`;
	return face('Switzer-Regular.woff2', 400) + face('Switzer-Medium.woff2', 500) + face('Switzer-Bold.woff2', 700);
}

/* The words. A title that says what he is — the discipline, not the job he
   wants — and under it, quietly, the one thing he is asking for. No name:
   LinkedIn prints it in bold right under the banner.

   Type: Switzer, the site's face — his call (04/10/2026), after a thin serif
   read as pasted over the drawing. Bold and tight for the title, Regular for
   the sentence: the drawing's faces and its hairlines.

   The title stands on the hairline: its baseline sits just above it, the line
   breaks where the descenders cross. The sentence starts exactly under the
   title's last word: both are set from `x`, the title's first part runs
   leftwards from it. If the words change, move `x` so the title still starts
   right of the app's side crop (x ≥ ~230) and ends clear of the blue cube
   (x ≤ ~920).

   Where it can go: LinkedIn lays the profile photo over the lower left
   (desktop: x ≲ 350 from y ≈ 175; the app crops ~190 px off each side, which
   moves it to x ≈ 230–560 from y ≈ 220, its top rising toward x ≈ 400). The
   sentence starts right of the photo's crown and ends above it. */
const COPY = { lead: 'Process', word: 'engineering', x: 528, ask: ['Looking for an internship', 'from April 2027.'] };
const SITE = 'charifhamza.com';
const TITLE = { size: 68, base: 144, weight: 700, track: -0.03 };
const ASK = { size: 28, base: 197, lead: 36, weight: 400 };
const SPACE = 0.188; // Switzer Bold's word space, in em

function text() {
	const t = COPY;
	const face = (f) => `font-family="Switzer, 'Helvetica Neue', Arial, sans-serif" font-size="${f.size}" font-weight="${f.weight}"`;
	const gap = r((SPACE + TITLE.track) * TITLE.size);
	const title = `<text ${face(TITLE)} letter-spacing="${r(TITLE.track * TITLE.size)}" fill="${C.ink}">
    <tspan x="${r(t.x - gap)}" y="${TITLE.base}" text-anchor="end">${t.lead}</tspan><tspan x="${t.x}" y="${TITLE.base}">${t.word}</tspan></text>`;
	return {
		/* Skip-ink: the hairline is cut around the descenders, 4 px clear. The
		   clearance must stay under the ~8 px between baseline and line, or the
		   line is cut under every letter. */
		defs: `<mask id="skip" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#fff"/><g fill="#000" stroke="#000" stroke-width="8">${title}</g></mask>`,
		body: `
  ${title}
  <text ${face(ASK)} fill="${C.ink700}">${t.ask.map((line, i) => `<tspan x="${t.x}" y="${ASK.base + i * ASK.lead}">${line}</tspan>`).join('')}</text>
  <text x="${r(pr(10, 0, 0)[0])}" y="374" text-anchor="end" ${face({ size: 18, weight: 500 })} letter-spacing="0.36" fill="${C.ink500}">${SITE}</text>`,
	};
}

/* --- Output --------------------------------------------------------------------------- */

export function bannerSVG({ words = true } = {}) {
	const w = words ? text() : null;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${w ? `<style>${fontFaces()}</style><defs>${w.defs}</defs>` : ''}
  <rect width="${W}" height="${H}" fill="${C.field}"/>
  ${motif({ skip: !!w })}
  ${w ? w.body : ''}
</svg>
`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const motifOnly = process.argv.includes('--motif');
	const out = resolve(here, 'out');
	mkdirSync(out, { recursive: true });
	const slug = motifOnly ? 'banner-linkedin-motif' : 'banner-linkedin';
	const svg = join(out, `${slug}.svg`);
	const png = join(out, `${slug}.png`);
	writeFileSync(svg, bannerSVG({ words: !motifOnly }));
	execFileSync(
		process.env.CHROMIUM ?? 'chromium',
		['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`, '--force-device-scale-factor=2', '--virtual-time-budget=2000', `--screenshot=${png}`, pathToFileURL(svg).href],
		{ stdio: 'ignore' },
	);
	execFileSync('magick', [png, '-quality', '95', png.replace(/\.png$/, '.jpg')]);
	console.log(`banner — ${svg}`);
}
