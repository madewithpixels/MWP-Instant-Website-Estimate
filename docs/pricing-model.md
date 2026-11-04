# Pricing model

The estimate is the sum of five category ranges. Each category is `[min, max]`. The total is rounded **down** to the nearest `rounding.minDownTo` (£250) and **up** to the nearest `rounding.maxUpTo` (£500).

Prices come from two places:

- **Option attributes in Webflow** for website size, brand, visual assets and individual features. To change these, edit the attribute on the option in the Designer. No release needed.
- **`MWP_PREFS`** for the content matrix, CMS bands and the stage 1 start figure. See [configuration.md](configuration.md).

Values below are as of 4 November 2026 (v3.0.0, set by Michael Auty). When both ends of a range are equal it's shown as a single figure, e.g. £1,000.

## Running figure before a size is chosen

| State | Figure shown |
| --- | --- |
| No answers | **£0** |
| Any stage 1 (`project_type`) answer | **£500** (`startFigure`), shown on the Website bar with the stage 1 answer as its label |
| Website size chosen | Real computed range. The £500 is **not** added on top. |
| Website size "Not sure" | **£1,000**: the £500 from stage 1 plus another £500. |

Stage 1 doesn't add to the price. It moves the running figure off zero and gives the breakdown something to show straight away. Choosing a size replaces the £500 on the Website bar.

## Website: `data-base-min` / `data-base-max` on `website_size` options

| Option id | Label | Range |
| --- | --- | --- |
| `small` | Small: 1–5 pages | £500–£1,500 |
| `medium` | Medium: 5–15 pages | £1,000–£3,000 |
| `large` | Large: 15–30+ pages | £3,000–£5,000 |
| `notsure` | Not sure | £1,000 (`data-base-min` = `data-base-max` = 1000) |

There is no single-page option (v3.0.0): a one-page site prices as small.

## Brand: `data-brand-min` / `data-brand-max` on `brand_state` options

| Option id | Label | Range |
| --- | --- | --- |
| `established` | We have a logo and brand guidelines | £0 |
| `logo-only` | We have a logo | £0 |
| `brand-help` | We need help with our brand | £150–£300 (tag `brand-development`) |

Only asking for help costs anything.

## Content: `contentMatrix[website_size][content_state]` in prefs

Content cost depends on site size. It's only counted once a size is chosen.

| Size ↓ / Content → | `everything` (written and approved) | `some` (exists, needs refining) | `help` (we need help writing it) |
| --- | --- | --- | --- |
| `small` | £0 | £150–£350 | £350–£700 |
| `medium` | £0 | £350–£500 | £500–£1,000 |
| `large` | £0 | £500–£1,000 | £750–£1,500 |
| `notsure` | £0 | £150–£350 | £350–£700 |

"Not sure" uses the small figures.

## Visual assets: `data-asset-min` / `data-asset-max` on `visual_assets` options

| Option id | Range |
| --- | --- |
| `pro` | £0 |
| `some-imagery` | £150–£350 |
| `little` | £250–£500 |

## Functionality: `features` stage (multi-select)

**CMS collections.** Each option with `data-cms-count="1"` (blog, portfolio, services, downloads, events, testimonials, team) adds to a count. The count then picks one band from `cmsBands`:

| Collections | Range |
| --- | --- |
| 1 | £0–£250 |
| 2 | £250–£500 |
| 3 | £500–£750 |
| 4+ | £750–£1,250 |

**Features.** These are summed:

| Option id | Range | Notes |
| --- | --- | --- |
| `adv-forms` | £500–£900 | |
| `booking` | £500–£1,200 | |
| `crm` | £500–£1,200 | |
| `ecom` | £1,000–£2,500 | tag `ecommerce` |
| `social` | £500–£1,000 | Social media campaign. Added in v3.0.0, as a feature because it must come with a website. |
| `ai` | not priced | `data-complexity="consultation"` |
| `bespoke` | not priced | `data-complexity="consultation"` |

Any `consultation` option sets the **bespoke** flag. The running estimate note and the summary paragraph's closing sentence then mention it, and the result type becomes `complex`.

## Result type

Not shown to the visitor since v3.0.0, but still written to the hidden `result_type` field. The first matching type in `resultTypePriority` wins:

| Type | When |
| --- | --- |
| `complex` | bespoke flag, **or** ecommerce plus more than 3 features selected |
| `brand-led` | brand = `brand-help` |
| `content-led` | content = `some` or `help` |
| `asset-led` | assets = `little` |
| `standard` | otherwise |

## Worked example

New site, small website, we have a logo, content exists and needs refining, some imagery, blog and booking system:

| Category | Range |
| --- | --- |
| Website (small) | £500–£1,500 |
| Brand (logo-only) | £0 |
| Content (small × some) | £150–£350 |
| Assets (some-imagery) | £150–£350 |
| Functionality (1 CMS £0–£250, booking £500–£1,200) | £500–£1,450 |
| **Raw total** | £1,300–£3,650 |
| **Shown** | **£1,250–£4,000**, `content-led` |

The smoke test checks this example.
