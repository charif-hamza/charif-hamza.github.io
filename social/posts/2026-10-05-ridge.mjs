/**
 * RIDGE — "the optimal cycle is a curve, freeze-dryers run steps".
 *
 * The text carries the project; the drawing is composition. The motif is
 * RIDGE's own M-01 ("the certified gap"), the same geometry as its card and
 * its OG image, so the post and the link preview under it read as one object.
 * Box list copied from src/motifs/m-01-certified-gap.astro — keep in step.
 */
import { box, painterSort } from '../../src/motifs/iso.js';
import { scene } from '../lib.mjs';

const motif = scene({
	boxes: painterSort([
		box(0, 0, 0, 1, 1, 4, 'light'),
		box(1, 0, 0, 1, 1, 3, 'accent'),
		box(0, 1, 0, 1, 1, 2, 'light'),
		box(1, 1, 0, 1, 1, 1, 'light'),
	]),
	shadow: { x: 2, y: 2, footprint: 2.4 },
	surface: 'blue',
	cls: 'm01',
});

export default {
	width: 1080,
	height: 1350,
	css: `
	.hero { left: 40px; top: 40px; width: 1000px; height: 880px; }
	.hero .pill { position: absolute; left: 64px; top: 64px; }
	.hero .title { position: absolute; left: 60px; top: 150px; font-size: 86px; }
	.hero .lead { position: absolute; left: 64px; bottom: 64px; width: 480px; font-size: 30px; }
	.m01 { position: absolute; right: -70px; bottom: 30px; width: 440px; }
	.facts { left: 40px; top: 944px; width: 1000px; height: 300px; padding: 44px 64px 0; }
	.row { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 40px; }
	.fig { font-size: 70px; font-weight: 700; letter-spacing: var(--track-display); line-height: 1; }
	.fig + p { margin-top: 14px; font-size: 23px; line-height: 1.35; color: var(--ink-700); }
	.status { position: absolute; left: 64px; right: 64px; bottom: 34px; padding-top: 22px; border-top: 2px solid var(--rule); font-size: 21px; }
	.sign { position: absolute; left: 64px; right: 64px; top: 1276px; display: flex; justify-content: space-between; font-size: 24px; }
	`,
	body: `
<section class="card card--blue hero">
  <span class="pill">RIDGE</span>
  <h1 class="title">The optimal<br>cycle is a curve.<br>Freeze-dryers<br>run steps.</h1>
  <p class="lead">RIDGE computes the steps a controller can run, and certifies how little time they give up.</p>
  ${motif}
</section>
<section class="card card--white facts">
  <div class="row">
    <div><div class="fig">−62%</div><p>primary drying time,<br>5% mannitol</p></div>
    <div><div class="fig">−50%</div><p>primary drying time,<br>5% sucrose</p></div>
    <div><div class="fig">&lt;1%</div><p>certified gap between<br>the steps and the curve</p></div>
  </div>
  <p class="status meta">Model results against typical cycle conditions, not yet run on a real dryer.</p>
</section>
<div class="sign meta"><span>Hamza Charif</span><span>charifhamza.com</span></div>
`,
};
