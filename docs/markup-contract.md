# Markup contract

The scripts find everything through `data-*` attributes inside **one root element**:

```html
<section id="mwp-adv"> … </section>
```

Webflow class names (`IWA Panel`, `IWA Option`, `mwp-dock-tiles` and so on) are **only for styling**. You can rename them without touching this repo. The attributes below are the contract. If you rename or remove one, the matching feature stops working and nothing reports an error.

"Required" means the core flow breaks without it. "Optional" features skip themselves when their element is missing.

## Stages and options

| Attribute | On | Required | Notes |
| --- | --- | --- | --- |
| `data-stage="<id>"` | stage wrapper | ✔ | Order in the DOM = step order. The engine expects these ids: `project_type`, `website_size`, `brand_state`, `content_state`, `visual_assets`, `features`. |
| `data-select="single\|multi"` | stage wrapper | ✔ | Single stages must be answered before Next; multi stages can be skipped. |
| `data-cat="website\|brand\|content\|assets\|func"` | stage wrapper | – | Descriptive only. |
| `data-active="true\|false"` | stage wrapper, result | – | Set by the engine. Stages are shown and hidden with inline `display`, so all of them stay visible in the Designer. |
| `data-answer-id="<id>"` | option (link / button) | ✔ | Clickable, and responds to Space and Enter. The engine sets `aria-pressed` (single) or `aria-checked` (multi) and the `.is-selected` class. |
| `data-label` | option | ✔ | Text used in summaries and the "shaping" sentence. Falls back to the option's text. |
| `data-result-tags` | option | – | Space-separated tags written to `complexity_tags`. |
| Price attributes | option | – | See [pricing-model.md](pricing-model.md). |

## Navigation & progress

| Attribute | Purpose |
| --- | --- |
| `data-mwp="nav"` | Back/Next row. Hidden on the result and booking screens. |
| `data-mwp="back"`, `data-mwp="next"` | Buttons. Next is hidden on the last stage, where the summary box buttons take over. Next gets `aria-disabled="true"` while the active single-choice stage is unanswered. |
| `data-mwp="q-row"` → `data-mwp="q"` + `data-mwp="next-top"` | Heading row in each stage (class `IWA Question Row`): the question plus an extra Next button lined up with the right edge of the options. `next-top` clicks the main Next and gets the same `aria-disabled` state. Any `next-top` in the last stage is hidden. |
| `data-mwp="progress"` | Gets `aria-valuenow`. |
| `data-mwp="pstep"` | One per stage. Gets `.is-done` / `.is-current`. |
| `data-mwp="stage-label"` | Text is set to "Step n of 6 — …". Shows `startLabel` ("Get started") until the visitor starts. |
| `data-mwp="progress-wrap"` | Wrapper around the stage label and progress. Before starting it's the fixed "Get started" button (its Webflow class, `IWA Progress Wrapper`, positions it). Starting adds `.mwp-started` to `#mwp-adv`, which puts it back in the flow at the top of the widget and scrolls the widget into view. |

## Live graph (graph column / mobile dock)

| Attribute | Purpose |
| --- | --- |
| `data-mwp="graph-col"` | Graph column. Becomes the fixed dock under 768px. Gets `.is-open`. |
| `data-mwp="graph-h"`, `data-mwp="graph-sub"` | Heading and sub. Copy changes on the result screen. |
| `data-mwp="bars"` | Bar rows wrapper. Hidden in the collapsed mobile dock. |
| `data-fill="<cat>"` | Bar fill. Width is set as a % of the category's scale. |
| `data-val="<cat>"` | "£a–£b" or "—". |
| `data-mwp="est"` | Total row. Tapping it toggles the dock on mobile. |
| `data-mwp="est-figure"` | Running estimate (£0 → £500 → range). |
| `data-mwp="est-note"` | Bespoke-functionality note. |
| `data-mwp="est-caveat"` | Static line under the running figure ("Final price depends on scope and design revisions."). Edit the copy in Webflow. Hidden in the collapsed mobile dock and shown when it's expanded. |
| `data-mwp="preview-flag"` | Shown while previewing on hover or focus. |
| `data-mwp="dock-hint"`, `data-mwp="dock-chev"` | "Breakdown" / "Less detail" text and chevron. |
| `data-mwp="dock-tiles"`, `data-short="<cat>"` | Compact tiles. Hidden at Mobile since 1.0.0 but still kept up to date. |
| `data-choice="<cat>"` | *Optional.* Shows the chosen answer label per category. |
| `data-mwp="sum-cta"` | Button row at the bottom of the summary box (class `IWA Sum CTA`, sticky to the bottom of the screen on desktop). Hidden until the last stage. Holds `cta-book` and `cta-see`. |
| `data-mwp="cta-book"` | "Book a consultation". Shows the booking panel in the left column. Shown on the last stage and the result screen. `href` set from `links.bookingUrl`. |
| `data-mwp="cta-see"` | "See assessment". Shows the result panel in the left column. Shown on the last stage and the booking screen. |

## Result screen

| Attribute | Purpose |
| --- | --- |
| `data-mwp="result"` | Result panel. `data-active="true"` while showing. |
| `data-mwp="result-type"` | Badge. Also gets `data-type="standard\|content-led\|brand-led\|asset-led\|complex"` for colour. |
| `data-mwp="result-sub"`, `data-mwp="shaping"` | Result copy. |
| `data-mwp="drivers"` | *Optional.* Filled with `.mwp-driver` rows (one per category with a price, using `driverCopy`). Removed from the page on 22 Sep 2026 because it repeated the summary box. The engine skips it when it's missing, so adding the element back brings it back. |
| `data-mwp="big-est"` | Final range (+ "bespoke functionality to be scoped"). |
| `data-mwp="big-est-caveat"` | Static line under the final range. Edit the copy in Webflow. The scripts don't touch it. |
| `data-mwp="tips"` → `data-mwp="tips-list"` | Lower-end tips. `tips.js` fills the list with `<p class="iwa-fine-print" data-mwp="tip">`. The whole block is hidden when no tip applies. |
| `data-mwp="recos"` | Filled with `.mwp-reco.is-<key>` boxes (`h4.mwp-reco-h`, `p.mwp-reco-p`). |
| `data-mwp="cta-send"` | "Get this assessment by email". Toggles the send form `data-mwp="send"` and focuses `data-mwp="email"`. |
| `data-mwp="send-go"`, `data-mwp="send-ok"`, `data-f="email"` | *Optional* custom send flow. It isn't on the page as of Sep 2026, where the send form submits natively through Webflow. |
| `data-mwp="rating"` → `data-rate="1..5"` + `input[data-mwp="rating-value"]` | Star rating. Any number of rating blocks is supported. |

## Booking screen

| Attribute | Purpose |
| --- | --- |
| `data-mwp="book-panel"` | Booking panel in the left column (classes `IWA Panel` + `MWP Result Panel`). `data-active="true"` and shown while booking. |
| `data-mwp="book-tel"`, `data-mwp="book-email"` | Phone and email links. Plain Webflow links, no script. |
| `data-mwp="book"`, `data-mwp="book-first"` | Booking form (always visible inside the panel) and the field focused when the panel opens (not on touch screens). |

## Hidden form fields

Hidden `<input data-f="…">` fields inside the forms carry the assessment into Webflow form submissions. The engine keeps them in sync on every answer and on the result screen:

`project_type`, `website_size`, `brand_state`, `content_state`, `visual_assets`, `features` (comma-separated), `estimate_min`, `estimate_max`, `result_type`, `complexity_tags`, `recommendation`.

`tips.js` also reads `content_state`, `visual_assets`, `brand_state` and `features` from these fields, so keep them in the markup.

## Classes the scripts add

`.mwp-started`, `.mwp-cta-active`, `.mwp-result-active`, `.mwp-book-active` (all on `#mwp-adv`), `.is-selected`, `.is-done`, `.is-current`, `.is-preview`, `.is-open`, `.mwp-driver`, `.mwp-driver-h`, `.mwp-driver-p`, `.mwp-reco`, `.mwp-reco-h`, `.mwp-reco-p`, `.iwa-fine-print` (tips). Style the generated ones in Webflow by creating classes with those exact names.
