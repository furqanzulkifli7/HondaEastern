# Improvements — Honda Eastern Automobile site

Last reviewed: 8 August 2026 — items 1-3 completed same day

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

## 4. Duplicate libraries on every page load

[index.html:136-144](index.html) loads two copies of two libraries:

- **jQuery twice** — `assets/js/jquery.minf43b.js` (3.7.1) then
  `assets/vendors/jquery.min.js`. The second overwrites the first, so whichever
  version it is silently wins.
- **Owl Carousel twice** — `owl.carousel.min.js` then the unminified
  `owl.carousel.js`.

Free bandwidth saving, and it removes a real source of "works locally, breaks in
production" confusion caused by two jQuery versions racing.

**Do:** keep one jQuery (the 3.7.1 build) and only the minified Owl. Test the
promo carousel, the salesman swiper and the loan calculator afterwards, since
all three depend on jQuery.

---

## 5. Add cache-busting to changed assets

Currently `agency.js?v=3`, `untitled2.css?v=1.3`, `bootstrap.min2.css?v=1.3`.
Without these, returning visitors keep the old cached file and do not see fixes
— which looks exactly like a failed upload. This matters more now that the CSS
references `.webp` backgrounds: a stale stylesheet would request PNGs that no
longer exist on the server.

**Do:** bump the `?v=` number every time `agency.js`, `untitled2.css` or
`bootstrap.min2.css` is uploaded. Worth a note in the deploy routine.

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

## Suggested order

Items 1-3 are done. Remaining, in order:

1. **Items 4, 5** — quick, low risk.
2. **Items 6, 7, 9** — polish.
3. **Item 8** — the restructure. Now much easier: prices.json already holds the
   per-model data those pages would be generated from.
