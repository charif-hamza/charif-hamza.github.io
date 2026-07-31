/**
 * OG image endpoint — SPEC §6.7, §12.3.
 *
 * "OG image per page from the motif poster frame with title text overlaid —
 * shared links become recognisable." That is success criterion S2: the motif
 * system is the thing that makes a shared link identifiable as yours.
 *
 * The pipeline in §6.7 is "headless screenshot of the poster frame at
 * 1200x630". This endpoint produces the thing to screenshot: a complete,
 * self-contained 1200x630 SVG card with the motif frozen at its poster frame.
 * In a browser it is already correct and can be used directly as og:image.
 *
 * TODO(D-og) — LinkedIn and Slack want raster. `npm run og:png` is documented
 * in docs/TODO.md and is a headless screenshot of these URLs; once the PNGs
 * exist, flip `og.format` to "png" in site.config.yaml.
 */
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { motifs, type MotifId } from '~/motifs/index.ts';
import { allProjects } from '~/lib/collections.ts';
import { site, t } from '~/lib/site.ts';
import { colour } from '~/lib/tokens.js';

interface Card {
	title: string;
	subtitle: string;
	tag: string;
	motif: MotifId;
	surface: 'green' | 'white';
}

export async function getStaticPaths() {
	const projects = await allProjects();

	const cards: Array<{ params: { slug: string }; props: Card }> = projects.map((project) => ({
		params: { slug: project.data.slug },
		props: {
			title: project.data.title,
			subtitle: project.data.subtitle,
			tag: project.data.tag,
			motif: project.data.motif as MotifId,
			surface: project.data.motifColor,
		},
	}));

	/* The site card. Uses the strongest single image on the site (§6.5 M-01). */
	cards.push({
		params: { slug: 'home' },
		props: {
			title: site.name,
			subtitle: site.tagline.en,
			tag: t.sections.projects,
			motif: 'm-01-certified-gap',
			surface: 'green',
		},
	});

	return cards;
}

/** Wrap text at a character budget — no text measurement available here, and
 *  a conservative budget is better than an overflowing card. */
function wrap(text: string, perLine: number, maxLines: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		if ((line + ' ' + word).trim().length > perLine && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines) break;
		} else {
			line = (line + ' ' + word).trim();
		}
	}
	if (line && lines.length < maxLines) lines.push(line);
	return lines;
}

/** Motif box inside the 1200x630 card. Text keeps the left 620px. */
const MOTIF = { x: 730, y: 130, size: 370 };

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ props }) => {
	const { title, subtitle, tag, motif, surface } = props as Card;

	/* The motif is rendered by the same component as the card and the project
	   header — one motif, five uses (§6.4). Since v0.6 it is a still
	   everywhere, so the OG card and the card on / are the same drawing rather
	   than one being a frame lifted out of the other. */
	const container = await AstroContainer.create();
	const motifMarkup = await container.renderToString(motifs[motif], { props: { surface } });

	/* The component emits <svg> plus its <style>; both are valid inside an
	   outer <svg>. A nested <svg> with no geometry defaults to the full
	   viewport, so it is given explicit x/y/width/height here — that, plus its
	   own viewBox and preserveAspectRatio, places the motif exactly like an
	   image without touching the component. */
	const inner = motifMarkup
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\sdata-astro-(cid|source-file|source-loc)="[^"]*"/g, '')
		.replace(/<svg\s/, `<svg x="${MOTIF.x}" y="${MOTIF.y}" width="${MOTIF.size}" height="${MOTIF.size}" `)
		.trim();

	const bg = surface === 'green' ? colour['green-300'] : colour.paper;
	const titleLines = wrap(title, 18, 2);
	const subtitleLines = wrap(subtitle, 38, 3);

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${site.og.width}" height="${site.og.height}" viewBox="0 0 ${site.og.width} ${site.og.height}" font-family="Switzer, 'Helvetica Neue', Arial, sans-serif">
<style>
  :root{--paper:${colour.paper};--field:${colour.field};--ink-900:${colour['ink-900']};--ink-500:${colour['ink-500']};
        --green-100:${colour['green-100']};--green-200:${colour['green-200']};--green-300:${colour['green-300']};
        --green-400:${colour['green-400']};--green-500:${colour['green-500']};--green-700:${colour['green-700']};
        --iso-lit:${colour['iso-lit']};--iso-shadow:${colour['iso-shadow']};
        --shadow-ground:rgb(127 225 142 / .22);--shadow-ground-neutral:rgb(16 17 19 / .08);
        --iso-stroke-width:1.25;}
  .iso{stroke:var(--iso-shadow);stroke-width:var(--iso-stroke-width);stroke-linejoin:miter;vector-effect:non-scaling-stroke}
  .iso-face--top{fill:var(--iso-top);vector-effect:non-scaling-stroke}
  .iso-face--left{fill:var(--iso-left);vector-effect:non-scaling-stroke}
  .iso-face--right{fill:var(--iso-right);vector-effect:non-scaling-stroke}
  .iso-edge{fill:none;vector-effect:non-scaling-stroke}
  .iso--light{--iso-top:var(--paper);--iso-left:var(--iso-lit);--iso-right:var(--iso-shadow)}
  .iso--dark{--iso-top:var(--paper);--iso-left:var(--iso-shadow);--iso-right:var(--iso-shadow)}
  .iso--accent{--iso-top:var(--green-200);--iso-left:var(--iso-accent-left,var(--green-300));--iso-right:var(--iso-shadow)}
  .iso--accent-edge{--iso-top:var(--paper);--iso-left:var(--iso-accent-left,var(--green-300));--iso-right:var(--iso-shadow)}
  .iso--accent-soft{--iso-top:var(--paper);--iso-left:var(--iso-accent-soft,var(--green-100));--iso-right:var(--iso-shadow)}
  .iso--ghost{opacity:.3;stroke-dasharray:3.5 3.5}
  .iso--frame{fill:none;stroke:var(--green-700);stroke-dasharray:4 3}
  .iso-grain{opacity:.45;mix-blend-mode:multiply}
  .iso-ground{stroke:none;fill:var(--ground)}
  .motif{--ground:var(--shadow-ground-neutral)}
  .motif[data-surface="green"]{--ground:var(--shadow-ground)}
  .og-title{font-size:64px;font-weight:700;letter-spacing:-0.02em;fill:${colour['ink-900']}}
  .og-sub{font-size:28px;font-weight:400;fill:${colour['ink-700']}}
  .og-meta{font-size:22px;font-weight:500;letter-spacing:0.02em;fill:${colour['ink-500']}}
</style>
<rect width="${site.og.width}" height="${site.og.height}" fill="${colour.field}"/>
<rect x="48" y="48" width="1104" height="534" rx="28" fill="${bg}"/>
${inner}
<text class="og-meta" x="104" y="146">${escape(tag)}</text>
${titleLines.map((line, i) => `<text class="og-title" x="104" y="${268 + i * 72}">${escape(line)}</text>`).join('\n')}
${subtitleLines.map((line, i) => `<text class="og-sub" x="104" y="${268 + titleLines.length * 72 + 22 + i * 38}">${escape(line)}</text>`).join('\n')}
<text class="og-meta" x="104" y="526">${escape(site.name)}</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
