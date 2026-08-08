#!/usr/bin/env node
/*
 * Converts assets/img to WebP and rewrites every reference to match.
 *
 *   node tools/optimise-images.js --dry     report what would change
 *   node tools/optimise-images.js           convert and rewrite references
 *
 * Photographs are the whole payload of this site and were shipped as
 * full-resolution PNG - 78 MB for a page that never displays an image wider
 * than about 900 CSS pixels. WebP at quality 82, capped at MAX_WIDTH, is
 * visually indistinguishable here and roughly a twentieth of the bytes.
 *
 * Originals are kept: nothing is deleted, the PNG/JPG simply stops being
 * referenced. Delete them once the site has been checked in a browser.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'assets/img');
const DRY = process.argv.includes('--dry');

const MAX_WIDTH = 1600;   // nothing on the page is displayed wider than this
const QUALITY = 82;

// Files referenced from CSS as background-image need their name kept in sync
// too, so every source file that can mention an image is rewritten.
const REF_FILES = [
  'index.html',
  'assets/css/untitled2.css',
  'assets/css/bootstrap.min2.css',
  'assets/js/agency.js',
  'assets/js/scripts.js',
  'assets/js/app.js'
].filter(f => fs.existsSync(path.join(ROOT, f)));

const walk = d => fs.readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

const CONVERTIBLE = /\.(png|jpe?g)$/i;

// Must stay PNG. WhatsApp and Facebook link previews do not reliably render a
// WebP og:image, and Safari ignores a WebP favicon - both are consumed by
// clients outside our control, unlike ordinary page images.
const KEEP_ORIGINAL = ['header.png', 'favicon.png'];

(async () => {
  const sources = REF_FILES.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'));
  const all = sources.join('\n');

  const files = walk(IMG).filter(f => CONVERTIBLE.test(f));
  let before = 0, after = 0, converted = 0, skipped = 0;
  const renames = [];

  for (const file of files) {
    const base = path.basename(file);
    if (!all.includes(base)) { skipped++; continue; }   // unreferenced, leave alone
    if (KEEP_ORIGINAL.includes(base)) { skipped++; continue; }

    const webp = file.replace(CONVERTIBLE, '.webp');
    const srcSize = fs.statSync(file).size;
    before += srcSize;

    if (!DRY) {
      const meta = await sharp(file).metadata();
      let pipe = sharp(file);
      if (meta.width > MAX_WIDTH) pipe = pipe.resize({ width: MAX_WIDTH });
      await pipe.webp({ quality: QUALITY }).toFile(webp);
    }

    const outSize = DRY ? 0 : fs.statSync(webp).size;

    // Only adopt the WebP when it actually wins; a few small flat PNGs do not.
    if (!DRY && outSize >= srcSize) {
      fs.unlinkSync(webp);
      after += srcSize;
      skipped++;
      continue;
    }

    after += outSize;
    converted++;
    renames.push([base, path.basename(webp), srcSize, outSize]);
  }

  if (renames.length && !DRY) {
    REF_FILES.forEach((f, i) => {
      let text = sources[i];
      for (const [from, to] of renames) text = text.split(from).join(to);
      if (text !== sources[i]) fs.writeFileSync(path.join(ROOT, f), text);
    });
  }

  const mb = n => (n / 1048576).toFixed(2) + ' MB';
  console.log(DRY ? '(dry run - nothing written)\n' : '');
  renames
    .sort((a, b) => (b[2] - b[3]) - (a[2] - a[3]))
    .slice(0, 12)
    .forEach(([from, , s, o]) =>
      console.log(`  ${(s / 1024).toFixed(0).padStart(7)} KB -> ${(o / 1024).toFixed(0).padStart(6)} KB   ${from}`));
  console.log(`\nconverted ${converted} file(s), skipped ${skipped}`);
  console.log(`total ${mb(before)} -> ${mb(after)}` +
    (before ? `  (${(100 - after / before * 100).toFixed(1)}% smaller)` : ''));
  if (!DRY) console.log('\nOriginal PNG/JPG files kept. Delete them once the site looks right.');
})();
