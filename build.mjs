// Builds dist/mwp-estimate(.min).js and dist/mwp-estimate(.min).css from src/.
// Usage: npm run build        (writes dist/)
//        npm run check        (syntax-checks the bundle, writes nothing)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { transformSync } from 'esbuild';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const CHECK = process.argv.includes('--check');

// Order matters: prefs must exist before the engine reads them. The other
// modules only need the markup and MutationObserver, so they follow.
const JS = ['prefs', 'engine', 'book-reveal', 'rating', 'tips', 'dock', 'start', 'next-top'];
const CSS = ['assessment', 'dock', 'start', 'next-top'];

const banner = `/*! MWP Instant Website Estimate v${pkg.version} | madewithpixels.co.uk | github.com/madewithpixels/MWP-Instant-Website-Estimate */`;

const body = JS.map((n) => `/* ---- ${n}.js ---- */\n` + readFileSync(`src/js/${n}.js`, 'utf8')).join('\n');

// Run once the DOM is ready, whether the file is loaded in <head>, with
// defer, or in the page footer.
const js = `${banner}
(function () {
  'use strict';
  if (window.__MWP_ESTIMATE_LOADED__) return;
  window.__MWP_ESTIMATE_LOADED__ = '${pkg.version}';
  function run() {
${body}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
`;
const css = `${banner}\n` + CSS.map((n) => readFileSync(`src/css/${n}.css`, 'utf8')).join('\n');

const jsMin = transformSync(js, { minify: true, loader: 'js', target: 'es2017', legalComments: 'inline' }).code;
const cssMin = transformSync(css, { minify: true, loader: 'css', legalComments: 'inline' }).code;

if (CHECK) {
  console.log(`OK — v${pkg.version}: js ${jsMin.length} B min, css ${cssMin.length} B min`);
} else {
  mkdirSync('dist', { recursive: true });
  writeFileSync('dist/mwp-estimate.js', js);
  writeFileSync('dist/mwp-estimate.min.js', jsMin);
  writeFileSync('dist/mwp-estimate.css', css);
  writeFileSync('dist/mwp-estimate.min.css', cssMin);
  console.log(`Built v${pkg.version} → dist/ (js ${jsMin.length} B, css ${cssMin.length} B minified)`);
}
