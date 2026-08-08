# Improvements — Honda Eastern Automobile site

Last reviewed: 8 August 2026

Ordered by value-for-effort. Everything here was verified against the current
code, not assumed — file and line references are included so each item can be
checked before acting on it.

---

## 1. Wrong prices are showing to customers (fix first)

Each car modal states its price **twice**: once in the "Specifications & Pricing"
tab, and again in the "Retail Price Without Insurance" list below it. In two
modals those two numbers disagree, so a customer scrolling one popup sees two
different prices for the same variant.

**Honda HR-V — [index.html:1550-1573](index.html#L1550-L1573)** — the lower list
is a copy-paste of the **Civic** price table:

| Variant | Spec tab | Price list below | Correct? |
|---|---|---|---|
| HR-V 1.5L S | RM 115,900 | RM 131,900 | list is wrong |
| HR-V 1.5L T E | RM 130,900 | RM 144,900 | list is wrong |
| HR-V 1.5L T V | RM 135,900 | RM 151,900 | list is wrong |
| HR-V 1.5L e:HEV RS | RM 141,900 | RM 167,900 | list is wrong |

Those four "wrong" figures match the Civic exactly (`Civic 1.5L E` = 131900,
`V` = 144900, `RS` = 151900, `e:HEV RS` = 167900 in
[assets/js/agency.js:353-356](assets/js/agency.js#L353-L356)), which confirms
the copy-paste rather than a genuine price difference.

**Honda City** — top variant reads RM 111,560 in the spec tab
([index.html:1203](index.html#L1203)) but RM 111,900 in the list below
([index.html:1233](index.html#L1233)).

There is also a third source of truth. The same car carries a different price in
each of three places:

| | Product tile | Modal spec tab | Loan calculator |
|---|---|---|---|
| Honda City | RM 84,560 | RM 84,560 | RM 84,900 |
| Honda HR-V | RM 115,530 | RM 115,900 | RM 115,900 |

**Do:** confirm the correct figures against the current Honda Malaysia price
list, then fix. **Then:** see item 2 — this class of bug keeps recurring because
of how prices are stored.

---

## 2. Store each price once

Right now a single model's price is written in up to four places: the desktop
tile, the mobile list, the modal spec tab, the modal price list, plus the
calculator in `agency.js`. Updating a price means five correct edits, and item 1
is what happens when one is missed.

Define the models once and render from that:

```js
const MODELS = {
  hrv: {
    name: 'Honda HR-V',
    tagline: 'COMMAND PRESENCE',
    variants: [
      { name: 'HR-V 1.5L S',        price: 115900 },
      { name: 'HR-V 1.5L T E',      price: 130900 },
      { name: 'HR-V 1.5L T V',      price: 135900 },
      { name: 'HR-V 1.5L e:HEV RS', price: 141900 }
    ]
  }
};
```

Then the tile, the mobile row, both modal price blocks and the calculator all
read from `MODELS`. One edit per price change, and they cannot drift apart.

This is the highest-leverage change in this document. It pays for itself the
first time a price list is updated, and it makes item 8 (separate model pages)
straightforward rather than a rewrite.

---

## 3. Images: 78.5 MB, mostly uncompressed PNG

`assets/img/` is 78.5 MB. Largest offenders:

| Size | File |
|---|---|
| 11.6 MB | `assets/img/background/service-cover.png` |
| 5.2 MB | `assets/img/background/redSilver.png` |
| 3.9 MB | `assets/img/salesman/salesman12.png` |
| 2.7 MB | `assets/img/car/honda-hrv-back.png` |
| 2.5 MB | `assets/img/salesman/salesman13.png` |
| 2.2 MB | `assets/img/car/Features/crv-feat1.png` |

The PROMOSI WebP conversion cut those files ~95% (3.2 MB → 165 KB) with no
visible quality loss. The same treatment across `assets/img/` would plausibly
take 78.5 MB to under 8 MB.

This is the single biggest lever on page speed, and page speed is a ranking
factor. `service-cover.png` alone is larger than every other asset on the page
combined.

**Do:**
1. Convert to WebP, keeping the PNG only where transparency over a photo matters.
2. Resize to what is actually displayed — several are 2048 px wide rendering at
   ~425 px.
3. Add `loading="lazy"` to below-the-fold `<img>` tags. None currently have it.
4. Add `width` and `height` attributes. Besides preventing layout shift, this
   is the root cause behind the carousel bug fixed in `agency.js` — unsized
   images let containers collapse to zero width before the images arrive.

**Also delete — 11 unreferenced images, 2.0 MB:**
`car/hrv_backup.png` · `car/honda-hrv-back_backup.png` · `car/honda-hrv.png` ·
`car/honda-hrv2.png` · `car/honda-civic.png` · `car/11.png` ·
`PROMOSI/hondabrochure.jpg` · `Features/civic-feat1.jpeg` and 3 smaller.

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

`index.html:1947` now uses `agency.js?v=2`, and the CSS uses `?v=1.2`. Without
these, returning visitors keep the old cached file and do not see fixes — which
looks exactly like a failed upload.

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

1. **Item 1** — wrong prices are live now.
2. **Items 4, 5** — quick, low risk.
3. **Item 3** — biggest speed win, mechanical work.
4. **Item 2** — prevents item 1 recurring.
5. **Items 6, 7, 9** — polish.
6. **Item 8** — plan properly, after item 2.
