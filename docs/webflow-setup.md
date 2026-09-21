# Webflow setup & migration

## Where things live today (21 Sep 2026)

On `madewithpixels-dev` → **Estimate** page, the tool runs from **seven HTML Embed elements** inside the page, plus one site-wide rule:

| Embed (first line)                          | Replaced by                        |
| ------------------------------------------- | ---------------------------------- |
| `<style>` MWP Assessment — functional CSS   | `src/css/assessment.css`           |
| `<script id="mwp-adv-prefs">`               | `src/js/prefs.js` (defaults)       |
| `<script id="mwp-adv-engine">`              | `src/js/engine.js`                 |
| `<script id="mwp-adv-book-reveal">`         | `src/js/book-reveal.js`            |
| `<script id="mwp-adv-rating">`              | `src/js/rating.js`                 |
| `<script id="mwp-adv-tips">`                | `src/js/tips.js`                   |
| `<style>` + `<script id="mwp-adv-dock">`    | `src/css/dock.css` + `src/js/dock.js` |

The site's **Head code** (Site settings → Custom code) also has `.iwa-panel .mwp-result-panel { … }`, which resets the panel styling on the result screen. It's site-wide and unrelated to loading, so leave it where it is. You could move it onto the `MWP Result Panel` class in the Designer later.

## Migrating to the CDN build

Do it in one go. If the embeds and the CDN bundle are both on the page, the engine binds twice and every click toggles twice.

1. **Tag a release** (see [releasing.md](releasing.md)) and check the files load:
   `https://cdn.jsdelivr.net/gh/madewithpixels/MWP-Instant-Website-Estimate@v1.0.0/dist/mwp-estimate.min.js`
2. **If you've changed anything in the live prefs embed** that differs from `src/js/prefs.js`, either commit that change to the repo first or keep it as an override (step 4). As of 21 Sep 2026 the two are identical, apart from the new `startFigure` key, which the engine defaults to 500 anyway.
3. In the Designer, **delete the seven embeds** listed above. Keep all other elements. The `tips` block, `data-f` hidden inputs, rating blocks and so on are markup, not code.
4. *(Optional)* Add a page-level override, before the bundle, using [`webflow/prefs-override.html`](../webflow/prefs-override.html).
5. Paste [`webflow/install.html`](../webflow/install.html) into **Page settings → Custom code → Before `</body>`**.
6. Publish to staging and run through the checklist below.

## Staging checklist

Test on desktop and on a phone-width viewport (under 768px):

- [ ] Figure shows **£0** on load, **£500** after any stage 1 answer (and on hover), and a range once a website size is chosen.
- [ ] Hovering or focusing an option previews the bars with the "preview" flag. Moving away restores the committed state.
- [ ] Next is disabled until a single-choice stage has an answer. Back clears later answers.
- [ ] Result screen: badge colour matches type, drivers list, big estimate, tips, recommendations.
- [ ] Mobile: the dock shows just the total and "Breakdown". Tapping it opens the bars. Back/Next sit inside the panel above the dock. The dock disappears on the result screen.
- [ ] "Book a call" reveals the booking form and focuses Name. Stars can be clicked and used with the keyboard.
- [ ] Submit the send/book forms and confirm the hidden `data-f` fields arrive in Webflow form submissions.
- [ ] Browser console shows no errors. `window.__MWP_ESTIMATE_LOADED__` returns the expected version.

## Rolling back

Point the two tags at the previous version (`@v1.0.0` → `@v0.x.y`) and publish. Webflow's page backups still have the embed version if you need to go further back.
