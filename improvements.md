# Improvements — Honda Eastern Automobile site

Last reviewed: 23 October 2026 — items 1-5, 10-11 done; 6-9 open

Ordered by value-for-effort. Everything here was verified against the current
code, not assumed — file and line references are included so each item can be
checked before acting on it.

---

## ~~1. Wrong prices are showing to customers~~ — DONE 8 Aug 2026

All prices were re-checked against honda.com.my and corrected. The problem was
worse than first reported: on top of the two internal mismatches, most figures
were simply out of date, and the CR-V lineup had changed.

| Model | Was on site | Now (official) |
|---|---|---|
| City (all 5) | 84,560 / 89,560 / 94,560 / 99,560 / 111,560 | 84,900 / 89,900 / 94,900 / 99,900 / 111,900 |
| Civic 1.5L RS | 151,900 | 149,900 |
| HR-V 1.5L T V | 135,900 | 137,900 |
| HR-V 1.5L e:HEV RS | 141,900 | 143,900 |
| HR-V price list | Civic prices (131,900-167,900) | matches the spec tabs |
| CR-V | 4 variants from 159,900 | 3 variants from 178,200 |
| Tiles (all models) | ...,560 / ...,530 series | base variant price |

The CR-V petrol S (RM159,900) and petrol E (RM169,900) were discontinued on
3 March 2026 and replaced by the e:HEV E at RM178,200 — the site had been
advertising two variants Honda no longer sells. The modal, spec tables,
calculator and `populateTabs` were all restructured to the 3-variant lineup.

The e:HEV E spec table is derived from the e:HEV RS: same 2.0L i-MMD powertrain,
brakes and body dimensions (the only three categories these tables carry).
Worth a check against the brochure if you want it exact.

---

## ~~2. Store each price once~~ — DONE 8 Aug 2026

[prices.json](prices.json) is now the single source of truth. Edit it, then:

```
npm run prices          # rewrite every price on the site from prices.json
npm run prices:check    # verify nothing has drifted (run before deploying)
```

[tools/sync-prices.js](tools/sync-prices.js) writes all **six** places a price
appears — desktop tile, mobile row, modal spec tab, modal price list, loan
calculator, and the JSON-LD structured data Google reads. It refuses to run if
prices.json and the markup disagree about which variants exist, so a half-done
edit fails loudly instead of shipping.

Adding or removing a *variant* still needs a manual edit to the tab buttons and
panels in index.html and to `carData` / `populateTabs` in agency.js. Only the
numbers and labels are automated.

---

## ~~3. Images: 78.5 MB~~ — DONE 8 Aug 2026

`assets/img/` is now **5.8 MB**, down from 78.5 MB (93% smaller).

```
npm run images       # convert to WebP + add width/height/lazy to new images
npm run images:dry   # preview without writing
```

- 74 images converted to WebP at quality 82, capped at 1600px wide
  (`service-cover.png` alone: 11.6 MB -> 81 KB)
- 11 unreferenced images deleted, then 72 superseded originals deleted
- `width`/`height` and `loading="lazy"` added to 101 `<img>` tags
- `sales.png` and `values.png` kept as PNG — WebP came out larger
- `header.png` and `favicon.png` deliberately kept as PNG: WhatsApp and
  Facebook link previews do not reliably render a WebP `og:image`, and Safari
  ignores a WebP favicon. `tools/optimise-images.js` excludes them by name.

Six salesman photos were never committed to git, so their originals exist only
in a scratchpad backup from this session. If you want them archived, copy them
somewhere permanent before that folder is cleared.

The `width`/`height` attributes depend on the `img { height: auto; }` reset
added to bootstrap.min2.css. Without it those attributes act as presentational
hints and any image sized by CSS width alone stretches to its full pixel height
(the promo carousel, tick icons, QR code and #Hours background all broke this
way during the first pass). Do not remove that rule.

The `width`/`height` attributes also fix the root cause behind the promo
carousel bug — the browser now reserves each image's box before it loads, so
containers can no longer collapse to zero width.

---

## ~~4. Duplicate libraries on every page load~~ — DONE 13 Aug 2026

The site now loads **one** jQuery and **one** Owl Carousel.

This turned out to be a security fix as well as a cleanup. jQuery 3.7.1 loaded
first, then `assets/vendors/jquery.min.js` (**3.3.1**) loaded after and won — so
the live site was running a version affected by CVE-2020-11022 / CVE-2020-11023
(XSS in the HTML prefilter, fixed in 3.5.0). It now runs 3.7.1.

**The catch, worth knowing before touching these tags again:** the last line of
`assets/js/jquery.minf43b.js` is `jQuery.noConflict()` — it is the WordPress
build, and it deliberately gives up the `$` alias. The duplicate 3.3.1 copy was
what quietly handed `$` back, and `agency.js` uses `$` throughout. Dropping the
duplicate on its own killed every carousel with `TypeError: $ is not a function`.
There is now an explicit one-line `window.$ = window.jQuery;` after the jQuery
tag, commented in place. Do not remove it.

Also deleted `assets/vendors/` (352 KB, five files — nothing referenced any of
them once the duplicate jQuery went) and the unminified `owl.carousel.js`.

Verified afterwards: single jQuery 3.7.1, both promo carousels, the mobile
services carousel, owl nav clicks, the salesman swiper, the loan calculator,
modals, spec tabs and the lightbox — all working, zero console errors.

---

## ~~5. Add cache-busting to changed assets~~ — DONE 13 Aug 2026

Version numbers are no longer hand-written. Every local CSS/JS link in
index.html is stamped with a hash of that file's contents:

```
npm run stamp        # restamp after changing any CSS/JS
npm run predeploy    # prices:check + stamp, run this before building the zip
```

[tools/stamp-assets.js](tools/stamp-assets.js) hashes each referenced file and
rewrites its `?v=`. A changed file gets a new URL automatically; an unchanged
one keeps its cached copy. `--check` exits non-zero if anything is unstamped, so
it can gate a deploy.

This replaced `?v=1.3` / `?v=3`, which had to be remembered by hand — and
forgetting meant returning visitors kept the old file and never saw the fix,
looking exactly like a failed upload. It also now covers the twelve CSS/JS files
that previously had **no** cache-busting at all.

CDN URLs are skipped: they are already versioned and cannot be hashed locally.

---

## 6. Finish the Prelude modal's feature images

The Prelude modal uses the real Honda Sensing photo for the full-width slot, but
the three tiles below it are Font Awesome icons standing in for photos, because
no Prelude feature images existed. Every other model has three real photos.

**Do:** drop two more Prelude photos into `assets/img/car/Features/` as
`prelude-feat2/3`, then replace the three `<i class="fas fa-...">` tags at
[index.html:1836-1846](index.html) with `<img>` tags matching the HR-V block.

---

## 7. Social share image

`og:image` points at `assets/img/logo/header.png`, which is 225×51 — a thin
strip. Shares on WhatsApp and Facebook render it badly, and WhatsApp is the main
channel here judging by the number of `wa.me` links on the page.

**Do:** produce a 1200×630 image (showroom photo or a car with the logo) and
point `og:image` and `twitter:image` at it. Add `og:image:width` / `:height`.

---

## 8. Split the models onto their own pages

Everything lives at one URL, so there is no page that can rank for "Honda
Prelude Kelantan" or "harga Honda CR-V Kota Bharu" — the specific,
high-intent searches. The modals hold genuinely good content (full spec tables,
prices, brochures) that search engines largely cannot credit, because it is not
on a distinct URL.

Splitting into `/prelude/`, `/cr-v/` etc. would:

- give each model a real URL, title, description and canonical
- let each page carry its own `Car` + `Offer` structured data instead of one
  shared `ItemList`
- make the sitemap meaningful — it currently holds a single URL, because
  `#fragment` entries are not separately indexable
- cut initial page weight, since a visitor no longer downloads all eight models

This is the largest item here and the only one that is a restructure rather than
a fix. It is also the one with the highest ceiling. Item 2 should come first —
with prices centralised, the pages can be generated rather than hand-written.

---

## 9. Smaller cleanups

- **`lastmod` in [sitemap.xml](sitemap.xml)** is manual and will go stale.
  Update it when the page changes meaningfully.
- **Google Business Profile** matters more for "Honda near me" than any HTML
  change. Keep the name, address, phone and hours byte-identical to the
  `AutoDealer` schema in `index.html` so the two corroborate.
- **`geo` coordinates** are missing from the schema — deliberately, rather than
  guessed. Take the lat/long from Google Maps and add a `GeoCoordinates` block.
- **Keyboard access:** promo images open the lightbox via `onclick` on a plain
  `<img>`, so they cannot be reached by keyboard. Wrapping each in a `<button>`
  would fix it and costs little.
- **Heading order** skips levels in places (`<h2>` followed by `<h5>`, and
  `#contact` opens with `<h3>`). Minor, but it is what screen readers and
  crawlers use to understand page structure.
- **Hardcoded promo month** — the heading and dates in the promotions section
  are edited by hand each month. Easy to forget; a small script or a dated
  constant would remove the risk of an out-of-date month sitting live.

---

## ~~10. Model-year updates~~ — WR-V done 8 Sep, City done 27 Sep, City Hatchback done 23 Oct 2026

All three lineups lost their base variant(s), so each needed restructuring, not
just new numbers.

**WR-V** — DG4 facelift, launched 1 September 2026. Base **S (RM89,900)
discontinued**; E/V/RS all repriced *down*:

| Variant | Was | Now |
|---|---|---|
| S | RM 89,900 | discontinued |
| E | RM 95,900 | **RM 94,900** |
| V | RM 99,900 | **RM 98,900** |
| RS | RM 107,900 | **RM 104,900** |

17-inch black alloys on 215/55R17 (was 16-inch), 10-inch Display Audio with
wireless CarPlay/Android Auto (was 7-inch), Honda Sensing and LaneWatch across
the range. RS adds the 360-degree camera, wireless charger, red ambient
lighting, sequential front signals, black door handles and six airbags
(E and V have four).

**City** — GN2/GN3 facelift, launched 24 September 2026. Base **S (RM84,900)
discontinued**, five variants down to four. Surviving prices are unchanged:

| Variant | Price |
|---|---|
| E | RM 89,900 |
| V | RM 94,900 |
| RS | RM 99,900 |
| e:HEV RS | RM 111,900 |

Spec changes: Bi-LED projector headlights across the range (was halogen),
Blind Spot Information with rear cross traffic alert standard, tyre repair kit
in place of a spare. V and RS move to a 10-inch Display Audio with wireless
CarPlay/Android Auto and the 360-degree Multi-View camera with moving object
detection, on 16-inch wheels (V: turbine-style Shark Grey; RS: Berlina Black),
with blue ambient lighting on V and red on RS. e:HEV RS adds the wireless
charger. E keeps the 8-inch head unit and 15-inch wheels.

**New City photography**, taken from Honda Malaysia's own launch assets:
product tile and modal hero, the mobile side profile, and all three feature
images (new face, 10-inch screen with 360 camera, new RS interior).

Note: Honda has so far only published the facelift in **Platinum White Pearl**,
so the City is now the only white car in a list of red ones. Swap in a Blazing
Red Pearl shot when one is available, and re-run `npm run images`.

While updating the City, three **empty leftover `<table class="car-table">`
elements** were found in index.html — one still named "Honda City 1.5L S".
They rendered nothing (the real spec tables are generated by `populateTabs`)
but they were dead markup naming a discontinued variant, so they were removed.
Spec-table count now matches the tab-panel count exactly, 25 to 25.

**City Hatchback** — facelift launched **19 October 2026**, the same update as
the sedan. Five variants down to three: **S (RM85,900) and E (RM90,900)
discontinued**, V is the entry point. Surviving prices are unchanged:

| Variant | Price |
|---|---|
| V | RM 95,900 |
| RS (petrol) | RM 100,900 |
| e:HEV RS | RM 112,900 |

The tile and mobile row now read "From RM 95,900" (was 85,900), a RM10,000 jump
at the entry point that customers will notice. Powertrains are unchanged
(121 PS petrol, 109 PS e:HEV motor).

Prices were cross-checked against paultan.org, Carlist, ZigWheels, Cars of
Malaysia and the honda.com.my model page. SoyaCincau and Newswav quoted
RM91,900 / 96,900 / 108,900; no other source supports those, so they were
treated as the outlier. Note honda.com.my was serving a staged *Preview* of its
site when this was checked, and its own `/pricing` page is still stale at
"From RM85,900" — do not use that page to verify.

The spec tables were **generated from Honda's official spec sheet** rather than
retyped, so values are per-variant and exact. What changed: bi-LED projector
headlights, 10-inch Display Audio with wireless CarPlay/Android Auto, 7-inch TFT
meter, Blind Spot Information with cross traffic monitoring, single-zone auto
air-con with rear vents, remote engine start, rear disc brakes, tyre repair kit
in place of a spare (boot is 289 L), 16-inch wheels. RS adds auto wipers, black
door handles, sport pedals, Multi-View Camera and Honda CONNECT; the e:HEV RS
adds the wireless charger, Low Speed Follow, electric parking brake with Auto
Brake Hold and deceleration paddles.

Two things in the old data were wrong and are fixed by the regeneration: the
e:HEV block listed the *petrol* engine's 121 PS, and several rows (8-inch
screen, 15-inch wheels, 4.2-inch meter) described the pre-facelift car.

The 360-degree camera is **not** listed as standard. Honda's own footnote calls
it a *recommended accessory* fitted by an appointed supplier (separate warranty)
on RS and e:HEV RS; the table's standard item is the Multi-View Camera System.

**New City Hatchback photography** from Honda's launch assets (tile and modal
hero share the front three-quarter shot, as the sedan does; side profile for the
mobile row; new face / 10-inch screen / RS interior as the three feature
photos). All five replaced images showed the old red car with the honeycomb
grille. The old modal also had an engine photo alt-tagged "AUTO LOCK"; the alt
text now describes each image.

**A cut-out that did not work:** the repo's `dewhite-image.js` was tried on
Honda's white-background side shot and left ragged white patches under the car
on coloured cards, because that photo has a white floor reflection the tool
cannot separate. It was dropped in favour of two Honda assets that ship with
real transparency. Use the tool only on flat studio shots.

As with the City, Honda has only published the facelift in white, so the
Hatchback is the second white car in the list. Swap in a Blazing Red Pearl shot
when one exists.

**Not done:** the Hatchback modal's *Download Brochure* still links to the May
2024 PDF — the live model page exposes no new brochure link to copy. Replace it
once Honda publishes one. Spec-table count is now 23 to 23.

---

## ~~11. Loan calculator was using an illegal interest method~~ — DONE 27 Sep 2026

The **Hire-Purchase (Amendment) Act 2026** — gazetted 30 January 2026, in force
**1 June 2026** — abolished flat-rate and Rule of 78 interest on new hire
purchase agreements. Interest is now charged on the **reducing balance** and the
rate must be quoted as an **effective interest rate (EIR)**. The calculator was
still doing `interest/100 * loanAmount * term`, the flat-rate method, nearly four
months after the law changed.

`calculatePayment()` in agency.js already contained a correct reducing-balance
amortisation function — it had simply never been called. `calculate()` now uses
it.

**The trap, if you ever touch the rate again:** an EIR and a flat rate are not
interchangeable. An EIR is roughly **1.9x** the flat rate that produces the same
instalment:

| Flat rate | Equivalent EIR (5y) | Equivalent EIR (9y) |
|---|---|---|
| 2.30% | 4.37% | 4.29% |
| 2.55% | 4.83% | 4.72% |
| 3.50% | 6.54% | 6.34% |

Swapping the formula without rebasing the rate understates the monthly payment
by about 11% — on a City 1.5L E with RM10,000 down over 9 years, RM863 instead
of RM973. So the slider was rebased at the same time:

| | Was (flat) | Now (EIR) |
|---|---|---|
| Min | 1.50% | 3.00% |
| Max | 6.00% | 9.00% |
| Default | 3.50% | 4.50% |

4.50% EIR works out to a 2.42% flat equivalent, which sits inside the 2.30-2.55%
flat band Maybank, Public Bank and CIMB advertise for new cars.

The 3.00-9.00 span was picked for two reasons. It brackets the real market —
a Honda promo rate bottoms out near 3.54% EIR (1.88% flat) and 9.00% EIR is
5.14% flat, well past anything a new Honda attracts — and it makes the slider's
four grid ticks land on **3 / 4.5 / 6 / 7.5 / 9**. A first attempt used
2.50-12.00, which was technically fine (the Act caps hire purchase at 17% p.a.)
but labelled the ticks 2.5 / 4.88 / 7.25 / 9.63 and gave the slider a long
stretch of rates no customer will ever be offered. If you widen the range again,
keep `(max - min)` divisible by 4 or the tick labels go ragged.

Because customers and salespeople here still talk in flat rates, the calculator
shows the **equivalent flat rate** in grey text directly under the EIR label —
`≈ Kadar Rata / Flat Rate = 2.42% setahun (p.a.)`. The disclaimer states the
basis of the calculation and that the bank's actual rate and amortisation
schedule govern.

`flatRateEquivalent()` takes **only the rate and the tenure**. The principal
cancels out of the amortisation formula, so no car, deposit or Calculate click
is needed. This matters: a first pass computed it from the loan's actual interest
inside `calculate()`, which meant it sat on a dash until a variant was picked and
Calculate pressed — a slider reading 4.95% next to "flat rate: —" that explained
nothing. `updateFlatEquivalent()` now runs on slider drag, on rate-box input, on
first paint and inside `calculate()`, so the pair is never out of step.

Checked against RinggitPlus' flat-to-EIR converter, which agrees in both
directions: RM100,000 over 5 years at 3.00% flat is RM115,000 total and 5.64%
EIR; feeding 5.64% EIR at 5 years back in returns 3.00% flat. The figure moves
with tenure (3.00% flat is 5.68% EIR over 3 years, 5.50% over 9), which is why
the repayment period is an input to it.

**The money figures still wait for Calculate** — the interest slider, the rate
box and the deposit field deliberately leave the instalment and totals alone.
That is intended behaviour, not an oversight: an earlier pass wired them up live
and it was reverted on request. The commented-out `calculate()` in
`CheckIfNoDownPayment()` is the switch if that ever changes. Choosing a model
*does* recalculate, which is how it has always worked. The flat-rate line is the
one exception, and deliberately so: it is not a result of the loan, it is the
same rate said a different way, so it tracks the slider like the rate box does.

`EIR_MIN` / `EIR_MAX` in `agency.js` and the `min`/`max` on `#interest-input`
plus the `data-piotnetforms-range-slider` JSON in `index.html` are three copies
of the same bounds. They are commented to point at each other; keep them in
step. (Unlike prices, they are not covered by `npm run prices`.)

One real bug on the same code path was fixed while in there:

- **Duplicate `id="hargakereta"`** — a `<span>` and a hidden `<input>` shared it,
  and `calculate()` read the price by parsing `"RM "` back out of whichever one
  `getElementById` returned first. It now reads `#car-model`, whose option values
  *are* the prices, so nothing is parsed out of display text. The hidden input
  was renamed to `form-field-harga_kereta`, matching its own `<label for>`.

`calculate()` also now blanks all four readouts when no variant is chosen or the
deposit meets or exceeds the price, instead of printing a negative instalment.

Not done: the Act also requires lenders to give the customer a **full
amortisation schedule**. That is the bank's obligation, not a dealer site's, but
a month-by-month principal/interest breakdown would be a genuinely useful
addition here and the maths is now all in place for it.

---

## ~~12. Page weight and mobile layout~~ — DONE 27 Sep 2026

Measured with a real cold-cache page load, not estimates.
**6.07 MB over 74 requests -> 3.29 MB over 68 (-46%).** Images alone:
4.58 MB -> 1.86 MB.

**Horizontal scrolling on phones (fixed).** The page could be dragged
left/right. Found by hiding each top-level section in turn: `#promotion` was
the sole cause - the Owl carousels lay every slide out in a `.owl-stage`
thousands of pixels wide. That section is now clipped horizontally, plus
`html, body { overflow-x: hidden }` as a guarantee (nothing on this page uses
`position: sticky`, so clamping the document is safe). Verified at 360 / 390 /
412 / 768 px over repeated loads.

**Promo carousel unreadable on mobile (fixed).** The two-up breakpoint was
600px, which gave each slide about 250px. The HiP slides are dense text
infographics and were illegible. Two-up now starts at 900px, so a 600px screen
gets one 516px slide. The nav arrows also sat on top of the text; below 900px
they are smaller, translucent and tucked into the edge.

**Waste removed:**

| What | Saving |
|---|---|
| Two Prelude images were still remote Cloudinary **PNGs** | 1.30 MB -> 185 KB |
| 43 images larger than they are ever displayed, downscaled to 2x their real display size | -2.25 MB |
| `bootstrap-icons.css` - **zero** `bi-` classes anywhere on the site | -66 KB |
| Font Awesome **5** stack (3 stylesheets) - the FA6 CDN renders every icon, proven by disabling them and diffing | -58 KB |
| 61 files shipped but referenced by nothing, incl. 4.8 MB of FA5 webfonts, two copies of bootstrap.min.js, unused Lottie/megamenu plugins | -5.86 MB in the package |

Stylesheet requests went from 16 to 12, and `wp-content/` from 833 KB to 105 KB.

Also added: `preconnect` for cdnjs and jsDelivr (both are used for
render-blocking assets), and a `theme-color` meta so mobile browser chrome
matches the brand.

`tools/add-image-dims.js` now **refreshes** width/height instead of only adding
them, because re-running `npm run images` changes real pixel sizes and a stale
value reserves the wrong box.

### Still on the table

- **Font Awesome fonts: 226 KB for 11 icons.** `fa-solid-900.woff2` (123 KB) and
  `fa-brands-400.woff2` (103 KB) are downloaded in full to draw bars, bolt,
  calculator, exchange, facebook, phone, plus, road, times, waze and whatsapp.
  Inlining those as SVG would remove essentially all of it - the single biggest
  remaining win, and it would drop two render-blocking requests.
- **`swiper-bundle.min.js` is 262 KB** for one salesman carousel, and
  **`bootstrap.min2.css` is 271 KB** largely unused. Both are candidates for
  deferring or trimming.
- **Responsive images (`srcset`).** Phones still download the desktop-sized
  file. Real per-breakpoint sources would cut mobile weight again.

---

## Suggested order

Items 1-5, 10 and 11 are done. Remaining:

1. **Items 6, 7, 9** — polish. Item 7 (a 1200x630 social image) is the one that
   shows up publicly, on every WhatsApp share.
2. **Item 8** — the restructure. Deliberately left for later.
