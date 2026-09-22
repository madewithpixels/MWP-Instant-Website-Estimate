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
assert.equal(fig(), '£750–£1,500', 'stage 2 replaces start figure with website base (£850 rounds down to £750)');
next(); pick('brand_state', 'logo-only'); next(); pick('content_state', 'some'); next(); pick('visual_assets', 'phone'); next();
pick('features', 'blog'); next();
await tick();
assert.equal(q('[data-mwp="result"]').getAttribute('data-active'), 'true', 'result shows');
assert.equal(q('[data-mwp="big-est"]').textContent, '£1,750–£4,000', 'worked example in docs/pricing-model.md');
assert.equal(q('[data-f="result_type"]').value, 'content-led');
assert.equal(R.querySelectorAll('[data-mwp="tip"]').length, 5, 'all five tips apply');
assert.ok(R.classList.contains('mwp-result-active'), 'dock flagged hidden on result');
console.log('smoke: all checks passed');
