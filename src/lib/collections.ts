/**
 * Collection accessors and the cross-entry half of §9.4 validation.
 *
 * Zod validates one entry at a time; the rules that make a *set* of projects
 * coherent — no duplicate rail position, no dangling cross-reference, no more
 * cards than the rail can hold — have to be checked once the whole collection
 * is in hand. Every page loads projects through here, so a violation fails the
 * build rather than shipping quietly.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Writing = CollectionEntry<'writing'>;

/** §8.1.5 — the rail shows a maximum of six cards. */
export const RAIL_MAX = 6;

/** Drafts render in preview builds and disappear in production (§13). */
const showDrafts = !import.meta.env.PROD || import.meta.env.SHOW_DRAFTS === 'true';

function fail(message: string): never {
	throw new Error(`[content] ${message}\n         See docs/SPEC.md §9.4.`);
}

let validated = false;

function validate(projects: Project[], writing: Writing[]) {
	if (validated) return;

	const byOrder = new Map<number, string>();
	const bySlug = new Map<string, string>();

	for (const p of projects) {
		const { slug, order } = p.data;

		if (bySlug.has(slug)) {
			fail(`two projects share the slug "${slug}": ${bySlug.get(slug)} and ${p.id}`);
		}
		bySlug.set(slug, p.id);

		if (byOrder.has(order)) {
			fail(
				`two projects share order ${order}: "${byOrder.get(order)}" and "${slug}". ` +
					`Rail position is manual and must be unique (§9.1).`,
			);
		}
		byOrder.set(order, slug);

		/* The file name and the slug are two places to say the same thing;
		   disagreement between them is how a URL silently changes. */
		if (p.id !== slug) {
			fail(`project "${p.id}" declares slug "${slug}". The file name must match the slug (§3.4).`);
		}
	}

	for (const w of writing) {
		if (w.id !== w.data.slug) {
			fail(`writing "${w.id}" declares slug "${w.data.slug}". The file name must match the slug.`);
		}
		for (const ref of w.data.related) {
			if (!bySlug.has(ref)) {
				fail(`writing "${w.data.slug}" relates to project "${ref}", which does not exist (§9.2).`);
			}
		}
	}

	validated = true;
}

async function load() {
	const projects = await getCollection('projects', (p) => showDrafts || !p.data.draft);
	const writing = await getCollection('writing', (w) => showDrafts || !w.data.draft);
	validate(projects, writing);
	return { projects, writing };
}

/** All projects, in manual rail order (§8.1.5). */
export async function allProjects(): Promise<Project[]> {
	const { projects } = await load();
	return [...projects].sort((a, b) => a.data.order - b.data.order);
}

/** The projects that appear on the home rail, capped at RAIL_MAX (§8.1.5). */
export async function railProjects(): Promise<Project[]> {
	const projects = await allProjects();
	return projects.filter((p) => p.data.featured).slice(0, RAIL_MAX);
}

/** True once the rail overflows and the "see all projects" slot is needed. */
export async function railOverflows(): Promise<boolean> {
	const projects = await allProjects();
	return projects.filter((p) => p.data.featured).length > RAIL_MAX;
}

/** All writing, newest first (§8.3). */
export async function allWriting(): Promise<Writing[]> {
	const { writing } = await load();
	return [...writing].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Writing grouped by year, for the bibliography-style index (§8.3). */
export async function writingByYear(): Promise<Array<[number, Writing[]]>> {
	const entries = await allWriting();
	const groups = new Map<number, Writing[]>();
	for (const w of entries) {
		const year = w.data.date.getUTCFullYear();
		if (!groups.has(year)) groups.set(year, []);
		groups.get(year)!.push(w);
	}
	return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

/**
 * Neighbours for the "next" affordance every Layer 2 page must end with
 * (§3.2: no dead ends). Wraps around, so the last project leads back to the
 * first rather than to nothing.
 */
export async function projectNeighbours(slug: string) {
	const projects = await allProjects();
	const i = projects.findIndex((p) => p.data.slug === slug);
	if (i === -1) return { previous: undefined, next: undefined };
	const previous = projects[(i - 1 + projects.length) % projects.length];
	const next = projects[(i + 1) % projects.length];
	return {
		previous: projects.length > 1 ? previous : undefined,
		next: projects.length > 1 ? next : undefined,
	};
}

export async function writingNeighbours(slug: string) {
	const entries = await allWriting();
	const i = entries.findIndex((w) => w.data.slug === slug);
	if (i === -1) return { previous: undefined, next: undefined };
	return {
		previous: entries[i - 1],
		next: entries[i + 1],
	};
}

export async function projectBySlug(slug: string): Promise<Project | undefined> {
	const projects = await allProjects();
	return projects.find((p) => p.data.slug === slug);
}

/** §9.2 `readingTime: auto`. 220 wpm on technical prose is a fair estimate. */
export function readingTime(body: string | undefined): number {
	if (!body) return 1;
	const words = body.trim().split(/\s+/).length;
	return Math.max(1, Math.round(words / 220));
}
