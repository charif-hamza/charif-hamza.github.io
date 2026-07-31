/**
 * Content model — SPEC §9.
 *
 * "Scalability lives here. Layout code must never be edited to add content."
 *
 * §9.4 is the important part: a build MUST fail if a required field is
 * missing, if card.description exceeds its length, if a tag is outside the
 * vocabulary, if a motif id has no matching asset, or if two projects share an
 * order. Per-entry rules are enforced by the schemas below; the cross-entry
 * rules live in src/lib/collections.ts, which every page goes through.
 *
 * This is what keeps the site coherent when a project is added at 2 a.m.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
/* Astro still re-exports `z` from astro:content, but has deprecated it. Zod is
   imported directly so this file survives its removal — §16 lists framework
   churn as a standing risk and this is a one-line hedge against it. */
import { z } from 'zod/v4';
import { motifIds } from './motifs/index.ts';

/**
 * Controlled tag vocabulary (§9.1) — max 6, ever.
 * "A taxonomy that grows is a taxonomy that failed."
 */
export const TAGS = [
	'Optimisation',
	'Modélisation',
	'Étude technico-économique',
	'Logiciel',
	'Recherche',
	'Procédés',
] as const;

/** Writing may also carry method-ish tags drawn from the same vocabulary. */
export const WRITING_TAGS = [...TAGS, 'Méthode'] as const;

const artifact = z.object({
	label: z.string().min(1),
	url: z.string().min(1),
	type: z.enum(['repo', 'docs', 'pdf', 'dataset', 'slides', 'paper']),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects' }),
	schema: z.object({
		/** Stable forever. Lowercase, hyphenated (§3.4). */
		slug: z
			.string()
			.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be lowercase and hyphenated (§3.4)'),
		/** Card constraint: the title has to survive at --t-h2 on a 380px card. */
		title: z.string().min(1).max(28, 'title must be <= 28 characters (card constraint, §9.1)'),
		subtitle: z.string().min(1).max(120, 'subtitle must be <= 120 characters (§9.1)'),
		tag: z.enum(TAGS),
		/** Manual rail position — your best work is not necessarily your newest. */
		order: z.number().int().positive(),
		featured: z.boolean().default(true),
		motif: z.enum(motifIds as [string, ...string[]]),
		motifColor: z.enum(['green', 'white']),
		card: z.object({
			description: z
				.string()
				.max(165, 'card.description must be <= 165 characters — 2-3 lines on the card (§9.1)'),
		}),
		/** Rendered as the facts table (§8.2.2). Ordered as written. */
		facts: z.object({
			context: z.string(),
			period: z.string(),
			role: z.string(),
			domain: z.string(),
			methods: z.array(z.string()).min(1),
			stack: z.array(z.string()).min(1),
			status: z.string(),
		}),
		artifacts: z.array(artifact).default([]),
		og: z.object({ image: z.string().optional() }).default({}),
		seo: z.object({
			description: z.string().max(155, 'seo.description must be <= 155 characters (§9.1)'),
		}),
		dates: z.object({
			published: z.coerce.date(),
			updated: z.coerce.date(),
		}),
		draft: z.boolean().default(false),
		/** §10.3 — a small EN marker warns a French reader before the click. */
		language: z.enum(['en', 'fr']).default('en'),
	}),
});

const writing = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './content/writing' }),
	schema: z.object({
		slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
		title: z.string().min(1),
		/** One line, used on the index. It should read like a bibliography entry. */
		description: z.string().max(180, 'description must be <= 180 characters (§8.3)'),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		tags: z.array(z.enum(WRITING_TAGS)).min(1).max(2),
		draft: z.boolean().default(false),
		/** Project slugs — renders a cross-link block (§9.2). */
		related: z.array(z.string()).default([]),
		language: z.enum(['en', 'fr']).default('en'),
	}),
});

export const collections = { projects, writing };
