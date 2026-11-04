// Smoke test: loads dist/mwp-estimate.js into test/fixture.html (jsdom) and
// walks the flow. Run after `npm run build`:  npm test
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!doctype html><body>${readFileSync('test/fixture.html', 'utf8')}</body>`, { runScripts: 'outside-only' });
const { window } = dom;
window.matchMedia = () => ({ matches: false });
window.HTMLElement.prototype.scrollIntoView = function () {};
window.scrollTo = function () {};
window.eval(readFileSync(process.argv[2] || 'dist/mwp-estimate.js', 'utf8'));
if (window.document.readyState === 'loading') await new Promise((r) => window.document.addEventListener('DOMContentLoaded', r));

const R = window.document.getElementById('mwp-adv');
const q = (s) => R.querySelector(s);
const fig = () => q('[data-mwp="est-figure"]').textContent;
const pick = (stage, id) => q(`[data-stage="${stage}"] [data-answer-id="${id}"]`).click();
const next = () => q('[data-mwp="next"]').click();
const tick = () => new Promise((r) => setTimeout(r, 0));

const label = () => q('[data-mwp="stage-label"]').textContent;
const wrap = q('[data-mwp="progress-wrap"]');
assert.equal(label(), 'Get started', 'launcher label before starting');
assert.equal(wrap.getAttribute('role'), 'button');
wrap.click();
assert.ok(R.classList.contains('mwp-started'), 'launcher click starts');
assert.equal(label(), 'Step 1 of 6 — Your project', 'step label restored');
assert.equal(q('[data-mwp="graph-h"]').textContent, 'Your estimate so far', 'side panel heading during questions');
assert.equal(q('[data-mwp="graph-sub"]').textContent, 'Answer the questions, the price updates as you go', 'side panel sub-heading during questions');
assert.equal(wrap.getAttribute('role'), null);
assert.equal(fig(), '£0', 'starts at £0');
const top1 = q('[data-stage="project_type"] [data-mwp="next-top"]');
await tick();
assert.equal(top1.getAttribute('aria-disabled'), 'true', 'top Next disabled until answered');
top1.click();
assert.equal(q('[data-stage="project_type"]').getAttribute('data-active'), 'true', 'disabled top Next does nothing');
pick('project_type', 'redesign');
assert.equal(fig(), '£500', 'stage 1 answer shows start figure');
assert.equal(q('[data-val="website"]').textContent, '£500', 'stage 1 answer shows on the Website bar straight away');
pick('project_type', 'redesign');
assert.equal(fig(), '£0', 'deselecting stage 1 returns to £0');
pick('project_type', 'new-site');
await tick();
assert.equal(top1.getAttribute('aria-disabled'), 'false', 'top Next enabled once answered');
top1.click();
assert.equal(q('[data-stage="website_size"]').getAttribute('data-active'), 'true', 'top Next advances');
pick('website_size', 'notsure');
assert.equal(fig(), '£1,000', '"not sure" size = £500 start + £500, shown as a single figure');
pick('website_size', 'small');
assert.equal(fig(), '£500–£1,500', 'stage 2 replaces start figure with the small website base');
pick('website_size', 'medium');
assert.equal(fig(), '£1,000–£3,000', 'medium website base');
pick('website_size', 'small');
const vis = (s) => q(s).style.display !== 'none';
assert.ok(!vis('[data-mwp="sum-cta"]'), 'summary buttons hidden before the last stage');
next(); pick('brand_state', 'logo-only'); next(); pick('content_state', 'some'); next(); pick('visual_assets', 'some-imagery'); next();
pick('features', 'blog'); pick('features', 'booking');
// Last stage: Next goes, the summary box offers Book + See assessment
assert.ok(!vis('[data-mwp="next"]'), 'Next hidden on the last stage');
assert.ok(!vis('[data-stage="features"] [data-mwp="next-top"]'), 'top Next hidden on the last stage');
assert.ok(vis('[data-mwp="back"]'), 'Back stays');
assert.ok(vis('[data-mwp="sum-cta"]') && vis('[data-mwp="cta-book"]') && vis('[data-mwp="cta-see"]'), 'both summary buttons on the last stage');
assert.ok(R.classList.contains('mwp-cta-active'));
q('[data-mwp="cta-see"]').click();
await tick();
assert.equal(q('[data-mwp="result"]').getAttribute('data-active'), 'true', 'See assessment shows the result');
assert.ok(vis('[data-mwp="result"]') && !vis('[data-mwp="book-panel"]'));
assert.ok(vis('[data-mwp="cta-book"]') && !vis('[data-mwp="cta-see"]'), 'result view: summary keeps only Book');
assert.equal(label(), 'Your results');
assert.equal(fig(), '£1,250–£4,000', 'worked example in docs/pricing-model.md');
assert.equal(q('[data-f="result_type"]').value, 'content-led');
assert.equal(R.querySelectorAll('[data-mwp="tip"]').length, 4, 'four tips apply (content, brand, features, shared)');
assert.equal(q('[data-mwp="graph-h"]').textContent, 'What makes up the cost', 'result heading');
const summary = q('[data-mwp="shaping"]').textContent;
assert.equal(
  summary,
  'You’re planning a new website (up to five pages), with a logo already in place, content that needs shaping and some existing imagery, plus a blog and a booking system. It’s a clear brief and a sensible place to start.',
  'summary paragraph'
);
assert.equal(q('[data-f="recommendation"]').value, summary, 'summary is sent as the recommendation');
const boxes = [...R.querySelectorAll('[data-mwp="reco"]')];
assert.deepEqual(boxes.map((b) => b.querySelector('h4').textContent), ['Your website', 'Your brand', 'Your content', 'Your images', 'Your functionality'], 'five blocks, in order');
assert.ok(boxes.every((b) => b.classList.contains('mwp-reco')), 'blocks carry the mwp-reco class');
assert.ok(boxes[0].classList.contains('is-website') && boxes[4].classList.contains('is-complex'), 'block colour classes');
assert.ok(boxes[2].textContent.includes('shaping something rough'), 'content block follows the content answer');
assert.ok(boxes[4].textContent.includes('firm ideas'), 'functionality block: features picked');
assert.ok(R.classList.contains('mwp-result-active'), 'result flag for the dock');
q('[data-mwp="cta-book"]').click();
await tick();
assert.ok(vis('[data-mwp="book-panel"]') && !vis('[data-mwp="result"]'), 'Book shows the booking panel');
assert.equal(q('[data-mwp="book-panel"]').getAttribute('data-active'), 'true');
assert.equal(q('[data-mwp="book"]').hidden, false, 'booking form visible');
assert.ok(vis('[data-mwp="cta-see"]') && !vis('[data-mwp="cta-book"]'), 'book view: summary offers See assessment');
assert.equal(label(), 'Book a free chat');
assert.ok(R.classList.contains('mwp-book-active') && !R.classList.contains('mwp-result-active'));
q('[data-mwp="cta-see"]').click();
assert.ok(vis('[data-mwp="result"]'), 'back to the assessment');
assert.equal(R.querySelectorAll('[data-mwp="tip"]').length, 4, 'tips still there');

// Second walk: "not sure" size, help with brand and writing, little imagery, no features, an improvement note.
{
  const d2 = new JSDOM(`<!doctype html><body>${readFileSync('test/fixture.html', 'utf8')}</body>`, { runScripts: 'outside-only' });
  const w2 = d2.window;
  w2.matchMedia = () => ({ matches: false });
  w2.HTMLElement.prototype.scrollIntoView = function () {};
  w2.scrollTo = function () {};
  w2.MWP_PREFS = { improvementNote: 'Extra note for improvements.' };
  w2.eval(readFileSync(process.argv[2] || 'dist/mwp-estimate.js', 'utf8'));
  if (w2.document.readyState === 'loading') await new Promise((r) => w2.document.addEventListener('DOMContentLoaded', r));
  const R2 = w2.document.getElementById('mwp-adv');
  const q2 = (s) => R2.querySelector(s);
  const pick2 = (stage, id) => q2(`[data-stage="${stage}"] [data-answer-id="${id}"]`).click();
  const next2 = () => q2('[data-mwp="next"]').click();
  pick2('project_type', 'improvement'); next2();
  pick2('website_size', 'notsure'); next2();
  pick2('brand_state', 'brand-help'); next2();
  pick2('content_state', 'help'); next2();
  pick2('visual_assets', 'little'); next2();
  q2('[data-mwp="cta-see"]').click();
  assert.equal(q2('[data-mwp="est-figure"]').textContent, '£1,750–£2,500', 'not-sure size uses the small content price; brand help £150–£300; little imagery £250–£500');
  assert.equal(
    q2('[data-mwp="shaping"]').textContent,
    'You’re planning improvements to your existing website, with brand work still to do, content still to be written and little imagery so far. It’s a clear brief and a sensible place to start.'
  );
  const bx = [...R2.querySelectorAll('[data-mwp="reco"]')];
  assert.ok(bx[0].textContent.includes('Extra note for improvements.'), 'improvement note added to Your website');
  assert.ok(bx[2].textContent.includes('starting from scratch'), 'content block for "write it for us"');
  assert.ok(bx[4].textContent.includes('no-pressure, zero-obligation chat'), 'functionality block: no features picked');
  assert.equal(q2('[data-f="result_type"]').value, 'brand-led');
}
console.log('smoke: all checks passed');
