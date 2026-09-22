# MWP Instant Website Estimate

The Q&A estimate tool behind [madewithpixels.co.uk/estimate](https://madewithpixels-dev.webflow.io/estimate). A visitor answers six short questions about their project, watches the estimate build live, then sees an indicative price range, what's driving it, tailored recommendations and ways to keep costs towards the lower end.

The **markup and visual design live in Webflow**. This repo holds the **behaviour and functional CSS**, and it's served to the page from jsDelivr.

```
Webflow page (structure, classes, copy)  ──►  data-* attributes  ◄──  dist/mwp-estimate.min.js + .css (this repo, via jsDelivr)
```

## Install on a Webflow page

Put this in **Page settings → Custom code → Before `</body>`**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/madewithpixels/MWP-Instant-Website-Estimate@v1.0.0/dist/mwp-estimate.min.css" />
<script src="https://cdn.jsdelivr.net/gh/madewithpixels/MWP-Instant-Website-Estimate@v1.0.0/dist/mwp-estimate.min.js"></script>
```

The page needs a `<section id="mwp-adv">` built to the [markup contract](docs/markup-contract.md). To override settings such as the booking URL or the start figure without a new release, see [configuration](docs/configuration.md).

When you move the live page over from its inline embeds, follow [docs/webflow-setup.md](docs/webflow-setup.md), because the embeds have to be removed at the same time.

## Repo layout

```
src/js/
  prefs.js         Default settings (window.MWP_PREFS). Pages can override top-level keys.
  engine.js        Stages, answers, pricing, live graph, result panel, hidden form sync.
  book-reveal.js   "Book a call" button reveals the booking form.
  rating.js        Star rating widgets.
  tips.js          "Keeping costs towards the lower end" tips on the result screen.
  dock.js          Mobile estimate dock (collapse/expand, compact tiles, hide on result).
  start.js         "Get started" launcher: fixed progress bar that drops into place on start.
  next-top.js      Extra Next button beside each question; disabled state for both Next buttons.
src/css/
  assessment.css   Functional CSS: bar fills, badges, JS-toggled states, rating.
  dock.css         Mobile dock rules that depend on JS-toggled parent classes.
  start.css        Launcher states (before/after .mwp-started).
  next-top.css     Top Next button: no-wrap and disabled state.
dist/              Built files served by jsDelivr (committed on purpose).
test/              jsdom smoke test against a minimal copy of the markup.
webflow/           Paste-ready snippets for Webflow custom code.
docs/              Setup, markup contract, pricing model, configuration, releasing, roadmap.
```

## Development

```bash
npm install
npm run build   # src/ → dist/ (full + minified JS and CSS)
npm test        # builds, then runs the smoke test on both bundles
```

The build joins the modules in dependency order, with prefs before engine, and wraps them in one DOM-ready runner. That means the bundle works whether it loads in `<head>`, with `defer`, or in the footer. A guard stops it running twice if it's included twice.

The smoke test checks the headline behaviour: the figure starts at £0, goes to £500 after stage 1, and a known set of answers gives the same range as the live page. It also checks the result type and the tips.

## Docs

- [Webflow setup & migration](docs/webflow-setup.md)
- [Markup contract](docs/markup-contract.md): every `data-*` hook the scripts rely on
- [Pricing model](docs/pricing-model.md): how the estimate is calculated
- [Configuration](docs/configuration.md): `MWP_PREFS` reference
- [Releasing](docs/releasing.md): versioning, tagging and jsDelivr cache
- [Roadmap](docs/roadmap.md): what's next — v1.1.0 release, CDN migration, booking link, copy into prefs
- [Changelog](CHANGELOG.md)

## Principles

- **Design stays in Webflow.** Anything the Webflow Style panel can express belongs on a class, not in this CSS. `src/css` only holds states the Designer can't show: JS-toggled classes, attribute selectors and parent-state rules.
- **Hooks are `data-*` attributes, not class names**, so you can rename or restyle classes freely.
- **No framework, no dependencies at runtime.** Plain ES5-style JavaScript in IIFEs.

© MadewithPixels. All rights reserved.
