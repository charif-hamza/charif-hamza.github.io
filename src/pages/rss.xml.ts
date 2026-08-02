/**
 * RSS for /writing — SPEC §3.1, §12.3.
 *
 * A feed is the cheapest way to be followed by the people who would otherwise
 * have to remember to come back. Projects are not in it: they are documents
 * that get revised, not posts (§1.3 — writing supports the projects, it does
 * not lead).
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allWriting } from '~/lib/collections.ts';
import { site, en } from '~/lib/site.ts';

export async function GET(context: APIContext) {
	const entries = await allWriting();

	return rss({
		title: `${site.name} · ${en.writingIndexTitle}`,
		description: en.writingIndexLead,
		site: context.site ?? site.url,
		trailingSlash: false,
		items: entries.map((entry) => ({
			title: entry.data.title,
			description: entry.data.description,
			pubDate: entry.data.date,
			link: `/writing/${entry.data.slug}`,
			categories: entry.data.tags,
		})),
		customData: `<language>${site.docLang}</language>`,
	});
}
