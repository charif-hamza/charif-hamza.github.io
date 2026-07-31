/**
 * Per-instance ids for motif <defs>.
 *
 * One motif is rendered five times in a build (card, project header, grid, OG
 * image, print) and more than once per page. Two gradients sharing an id in
 * one document is a silent wrong-colour bug that only shows on whichever
 * instance happens to come second, so ids are minted, never written.
 */
let n = 0;

export function nextUid(prefix = 'iso'): string {
	n += 1;
	return `${prefix}${n}`;
}
