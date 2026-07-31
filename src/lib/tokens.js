/**
 * Token mirror for non-CSS contexts — SPEC §5.1, Appendix A.
 *
 * `src/styles/tokens.css` is the single source of truth for the design system.
 * A few places cannot read CSS custom properties: the Shiki syntax theme
 * (build-time, needs literal hex) and the OG image generator (standalone SVG
 * documents with no stylesheet). Those import this file instead of inventing
 * colours.
 *
 * `npm run budgets` diffs this file against tokens.css and fails the build if
 * they drift, which is what keeps the §15 rule "no colour outside the token set
 * appears anywhere" enforceable rather than aspirational.
 */

/** @type {Record<string, string>} */
export const colour = {
	'green-050': '#F1FDF2',
	'green-100': '#DFFAE2',
	'green-200': '#C2F5C9',
	'green-300': '#A3EFAE',
	'green-400': '#7FE18E',
	'green-500': '#48C862',
	'green-700': '#1E7A38',
	'ink-900': '#101113',
	'ink-700': '#3A3D42',
	/* Darkened from Appendix A's #6B7079 for AA on --field / --field-deep;
	   see the note in tokens.css. */
	'ink-500': '#5E636A',
	'ink-300': '#B9BDC4',
	rule: '#E3E5E8',
	paper: '#FFFFFF',
	/* The two isometric face tones (§6.1); see the note in tokens.css. */
	'iso-lit': '#FAFAFA',
	'iso-shadow': '#232427',
	field: '#F2F2F1',
	'field-deep': '#E8E8E7',
};

/**
 * Syntax highlighting theme — SPEC §8.2.5: "a muted theme using
 * --ink-900/--ink-500/--green-700 only". Three greys and one green; code on a
 * project page is evidence, not decoration.
 */
export const paperTheme = {
	name: 'paper',
	type: 'light',
	colors: {
		'editor.background': colour.paper,
		'editor.foreground': colour['ink-900'],
	},
	settings: [
		{ settings: { background: colour.paper, foreground: colour['ink-900'] } },
		{
			scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
			settings: { foreground: colour['ink-500'], fontStyle: 'italic' },
		},
		{
			scope: [
				'keyword',
				'keyword.control',
				'storage',
				'storage.type',
				'storage.modifier',
				'constant.language',
				'variable.language',
				'keyword.operator.new',
			],
			settings: { foreground: colour['green-700'], fontStyle: 'bold' },
		},
		{
			scope: ['entity.name.function', 'support.function', 'meta.function-call.generic'],
			settings: { foreground: colour['ink-900'], fontStyle: 'bold' },
		},
		{
			scope: ['string', 'string.quoted', 'constant.numeric', 'constant.character'],
			settings: { foreground: colour['ink-700'] },
		},
		{
			scope: [
				'punctuation',
				'meta.brace',
				'keyword.operator',
				'punctuation.separator',
				'punctuation.definition',
			],
			settings: { foreground: colour['ink-500'] },
		},
		{
			scope: ['entity.name.type', 'support.type', 'support.class', 'entity.name.class'],
			settings: { foreground: colour['ink-900'] },
		},
		{
			scope: ['variable', 'variable.other', 'meta.definition.variable'],
			settings: { foreground: colour['ink-900'] },
		},
		{
			scope: ['entity.name.tag', 'meta.tag'],
			settings: { foreground: colour['green-700'] },
		},
		{
			scope: ['entity.other.attribute-name'],
			settings: { foreground: colour['ink-700'], fontStyle: 'italic' },
		},
	],
};
