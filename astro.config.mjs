// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { load as parseYaml } from 'js-yaml';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { paperTheme } from './src/lib/tokens.js';

/** @type {any} */
const site = parseYaml(readFileSync(new URL('./site.config.yaml', import.meta.url), 'utf8'));

/**
 * Turn `import config from './site.config.yaml'` into a plain module at build
 * time. Reading the file at runtime instead would break the moment the
 * bundler relocates a chunk, and would leave an fs dependency in a site that
 * has no business touching the filesystem.
 */
function yamlConfig() {
	return {
		name: 'yaml-config',
		/**
		 * @param {string} code
		 * @param {string} id
		 */
		transform(code, id) {
			if (!/\.ya?ml$/.test(id.split('?')[0])) return null;
			return { code: `export default ${JSON.stringify(parseYaml(code))};`, map: null };
		},
	};
}

/**
 * Print the still-open decisions after every build. A placeholder that ships
 * silently is a placeholder that ships; docs/TODO.md is the full register and
 * this is the part of it that can be checked mechanically.
 */
function pendingDecisions() {
	return {
		name: 'pending-decisions',
		hooks: {
			'astro:build:done': () => {
				/* Explicitly declared open decisions, plus the ones a pattern
				   can find on its own. */
				const pending = [...(site.pending ?? [])];
				/** @param {string} label @param {unknown} value */
				const check = (label, value) => {
					if (/TODO|example\.com/i.test(String(value))) pending.push(`${label} — ${value}`);
				};

				check('site.url (D1: domain)', site.url);
				check('site.email', site.email);
				check('social.github', site.social.github);
				check('social.linkedin', site.social.linkedin);
				check('social.repo (D7: public repo)', site.social.repo);
				if (!site.cv.available) pending.push('cv.available is false — no PDFs in public/cv/');
				if (!site.fonts.installed) pending.push('fonts.installed is false — no WOFF2 in public/fonts/');
				if (site.og.format !== 'png') pending.push('og.format is "svg" — LinkedIn and Slack want PNG');

				if (pending.length === 0) return;
				console.log(`\n  ${pending.length} decision(s) still open — see docs/TODO.md`);
				for (const item of pending) console.log(`    · ${item}`);
				console.log('');
			},
		},
	};
}

// SPEC §11.1 — Astro, zero JS by default. The only client script on the site is
// the rail's enhancement (§7.4) and the reduce-motion toggle (§7.6); both are
// plain <script> tags, no framework island, no animation library.
export default defineConfig({
	site: site.url,
	trailingSlash: 'ignore',
	integrations: [
		mdx(),
		// §12.3 — sitemap.xml. /404 is excluded; drafts never reach the build.
		sitemap({ filter: (page) => !page.includes('/404') }),
		pendingDecisions(),
	],
	markdown: {
		// §8.2.5 — KaTeX at build time, no client runtime.
		remarkPlugins: [remarkMath],
		rehypePlugins: [[rehypeKatex, { output: 'html', strict: false }]],
		// §8.2.5 — muted highlighting from the token set only.
		shikiConfig: { theme: /** @type {any} */ (paperTheme), wrap: false },
	},
	build: {
		// §12.1 — the CSS is small enough that inlining removes a round trip on
		// the LCP path. Astro inlines only stylesheets below its size threshold.
		inlineStylesheets: 'auto',
	},
	// §4.4 fallback path: navigation is plain by default. Cross-document view
	// transitions are declared in CSS (@view-transition), so unsupported
	// browsers get an ordinary navigation and ship zero bytes of polyfill.
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	vite: {
		plugins: [yamlConfig()],
		build: {
			// Keep an eye on the §12.1 JS budgets: 40 KB on /, 10 KB on a project page.
			assetsInlineLimit: 2048,
		},
	},
});
