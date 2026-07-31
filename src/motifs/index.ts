/**
 * The motif registry — SPEC §6.4.
 *
 * "A motif is an asset with a name, versioned in the repo, not a one-off
 * decoration." Each project's frontmatter names a motif id; the build fails if
 * that id is not in this map (§9.4), which is what stops a project shipping
 * with a decoration nobody designed.
 *
 * One motif is used in five places, always the same drawing (v0.6: a still,
 * not a loop — see src/motifs/iso.js):
 *   1. on its home card
 *   2. in the project page header
 *   3. rendered into the project's OG image
 *   4. as the project's entry in the /projects grid
 *   5. as a faint watermark on the printed page (print.css)
 */
import M01 from './m-01-certified-gap.astro';
import M02 from './m-02-two-paths.astro';
import M03 from './m-03-collapse.astro';
import M404 from './m-404-prune.astro';

export const motifs = {
	'm-01-certified-gap': M01,
	'm-02-two-paths': M02,
	'm-03-collapse': M03,
	'm-404-prune': M404,
} as const;

export type MotifId = keyof typeof motifs;

export const motifIds = Object.keys(motifs) as MotifId[];

export function isMotifId(value: unknown): value is MotifId {
	return typeof value === 'string' && value in motifs;
}

/**
 * Reserved names for future projects, so two projects never collide on the
 * same idea (§6.5). Claim one here before you start drawing.
 *
 *   orbit-swap    scheduling
 *   lattice-fill  packing / allocation
 *   flow-split    network / flowsheet
 *   staircase     dynamic programming
 *   sieve         screening / HAZOP
 *
 * A project MAY launch by reusing a reserved composition before it has one of
 * its own (§16, "Motif scope creep") — that is the intended escape hatch, not
 * a failure.
 */
export const RESERVED_MOTIFS = [
	'orbit-swap',
	'lattice-fill',
	'flow-split',
	'staircase',
	'sieve',
] as const;
