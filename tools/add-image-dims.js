#!/usr/bin/env node
// Adds width/height (from the real file) and loading="lazy" to <img> tags in index.html.
// Skips above-the-fold images so the hero/nav still load eagerly.
//
// REQUIRES  img { height: auto; }  in the CSS (bootstrap.min2.css).
// width/height attributes are presentational hints: an <img> whose CSS sets
// only a width would otherwise take its HEIGHT from the attribute and stretch
// badly. Removing that CSS rule will break the promo carousel, the tick icons,
// the QR code and the #Hours background.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const EAGER = ['header.png'];           // nav logo - always visible immediately

// Images inside an Owl carousel must NOT be lazy. The carousel sits in a
// `col-xl-auto` wrapper, which shrink-wraps to its content: until an image has
// loaded the column has no width, so the browser decides the image is nowhere
// near the viewport and never fetches it. That deadlocks - the carousel stays
// collapsed forever because the load event that triggers refresh.owl.carousel
// never fires. These markers identify every <img> inside the three carousels.
const NO_LAZY_MARKERS = ['openModal(', 'openModal2(', 'img-servis2'];

(async () => {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  const uniq = [...new Set(tags)];

  let dims = 0, lazy = 0, missing = [];
  const edits = [];

  for (const tag of uniq) {
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || /^https?:/.test(src)) continue;      // remote images: size unknown
    const file = path.join(ROOT, src.replace(/^\.?\//, '').split('?')[0]);
    if (!fs.existsSync(file)) { missing.push(src); continue; }

    let next = tag;
    const base = path.basename(src);

    if (!/\swidth=/.test(next) && !/\sheight=/.test(next)) {
      try {
        const m = await sharp(file).metadata();
        if (m.width && m.height) {
          next = next.replace(/^<img\b/, `<img width="${m.width}" height="${m.height}"`);
          dims++;
        }
      } catch { /* unreadable, leave alone */ }
    }
    const inCarousel = NO_LAZY_MARKERS.some(mk => next.includes(mk));
    if (!/\sloading=/.test(next) && !EAGER.includes(base) && !inCarousel) {
      next = next.replace(/\s*\/?>$/, s => ' loading="lazy"' + s);
      lazy++;
    }
    if (next !== tag) edits.push([tag, next]);
  }

  for (const [from, to] of edits) html = html.split(from).join(to);
  fs.writeFileSync(path.join(ROOT, 'index.html'), html);

  console.log(`unique <img> tags: ${uniq.length}`);
  console.log(`  width/height added: ${dims}`);
  console.log(`  loading=lazy added: ${lazy}`);
  if (missing.length) console.log('  file not found (left as-is): ' + [...new Set(missing)].join(', '));
})();
