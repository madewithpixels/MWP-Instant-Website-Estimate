# Changelog

## v3.0.1 — 4 November 2026

Same code as v3.0.0. jsDelivr cached the `@3.0.0` URL while the tag briefly pointed at the wrong commit, so it kept serving v2.0.0 files. Use `@3.0.1`. Do not move or re-create a published tag.

## v3.0.0

**Breaking (markup contract):** new answer ids, a new result screen. The Webflow page must be updated with this release. See `docs/webflow-setup.md`. Specified by Michael Auty on 4 November 2026 (scoping notes: `claude/estimate-v3-scoping-notes.md` in the Claude project).

### Changed — questions and prices
- **Step 1** has four answers: new site, redesign, improvements, "Help building integrated business tools" (a route to a call, no price). "I'm not sure" is gone.
- **Step 2**: small (1–5 pages) £500–£1,500, medium (5–15) £1,000–£3,000, large (15–30+) £3,000–£5,000, not sure £1,000. No single-page answer.
- **Step 3** (brand), three answers: logo and guidelines £0, logo £0, need help £150–£300. Ids `established`, `logo-only`, `brand-help`; `logo-assets` removed.
- **Step 4** (content), three answers: written and approved £0; exists, needs refining (`some`) £150–£350 / £350–£500 / £500–£1,000 by size; need help writing (`help`) £350–£700 / £500–£1,000 / £750–£1,500. `most` removed. "Not sure" size uses the small figures.
- **Step 5** (images): "mostly phone photos" and "not sure" removed; "little or none" is £250–£500.
- **Step 6** (features): new `social` (social media campaign, £500–£1,000).
- **Side panel** sub-heading while answering: "Answer the questions, the price updates as you go".

### Changed — result screen
- One **summary paragraph** (`data-mwp="shaping"`) built from the answers (`summary` in prefs), then five blocks in `data-mwp="recos"`: Your website, brand, content (three versions), images, functionality (two routes). Copy in `blocks` in prefs. `is-website` is styled by the tool's CSS; the other four use the existing Webflow combos.
- The badge and lead line (`result-type`, `result-sub`) no longer get written; `resultTypes` and `recommendations` are gone from prefs. `result_type` is still sent in the hidden form.
- The price no longer needs to appear in the left card (`big-est`, `big-est-caveat` are optional).
- `recommendation` in the form is now the summary paragraph.
- Tips (`tips.js`) stay. The "phone photos" tip rule now only fires for "little or none".

### Removed
- `advice.js` and the optional `advice` / `advice-list` markup (the per-answer advice lines from v2.0.0).

## v2.0.0 — 2026-11-04

### Changed — assessment screen copy and advice lines (R-051, R-050; wording approved by Michael 2–3 Nov 2026)
- **Tighter copy** in `prefs.js`: result lead line ("A focused project with a clear way forward: good news for both budget and timing."), progress label "Your results", result graph heading "What makes up the cost" / "Each part of your project adds to the range.", booking progress label "Book a free chat". New prefs key `stageGraph` ("Your estimate so far" / "Each answer updates the range as you go.") replaces the hard-coded heading during the questions and also sets the sub-line. The content-led, brand-led, asset-led and "more involved" lead lines are rewritten in the same friendly, advice-first voice (drafted by Claude, 4 Nov 2026: Michael to approve).
- **Shaping paragraph** (`engine.js`): "From your answers, a {size} looks like the right fit…", and "Not sure" no longer reads as a project size.
- **Tips** (`tips.js`): the two shared tips are shortened as approved.

### Added
- **Per-answer advice lines** (`advice.js`, new optional `data-mwp="advice"` / `advice-list` markup): one short line for each answer on questions 1–5, plus up to three for the features picked, capped at six in total ("not sure" lines go first). Copy as approved by Michael on 3 Nov 2026.

### Changed — end of the journey (markup contract change)
- **Step 6 moves on from the summary box.** On the last stage the Next buttons are hidden (Back stays) and the summary box shows **Book a consultation** and **See assessment** (`data-mwp="sum-cta"`, class `IWA Sum CTA`). On desktop the row is sticky to the bottom of the screen, so the buttons stay visible even when the summary box is taller than the window. On mobile they sit side by side in the dock under the total.
- **See assessment** shows the result panel in the left column; the summary box then keeps only Book. **Book a consultation** shows the new booking panel (`data-mwp="book-panel"`) in the left column; the summary box then offers See assessment. Both screens share one computed result, so switching is instant.
- **Result screen** ends with **Get this assessment by email** (`cta-send`, relabelled). The Book button moved out of the result panel into the summary box.
- **Booking panel**: heading, intro, phone and email links (`book-tel`, `book-email`), the "No pressure" note, then the existing booking form, now always visible inside the panel. Name is focused when it opens, except on touch screens.
- **Mobile dock** stays on the result and booking screens, shrunk to the one remaining button (it used to disappear on the result screen). The engine now sets `.mwp-cta-active`, `.mwp-result-active` and `.mwp-book-active` on `#mwp-adv`; `dock.js` no longer watches the result panel.
- Switching screens scrolls the left column into view on tablet, mobile and short screens, or whenever it's off screen (`next-top.js`, `mwp:view` event from the engine).
- New prefs key `bookLabel` ('Book a consultation') for the progress label on the booking screen.

### Removed
- `book-reveal.js` and its embed. The engine now handles the booking view.

### Added
- **Next beside each question** (`next-top.js`, `next-top.css`): each stage's heading sits in a `data-mwp="q-row"` row with a second Next button on the right, lined up with the options. It clicks the main Next, so the engine's rules still apply. Both Next buttons now get `aria-disabled="true"` (dimmed, `not-allowed` cursor) until a single-choice stage is answered.
- **Scroll to the progress bar on Next** (`next-top.js`): on tablet, mobile and short screens (`scrollOnNext`, default `(max-width: 991px), (max-height: 800px)`), moving to the next stage or the result smooth-scrolls the progress bar to the top, below the navbar. It uses the same Lenis-safe scroll as the launcher and stops if the visitor scrolls.
- **"Get started" launcher** (`start.js`, `start.css`): before starting, the progress wrapper (`data-mwp="progress-wrap"`) is fixed at the bottom of the screen and reads "Get started" (`startLabel`). Clicking it, or pressing Enter/Space, adds `.mwp-started` to `#mwp-adv`, which puts the wrapper back at the top of the widget, restores the step label and smooth-scrolls the widget into view (`scroll-margin-top: 6rem` clears the navbar). Scrolling down to the questions, or clicking an answer, starts it without scrolling. On mobile the estimate dock stays hidden until started. Before starting, the bar is styled as a solid `var(--raspberry)` button (`start.css`): progress pips hidden, label centred at 1.25rem/700 with an arrow, and a hover lift. The switch is animated. Started by scrolling, the button glides from the bottom of the screen into its slot (FLIP), fades to the panel colours, and the progress pips grow in from the left one by one. Started by clicking, it rises into place while the page scrolls. Placeholder padding on `#mwp-adv` reserves the slot, so nothing below jumps. Reduced-motion users get the instant switch.

### Changed
- **Website size prices** (Webflow option attributes): single page £500–£850, small £850–£1,500, medium £1,500–£3,000, larger £3,000–£5,000. "Not sure" is now a flat £1,000 (the £500 from stage 1 plus £500), instead of £2,500–£5,000.
- **Stage 1 shows in the breakdown**: a stage 1 answer puts the £500 start figure on the Website bar, labelled with the answer (e.g. "A brand new website"), so the bars react before Next. Before, stage 1 had no bar, so the breakdown looked a step behind. A website size replaces it.
- **Single-figure ranges**: when both ends match, the engine shows one figure ("£1,000", not "£1,000–£1,000") in the running estimate, bars, drivers and final estimate.

### Webflow-side changes shipped alongside
- 22 Sep (journey change): new `IWA Sum CTA` class (flex, 12px gaps, sticky bottom with the panel background; static from Tablet down, no top padding and no wrap at Mobile Landscape). `sum-cta` row added to the summary box, holding the moved `cta-book` ("Book a consultation") and a new `cta-see` (`IWA Btn` + `IWA Btn Ghost`). New `book-panel` after the result panel (`IWA Panel` + `MWP Result Panel`) with `IWA Result H2`, `IWA Result Sub`, an `IWA CTA Row` of phone/email links, the moved "No pressure" note and the booking form (its `hidden` attribute removed). `cta-send` relabelled "Get this assessment by email". `mwp-adv-book-reveal` embed deleted; prefs, engine, dock and next-top embeds updated from `src/`.
- Removed the "What's driving your estimate" heading and `data-mwp="drivers"` list from the result panel, because they repeated the summary box. No code change: the engine skips the list when the element is missing.
- New class `IWA Question Row` (flex, space-between, centred, 1.5rem gap, 2rem bottom margin). `IWA Question` bottom margin moved to the row (now 0). Six rows added, one per stage, each holding the heading and an `IWA Btn` + `IWA Btn Primary` link with `data-mwp="next-top"`. New embed `mwp-adv-next-top`.
- New caveat lines, "Final price depends on scope and design revisions." (class `IWA Est Note`): `data-mwp="est-caveat"` under the running figure and `data-mwp="big-est-caveat"` under the final estimate. `dock.css` hides `est-caveat` in the collapsed mobile dock.
- Collapsed mobile dock: the dotted `IWA Est` top border is hidden (`dock.css`) and comes back when the dock is expanded, above the total.
- `Estimate Intro`: `min-height: 100svh`. `IWA Progress Wrapper`: fixed at the bottom (Michael's design).
- `IWA Progress Wrapper` element: new attribute `data-mwp="progress-wrap"`.
- New embed `mwp-adv-start`, until the page moves to the CDN.

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
