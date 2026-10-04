/**
 * Render a social post image from a post module.
 *
 *   node social/render.mjs social/posts/<slug>.mjs [out-dir]
 *
 * A post module default-exports { width, height, body } where `body` is the
 * inner HTML (it can call scene() from ./lib.mjs). The page links the site's
 * own tokens.css and motif.css, so the post inherits the palette, the type
 * scale and the isometric materials instead of copying them. Output:
 * <out-dir>/<slug>.html, .png (2x) and .jpg (for upload; LinkedIn chokes on
 * large PNGs). out-dir defaults to social/out/, which git ignores.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = import.meta.dirname;
const site = resolve(here, '..');
const [, , postPath, outArg] = process.argv;
if (!postPath) {
	console.error('usage: node social/render.mjs social/posts/<slug>.mjs [out-dir]');
	process.exit(1);
}

const slug = basename(postPath, '.mjs');
const post = (await import(pathToFileURL(resolve(postPath)).href)).default;
const out = resolve(outArg ?? join(here, 'out'));
mkdirSync(out, { recursive: true });

const rel = (p) => relative(out, p).split('\\').join('/');
const font = (file, weight) =>
	`@font-face{font-family:Switzer;src:url('${rel(join(here, 'fonts', file))}') format('woff2');font-weight:${weight};font-style:normal;font-display:block}`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${slug}</title>
<link rel="stylesheet" href="${rel(join(site, 'src/styles/tokens.css'))}">
<link rel="stylesheet" href="${rel(join(site, 'src/styles/motif.css'))}">
<link rel="stylesheet" href="${rel(join(here, 'post.css'))}">
<style>
${font('Switzer-Regular.woff2', 400)}
${font('Switzer-Medium.woff2', 500)}
${font('Switzer-Semibold.woff2', 600)}
${font('Switzer-Bold.woff2', 700)}
html,body{width:${post.width}px;height:${post.height}px}
${post.css ?? ''}
</style></head>
<body>${post.body}</body></html>`;

const htmlFile = join(out, `${slug}.html`);
const png = join(out, `${slug}.png`);
writeFileSync(htmlFile, html);
execFileSync(
	process.env.CHROMIUM ?? 'chromium',
	[
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--allow-file-access-from-files',
		`--window-size=${post.width},${post.height}`,
		'--force-device-scale-factor=2',
		'--virtual-time-budget=4000',
		`--screenshot=${png}`,
		pathToFileURL(htmlFile).href,
	],
	{ stdio: 'ignore' },
);
try {
	execFileSync('magick', [png, '-quality', '93', png.replace(/\.png$/, '.jpg')]);
} catch {
	console.warn('render — no ImageMagick, PNG only');
}
console.log(`render — ${png}`);
