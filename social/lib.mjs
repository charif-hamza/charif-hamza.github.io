/**
 * Social-image helpers — the isometric Scene, emitted as an SVG string.
 *
 * This is Scene.astro's emission rewritten for a context with no Astro
 * runtime: same classes, same gradients, same ground plate, so motif.css
 * styles a post exactly as it styles a card. The geometry comes from
 * src/motifs/iso.js unchanged; nothing here projects a point of its own
 * except through `project`.
 */
import { project, shadowPlate, groundAt } from '../src/motifs/iso.js';

let n = 0;

/** Projected polyline through points in unit-cube space, as an SVG path `d`. */
export function isoPath(points) {
	return points.map(([x, y, z], i) => `${i ? 'L' : 'M'}${project(x, y, z).join(',')}`).join('');
}

/**
 * boxes   painter-ordered boxes from iso.js `box()`
 * shadow  { x, y, z?, footprint? } — ground plate centre in unit space
 * surface 'blue' | 'white' — picks the ground shadow colour, as on the site
 * pad     padding around the drawing, SVG units
 * under   extra SVG markup painted before the boxes (same coordinate space)
 * over    extra SVG markup painted after the boxes
 * extent  extra unit-space points the viewBox must include (for under/over)
 */
export function scene({ boxes, shadow, surface = 'blue', pad = 6, under = '', over = '', extent = [], cls = '' }) {
	const uid = `s${++n}`;
	const xs = [];
	const ys = [];
	for (const b of boxes)
		for (const face of [b.top, b.left, b.right])
			for (const p of face.split(' ')) {
				const [a, c] = p.split(',').map(Number);
				xs.push(a);
				ys.push(c);
			}
	for (const [x, y, z] of extent) {
		const [a, c] = project(x, y, z);
		xs.push(a);
		ys.push(c);
	}
	let plate = '';
	if (shadow) {
		const g = groundAt(shadow.x, shadow.y, shadow.z ?? 0);
		const d = shadowPlate(g.cx, g.cy, shadow.footprint ?? 2);
		for (const m of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) {
			xs.push(+m[1]);
			ys.push(+m[2]);
		}
		plate = `<path class="iso-ground" d="${d}" filter="url(#${uid}-cast)"/>`;
	}
	const minX = Math.min(...xs) - pad;
	const minY = Math.min(...ys) - pad;
	const w = Math.max(...xs) - Math.min(...xs) + 2 * pad;
	const h = Math.max(...ys) - Math.min(...ys) + 2 * pad;

	const grain = boxes.filter((b) => b.m === 'light').map((b) => `<polygon points="${b.left}"/>`).join('');
	const faces = boxes
		.map(
			(b) =>
				`<g class="iso iso--${b.m}"><polygon class="iso-face--right" points="${b.right}"/><polygon class="iso-face--left" points="${b.left}"/><polygon class="iso-face--top" points="${b.top}"/></g>`,
		)
		.join('');

	return `<svg class="motif ${cls}" data-fit="natural" data-surface="${surface}" viewBox="${minX} ${minY} ${w} ${h}"
  style="--iso-accent-left:url(#${uid}-accent);--iso-accent-soft:url(#${uid}-soft);--iso-aspect:${w}/${h}" aria-hidden="true">
  <defs>
    <linearGradient id="${uid}-accent" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0%" stop-color="var(--blue-200)"/><stop offset="100%" stop-color="var(--blue-500)"/></linearGradient>
    <linearGradient id="${uid}-soft" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0%" stop-color="var(--blue-100)"/><stop offset="100%" stop-color="var(--blue-400)"/></linearGradient>
    <filter id="${uid}-cast" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6"/></filter>
    <filter id="${uid}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="3" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.85"/></feComponentTransfer></filter>
    <linearGradient id="${uid}-grainfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="40%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="1"/></linearGradient>
    <mask id="${uid}-grainmask"><rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="url(#${uid}-grainfade)"/></mask>
    <clipPath id="${uid}-lit">${grain}</clipPath>
  </defs>
  ${plate}
  ${under}
  ${faces}
  <g clip-path="url(#${uid}-lit)" class="iso-grain"><g mask="url(#${uid}-grainmask)"><rect x="${minX - w}" y="${minY - h}" width="${w * 3}" height="${h * 3}" filter="url(#${uid}-grain)"/></g></g>
  ${over}
</svg>`;
}
