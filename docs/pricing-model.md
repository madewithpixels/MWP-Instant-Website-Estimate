# Pricing model

The estimate is the sum of five category ranges. Each category is `[min, max]`. The total is rounded **down** to the nearest `rounding.minDownTo` (£250) and **up** to the nearest `rounding.maxUpTo` (£500).

Prices come from two places:

- **Option attributes in Webflow** for website size, brand, visual assets and individual features. To change these, edit the attribute on the option in the Designer. No release needed.
- **`MWP_PREFS`** for the content matrix, CMS bands and the stage 1 start figure. See [configuration.md](configuration.md).

Values below are as of 22 Sep 2026. When both ends of a range are equal it's shown as a single figure, e.g. £1,000.

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
| `single` | Single page website | £500–£850 (shows as £500–£1,000 after rounding) |
| `small` | Small website | £850–£1,500 (shows as £750–£1,500 after rounding) |
| `medium` | Medium website | £1,500–£3,000 |
| `large` | Larger website | £3,000–£5,000 |
| `notsure` | Not sure | £1,000 (`data-base-min` = `data-base-max` = 1000) |

## Brand: `data-brand-min` / `data-brand-max` on `brand_state` options

| Option id | Range |
| --- | --- |
| `established` | £0 |
| `logo-assets` | £150–£300 |
| `logo-only` | £300–£500 |
| `brand-help` | £500–£900 (tag `brand-development`) |

## Content: `contentMatrix[website_size][content_state]` in prefs

Content cost depends on site size. It's only counted once a size is chosen.

| Size ↓ / Content → | `everything` | `most` | `some` | `help` |
| --- | --- | --- | --- | --- |
| `single` | £0 | £150–£250 | £250–£350 | £350–£500 |
| `small` | £0 | £250–£400 | £400–£650 | £500–£800 |
| `medium` | £0 | £400–£650 | £650–£900 | £700–£1,050 |
| `large` | £0 | £650–£900 | £900–£1,300 | £1,050–£1,800 |
| `notsure` | £0 | £250–£400 | £400–£650 | £500–£800 |

> The content options also carry `data-content-multiplier` (0 / 0.35 / 0.65 / 1). The engine reads the attribute but **doesn't use it** for pricing: the matrix is what counts.

## Visual assets: `data-asset-min` / `data-asset-max` on `visual_assets` options

| Option id | Range |
| --- | --- |
| `pro` | £0 |
| `some-imagery` | £150–£350 |
| `phone` | £300–£700 |
| `little` | £500–£1,200 |
| `assets-notsure` | £300–£700 |

> These options also have `data-complexity` (low → high). The engine only acts on `data-complexity="consultation"` (features), so the asset values are informational.

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
| `ai` | not priced | `data-complexity="consultation"` |
| `bespoke` | not priced | `data-complexity="consultation"` |

Any `consultation` option sets the **bespoke** flag. The estimate note and the big estimate then add "+ bespoke functionality to be scoped", and the result type becomes `complex`.

## Result type

The first matching type in `resultTypePriority` wins:

| Type | When |
| --- | --- |
| `complex` | bespoke flag, **or** ecommerce plus more than 3 features selected |
| `brand-led` | brand = `brand-help` |
| `content-led` | content = `some` or `help` |
| `asset-led` | assets = `little` |
| `standard` | otherwise |

## Worked example

New site, small website, logo only, some content, phone photos, blog:

| Category | Range |
| --- | --- |
| Website (small) | £850–£1,500 |
| Brand (logo-only) | £300–£500 |
| Content (small × some) | £400–£650 |
| Assets (phone) | £300–£700 |
| Functionality (1 CMS) | £0–£250 |
| **Raw total** | £1,850–£3,600 |
| **Shown** | **£1,750–£4,000**, `content-led` |

The smoke test checks this example.
