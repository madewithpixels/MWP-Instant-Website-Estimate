// Smoke test: loads dist/mwp-estimate.js into test/fixture.html (jsdom) and
// walks the flow. Run after `npm run build`:  npm test
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!doctype html><body>${readFileSync('test/fixture.html', 'utf8')}</body>`, { runScripts: 'outside-only' });
const { window } = dom;
window.matchMedia = () => ({ matches: false });
window.eval(readFileSync(process.argv[2] || 'dist/mwp-estimate.js', 'utf8'));
if (window.document.readyState === 'loading') await new Promise((r) => window.document.addEventListener('DOMContentLoaded', r));

const R = window.document.getElementById('mwp-adv');
const q = (s) => R.querySelector(s);
const fig = () => q('[data-mwp="est-figure"]').textContent;
const pick = (stage, id) => q(`[data-stage="${stage}"] [data-answer-id="${id}"]`).click();
const next = () => q('[data-mwp="next"]').click();
const tick = () => new Promise((r) => setTimeout(r, 0));

assert.equal(fig(), '£0', 'starts at £0');
pick('project_type', 'redesign');
assert.equal(fig(), '£500', 'stage 1 answer shows start figure');
pick('project_type', 'redesign');
assert.equal(fig(), '£0', 'deselecting stage 1 returns to £0');
pick('project_type', 'new-site'); next();
pick('website_size', 'small');
assert.equal(fig(), '£2,500–£3,500', 'stage 2 replaces start figure with website base');
next(); pick('brand_state', 'logo-only'); next(); pick('content_state', 'some'); next(); pick('visual_assets', 'phone'); next();
pick('features', 'blog'); next();
await tick();
assert.equal(q('[data-mwp="result"]').getAttribute('data-active'), 'true', 'result shows');
assert.equal(q('[data-mwp="big-est"]').textContent, '£3,500–£6,000', 'matches live page for the same answers');
assert.equal(q('[data-f="result_type"]').value, 'content-led');
assert.equal(R.querySelectorAll('[data-mwp="tip"]').length, 5, 'all five tips apply');
assert.ok(R.classList.contains('mwp-result-active'), 'dock flagged hidden on result');
console.log('smoke: all checks passed');
