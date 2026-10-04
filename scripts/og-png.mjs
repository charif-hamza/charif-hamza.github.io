/**
 * OG rasterisation — TODO(D-og), SPEC §6.7.
 *
 * LinkedIn and Slack ignore SVG og:image, so a shared link showed no preview.
 * This screenshots every built card in dist/og/*.svg at 1200x630 with headless
 * Chromium and writes public/og/<slug>.png, which the next build ships next to
 * the SVG. site.config.yaml → og.format selects which one the pages point to.
 *
 * Run after `npm run build`, and again whenever a card's title, subtitle or
 * motif changes: the PNGs are committed, so a stale one stays stale.
 *
 *   npm run build && npm run og:png
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const src = join(root, 'dist', 'og');
const out = join(root, 'public', 'og');
const browser = process.env.CHROMIUM ?? 'chromium';

mkdirSync(out, { recursive: true });

const cards = readdirSync(src).filter((f) => f.endsWith('.svg'));
if (cards.length === 0) {
	console.error('og:png — no cards in dist/og; run `npm run build` first.');
	process.exit(1);
}

for (const card of cards) {
	const png = join(out, card.replace(/\.svg$/, '.png'));
	execFileSync(browser, [
		'--headless',
		'--disable-gpu',
		'--hide-scrollbars',
		'--force-device-scale-factor=1',
		'--window-size=1200,630',
		`--screenshot=${png}`,
		pathToFileURL(join(src, card)).href,
	], { stdio: 'ignore' });
	console.log(`og:png — ${card} → public/og/${card.replace(/\.svg$/, '.png')}`);
}
