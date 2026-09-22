# MWP Instant Estimate — Roadmap

22 Sep 2026 · Michael Auty

## Where it stands

The tool works and is committed, but the latest features aren't released yet and the live page still runs on inline embeds.

- **Repo:** `main` has no uncommitted changes and matches GitHub. There's one tag, `v1.0.0` (21 Sep 2026).
- **Unreleased work:** the last commit ("Cost and layout amendments") adds the "Get started" launcher, the Next button beside each question, scroll-on-Next and the new website size prices. It's committed but untagged, listed under *Unreleased* in the changelog.
- **Live page:** the Estimate page on `madewithpixels-dev` still runs from nine HTML Embed elements, not the jsDelivr bundle.
- **Tests:** `npm test` builds and runs the jsdom smoke test on both bundles.

## Next release: v1.1.0

The unreleased work should ship as **v1.1.0**: it adds features and new prefs keys (`startLabel`, `scrollOnNext`) without breaking existing pages.

There's a version mismatch to fix first. `package.json` still says `1.0.0`, so the committed `dist/` files contain the new code but carry a v1.0.0 banner. They'd also report `1.0.0` from `window.__MWP_ESTIMATE_LOADED__`.

- [ ] Bump `version` in `package.json` to `1.1.0`
- [ ] Run `npm test` to rebuild `dist/` with the right banner
- [ ] Rename *Unreleased* to *v1.1.0* in `CHANGELOG.md`, with the date
- [ ] Update the `@v1.0.0` URLs in `README.md` and `webflow/install.html` to `@v1.1.0`
- [ ] Commit, tag `v1.1.0`, push with tags
- [ ] Check both files load from jsDelivr at `@v1.1.0`

## CDN migration

Once v1.1.0 is tagged, move the Estimate page from its nine inline embeds to the jsDelivr bundle, all in one go. If the embeds and the bundle are both on the page, the engine binds twice and every click toggles twice.

1. Check whether the live prefs embed differs from `src/js/prefs.js`. If it does, commit the change or keep it as a page override.
2. Delete the nine embeds in the Designer. Keep all markup: the tips block, hidden `data-f` inputs and rating blocks stay.
3. *(Optional)* Add `webflow/prefs-override.html` before the bundle.
4. Paste `webflow/install.html` into Page settings → Custom code → Before `</body>`.
5. Publish to staging and run the checklist in `docs/webflow-setup.md` on desktop and at phone width.
6. Publish live.

The site-wide Head rule for `.iwa-panel .mwp-result-panel` stays where it is. It could move onto the `MWP Result Panel` class later.

The staging checklist still lists a "drivers list" check on the result screen. That list came off the page on 22 Sep, so drop that item.

## Booking link (`links.bookingUrl`)

The placeholder booking URL is cosmetic, not a launch blocker. Pointing it at the on-page form tidies it up.

**What it is.** `links.bookingUrl` is a setting in `prefs.js`, and its default is `#REPLACE_WITH_BOOKING_URL`. When the result screen loads, `engine.js` copies it into the `href` of the "Book a call" button (`data-mwp="cta-book"`).

**Why visitors don't see it.** A normal click never follows that link. `book-reveal.js` cancels the click (`preventDefault`) and opens the booking form on the page instead.

**Where the placeholder does show:**

- Hovering the button shows `…/estimate#REPLACE_WITH_BOOKING_URL` in the browser's status bar.
- Opening the button in a new tab, or copying its link, gives that URL.
- If the booking form were ever removed from the page, clicks would go to the placeholder.

| Option | Change | Effect |
| --- | --- | --- |
| **1. Point at the form (recommended)** | Give the booking form an ID in Webflow (e.g. `book-call`), set `bookingUrl: '#book-call'` | Link makes sense on hover and in a new tab. Click behaviour unchanged. |
| 2. External booking page | Set a Cal.com or Calendly URL | Clicks still open the on-page form. Only a new tab or copied link reaches the external page. |
| 3. Leave it | None | Nothing breaks. Looks unfinished to anyone who inspects the link. |

- [ ] Add the ID to the booking form in Webflow
- [ ] Set `bookingUrl` in `prefs.js`, and in `webflow/prefs-override.html` if you use it
- [ ] Remove the "placeholder, set before launch" note from `docs/configuration.md`

## Copy into prefs

Moving the remaining hard-coded copy into `MWP_PREFS` would let you edit wording with a page override, without cutting a release. It's backwards compatible, so it fits a minor version (v1.2.0 if v1.1.0 ships first).

| Copy | Where it lives now |
| --- | --- |
| Lower-end tips (text and `when` rules) | `TIPS` array in `src/js/tips.js` |
| "Next" / "See my assessment" | `engine.js`, Next button label |
| Shaping sentence | `shapingText()` in `engine.js` |
| "Thanks — we'll email your assessment to …" | `engine.js`, custom send flow |
| "Breakdown" / "Less detail" | `dock.js`, mobile dock hint |
| "What's shaping your estimate" graph heading | listed as hard-coded in `docs/configuration.md` |

The tips need care: their `when` rules are functions, so only the text can move cleanly into prefs. The rules could stay in code, keyed by tip ID.

## Smaller clean-ups and open questions

- **Unused pricing attributes:** content options carry `data-content-multiplier` and asset options carry `data-complexity`, but the engine doesn't use either for pricing. Remove them in Webflow, or leave them as notes.
- **Custom send flow:** `send-go` / `send-ok` handling is still in `engine.js`, though the page submits the send form natively through Webflow. Keep it as an option or remove it in a major release.
- **Head code rule:** move `.iwa-panel .mwp-result-panel` from Site settings onto the `MWP Result Panel` class.
- **Open question:** should going to production also mean moving from `madewithpixels-dev.webflow.io/estimate` to the live `madewithpixels.co.uk/estimate` URL in the README?
