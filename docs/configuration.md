# Configuration (`window.MWP_PREFS`)

Defaults ship in the bundle (`src/js/prefs.js`). A page can override any **top-level key** by defining `window.MWP_PREFS` **before** the bundle loads:

```html
<script>
  window.MWP_PREFS = {
    startFigure: 500,
    links: { bookingUrl: 'https://cal.com/madewithpixels/intro', sendAssessmentMode: 'form' },
  };
</script>
```

The merge is **shallow**: `Object.assign(defaults, yourPrefs)`. If you override a key that holds an object or array (`links`, `contentMatrix`, `resultTypes` and so on), pass the **whole** value, because it replaces the default completely.

Use page overrides for quick tweaks and testing. When a change should stick, update `prefs.js` and cut a release.

## Keys

| Key | Default | What it does |
| --- | --- | --- |
| `behaviour.requireNext` | `true` | `false` moves on automatically after a single-choice answer (after `autoAdvanceMs`). |
| `behaviour.autoAdvanceMs` | `550` | Delay before auto-advancing. |
| `behaviour.previewOnHover` / `previewOnFocus` | `true` | Preview bars and figure on hover or keyboard focus. |
| `behaviour.clearOnBack` | `true` | Going Back clears answers from that stage onward. |
| `behaviour.respectReducedMotion` | `true` | Reserved. Reduced motion is handled in CSS. |
| `rounding.minDownTo` / `maxUpTo` | `250` / `500` | Rounding for the total range. |
| `startFigure` | `500` | Figure shown after a stage 1 answer, before a size is chosen. |
| `startLabel` | `'Get started'` | Text on the fixed progress bar before the visitor starts. |
| `scrollOnNext` | `'(max-width: 991px), (max-height: 800px)'` | Media query. When it matches (tablet, mobile, short screens), moving to the next stage scrolls the progress bar to the top of the viewport, below the navbar. Set `'none'` to turn it off. |
| `graphScale` | `null` | `null` = each bar's 100% is that category's highest possible max. Or pass `{ website: 8000, … }`. |
| `currency.symbol` / `locale` | `'£'` / `'en-GB'` | Money formatting. |
| `links.bookingUrl` | `'#REPLACE_WITH_BOOKING_URL'` | Set as the `href` of `cta-book`. **Still a placeholder:** set it before launch. |
| `links.sendAssessmentMode` | `'form'` | Reserved. |
| `categories` | 5 entries | Keys and labels for the bars and drivers. The keys must stay `website`, `brand`, `content`, `assets`, `func`. |
| `contentMatrix` | see [pricing](pricing-model.md) | Content cost by size × content state. |
| `cmsBands` | see [pricing](pricing-model.md) | CMS collection count → range. |
| `resultTypePriority` | `complex, brand-led, content-led, asset-led, standard` | Order in which result types are tested. |
| `resultTypes.<type>.badge` / `.sub` | copy | Badge text and sub-line on the result screen. |
| `driverCopy.<cat>` | copy | One line per category in the optional `drivers` list on the result screen. Unused while that element isn't on the page. |
| `recommendations.<key>.h` / `.p` | copy | Recommendation boxes (`brand`, `content`, `assets`, `complex`). |
| `bespokeNote` | copy | Note shown under the running figure when a consultation feature is selected. |
| `stageLabels` | 7 labels | "Step n of 6 — label", plus the result label. |
| `finalGraph.heading` / `.sub` | copy | Graph heading and sub on the result screen. |

## Copy that isn't in prefs (yet)

These strings are hard-coded. Change them in the source and cut a release:

- **Lower-end tips**: the `TIPS` array at the top of `src/js/tips.js`. Each tip has a `when(answers)` rule and `text`.
- **Shaping sentence**: `shapingText()` in `engine.js`.
- Button labels "Next" / "See my assessment", graph heading "What's shaping your estimate", dock "Breakdown" / "Less detail", and "Thanks — we'll email your assessment to …".

Moving these into prefs would make a full copy pass possible without releases. It's a good candidate for 1.1.
