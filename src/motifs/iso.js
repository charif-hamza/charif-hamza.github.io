/**
 * The isometric construction kit — SPEC §6.1, §6.2, §6.3.
 *
 * True isometric, camera locked at 30° above horizontal, light fixed at the
 * upper left. Every motif is a small stack of axis-aligned boxes on the unit
 * grid, painted back to front. The output is plain SVG geometry: no keyframes,
 * no runtime, no animation library.
 *
 * Revision (v0.6): the motifs are STILLS. The looping choreography the spec
 * originally asked for was cut — a hard loop that reads as "unresolved" costs
 * more than it returns, and the card carousel now carries the motion budget
 * (§7.4). What is left is the part that was always doing the work: one
 * composition, one accent object, one ground shadow.
 */

/** Unit cube side, in SVG user units. Must match --iso-u in tokens.css. */
export const U = 24;

const COS30 = Math.sqrt(3) / 2;

/** Screen displacement of one unit step along each isometric axis. */
export const AXIS = {
	x: [COS30 * U, 0.5 * U], // right and down
	y: [-COS30 * U, 0.5 * U], // left and down
	z: [0, -U], // straight up
};

const round = (n) => Math.round(n * 1000) / 1000;

/** Project a point in unit-cube space onto the locked isometric camera. */
export function project(x, y, z) {
	return [round((x - y) * COS30 * U), round(((x + y) * 0.5 - z) * U)];
}

/** Projected point as an SVG `x,y` pair. */
export function pt(x, y, z) {
	const [a, b] = project(x, y, z);
	return `${a},${b}`;
}

/**
 * Screen offset of a cell, for placing a `<use>` of a prototype built at the
 * origin. The projection is linear, so a cell offset is exact, not an
 * approximation — this is what keeps every instance grid-true (§7.3).
 */
export function offset(x, y, z) {
	const [a, b] = project(x, y, z);
	return { x: a, y: b };
}

/**
 * The three visible faces of a box occupying [x, x+dx] × [y, y+dy] × [z, z+dz].
 *
 * Light is fixed, from the upper left (§6.1), so the y+dy face is the lit one
 * (screen-left) and the x+dx face is the shadow one (screen-right). The
 * caller paints them via the --iso-top / --iso-left / --iso-right custom
 * properties, which is how one prototype serves light, dark, accent and ghost
 * objects without duplicating geometry.
 */
export function boxFaces(x = 0, y = 0, z = 0, dx = 1, dy = 1, dz = 1) {
	const poly = (points) => points.map(([a, b, c]) => pt(a, b, c)).join(' ');
	return {
		top: poly([
			[x, y, z + dz],
			[x + dx, y, z + dz],
			[x + dx, y + dy, z + dz],
			[x, y + dy, z + dz],
		]),
		left: poly([
			[x, y + dy, z],
			[x + dx, y + dy, z],
			[x + dx, y + dy, z + dz],
			[x, y + dy, z + dz],
		]),
		right: poly([
			[x + dx, y, z],
			[x + dx, y + dy, z],
			[x + dx, y + dy, z + dz],
			[x + dx, y, z + dz],
		]),
	};
}

/**
 * A box, ready to render: its three faces plus the painter's-order key.
 *
 * `m` is the material class suffix (light | accent | accent-soft | dark) and
 * `id` a stable handle so a motif can hand-order two boxes that share a depth.
 */
export function box(x, y, z, dx, dy, dz, m = 'light') {
	return { ...boxFaces(x, y, z, dx, dy, dz), m, depth: x + y + z, near: x + dx + y + dy + z + dz };
}

/**
 * Painter's order. In this projection the camera axis is (1,1,1), so depth is
 * exactly x + y + z: sorting on the near corner and breaking ties on the far
 * one puts every box behind the boxes that may occlude it. Boxes that share
 * both keys cannot overlap on screen, so their relative order is free.
 */
export function painterSort(boxes) {
	return [...boxes].sort((a, b) => a.depth - b.depth || a.near - b.near);
}

/**
 * A Frame primitive (§6.2): a hollow cube, edges only. All twelve edges, as a
 * single fill-less path.
 */
export function framePath(x = 0, y = 0, z = 0, dx = 1, dy = 1, dz = 1) {
	const p = (a, b, c) => pt(a, b, c);
	const x1 = x + dx;
	const y1 = y + dy;
	const z1 = z + dz;
	return [
		`M${p(x, y, z)}L${p(x1, y, z)}L${p(x1, y1, z)}L${p(x, y1, z)}Z`,
		`M${p(x, y, z1)}L${p(x1, y, z1)}L${p(x1, y1, z1)}L${p(x, y1, z1)}Z`,
		`M${p(x, y, z)}L${p(x, y, z1)}`,
		`M${p(x1, y, z)}L${p(x1, y, z1)}`,
		`M${p(x1, y1, z)}L${p(x1, y1, z1)}`,
		`M${p(x, y1, z)}L${p(x, y1, z1)}`,
	].join('');
}

/**
 * Ground shadow (§6.1): every composition sits on an invisible ground plane
 * with one soft shadow, offset down-right by 0.35U.
 *
 * The reference art casts a rounded isometric plate rather than an ellipse —
 * the footprint of the object, not a generic blob — which is what makes the
 * object read as standing on something. It is a path plus one static blur; the
 * §6.7 ban on animating filters does not apply to a still.
 */
export function shadowPlate(cx, cy, footprint = 2, radius = 0.55) {
	const hx = round(footprint * COS30 * U);
	const hy = round(footprint * 0.5 * U);
	const ox = round(cx + 0.35 * U * COS30);
	const oy = round(cy + 0.35 * U * 0.5);
	/* Corner cut, as a fraction of each half-diagonal. */
	const tx = round(hx * radius * 0.5);
	const ty = round(hy * radius * 0.5);
	const P = (x, y) => `${round(ox + x)},${round(oy + y)}`;
	return [
		`M${P(-hx + tx, -ty)}`,
		`Q${P(-hx, 0)} ${P(-hx + tx, ty)}`,
		`L${P(-tx, hy - ty)}`,
		`Q${P(0, hy)} ${P(tx, hy - ty)}`,
		`L${P(hx - tx, ty)}`,
		`Q${P(hx, 0)} ${P(hx - tx, -ty)}`,
		`L${P(tx, -hy + ty)}`,
		`Q${P(0, -hy)} ${P(-tx, -hy + ty)}`,
		'Z',
	].join('');
}

/**
 * Centre of a composition's footprint on screen, so the shadow can be placed
 * from the same numbers that placed the boxes.
 */
export function groundAt(x, y, z = 0) {
	const [cx, cy] = project(x, y, z);
	return { cx, cy };
}
