# Changelog

## v1.0.0 — 2026-09-21

First release as a standalone repo. The code moved out of the Webflow page's inline embeds.

### Added
- **Build & distribution**: `src/` → `dist/mwp-estimate(.min).js|css` via esbuild, served through jsDelivr. The bundle runs on DOM ready and guards against loading twice.
- **Prefs overrides**: `window.MWP_PREFS` set on the page now shallow-merges over the bundled defaults.
- **Lower-end tips** (`tips.js`): tips on the result screen for keeping costs down, chosen from the visitor's answers.
- **Smoke test**: jsdom test against a minimal copy of the markup.

### Changed
- **Running figure** starts at £0 and shows £500 (`startFigure`) after any stage 1 answer. It's replaced by the real range once a website size is chosen. Totals from stage 2 onward are unchanged.
- **Mobile dock**: compact tiles hidden in the collapsed dock (`mwp-dock-tiles` → `display: none` at Mobile), so it's just the total and Breakdown toggle. The question panel clears the dock with `margin-bottom: 110px` (was `padding-bottom: 170px`).
- **Mobile Back/Next**: `IWA Nav` no longer translates down 100% at Mobile, so the buttons sit inside the panel instead of on top of the dock.

### Webflow-side changes shipped alongside
- `mwp-dock-tiles` class: `display: none` at Mobile.
- `IWA Nav` class: `transform: translate(0px, 0px)` at Mobile.
- New elements: `data-mwp="tips"` block containing `tips-h` (IWA Eyebrow) and `tips-list`.
