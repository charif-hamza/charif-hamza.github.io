/**
 * French typography — SPEC §10.2.
 *
 * "Typography must be French-correct: narrow non-breaking spaces before : ; ! ?,
 * guillemets « » with inside spacing. This detail is noticed by exactly the
 * audience you are targeting."
 *
 * Persona A reads presentation quality as a proxy for rigour, so this is not a
 * flourish — it is the same class of signal as a well-set CV. Doing it with a
 * function rather than by hand means it cannot rot: copy is authored with
 * ordinary spaces in site.config.yaml and corrected at build time.
 *
 * Applied to French UI strings only. Layer 2 is English (§10.3, D6) and passes
 * through untouched.
 */

/** U+202F NARROW NO-BREAK SPACE. */
const NNBSP = ' ';
/** Any space that might already be sitting where a NNBSP belongs, so that
 *  running this twice changes nothing. */
const SP = '[ \\u00A0\\u202F\\u2009]';

export function fr(text: string): string {
	return (
		text
			// ; ! ? always take a narrow no-break space.
			.replace(new RegExp(`([^\\s])${SP}?([;!?])`, 'g'), `$1${NNBSP}$2`)
			// A colon does too — but not the one in "https://" or in "14:30",
			// so require a following space or the end of the string.
			.replace(new RegExp(`([^\\s\\d])${SP}?:(\\s|$)`, 'g'), `$1${NNBSP}:$2`)
			// Guillemets are spaced on the inside.
			.replace(new RegExp(`«${SP}*`, 'g'), `«${NNBSP}`)
			.replace(new RegExp(`${SP}*»`, 'g'), `${NNBSP}»`)
			// Thin space as thousands separator is French practice; digits are
			// otherwise left exactly as authored.
			.replace(new RegExp(`(\\d)${SP}(\\d{3})\\b`, 'g'), `$1${NNBSP}$2`)
	);
}

/** Apply `fr` to every string in a nested structure, leaving shape intact. */
export function frDeep<T>(value: T): T {
	if (typeof value === 'string') return fr(value) as unknown as T;
	if (Array.isArray(value)) return value.map(frDeep) as unknown as T;
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) out[k] = frDeep(v);
		return out as T;
	}
	return value;
}

/**
 * French date, e.g. "12 août 2026" (§10.2). Month names are spelled out here
 * rather than left to Intl so the output does not depend on which locale data
 * the build machine happens to carry.
 */
const MONTHS_FR = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre',
];

export function dateFr(input: Date | string): string {
	const d = input instanceof Date ? input : new Date(input);
	const day = d.getUTCDate();
	return `${day === 1 ? '1er' : day} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** English date for Layer 2, e.g. "12 August 2026". */
const MONTHS_EN = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export function dateEn(input: Date | string): string {
	const d = input instanceof Date ? input : new Date(input);
	return `${d.getUTCDate()} ${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function monthYearEn(input: Date | string): string {
	const d = input instanceof Date ? input : new Date(input);
	return `${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** ISO yyyy-mm-dd, for <time datetime> and structured data. */
export function iso(input: Date | string): string {
	const d = input instanceof Date ? input : new Date(input);
	return d.toISOString().slice(0, 10);
}
